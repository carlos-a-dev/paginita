<template>
  <q-page
    padding
    class="demo-page"
  >
    <q-toolbar class="q-mb-xl">
      <q-toolbar-title>Quasar Components Demo</q-toolbar-title>
      <div>
        <q-select
          v-model="selectedSize"
          dense
          label="Component Size"
          stack-label
          :options="sizeOptions"
          style="width: 140px"
          emit-value
          map-options
        />
      </div>
    </q-toolbar>

    <!-- Buttons -->
    <section>
      <h2>Buttons</h2>
      <div class="q-gutter-md row wrap items-center">
        <q-btn
          :size="selectedSize"
          label="Primary"
          color="primary"
        />
        <q-btn
          :size="selectedSize"
          label="Secondary"
          color="secondary"
        />
        <q-btn
          :size="selectedSize"
          label="Positive"
          color="positive"
        />
        <q-btn
          :size="selectedSize"
          label="Negative"
          color="negative"
        />
        <q-btn
          :size="selectedSize"
          label="Warning"
          color="warning"
        />
        <q-btn
          :size="selectedSize"
          label="Info"
          color="info"
        />
        <q-btn
          :size="selectedSize"
          label="Accent"
          color="accent"
        />
        <q-btn
          :size="selectedSize"
          label="Dark"
          color="dark"
        />
      </div>

      <div class="q-gutter-md row wrap items-center q-mt-md">
        <q-btn
          :size="selectedSize"
          label="Flat"
          flat
          color="primary"
        />
        <q-btn
          :size="selectedSize"
          label="Outline"
          outline
          color="primary"
        />
        <q-btn
          :size="selectedSize"
          label="Push"
          push
          color="primary"
        />
        <q-btn
          :size="selectedSize"
          label="Unelevated"
          unelevated
          color="primary"
        />
      </div>
    </section>

    <q-separator spaced />

    <!-- Inputs -->
    <section>
      <h2>Inputs</h2>
      <q-toggle
        v-model="isDense"
        label="Toggle Dense Inputs"
        class="q-mt-md"
        dense
        color="primary"
      />
      <div class="row q-gutter-md q-flex-wrap">
        <q-input
          v-model="inputs.standard"
          label="Standard"
          :dense="isDense"
        />
        <q-input
          v-model="inputs.outlined"
          label="Outlined"
          outlined
          :dense="isDense"
        />
        <q-input
          v-model="inputs.filled"
          label="Filled"
          filled
          :dense="isDense"
        />
        <q-input
          v-model="inputs.rounded"
          label="Rounded"
          rounded
          :dense="isDense"
        />
        <q-input
          v-model="inputs.icon"
          label="With Icon"
          :dense="isDense"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </section>

    <q-separator spaced />

    <!-- Cards -->
    <section>
      <h2>Cards</h2>
      <div class="row q-gutter-md">
        <q-card
          style="max-width: 300px;"
          class="shadow-2"
        >
          <q-card-section>
            <div class="text-h6">
              Simple Card
            </div>
            <div class="text-subtitle2">
              Subtitle goes here
            </div>
          </q-card-section>
          <q-img
            src="https://cdn.quasar.dev/img/mountains.jpg"
            height="140"
          />
          <q-card-actions align="right">
            <q-btn
              flat
              label="Action 1"
              color="primary"
              :size="selectedSize"
            />
            <q-btn
              flat
              label="Action 2"
              color="primary"
              :size="selectedSize"
            />
          </q-card-actions>
        </q-card>

        <q-card
          flat
          bordered
          :dark="false"
          class="bg-grey-1 text-dark"
        >
          <q-card-section>
            <div class="text-h6">
              Flat Bordered Card
            </div>
            <div>With grey background and border</div>
          </q-card-section>
        </q-card>
      </div>
    </section>

    <q-separator spaced />

    <!-- Chips -->
    <section>
      <h2>Chips</h2>
      <div class="q-gutter-sm row wrap items-center">
        <q-chip
          v-for="color in chipColors"
          :key="color"
          :size="selectedSize"
          :color="color"
          text-color="white"
        >
          {{ color }}
        </q-chip>
      </div>
    </section>

    <q-separator spaced />

    <!-- Lists -->
    <section>
      <h2>Lists</h2>
      <q-list
        bordered
        padding
      >
        <q-item
          v-ripple
          clickable
        >
          <q-item-section avatar>
            <q-icon name="person" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Person 1</q-item-label>
            <q-item-label caption>
              Caption text
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn
              dense
              flat
              icon="mdi-delete"
              color="negative"
              :size="selectedSize"
            />
          </q-item-section>
        </q-item>
        <q-item
          v-ripple
          clickable
        >
          <q-item-section avatar>
            <q-icon name="person_outline" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Person 2</q-item-label>
            <q-item-label caption>
              Another caption
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn
              dense
              flat
              icon="mdi-delete"
              color="negative"
              :size="selectedSize"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </section>

    <q-separator spaced />

    <!-- Tabs -->
    <section>
      <h2>Tabs</h2>
      <q-tabs
        v-model="tab"
        dense
        active-color="primary"
        indicator-color="primary"
        class="text-subtitle1"
      >
        <q-tab
          name="tab1"
          label="Tab 1"
        />
        <q-tab
          name="tab2"
          label="Tab 2"
        />
        <q-tab
          name="tab3"
          label="Tab 3"
        />
      </q-tabs>

      <q-tab-panels
        v-model="tab"
        animated
      >
        <q-tab-panel name="tab1">
          Content for tab 1
        </q-tab-panel>
        <q-tab-panel name="tab2">
          Content for tab 2
        </q-tab-panel>
        <q-tab-panel name="tab3">
          Content for tab 3
        </q-tab-panel>
      </q-tab-panels>
    </section>

    <q-separator spaced />

    <!-- Switches, Checkboxes, Radios -->
    <section>
      <h2>Form Controls</h2>
      <div class="row q-gutter-md q-flex-wrap">
        <q-checkbox
          v-model="form.checkbox"
          label="Checkbox"
          color="primary"
          :dense="isDense"
          :size="selectedSize"
        />

        <q-toggle
          v-model="form.toggle"
          label="Toggle Switch"
          color="primary"
          :dense="isDense"
          :size="selectedSize"
        />

        <q-radio
          v-model="form.radio"
          val="option1"
          label="Radio Option 1"
          color="primary"
          :dense="isDense"
          :size="selectedSize"
        />
        <q-radio
          v-model="form.radio"
          val="option2"
          label="Radio Option 2"
          color="primary"
          :dense="isDense"
          :size="selectedSize"
        />
      </div>
    </section>

    <q-separator spaced />

    <!-- Progress -->
    <section>
      <h2>Progress Indicators</h2>
      <div class="q-gutter-md row items-center">
        <q-linear-progress
          color="primary"
          :value="0.4"
          class="q-mr-md"
          style="width: 200px"
        />
        <q-linear-progress
          color="secondary"
          indeterminate
          class="q-mr-md"
          style="width: 200px"
        />
        <q-circular-progress
          size="50px"
          color="primary"
          :value="0.6"
          class="q-mr-md"
        />
        <q-circular-progress
          size="50px"
          color="secondary"
          indeterminate
          class="q-mr-md"
        />
      </div>
    </section>

    <q-separator spaced />

    <!-- Dialog Demo -->
    <section>
      <h2>Dialog Demo</h2>
      <q-btn
        label="Open Dialog"
        color="primary"
        :size="selectedSize"
        @click="dialog = true"
      />
      <q-dialog v-model="dialog">
        <q-card style="min-width: 300px">
          <q-card-section class="row items-center">
            <q-icon
              name="info"
              color="primary"
              size="36px"
              class="q-mr-md"
            />
            <div>
              <div class="text-h6">
                Dialog Title
              </div>
              <div>This is a sample dialog content.</div>
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              v-close-popup
              flat
              label="Cancel"
              color="negative"
              :size="selectedSize"
            />
            <q-btn
              v-close-popup
              flat
              label="Ok"
              color="primary"
              :size="selectedSize"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </section>

    <section class="q-pa-md">
      <h2>
        Typography
      </h2>

      <div class="q-gutter-md">
        <div class="text-h1">
          Heading 1 - .text-h1
        </div>
        <div class="text-h2">
          Heading 2 - .text-h2
        </div>
        <div class="text-h3">
          Heading 3 - .text-h3
        </div>
        <div class="text-h4">
          Heading 4 - .text-h4
        </div>
        <div class="text-h5">
          Heading 5 - .text-h5
        </div>
        <div class="text-h6">
          Heading 6 - .text-h6
        </div>

        <div class="text-subtitle1">
          Subtitle 1 - .text-subtitle1
        </div>
        <div class="text-subtitle2">
          Subtitle 2 - .text-subtitle2
        </div>

        <div class="text-body1">
          Body 1 - .text-body1 (Default paragraph text)
        </div>
        <div class="text-body2">
          Body 2 - .text-body2
        </div>

        <div class="text-caption">
          Caption - .text-caption
        </div>
        <div class="text-overline">
          Overline - .text-overline
        </div>
      </div>

      <div class="q-mt-xl q-gutter-sm">
        <div class="text-bold">
          .text-bold
        </div>
        <div class="text-italic">
          .text-italic
        </div>
        <div class="text-uppercase">
          .text-uppercase
        </div>
        <div class="text-lowercase">
          .text-lowercase
        </div>
        <div class="text-weight-thin">
          .text-weight-thin
        </div>
        <div class="text-weight-light">
          .text-weight-light
        </div>
        <div class="text-weight-regular">
          .text-weight-regular
        </div>
        <div class="text-weight-medium">
          .text-weight-medium
        </div>
        <div class="text-weight-bold">
          .text-weight-bold
        </div>
      </div>

      <div class="q-mt-xl">
        <div class="text-center">
          .text-center — Center aligned
        </div>
        <div class="text-left">
          .text-left — Left aligned
        </div>
        <div class="text-right">
          .text-right — Right aligned
        </div>
      </div>
    </section>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

definePageMeta({
  middleware: [
    function () {
      if (process.env.NODE_ENV === 'production') {
        return navigateTo('/404')
      }
    },
  ],
})

const sizeOptions = [
  { label: 'XS', value: 'xs' },
  { label: 'SM', value: 'sm' },
  { label: 'MD', value: 'md' },
  { label: 'LG', value: 'lg' },
  { label: 'XL', value: 'xl' },
]

const selectedSize = ref('md')
const isDense = ref(false)

const tab = ref('tab1')
const dialog = ref(false)

const inputs = ref({
  standard: '',
  outlined: '',
  filled: '',
  rounded: '',
  icon: '',
})

const form = ref({
  checkbox: false,
  toggle: false,
  radio: 'option1',
})

const chipColors = [
  'primary',
  'secondary',
  'positive',
  'negative',
  'warning',
  'info',
  'accent',
  'dark',
]
</script>

<style scoped lang="css">
.demo-page {
  max-width: 900px;
  margin: auto;
  font-family: 'Roboto', sans-serif;
}

section {
  margin-bottom: 48px;
}

h2 {
  margin-bottom: 16px;
  font-weight: 600;
  color: var(--q-primary);
}
</style>
