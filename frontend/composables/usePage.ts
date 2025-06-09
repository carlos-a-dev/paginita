import type { Page } from '~/types/strapi/page'
import type { LayoutKey } from '#build/types/layouts'

const componentPopulate = { populate: { data: { populate: '*' }, props: { populate: '*' } }, filters: { visible: { $eq: true } } }

export default () => {
  const layout = useState<LayoutKey>('layout', () => 'default')

  const getSlug = (route = useRoute()) => {
    return route.params.slug !== undefined
      ? (route.params.slug[0] ?? route.params.slug) || 'index'
      : route.path.split('/').pop() || 'index'
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
        body: {
          populate: '*',
          on: {
            'f.hero': componentPopulate,
            'f.content': componentPopulate,
            'f.service-list': componentPopulate,
            'f.contact-form': componentPopulate,
          },
        },
      },
    })

    if (response.data.length > 0) {
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
