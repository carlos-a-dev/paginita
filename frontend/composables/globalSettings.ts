import type { GlobalSettings } from '~/types/globalSettings'
import type { Global } from '~/types/strapi/global'

// This function converts a Global object from Strapi to a GlobalSettings object
// that can be used in the application.
const globalToGlobalSettings = (global: Global): GlobalSettings => {
  return {
    siteName: global.siteName,
    siteDescription: global.siteDescription,
    siteLogo: global.siteLogo?.url ? `/strapi${global.siteLogo?.url}` : '',
    favicon: global.favicon?.url ?? '',
    metaTitle: global.defaultSeo?.metaTitle || '',
    metaDescription: global.defaultSeo?.metaDescription || '',
    shareImage: global.defaultSeo?.shareImage?.url || '',
    quasarTheme: global.quasarTheme,
  }
}

export const useGlobalSettings = () => {
  const globalSettings = useState<GlobalSettings>('globalSettings')

  const fetchGlobal = async () => {
    const params = {
      populate: {
        favicon: { fields: ['url'] },
        siteLogo: { fields: ['url'] },
        defaultSeo: {
          populate: {
            shareImage: { fields: ['url'] },
          },
        },
        quasarTheme: '*',
      },
    }

    const { data: global } = await useStrapi().findOne<Global>('global', params)

    globalSettings.value = globalToGlobalSettings(global)
  }

  return {
    globalSettings,
    fetchGlobal,
  }
}
