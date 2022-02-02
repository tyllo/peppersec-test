<template>
  <q-page
    padding
    class="page-airdrop-summary"
  >
    <div v-if="!isConnected">
      <q-btn
        color="primary"
        outline
        class="q-mt-md"
        label="Подключить кошелек"
        @click="onConnect"
      />
    </div>

    <q-circular-progress
      v-else-if="isLoading"
      indeterminate
      size="50px"
      color="primary"
      class="q-ma-md"
    />

    <div v-else-if="errorMessage" class="q-pa-lg">
      <q-banner class="bg-grey-3 text-red">
        {{ errorMessage }}
      </q-banner>

      <q-btn
        to="/"
        color="primary"
        outline
        class="q-mt-md"
        label="Назад"
      />
    </div>

    <div v-else-if="claimData">
      Вам полагается
      <b>{{ claimData.amount }} {{ airdrops.symbol }}</b>
      <br>Token address:
      <a
        target="_blank_"
        :href="`https://goerli.etherscan.io/address/${airdrops.tokenAddress}`"
        v-text="airdrops.tokenAddress"
      />
      <br>

      <q-btn
        color="primary"
        :loading="isLoadingDrop"
        outline
        class="q-mt-md"
        label="Забрать вознаграждения"
        @click="onClaimedDrop"
      />
    </div>

    <q-banner
      v-else
      class="bg-grey-3 text-red"
    >
      У вас нет вознаграждений
    </q-banner>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useWallet } from 'src/composable/store'
import { IData, getAirdropData, claimedDrop } from './utils'


export default defineComponent({
  name: 'PageAirdropDrop',
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup: (props) => {
    const isLoading = ref(true)
    const isLoadingDrop = ref(false)
    const errorMessage = ref('')
    const airdrops = ref()

    const data = ref<IData>({
      tokenAddress: '',
      listTransactions: [],
    })

    const $q = useQuasar()

    const {
      webProvider,
      ethAccount,
      externalProvider,
    } = useWallet().state

    const {
      isConnected,
    } = useWallet().getters

    const {
      connectToMetamask,
    } = useWallet().actions

    const claimData = computed(() => {
      const account = ethAccount.value?.toLowerCase()
      if (!account) return void 0

      const result = data.value.listTransactions.find(([addr]) => (
        addr.toLowerCase() === ethAccount.value?.toLowerCase()
      ))

      if (!result) return void 0

      const [address, amount] = result
      return { address, amount }
    })

    const onConnect = () => {
      connectToMetamask()
    }

    const onClaimedDrop = async () => {
      isLoadingDrop.value = true

      const provider = externalProvider.value
      const { address, amount } = claimData.value || {}
      if (!address || !amount || !provider) return

      try {
        const tx = await claimedDrop(
          props.id,
          address,
          amount,
          airdrops.value.decimals,
          data.value,
          provider,
        )

        await tx.wait()

        $q.notify({
          color: 'positive',
          message: 'Вознаграждение получено',
          position: 'top',
        })
      } catch (error) {
        // @ts-ignore TODO
        const { message } = (error?.error || error) as Error

        $q.notify({
          color: 'negative',
          message,
          position: 'top',
        })
      }

      isLoadingDrop.value = false
    }

    void (async () => {
      if (!webProvider.value || !isConnected.value) return
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
      isConnected,
      isLoading,
      isLoadingDrop,

      errorMessage,
      data,
      airdrops,
      claimData,

      onConnect,
      onClaimedDrop,
    }
  },
})
</script>


<style lang="scss">
.page-airdrop-drop {
  display: flex;
  justify-content: center;

  &__table {
    max-width: 1024px;
    width: 1024px;
  }
}
</style>
