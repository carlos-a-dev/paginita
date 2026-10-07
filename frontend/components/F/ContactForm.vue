<!-- eslint-disable vue/no-v-text-v-html-on-component vue/no-v-html -->
<template>
  <q-card class="contact-card">
    <q-card-section
      v-if="data?.header"
      class="contact-intro cms-prose text-center"
      v-html="useMarkdown().md.render(data.header)"
    />
    <q-form
      ref="contactForm"
      @submit.prevent="submitForm"
      @reset="onReset"
    >
      <q-card-section class="contact-fields">
        <q-input
          v-model="formData.name"
          outlined
          label="Name"
          name="name"
          autocomplete="name"
          maxlength="100"
          :rules="[val => !!val || 'Name is required']"
          lazy-rules
        >
          <template #prepend>
            <q-icon name="person" />
          </template>
        </q-input>
        <q-input
          v-model="lastName"
          type="text"
          autocomplete="off"
          label="Last Name"
          name="lastName"
          class="hidden"
        />
        <q-input
          v-model="formData.email"
          outlined
          label="Email"
          name="email"
          autocomplete="email"
          maxlength="254"
          type="email"
          :rules="[
            val => !!val || 'Email is required',
            val => /.+@.+\..+/.test(val) || 'Enter a valid email',
          ]"
          lazy-rules
        >
          <template #prepend>
            <q-icon name="email" />
          </template>
        </q-input>
        <q-input
          v-model="formData.message"
          outlined
          label="Message"
          name="message"
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
        >
          <template #prepend>
            <q-icon name="message" />
          </template>
        </q-input>
      </q-card-section>
      <q-card-actions>
        <q-btn
          icon="send"
          label="Send Message"
          color="primary"
          text-color="dark"
          type="submit"
          class="full-width contact-submit"
          unelevated
          :loading="submitting"
          :disable="submitting"
        />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar } from 'quasar'

defineProps<{
  data?: {
    header?: string
  }
}>()

const $q = useQuasar()
const contactForm = ref()
const formData = ref({
  name: '',
  email: '',
  phone: '',
  message: '',
})
const lastName = ref('')
const submitting = ref(false)

async function submitForm() {
  if (submitting.value) return
  submitting.value = true
  try {
    if (!await contactForm.value?.validate()) {
      return
    }

    if (lastName.value) return

    await useStrapi().create('contact-messages', formData.value)

    $q.notify({
      type: 'positive',
      message: 'Message sent successfully!',
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
