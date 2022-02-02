<template>
  <q-banner inline-actions class="text-white bg-red">
    Вы подключены к неподдерживаемой сети. Используйте {{ NETWORK_NAME }}
    <template #action>
      <q-btn
        flat
        color="white"
        label="Сменить сеть"
        @click="$emit('switch')"
      />
    </template>
  </q-banner>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppUnsupportedNetwork',
  emits: ['switch'],
  setup: () => ({
    NETWORK_NAME: process.env.NETWORK_NAME,
  }),
})
</script>
