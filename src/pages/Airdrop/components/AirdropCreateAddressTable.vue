<template>
  <div>
    <q-table
      :rows="listTransactions"
      :columns="columns"
      row-key="0"
      :rows-per-page-options="[0]"
      class="q-mb-md"
      flat
    >
      <template #body-cell-address="props">
        <q-td :props="props">
          <a
            :href="`https://goerli.etherscan.io/address/${props.value}`"
            target="__blank"
            v-text="props.value"
          />
        </q-td>
      </template>
    </q-table>

    <AirdropCreateTokenData
      v-if="tokenData"
      v-bind="tokenData"
      class="q-mb-md"
    />

    <div
      v-if="tokenData?.isNeedApprove"
      class="flex flex-center q-mb-md"
    >
      <q-radio
        v-model="approveAmount"
        :val="tokenData.total"
        :label="`Необходимое количество токенов ${tokenData.total}`"
      />
      <q-radio
        v-model="approveAmount"
        val=""
        label="Неограниченное количество токенов"
      />
    </div>

    <div class="flex flex-center">
      <q-btn
        color="primary"
        flat
        label="Назад"
        class="q-mx-xs"
        @click="$emit('back')"
      />

      <q-btn
        v-if="tokenData?.isNeedApprove"
        :loading="loadingApprove"
        color="primary"
        label="Подтвердить"
        :disabled="disabled"
        unelevated
        class="q-mx-xs"
        @click="$emit('approve', approveAmount)"
      />

      <q-btn
        v-else
        color="primary"
        label="Дальше"
        :disabled="disabled"
        unelevated
        class="q-mx-xs"
        @clock="$emit('next')"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  PropType,
  defineComponent,
  computed,
  ref,
} from 'vue'
import { IListTransactions, ITokenData } from '../utils'

import AirdropCreateTokenData from './AirdropCreateTokenData.vue'

const TABLE_COLUMNS = [
  {
    field: '0',
    label: 'Адрес',
    name: 'address',
    align: 'left',
    sortable: true,
  },
  {
    field: '1',
    label: 'Количество',
    align: 'right',
    sortable: true,
  },
]

export default defineComponent({
  name: 'AirdropCreateAddressTable',
  components: {
    AirdropCreateTokenData,
  },
  props: {
    tokenData: {
      type: Object as PropType<ITokenData>,
    },
    listTransactions: {
      type: Array as PropType<IListTransactions>,
      required: true,
    },
    loadingApprove: {
      type: Boolean,
      required: true,
    },
  },
  emits: [
    'back',
    'approve',
  ],
  setup: (props) => {
    const approveAmount = ref('')

    const disabled = computed(() => (
      !props.tokenData
      || !props.tokenData.isEnoughBalance
      || props.loadingApprove
    ))

    return {
      columns: TABLE_COLUMNS,
      approveAmount,
      disabled,
    }
  },
})
</script>
