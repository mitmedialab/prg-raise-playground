export const CancelReason = {
  QueueCostLimitExceeded: 'Queue cost limit exceeded',
  Aborted: 'Task aborted',
  Cancel: 'Task cancelled',
  TaskTooExpensive: 'Task cost exceeds maximum bucket size',
} as const
