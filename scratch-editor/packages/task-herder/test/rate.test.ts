import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { TaskQueue } from '../src'
import { waitTicks, makeTask } from './test-utilities'

describe('rate limit', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })
  it('should obey the rate limit', async () => {
    const bucket = new TaskQueue({
      startingTokens: 1,
      burstLimit: 2,
      sustainRate: 1000, // 1 token per ms
      concurrency: 99999,
    })

    const taskStates: Record<string, string> = {}

    void bucket.do(makeTask(taskStates, 'task1'), { cost: 1 })
    void bucket.do(makeTask(taskStates, 'task2'), { cost: 2 })
    void bucket.do(makeTask(taskStates, 'task3'), { cost: 1 })

    // Wait many ticks, but zero time, to allow the queueing machinery to settle
    // Since `startingTokens` is 1, only the first task should run immediately
    await waitTicks(1000)
    expect(taskStates.task1).toEqual('finished')
    expect(taskStates.task2).toBeUndefined()
    expect(taskStates.task3).toBeUndefined()

    // Advance time by 1ms, which should refill 1 token
    vi.advanceTimersByTime(1)
    await waitTicks(1000)

    // That 1 token isn't enough for the second task to run yet
    expect(taskStates.task1).toEqual('finished')
    expect(taskStates.task2).toBeUndefined()
    expect(taskStates.task3).toBeUndefined()

    // Advance time by another 1ms to refill another token
    vi.advanceTimersByTime(1)
    await waitTicks(1000)

    // The second task should have run by now.
    expect(taskStates.task1).toEqual('finished')
    expect(taskStates.task2).toEqual('finished')
    expect(taskStates.task3).toBeUndefined()

    // Advance time by another 1ms to allow the third task to complete
    vi.advanceTimersByTime(1)
    await waitTicks(1000)

    // After 3ms, all tasks should be done.
    expect(taskStates.task1).toEqual('finished')
    expect(taskStates.task2).toEqual('finished')
    expect(taskStates.task3).toEqual('finished')
  })
})
