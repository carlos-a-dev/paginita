import { sanitizeCmsHtml } from '~/utils/sanitizeCmsHtml'

// Markdown from the CMS rendered to sanitized HTML.
export default function useCmsHtml() {
  const { md } = useMarkdown()
  return (markdown?: string | null) => (markdown ? sanitizeCmsHtml(md.render(markdown)) : '')
}
