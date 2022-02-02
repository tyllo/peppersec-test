<template>
  <q-page
    padding
    class="page-airdrop-create"
  >
    <div class="page-airdrop-create__form">
      <AirdropCreateForm
        v-if="step === 0"
        :data="form"
        :connected="isConnected"
        @connect="onConnect"
        @next="onNext"
      />

      <AirdropCreateAddressTable
        v-else-if="step === 1"
        v-bind="form"
        :token-data="tokenData"
        :loading-approve="isLoadingApprove"
        @approve="onApprove"
        @back="onBack"
      />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useWallet } from 'src/composable/store'
import {
  IData,
  ITokenData,
  getTokenData,
  approveToken,
} from './utils'

import AirdropCreateForm from './components/AirdropCreateForm.vue'
import AirdropCreateAddressTable from './components/AirdropCreateAddressTable.vue'


export default defineComponent({
  name: 'PageAirdropCreate',
  components: {
    AirdropCreateForm,
    AirdropCreateAddressTable,
  },
  setup: () => {
    const isLoadingApprove = ref(false)
    const form = ref<IData>()
    const tokenData = ref<ITokenData>()
    const step = ref(0)
    const $q = useQuasar()

    const { state } = useWallet()

    const {
      isConnected,
    } = useWallet().getters

    const {
      connectToMetamask,
    } = useWallet().actions

    const onGetTokenData = async () => {
      const account = state.ethAccount.value
      const webProvider = state.webProvider.value
      const data = form.value

      if (!account || !webProvider || !data) return

      try {
        tokenData.value = await getTokenData(
          account,
          webProvider,
          data,
        )
      } catch (error) {
        tokenData.value = void 0

        $q.notify({
          color: 'negative',
          message: (error as Error).message,
          position: 'top',
          timeout: 10_000,
        })
      }
    }

    const onApprove = async (amount: string) => {
      const externalProvider = state.externalProvider.value
      const data = form.value

      if (!externalProvider || !data) return

      isLoadingApprove.value = true

      try {
        const tx = await approveToken(
          amount,
          externalProvider,
          data,
        )

        await tx.wait()

        $q.notify({
          color: 'negative',
          message: `Transaction ${tx.hash} is ok`,
          position: 'top',
        })

        await onGetTokenData()
      } catch (error) {
        $q.notify({
          color: 'negative',
          message: (error as Error).message,
          position: 'top',
          timeout: 10_000,
        })
      }

      isLoadingApprove.value = false
    }

    const onConnect = async () => {
      try {
        await connectToMetamask()
      } catch (error) {
        $q.notify({
          color: 'negative',
          message: (error as Error).message,
          position: 'top',
          timeout: 10_000,
        })
      }
    }

    const onNext = (data: IData) => {
      step.value = 1
      form.value = data
      onGetTokenData()
    }

    const onBack = () => {
      step.value = 0
    }

    return {
      isConnected,
      isLoadingApprove,

      step,
      form,
      tokenData,

      onConnect,
      onApprove,
      onNext,
      onBack,
    }
  },
})
</script>

<style lang="scss">
.page-airdrop-create {
  display: flex;
  justify-content: center;

  &__form {
    max-width: 728px;
    width: 728px;
  }
}
</style>
