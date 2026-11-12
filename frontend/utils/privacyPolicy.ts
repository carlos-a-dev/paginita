// CMS pages use one slug. Reject external links, traversal, and executable URLs.
export function cmsPagePath(value: string, setting: string): string {
  if (!value) return ''
  if (!/^\/[a-z\d][a-z\d_-]*$/i.test(value)) {
    throw new Error(`${setting} must be a single CMS page path or empty`)
  }
  return value
}

export function privacyPolicyPath(value: string): string {
  return cmsPagePath(value, 'NUXT_PUBLIC_PRIVACY_POLICY_PATH')
}

export function termsOfServicePath(value: string): string {
  return cmsPagePath(value, 'NUXT_PUBLIC_TERMS_OF_SERVICE_PATH')
}

export function accessibilityStatementPath(value: string): string {
  return cmsPagePath(value, 'NUXT_PUBLIC_ACCESSIBILITY_STATEMENT_PATH')
}
