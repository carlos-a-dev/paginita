import { accessibilityStatementPath } from '~/utils/privacyPolicy'

export default function useAccessibilityStatement() {
  return accessibilityStatementPath(useRuntimeConfig().public.accessibilityStatementPath)
}
