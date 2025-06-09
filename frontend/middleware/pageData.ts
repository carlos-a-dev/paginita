import type { LayoutKey } from '#build/types/layouts'

export default defineNuxtRouteMiddleware(async (to) => {
  const { fetchRoutePage, layout } = usePage()

  const page = await fetchRoutePage(to)
  if (page.value) {
    layout.value = page.value.layout as LayoutKey
  }
  else {
    throw createError({
      statusCode: 404,
      statusMessage: 'Page not found',
      fatal: true,
    })
  }
})
