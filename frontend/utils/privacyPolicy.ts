export function privacyPolicyPath(value: string): string {
  if (!value) return ''
  // CMS pages use one slug. Reject external links, traversal, and executable URLs.
  if (!/^\/[a-z\d][a-z\d_-]*$/i.test(value)) {
    throw new Error('NUXT_PUBLIC_PRIVACY_POLICY_PATH must be a single CMS page path or empty')
  }
  return value
}
