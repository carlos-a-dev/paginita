import type { GlobalSettings } from '~/types/globalSettings'
import type { Global } from '~/types/strapi/global'

const globalToGlobalSettings = (global: Global): GlobalSettings => {
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
  const globalSettings = useCookie<GlobalSettings>('globalSettings', {
    maxAge: 60 * 60 * 24, // 1 day
  })

  const fetchGlobal = async () => {
    if (globalSettings.value && process.env.NODE_ENV === 'production') {
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
      globalSettings.value = globalToGlobalSettings(data.value)
    }
  }

  return {
    globalSettings,
    fetchGlobal
  }
}
