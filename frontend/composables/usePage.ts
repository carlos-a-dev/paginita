import type { Page } from '~/types/strapi/page'
import type { LayoutKey } from '#build/types/layouts'

const componentPopulate = { populate: { data: { populate: '*' }, props: { populate: '*' } }, filters: { visible: { $eq: true } } }

export default () => {
  const layout = useState<LayoutKey>('layout', () => 'default')

  const getSlug = (route = useRoute()) => {
    const slug = route.params.slug
    const segments = slug !== undefined
      ? Array.isArray(slug) ? slug : slug ? [slug] : []
      : route.path.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean)

    // CMS pages have a single slug. Never alias a nested URL to its parent page.
    if (segments.length > 1 || segments.some(segment => segment.includes('/'))) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Page not found',
        fatal: true,
      })
    }

    return segments[0] || 'index'
  }

  const fetchPage = async (slug: string) => {
    const page = useState<Page>(`page/${slug}`)
    if (page.value) {
      return page
    }

    const response = await useStrapi<Page>().find('pages', {
      filters: {
        slug: {
          $eq: slug,
        },
      },
      populate: {
        props: {
          populate: '*',
        },
        seo: {
          populate: {
            openGraph: {
              populate: '*',
            },
            metaImage: {
              populate: '*',
            },
          },
        },
        body: {
          populate: '*',
          on: {
            'f.hero': componentPopulate,
            'f.content': componentPopulate,
            'f.service-list': componentPopulate,
            'f.contact-form': componentPopulate,
            'f.about': { populate: { data: { populate: { stories: { populate: '*' } } }, props: { populate: '*' } }, filters: { visible: { $eq: true } } },
          },
        },
      },
    })

    if (response.data.length > 0) {
      delete response.data[0].props?.id
      page.value = response.data[0]
    }

    return page
  }

  const fetchRoutePage = (route = useRoute()) => {
    return fetchPage(getSlug(route))
  }

  return {
    layout,
    fetchPage,
    fetchRoutePage,
    getSlug,
  }
}
