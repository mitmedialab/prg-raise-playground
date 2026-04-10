import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { TaskQueue } from '../src'
import { waitTicks, makeTask } from './test-utilities'

describe('concurrency limit 1', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })
  it('should obey the concurrency limit', async () => {
    const bucket = new TaskQueue({
      startingTokens: 10,
      burstLimit: 10,
      sustainRate: 1, // refill isn't relevant for this test
      queueCostLimit: 20,
      concurrency: 1,
    })

    const taskStates: Record<string, string> = {}

    void bucket.do(makeTask(taskStates, 'task1', 10))
    void bucket.do(makeTask(taskStates, 'task2', 10))
    void bucket.do(makeTask(taskStates, 'task3', 10))

    // Wait many ticks, but zero time, to allow the queueing machinery to settle
    await waitTicks(1000)

    // Since no time has passed, nothing should have finished yet
    expect(taskStates.task1).toEqual('started')
    expect(taskStates.task2).toBeUndefined()
    expect(taskStates.task3).toBeUndefined()

    // Advance time by 10ms to allow the first task to complete
    // Since concurrency=1, only the first task should complete, even though the bucket has tokens for more
    vi.advanceTimersByTime(10)
    await waitTicks(1000)

    // After 10ms, the first task should be done and the second should start.
    expect(taskStates.task1).toEqual('finished')
    expect(taskStates.task2).toEqual('started')
    expect(taskStates.task3).toBeUndefined()

    // Advance time by another 10ms to allow the second task to complete
    vi.advanceTimersByTime(10)
    await waitTicks(1000)

    // After 20ms, the second task should be done.
    expect(taskStates.task1).toEqual('finished')
    expect(taskStates.task2).toEqual('finished')
    expect(taskStates.task3).toEqual('started')

    // Advance time by another 10ms to allow the third task to complete
    vi.advanceTimersByTime(10)
    await waitTicks(1000)

    // After 30ms, all tasks should be done.
    expect(taskStates.task1).toEqual('finished')
    expect(taskStates.task2).toEqual('finished')
    expect(taskStates.task3).toEqual('finished')
  })
})
