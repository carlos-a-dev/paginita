import { accessibilityStatementPath, privacyPolicyPath, termsOfServicePath } from '~/utils/privacyPolicy'

// Legal pages shown together in the footer; each path is configurable or empty.
export default function useLegalLinks() {
  const config = useRuntimeConfig().public
  return [
    { label: 'Privacy Policy', to: privacyPolicyPath(config.privacyPolicyPath) },
    { label: 'Terms of Service', to: termsOfServicePath(config.termsOfServicePath) },
    { label: 'Accessibility', to: accessibilityStatementPath(config.accessibilityStatementPath) },
  ].filter(link => link.to)
}
