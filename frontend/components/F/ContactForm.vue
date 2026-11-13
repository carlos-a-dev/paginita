<!-- eslint-disable vue/no-v-text-v-html-on-component vue/no-v-html -->
<template>
  <app-section
    id="contact"
    :tone="data?.tone"
    class="contact-section"
  >
    <div class="split contact-split">
      <div class="split-main contact-intro">
        <p
          v-if="data?.eyebrow"
          class="eyebrow"
        >
          {{ data.eyebrow }}
        </p>
        <div
          v-if="data?.header"
          class="cms-prose contact-header"
          v-html="header"
        />
        <app-highlights
          v-if="data?.details?.length"
          :items="data.details"
          :variant="data.details.some(item => item.text) ? 'cards' : 'inline'"
          class="contact-details"
        />
      </div>
      <div class="contact-card">
        <h2
          v-if="data?.formTitle"
          class="contact-form-title"
        >
          {{ data.formTitle }}
        </h2>
        <q-form
          ref="contactForm"
          greedy
          @submit.prevent="submitForm"
          @reset="onReset"
        >
          <div class="contact-fields">
            <q-input
              v-model="formData.name"
              outlined
              label="Name"
              name="name"
              aria-required="true"
              autocomplete="name"
              maxlength="100"
              :rules="[val => !!val || 'Name is required']"
              lazy-rules
            />
            <q-input
              v-model="lastName"
              type="text"
              autocomplete="off"
              label="Last Name"
              name="lastName"
              class="hidden"
              tabindex="-1"
              aria-hidden="true"
            />
            <q-input
              v-model="formData.email"
              outlined
              label="Email"
              name="email"
              aria-required="true"
              autocomplete="email"
              maxlength="254"
              type="email"
              :rules="[
                val => !!val || 'Email is required',
                val => /.+@.+\..+/.test(val) || 'Enter a valid email',
              ]"
              lazy-rules
            />
            <q-input
              v-model="formData.message"
              outlined
              label="Message"
              name="message"
              aria-required="true"
              type="textarea"
              placeholder="Tell us a little about your business and how we can help."
              :input-style="{ minHeight: '140px' }"
              :rules="[
                val => !!val || 'Message is required',
                val => val.length <= 500 || 'Message must be less than 500 characters',
                val => val.length > 20 || 'Message must be more than 20 characters',
              ]"
              counter
              maxlength="500"
            />
          </div>
          <p class="contact-note">
            All fields are required.
            Please do not include passwords, payment details, government identification numbers, or medical information.
            We use your details to respond to your inquiry.
            <template v-if="privacyPolicyPath">
              Read our <NuxtLink :to="privacyPolicyPath">Privacy Policy</NuxtLink>.
            </template>
          </p>
          <div class="contact-actions">
            <q-btn
              icon="send"
              label="Send message"
              color="primary"
              text-color="white"
              type="submit"
              class="full-width contact-submit"
              unelevated
              :loading="submitting"
              :disable="submitting"
            />
          </div>
        </q-form>
      </div>
    </div>
  </app-section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar } from 'quasar'

import type { Highlight, Tone } from '~/types/strapi/blocks'

const props = defineProps<{
  data?: {
    header?: string
    eyebrow?: string | null
    formTitle?: string | null
    details?: Highlight[]
    tone?: Tone
  }
}>()

const render = useCmsHtml()
const header = computed(() => render(props.data?.header))

const $q = useQuasar()
const privacyPolicyPath = usePrivacyPolicy()
const contactForm = ref()
const formData = ref({
  name: '',
  email: '',
  phone: '',
  message: '',
})
const lastName = ref('')

// Anti-spam token from the site, fetched when the form loads and refreshed if
// the page has been open a long time. The CMS rejects posts without one.
const formToken = ref<{ value: string, fetchedAt: number } | null>(null)
async function loadFormToken() {
  try {
    const { token } = await $fetch<{ token: string }>('/api/contact-token')
    formToken.value = { value: token, fetchedAt: Date.now() }
  }
  catch {
    formToken.value = null
  }
}
onMounted(loadFormToken)
const submitting = ref(false)

async function submitForm() {
  if (submitting.value) return
  submitting.value = true
  try {
    if (!await contactForm.value?.validate()) {
      return
    }

    if (lastName.value) return

    if (!formToken.value || Date.now() - formToken.value.fetchedAt > 60 * 60 * 1000) await loadFormToken()
    await useStrapi().create('contact-messages', { ...formData.value, lastName: lastName.value, formToken: formToken.value?.value })

    $q.notify({
      type: 'positive',
      message: 'Your message has been received. Thank you for getting in touch!',
      position: 'top-right',
    })

    contactForm.value?.reset()
  }
  catch (error) {
    if (error instanceof Error) {
      $q.notify({
        type: 'negative',
        message: `${error.name}: ${error.message}`,
        position: 'top-right',
      })
    }
    else if (typeof error === 'object' && error !== null && 'error' in error && typeof error.error === 'object' && error.error !== null && 'name' in error.error && 'message' in error.error) {
      $q.notify({
        type: 'negative',
        message: `${error.error.name}: ${error.error.message}`,
        position: 'top-right',
      })
    }
    else {
    // Handle cases where the thrown value is not an Error
      console.error('An unexpected error occurred:', error, typeof error)
    }
  }
  finally {
    submitting.value = false
  }
}

function onReset() {
  formData.value = {
    name: '',
    email: '',
    phone: '',
    message: '',
  }

  lastName.value = ''
}
</script>
