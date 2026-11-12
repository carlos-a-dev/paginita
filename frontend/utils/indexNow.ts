// IndexNow keys are 8-128 characters of a-z, A-Z, 0-9 and dashes.
export function indexNowKey(value?: string): string {
  const key = (value || '').trim()
  return /^[a-zA-Z0-9-]{8,128}$/.test(key) ? key : ''
}
