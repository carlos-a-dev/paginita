// Keep deployment settings from introducing wildcards or CSP directives.
export function cspOrigins(value: string): string[] {
  return [...new Set(value.split(',').map(origin => origin.trim()).filter(Boolean).map((origin) => {
    const url = new URL(origin)
    if (!['https:', 'http:'].includes(url.protocol)
      || url.username || url.password
      || !/^(?:[a-z\d.-]+|\[[a-f\d:]+\])$/i.test(url.hostname)) {
      throw new Error('CSP source settings must contain HTTP(S) origins')
    }
    return url.origin
  }))]
}
