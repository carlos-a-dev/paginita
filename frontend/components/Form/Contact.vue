<template>
  <q-form
    class="q-gutter-md"
    style="width: 100%; max-width: 500px"
    @submit.prevent="submitForm"
  >
    <q-input
      v-model="form.name"
      filled
      label="Name"
      :rules="[val => !!val || 'Name is required']"
    />
    <q-input
      v-model="form.email"
      filled
      label="Email"
      type="email"
      :rules="[
        val => !!val || 'Email is required',
        val => /.+@.+\..+/.test(val) || 'Enter a valid email',
      ]"
    />
    <q-input
      v-model="form.message"
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

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const form = ref({
  name: '',
  email: '',
  message: '',
  ip: '',
})

onMounted(async () => {
  const ip_data = await $fetch('/api/ip', { server: false })
  form.value.ip = ip_data.ip || ''
})

async function submitForm() {
  $q.loading.show()
  await useStrapi().create('contact-messages', form.value).then(() => {
    $q.notify({
      type: 'positive',
      message: 'Message sent successfully!',
    })

    form.value = {
      name: '',
      email: '',
      message: '',
    }
  }).catch(({ error }) => {
    $q.notify({
      type: 'negative',
      message: `${error.name}: ${error.message}`,
      position: 'top-right',
    })
  }).finally(() => {
    $q.loading.hide()
  })
}
</script>
