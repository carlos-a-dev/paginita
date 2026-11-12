// Crawlers that collect content to train AI models. Search and answer
// crawlers (OAI-SearchBot, ChatGPT-User, PerplexityBot, Claude-SearchBot,
// Claude-User, Googlebot, Bingbot) are not listed, so they keep access.
export const aiTrainingCrawlers = [
  'GPTBot',
  'ClaudeBot',
  'anthropic-ai',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
  'Meta-ExternalAgent',
  'Bytespider',
] as const

export function robotsTxt(options: { siteUrl?: string, blockAiTraining?: boolean }): string {
  const siteUrl = options.siteUrl
  if (!siteUrl || ['localhost', '127.0.0.1', '[::1]'].includes(new URL(siteUrl).hostname)) return 'User-agent: *\nDisallow: /\n'
  const training = options.blockAiTraining
    ? `# AI training crawlers: not allowed. AI search and answer crawlers are allowed.\n${aiTrainingCrawlers.map(agent => `User-agent: ${agent}`).join('\n')}\nDisallow: /\n\n`
    : ''
  return `${training}User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap.xml', siteUrl).href}\n`
}
