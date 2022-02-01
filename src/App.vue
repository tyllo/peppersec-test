<template>
  <AppMainLayout>
    <router-view />
  </AppMainLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppMainLayout from 'layouts/AppMainLayout.vue'

export default defineComponent({
  name: 'App',
  components: {
    AppMainLayout,
  },
})
</script>
