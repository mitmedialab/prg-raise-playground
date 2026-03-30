import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { TaskQueue, CancelReason } from '../src'
import { waitTicks, makeTask } from './test-utilities'

describe('cancel()', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should cancel a pending task and return true', async () => {
    const bucket = new TaskQueue({
      startingTokens: 1, // allow first task to start immediately
      burstLimit: 5,
      sustainRate: 1, // slow refill so second stays pending initially
      concurrency: 1,
    })

    const states: Record<string, string> = {}
    const p1 = bucket.do(makeTask(states, 'task1', 5), { cost: 1 })
    const p2 = bucket.do(makeTask(states, 'task2', 5), { cost: 2 })

    // Let queue settle; first task should be started, second pending
    await waitTicks(1000)
    expect(states.task1).toEqual('started')
    expect(states.task2).toBeUndefined()

    const didCancelTask = bucket.cancel(p2)
    expect(didCancelTask).toBe(true)

    // Advance enough time that the second task would have started and finished if not cancelled
    vi.advanceTimersByTime(100)
    await waitTicks(1000)

    expect(states.task1).toEqual('finished')
    expect(states.task2).toBeUndefined()
    await expect(p1).resolves.toBeUndefined()
    await expect(p2).rejects.toThrow(CancelReason.Cancel)
  })

  it('should return false when cancelling unknown promise', async () => {
    const bucket = new TaskQueue({
      startingTokens: 0,
      burstLimit: 5,
      sustainRate: 1000,
      concurrency: 1,
    })
    const fakePromise = Promise.resolve()
    await waitTicks(1000)
    const didCancelTask = bucket.cancel(fakePromise)
    expect(didCancelTask).toBe(false)
  })

  it('should cancel a pending task without disrupting the queue', async () => {
    const bucket = new TaskQueue({
      startingTokens: 1,
      burstLimit: 5,
      sustainRate: 1000,
      concurrency: 1,
    })
    const states: Record<string, string> = {}
    const p1 = bucket.do(makeTask(states, 'task1', 5), { cost: 1 })
    const p2 = bucket.do(makeTask(states, 'task2', 5), { cost: 1 })
    const p3 = bucket.do(makeTask(states, 'task3', 5), { cost: 1 })

    await waitTicks(1000)
    expect(states.task1).toEqual('started')
    expect(states.task2).toBeUndefined()
    expect(states.task3).toBeUndefined()

    // Cancel second task (pending)
    bucket.cancel(p2)

    // Advance timers so first finishes and third can start
    vi.advanceTimersByTime(10)
    await waitTicks(1000)

    // Third should have started after first finished because second was cancelled
    expect(states.task1).toEqual('finished')
    await expect(p2).rejects.toThrow(CancelReason.Cancel)
    expect(states.task3).toEqual('started')

    // Finish third
    vi.advanceTimersByTime(10)
    await waitTicks(1000)
    expect(states.task1).toEqual('finished')
    expect(states.task2).toBeUndefined()
    expect(states.task3).toEqual('finished')

    await expect(p1).resolves.toBeUndefined()
    await expect(p3).resolves.toBeUndefined()
  })
})

describe('cancelAll()', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should cancel all pending tasks and return their count', async () => {
    const bucket = new TaskQueue({
      startingTokens: 0,
      burstLimit: 5,
      sustainRate: 1,
      concurrency: 2,
    })
    const states: Record<string, string> = {}
    const p1 = bucket.do(makeTask(states, 'task1', 5), { cost: 1 })
    const p2 = bucket.do(makeTask(states, 'task2', 5), { cost: 1 })
    const p3 = bucket.do(makeTask(states, 'task3', 5), { cost: 1 })

    // Let queue settle and time advance a bit
    await waitTicks(1000)
    vi.advanceTimersByTime(10)
    await waitTicks(1000)

    // None should start because startingTokens=0 and no time advanced to refill
    expect(states.task1).toBeUndefined()
    expect(states.task2).toBeUndefined()
    expect(states.task3).toBeUndefined()

    // Cancel all pending tasks
    const cancelledCount = bucket.cancelAll()
    expect(cancelledCount).toBe(3)

    // Advance timers to allow any tasks to run if they weren't properly cancelled
    vi.advanceTimersByTime(100)
    await waitTicks(1000)

    // Verify none started and all were cancelled
    expect(states.task1).toBeUndefined()
    expect(states.task2).toBeUndefined()
    expect(states.task3).toBeUndefined()

    await expect(p1).rejects.toThrow(CancelReason.Cancel)
    await expect(p2).rejects.toThrow(CancelReason.Cancel)
    await expect(p3).rejects.toThrow(CancelReason.Cancel)
  })
})

describe('abortSignal option', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should abort a pending task using abortSignal', async () => {
    const bucket = new TaskQueue({
      startingTokens: 1,
      burstLimit: 5,
      sustainRate: 1,
      concurrency: 1,
    })
    const states: Record<string, string> = {}
    const controller = new AbortController()
    const p1 = bucket.do(makeTask(states, 'task1', 5), { cost: 1 })
    const p2 = bucket.do(makeTask(states, 'task2', 5), { cost: 2, signal: controller.signal })

    await waitTicks(1000)
    expect(states.task1).toEqual('started')
    expect(states.task2).toBeUndefined()

    // Abort second before it runs
    controller.abort()

    // Let first finish
    vi.advanceTimersByTime(10)
    await waitTicks(1000)

    expect(states.task1).toEqual('finished')
    expect(states.task2).toBeUndefined() // never started
    await expect(p1).resolves.toBeUndefined()
    await expect(p2).rejects.toThrow(CancelReason.Aborted)
  })
})
