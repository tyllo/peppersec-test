<template>
  <q-layout
    view="lHh Lpr lFf"
    class="app-main-layout"
  >
    <q-header>
      <q-toolbar>
        <q-toolbar-title>
          Airdrop
        </q-toolbar-title>

        <q-btn
          v-if="!isConnected"
          label="Подключить"
          outline
          no-caps
          @click="onConnect"
        />

        <AppWalletDetails
          v-if="isConnected"
          :account="ethAccountShort"
          :balance="balanceETH"
          class="row app-main-layout__info"
        />

        <q-btn
          v-if="isConnected"
          label="Отключить"
          outline
          no-caps
          @click="onDisconnect"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <AppUnsupportedNetwork
        v-if="isConnected && !isSupportedNetwork"
        @switch="onSwitch"
      />

      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useQuasar } from 'quasar'
import { useWallet } from 'src/composable/store'

import AppWalletDetails from './components/AppWalletDetails.vue'
import AppUnsupportedNetwork from './components/AppUnsupportedNetwork.vue'


export default defineComponent({
  name: 'AppMainLayout',
  components: {
    AppWalletDetails,
    AppUnsupportedNetwork,
  },
  setup: () => {
    const $q = useQuasar()

    const {
      isConnected,
      isSupportedNetwork,
      balanceETH,
      ethAccountShort,
    } = useWallet().getters

    const {
      connectToMetamask,
      disconnect,
      switchEthereumChain,
    } = useWallet().actions

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

    const onDisconnect = () => {
      disconnect()
    }

    const onSwitch = async () => {
      try {
        await switchEthereumChain()
      } catch (error) {
        $q.notify({
          color: 'negative',
          message: (error as Error).message,
          position: 'top',
          timeout: 10_000,
        })
      }
    }

    return {
      isConnected,
      isSupportedNetwork,
      balanceETH,
      ethAccountShort,

      NETWORK_NAME: process.env.NETWORK_NAME,
      onConnect,
      onDisconnect,
      onSwitch,
    }
  },
})
</script>

<style lang="scss">
.app-main-layout {
  &__info {
    min-width: 180px;
  }
}
</style>
