<template>
  <q-card flat bordered>
    <q-card-section>
      <div class="row text-center">
        <div class="col">
          Одобренное количество
          <br>токенов для MultiSender
          <b>{{ allowance }}</b>
        </div>

        <div class="col">
          Количество токенов
          <br>на отправку
          <b>{{ total }} {{ symbol }}</b>
        </div>

        <div
          :class="{ 'text-red': !isEnoughBalance }"
          class="col"
        >
          Текущий баланс
          <br><b>{{ balance }} {{ symbol }}</b>
        </div>
      </div>
    </q-card-section>

    <q-banner
      v-if="!isEnoughBalance"
      dense
      class="bg-grey-3 text-red"
    >
      Недостаточно токенов. Пожалуйста, пополните баланс
    </q-banner>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'


export default defineComponent({
  name: 'AirdropCreateTokenData',
  props: {
    name: {
      type: String,
    },
    symbol: {
      type: String,
      required: true,
    },
    allowance: {
      type: String,
      required: true,
    },
    total: {
      type: String,
      required: true,
    },
    balance: {
      type: String,
      required: true,
    },
    isEnoughBalance: {
      type: Boolean,
      required: true,
    },
  },
})
</script>
