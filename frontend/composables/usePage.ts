import type { Page } from '~/types/strapi/page'
import type { LayoutKey } from '#build/types/layouts'

export const usePage = (route = useRoute()) => {
  const slug = route.params.slug !== undefined
    ? (route.params.slug[0] ?? route.params.slug) || 'index'
    : null

  const page = slug ? useState<Page>(`page/${slug}`) : null
  const layout = useState<LayoutKey>('layout', () => 'default')

  const fetchPage = async (slug: string) => {
    const response = await useStrapi<Page>().find('pages', {
      filters: {
        slug: {
          $eq: slug,
        },
      },
      populate: {
        body: { populate: '*' },
      },
    })

    if (response.data.length > 0) {
      if (response.data.length === 0) {
        useState<Page>(`page/${slug}`).value = response.data[0]
      }
    }
  }

  return {
    page,
    layout,
    slug,
    fetchPage,
  }
}
