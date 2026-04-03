import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { TaskQueue } from '../src'
import { waitTicks, makeTask } from './test-utilities'

describe('rate and concurrency limits', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })
  it('should obey the limits', async () => {
    const bucket = new TaskQueue({
      startingTokens: 30,
      burstLimit: 20,
      sustainRate: 1000, // 1 token per ms
      queueCostLimit: 60,
      concurrency: 2,
    })

    const taskStates: Record<string, string> = {}

    void bucket.do(makeTask(taskStates, 'task1', 10), { cost: 10 })
    void bucket.do(makeTask(taskStates, 'task2', 10), { cost: 10 })
    void bucket.do(makeTask(taskStates, 'task3', 10), { cost: 10 })
    void bucket.do(makeTask(taskStates, 'task4', 10), { cost: 20 })

    // Wait many ticks, but zero time, to allow the queueing machinery to settle
    // We can afford 3 tasks immediately, but concurrency=2 means only 2 can start
    // Remaining tokens = 30 to start - 10 for task1 - 10 for task2 = 10
    await waitTicks(1000)
    expect(taskStates.task1).toEqual('started')
    expect(taskStates.task2).toEqual('started')
    expect(taskStates.task3).toBeUndefined()
    expect(taskStates.task4).toBeUndefined()

    // After 10ms, the first burst of tasks should be done.
    // We can now afford to start task3 (cost 10), but not task4 (cost 20) yet.
    // Remaining tokens = 10 + 10 replenished - 10 for task3 = 10
    await vi.advanceTimersByTimeAsync(10)
    await waitTicks(1000)
    expect(taskStates.task1).toEqual('finished')
    expect(taskStates.task2).toEqual('finished')
    expect(taskStates.task3).toEqual('started')
    expect(taskStates.task4).toBeUndefined()

    // After another 10ms, the third task should be done and we can start task4 (cost 20)
    // Remaining tokens = 10 + 10 replenished - 20 for task4 = 0
    await vi.advanceTimersByTimeAsync(10)
    await waitTicks(1000)
    expect(taskStates.task1).toEqual('finished')
    expect(taskStates.task2).toEqual('finished')
    expect(taskStates.task3).toEqual('finished')
    expect(taskStates.task4).toEqual('started')

    // Advance time by another 10ms to allow task4 to complete
    await vi.advanceTimersByTimeAsync(10)
    await waitTicks(1000)
    expect(taskStates.task1).toEqual('finished')
    expect(taskStates.task2).toEqual('finished')
    expect(taskStates.task3).toEqual('finished')
    expect(taskStates.task4).toEqual('finished')
  })
})
