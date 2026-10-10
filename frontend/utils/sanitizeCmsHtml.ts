import sanitizeHtml from 'sanitize-html'

// CMS editors may format content, but cannot add executable attributes or embeds.
export function sanitizeCmsHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img'],
    allowedAttributes: {
      '*': ['class', 'id'],
      'a': ['href', 'title'],
      'img': ['src', 'alt', 'title', 'width', 'height', 'srcset', 'sizes'],
      'th': ['colspan', 'rowspan', 'scope'],
      'td': ['colspan', 'rowspan'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowProtocolRelative: false,
  })
}
