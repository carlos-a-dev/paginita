import { privacyPolicyPath } from '~/utils/privacyPolicy'

export default function usePrivacyPolicy() {
  return privacyPolicyPath(useRuntimeConfig().public.privacyPolicyPath)
}
