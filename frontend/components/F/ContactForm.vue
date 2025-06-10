<template>
  <q-form
    ref="contactForm"
    class="q-gutter-sm"
    style="width: 100%; max-width: 500px"
    @submit.prevent="submitForm"
    @reset="onReset"
  >
    <q-input
      v-model="formData.name"
      filled
      label="Name"
      :rules="[val => !!val || 'Name is required']"
      lazy-rules
    />
    <q-input
      v-model="lastName"
      type="text"
      autocomplete="off"
      label="Last Name"
      class="hidden"
    />
    <q-input
      v-model="formData.email"
      filled
      label="Email"
      type="email"
      :rules="[
        val => !!val || 'Email is required',
        val => /.+@.+\..+/.test(val) || 'Enter a valid email',
      ]"
      lazy-rules
    />
    <q-input
      v-model="formData.message"
      filled
      label="Message"
      type="textarea"
      :rules="[
        val => !!val || 'Message is required',
        val => val.length <= 500 || 'Message must be less than 500 characters',
        val => val.length > 20 || 'Message must be more than 20 characters',
      ]"
      counter
    />
    <q-btn
      label="Send Message"
      color="primary"
      type="submit"
      class="full-width"
    />
  </q-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const contactForm = ref()
const formData = ref({
  name: '',
  email: '',
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
    else {
    // Handle cases where the thrown value is not an Error
      console.error('An unexpected error occurred:', error)
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
    message: '',
  }

  onMounted(() => {
    renderTime.value = Date.now()
  })
}
</script>
