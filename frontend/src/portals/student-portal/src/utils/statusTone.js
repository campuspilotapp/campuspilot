const STATUS_TONES = {
  Paid: 'g',
  Issued: 'g',
  Completed: 'g',
  Approved: 'g',
  Verified: 'g',
  Resolved: 'g',
  Present: 'g',
  Eligible: 'g',
  Cleared: 'g',
  Active: 'g',
  Due: 'w',
  Pending: 'w',
  'Under Review': 'w',
  'Action needed': 'w',
  Partial: 'w',
  Rejected: 'r',
  Absent: 'r',
  Cancelled: 'r',
}

export const statusTone = (status) => STATUS_TONES[status] || ''
