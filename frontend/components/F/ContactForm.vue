<!-- eslint-disable vue/no-v-text-v-html-on-component vue/no-v-html -->
<template>
  <q-card style="max-width: 600px;">
    <q-card-section
      v-if="data?.header"
      class="text-center"
      v-html="useMarkdown().md.render(data.header)"
    />
    <q-form
      ref="contactForm"
      @submit.prevent="submitForm"
      @reset="onReset"
    >
      <q-card-section class="q-gutter-y-sm fit">
        <q-input
          v-model="formData.name"
          outlined
          label="Name"
          name="name"
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
          v-model="formData.phone"
          outlined
          label="Phone"
          name="phone"
          type="tel"
          bottom-slots
        >
          <template #prepend>
            <q-icon name="phone" />
          </template>
        </q-input>
        <q-input
          v-model="formData.message"
          outlined
          label="Message"
          name="message"
          type="textarea"
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
          type="submit"
          class="full-width"
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
const renderTime = ref(0)

async function submitForm() {
  $q.loading.show()
  try {
    if (!contactForm.value?.validate()) {
      return
    }

    if ((!renderTime.value || Date.now() - renderTime.value > 5000) && !lastName.value) {
      renderTime.value = Date.now()
      const ip_data = await $fetch('/api/ip')
      await useStrapi().create('contact-messages', {
        ...formData.value,
        ip: ip_data.ip ?? '',
      })
    }

    $q.notify({
      type: 'positive',
      message: 'Message sent successfully!',
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
    $q.loading.hide()
  }
}

function onReset() {
  formData.value = {
    name: '',
    email: '',
    phone: '',
    message: '',
  }

  onMounted(() => {
    renderTime.value = Date.now()
  })
}
</script>
