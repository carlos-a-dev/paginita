<template>
  <q-form
    class="q-gutter-md"
    style="width: 100%; max-width: 500px"
    @submit.prevent="submitForm"
  >
    <q-input
      v-model="form.name"
      filled
      label="Your Name"
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
      :rules="[val => !!val || 'Message is required']"
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
})

function submitForm() {
  if (form.value.name && form.value.email && form.value.message) {
    // Replace with actual API or logic
    $q.notify({
      type: 'positive',
      message: 'Message sent successfully!',
    })

    form.value = {
      name: '',
      email: '',
      message: '',
    }
  }
  else {
    $q.notify({
      type: 'negative',
      message: 'Please fill in all fields.',
    })
  }
}
</script>
