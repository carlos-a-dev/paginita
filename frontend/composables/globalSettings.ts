import type { GlobalSettings } from '~/types/globalSettings'
import type { GlobalResponse } from '~/types/strapi/global'

// This function converts a Global object from Strapi to a GlobalSettings object
// that can be used in the application.
const globalToGlobalSettings = (global: GlobalResponse): GlobalSettings => {
  return {
    siteName: global.siteName,
    siteDescription: global.siteDescription,
    siteLogo: global.siteLogo?.formats?.thumbnail?.url || global.siteLogo?.url || '',
    favicon: global.favicon?.url || '',
    metaTitle: global.defaultSeo?.metaTitle || '',
    metaDescription: global.defaultSeo?.metaDescription || '',
    shareImage: global.defaultSeo?.shareImage?.url || '',
    quasarTheme: global.quasarTheme
  }
}

export const useGlobalSettings = () => {
  const { data: globalSettings } = useNuxtData<GlobalSettings>('globalSettings')

  const fetchGlobal = async () => {
    const { data } = await useAsyncData<GlobalSettings>('globalSettings', async () => {
      const params = { 
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
      }

      const { data: global } = await useStrapi().findOne<GlobalResponse>('global', params)

      return globalToGlobalSettings(global)
    })
    
    if (data.value) {
      globalSettings.value = data.value
    }
  }

  return {
    globalSettings,
    fetchGlobal
  }
}
