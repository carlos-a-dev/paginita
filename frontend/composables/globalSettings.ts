import type { Global } from '~/types/global'

export const useGlobalSettings = () => {
  const global =  useState<Global | null>('global', () => null)

  const fetchGlobal = async () => {
    const { data } = await useAsyncData<Global>('global-settings', async () => (await useStrapi().findOne<Global>('global', { 
      populate: ['siteLogo', 'favicon', 'defaultSeo', 'defaultSeo.shareImage']
    })).data)
    global.value = data.value ?? null
  }

  return {
    global,
    fetchGlobal
  }
}
