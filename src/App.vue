<template>
  <AppMainLayout
    :key="key"
  >
    <router-view />
  </AppMainLayout>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useWallet } from 'src/composable/store'

import AppMainLayout from 'layouts/AppMainLayout.vue'


export default defineComponent({
  name: 'App',
  components: {
    AppMainLayout,
  },
  setup: () => {
    const {
      ethAccount,
      chainId,
    } = useWallet().state

    const key = computed(() => [
      ethAccount.value,
      chainId.value,
    ].filter(Boolean).join('--'))

    return {
      key,
    }
  },
})
</script>
