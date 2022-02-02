<template>
  <q-page
    padding
    class="page-airdrop-summary"
  >
    <div v-if="errorMessage" class="q-pa-lg">
      <q-banner class="bg-grey-3 text-red">
        {{ errorMessage }}
      </q-banner>

      <q-btn
        :to="backLocation"
        color="primary"
        outline
        class="q-mt-md"
        label="Назад"
      />
    </div>

    <div v-else>
      <div v-if="airdrops" class="q-mb-md">
        <a
          target="_blank_"
          :href="`https://goerli.etherscan.io/address/${airdrops.owner}`"
          v-text="airdrops.owner"
        />
        <br>Claimed: {{ airdrops.claimed }} {{ airdrops.symbol }}
        <br>Total: {{ airdrops.total }} {{ airdrops.symbol }}
        <br>Token name: {{ airdrops.name }}
        <br>Token address:
        <a
          target="_blank_"
          :href="`https://goerli.etherscan.io/address/${airdrops.tokenAddress}`"
          v-text="airdrops.tokenAddress"
        />
      </div>

      <q-btn
        outline
        :to="dropLocation"
        label="Ссылка для получения вознаграждения пользователем"
        class="q-mb-md"
      />

      <AirdropViewAddressTable
        v-bind="data"
        :loading="isLoading"
        class="page-airdrop-summary__table"
      />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useWallet } from 'src/composable/store'
import { ROUTE_AIRDROP_CREATE, ROUTE_AIRDROP_DROP } from 'src/helpers/enums/routes'
import { IData, getAirdropData } from './utils'

import AirdropViewAddressTable from './components/AirdropViewAddressTable.vue'


const BACK_LOCATION = {
  name: ROUTE_AIRDROP_CREATE,
}

export default defineComponent({
  name: 'PageAirdropSummary',
  components: {
    AirdropViewAddressTable,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup: (props) => {
    const isLoading = ref(true)
    const errorMessage = ref('')
    const airdrops = ref()

    const data = ref<IData>({
      tokenAddress: '',
      listTransactions: [],
    })

    const {
      webProvider,
    } = useWallet().state

    void (async () => {
      if (!webProvider.value) return
      isLoading.value = true

      try {
        const response = await getAirdropData(props.id, webProvider.value)
        data.value = response.data
        airdrops.value = response.airdrops
      } catch {
        errorMessage.value = `Рассылки с id="${props.id}" не существует`
      }

      isLoading.value = false
    })()

    return {
      isLoading,
      errorMessage,
      data,
      airdrops,
      backLocation: BACK_LOCATION,
      dropLocation: {
        name: ROUTE_AIRDROP_DROP,
        params: { id: props.id },
      },
    }
  },
})
</script>

<style lang="scss">
.page-airdrop-summary {
  display: flex;
  justify-content: center;

  &__table {
    max-width: 1024px;
  }
}
</style>
