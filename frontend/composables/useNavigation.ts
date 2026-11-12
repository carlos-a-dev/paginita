import type { NavigationLink, NavigationLinkItem } from '~/types/strapi/navigationLink'

// Menu links and the header call-to-action from the CMS, fetched once per page.
export default function useNavigation() {
  return useAsyncData('nav-links', async () => {
    const { data } = await useStrapi().findOne<NavigationLink>('navigation-link', '', { populate: ['links', 'cta'] })
    const links = (data.links || []).filter(link => link.visible !== false)
    const cta = data.cta && data.cta.visible !== false && data.cta.label && data.cta.url ? data.cta : null
    return { links, cta: cta as NavigationLinkItem | null }
  })
}
