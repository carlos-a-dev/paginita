import markdownit from 'markdown-it'
import markdownItAttrs from 'markdown-it-attrs'
import markdownItHighlightjs from 'markdown-it-highlightjs'

export const useMarkdown = () => {
  const md = markdownit()

  // Allow classes and attributes
  md.use(markdownItAttrs)

  // Highlightjs
  md.use(markdownItHighlightjs, {
    inline: true,
  })

  // Customize some renders
  md.renderer.rules.paragraph_open = (tokens, idx, _options, _env, _self) => {
    const nextToken = tokens[idx + 1]

    if (
      nextToken
      && nextToken.type === 'inline'
      && nextToken.children
      && nextToken.children.some(child => child.type === 'text' && child.content.trim() !== '')
    ) {
    // If text content exists, render with class
      return '<p class="text-body1">'
    }

    // Otherwise, render normal <p> tag without class
    return '<p>'
  }

  md.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    // Add a class depending on the heading level
    token.attrJoin('class', `text-${token.tag}`)
    return self.renderToken(tokens, idx, options)
  }

  return {
    md,
  }
}
