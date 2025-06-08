import type { Page } from '~/types/strapi/page'
import type { LayoutKey } from '#build/types/layouts'

export default defineNuxtRouteMiddleware(async (to) => {
  const { slug, page, layout } = usePage(to)

  const componentPopulate = { populate: { data: { populate: '*' }, props: { populate: '*' } }, filters: { visible: { $eq: true } } }
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

  if (response.data.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Page not found',
    })
  }

  if (page) {
    page.value = response.data[0]

    layout.value = (response.data[0].layout || 'default') as LayoutKey
  }
})
