import type { Global } from '~/types/global'

export const useGlobalSettings = () => {
  const global = useCookie<Global>('globalSettings', {
    maxAge: 60 * 60 * 24, // 1 day
  })

  const fetchGlobal = async () => {
    if (global.value && process.env.NODE_ENV === 'production') {
      return
    }

    const { data } = await useAsyncData<Global>('globalSettings', async () => (await useStrapi().findOne<Global>('global', { 
      populate: {
        favicon: { fields: ['url'] },
        siteLogo: { fields: ['url', 'alternativeText'] },
        defaultSeo: {
          populate: {
            shareImage: { fields: ['url'] }
          }
        },
        quasarTheme: '*'
      }
    })).data)
    
    if (data.value) {
      // Remove unnecessary fields from the global settings
      // delete data.value?.createdAt
      // delete data.value?.updatedAt
      // delete data.value?.publishedAt
      // delete data.value?.documentId
      // delete data.value?.id

      // delete data.value?.defaultSeo?.id
      // delete data.value?.defaultSeo?.shareImage?.id
      // delete data.value?.defaultSeo?.shareImage?.documentId

      // delete data.value?.siteLogo?.id
      // delete data.value?.siteLogo?.documentId

      // delete data.value?.favicon?.id
      // delete data.value?.favicon?.documentId

      global.value = data.value
    }
  }

  return {
    global,
    fetchGlobal
  }
}
