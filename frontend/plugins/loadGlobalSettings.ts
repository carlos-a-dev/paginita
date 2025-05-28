export default defineNuxtPlugin(async () => {
  const { fetchGlobal } = useGlobalSettings()
    await fetchGlobal()
})
