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
        :loading="isLoadingApprove || isLoadingCreate"
        @back="onBack"
        @approve="onApprove"
        @create="onCreate"
      />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useWallet } from 'src/composable/store'
import { ROUTE_AIRDROP_SUMMARY } from 'src/helpers/enums/routes'
import {
  IData,
  ITokenData,
  getTokenData,
  approveToken,
  createNewAirdrop,
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
    const isLoadingCreate = ref(false)
    const form = ref<IData>()
    const tokenData = ref<ITokenData>()
    const step = ref(0)

    const $router = useRouter()
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
        // @ts-ignore TODO
        const { message } = (error?.error || error) as Error
        tokenData.value = void 0

        $q.notify({
          color: 'negative',
          message,
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
          color: 'positive',
          message: `Approved! Transaction ${tx.hash}`,
          position: 'top',
        })

        await onGetTokenData()
      } catch (error) {
        // @ts-ignore TODO
        const { message } = (error?.error || error) as Error

        $q.notify({
          color: 'negative',
          message,
          position: 'top',
          timeout: 10_000,
        })
      }

      isLoadingApprove.value = false
    }

    const onCreate = async () => {
      const externalProvider = state.externalProvider.value
      const data = form.value
      const tokenDataV = tokenData.value
      if (!data || !externalProvider || !tokenDataV) return

      isLoadingCreate.value = true

      try {
        const { id, tx } = await createNewAirdrop(
          data,
          tokenDataV,
          externalProvider,
        )

        await tx.wait()

        $q.notify({
          color: 'positive',
          message: `createNewAirdrop! Transaction ${tx.hash}`,
          position: 'top',
        })

        $router.push({
          name: ROUTE_AIRDROP_SUMMARY,
          params: { id },
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

      isLoadingCreate.value = false
    }

    const onConnect = async () => {
      try {
        await connectToMetamask()
      } catch (error) {
        // @ts-ignore TODO
        const { message } = (error?.error || error) as Error

        $q.notify({
          color: 'negative',
          message,
          position: 'top',
          timeout: 10_000,
        })
      }
    }

    const onNext = (data = form.value) => {
      step.value += 1
      form.value = data
      onGetTokenData()
    }

    const onBack = () => {
      step.value -= 1
    }

    return {
      isConnected,
      isLoadingApprove,
      isLoadingCreate,

      step,
      form,
      tokenData,

      onConnect,
      onApprove,
      onCreate,
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
    max-width: 1024px;
    width: 1024px;
  }
}
</style>
