export default () => {
  const darkMode = useCookie<boolean>('dark-mode', { default: () => false })

  const getThemeStyle = () => {
    const { globalSettings } = useGlobalSettings()
    if (!globalSettings.value?.quasarTheme) return null
    return `:root { ${Object.entries(globalSettings.value?.quasarTheme)
      .map(([key, val]) => `--q-${key}: ${val};`)
      .join('')} }`
  }

  return {
    themeStyle: getThemeStyle(),
    darkMode,
  }
}
