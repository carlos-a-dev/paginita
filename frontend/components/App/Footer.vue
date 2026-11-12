<template>
  <q-footer class="site-footer">
    <div class="site-footer-inner">
      <div class="footer-columns">
        <div class="footer-brand">
          <NuxtLink
            to="/"
            class="site-brand"
            :aria-label="`${globalSettings?.siteName} home`"
          >
            <q-avatar
              v-if="globalSettings?.siteLogo"
              size="38px"
            ><app-logo /></q-avatar>
            <!-- eslint-disable vue/no-v-html -->
            <span
              class="site-footer-brand"
              v-html="sanitizeCmsHtml(globalSettings?.siteNameStyled || globalSettings?.siteName || '')"
            />
            <!-- eslint-enable vue/no-v-html -->
          </NuxtLink>
          <p
            v-if="globalSettings?.siteDescription"
            class="footer-description"
          >
            {{ globalSettings.siteDescription }}
          </p>
        </div>
        <nav
          v-if="pageLinks.length"
          class="footer-column"
          aria-labelledby="footer-pages"
        >
          <h2
            id="footer-pages"
            class="footer-heading"
          >
            Pages
          </h2>
          <ul class="footer-list">
            <li
              v-for="link in pageLinks"
              :key="link.id"
            >
              <NuxtLink :to="link.url">
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>
        <nav
          v-if="legalLinks.length"
          class="footer-column"
          aria-labelledby="footer-legal"
        >
          <h2
            id="footer-legal"
            class="footer-heading"
          >
            Legal
          </h2>
          <ul class="footer-list">
            <li
              v-for="link in legalLinks"
              :key="link.to"
            >
              <NuxtLink :to="link.to">
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>
        <nav
          class="footer-column"
          aria-labelledby="footer-social"
        >
          <h2
            id="footer-social"
            class="footer-heading"
          >
            Follow us
          </h2>
          <social-networks variant="list" />
        </nav>
      </div>
      <p class="site-copyright">
        &copy; {{ new Date().getFullYear() }} {{ globalSettings?.organization?.legalName || globalSettings?.siteName }}. All rights reserved.
      </p>
    </div>
  </q-footer>
</template>

<script setup lang="ts">
import { sanitizeCmsHtml } from '~/utils/sanitizeCmsHtml'

const { globalSettings } = useGlobalSettings()
const legalLinks = useLegalLinks()
const { data: navigation } = useNavigation()
// Menu links, minus the legal pages listed in their own column.
const pageLinks = computed(() => (navigation.value?.links || []).filter(link => !legalLinks.some(legal => legal.to === link.url)))
</script>
