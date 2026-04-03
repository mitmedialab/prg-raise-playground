import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { TaskQueue, CancelReason } from '../src'
import { waitTicks } from './test-utilities'

describe('basics', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })
  it('should create an instance', () => {
    const bucket = new TaskQueue({
      startingTokens: 3,
      burstLimit: 10,
      sustainRate: 1,
      queueCostLimit: 20,
    })
    expect(bucket).toBeInstanceOf(TaskQueue)
  })
  it('should pass through task results', async () => {
    const bucket = new TaskQueue({
      burstLimit: 10,
      sustainRate: 1,
    })
    const task = () => 'sync done'
    const task2 = () => Promise.resolve('async done')
    const task3 = () => {
      throw new Error('task error')
    }
    const task4 = () => Promise.reject(new Error('async task error'))

    await waitTicks(1000)

    await expect(bucket.do(task)).resolves.toBe('sync done')
    await expect(bucket.do(task2)).resolves.toBe('async done')
    await expect(bucket.do(task3)).rejects.toThrow('task error')
    await expect(bucket.do(task4)).rejects.toThrow('async task error')
  })
  it('should reject a task that exceeds the burst limit', async () => {
    const bucket = new TaskQueue({
      startingTokens: 3,
      burstLimit: 2,
      sustainRate: 1,
      queueCostLimit: 20,
    })
    const task = () => Promise.resolve('done')

    // This task is too big to ever fit in this tiny bucket
    await expect(bucket.do(task, { cost: 3 })).rejects.toThrow(CancelReason.TaskTooExpensive)

    // This task fits
    await expect(bucket.do(task, { cost: 2 })).resolves.toBe('done')
  })
  it('should reject a task that pushes the queue past its cost limit', async () => {
    const bucket = new TaskQueue({
      startingTokens: 3,
      burstLimit: 10,
      sustainRate: 1,
      queueCostLimit: 10,
    })
    const task = () => Promise.resolve('done')

    void bucket.do(task, { cost: 5 })
    void bucket.do(task, { cost: 4 })
    expect(bucket.length).toBe(2)

    // This task is small enough to fit in the burst limit but too big to fit in the queue with the other tasks
    await expect(bucket.do(task, { cost: 2 })).rejects.toThrow(CancelReason.QueueCostLimitExceeded)
    expect(bucket.length).toBe(2)

    // This task fits
    void bucket.do(task, { cost: 1 })
    expect(bucket.length).toBe(3)
  })
  it('should reject a task even if there are cost limit shenanigans', async () => {
    const bucket = new TaskQueue({
      startingTokens: 0,
      burstLimit: 100,
      sustainRate: 1000,
      queueCostLimit: 1000,
    })
    const task = () => Promise.resolve('done')

    // The task is below the burst limit right now
    const taskPromise = bucket.do(task, { cost: 10 })

    // Don't try this at home
    ;(bucket as unknown as Record<string, number>).burstLimit = 1

    // Now let things settle
    vi.advanceTimersByTime(10)
    await waitTicks(1000)

    // The task became too expensive due to the burst limit change after being queued but before running
    // Right now this is "impossible" but could be relevant if we ever allow changes to the burst limit or task cost
    await expect(taskPromise).rejects.toThrow(CancelReason.TaskTooExpensive)
  })
})
