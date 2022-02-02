<template>
  <div class="row">
    <div class="col">
      <b>account:</b>
      <br>{{ account }}
    </div>

    <div
      v-if="balance"
      class="col"
    >
      <b>Balance:</b>
      <br>{{ balance }} ETH
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppWalletDetails',
  props: {
    account: {
      type: String,
      required: true,
    },
    balance: {
      type: String,
      required: true,
    },
  },
})
</script>
