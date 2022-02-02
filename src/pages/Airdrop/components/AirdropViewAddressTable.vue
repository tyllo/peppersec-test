<template>
  <q-table
    :rows="listTransactions"
    :columns="columns"
    row-key="0"
    :rows-per-page-options="[0]"
    :loading="loading"
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
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue'
import { IListTransactions } from '../utils'

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
  name: 'AirdropViewAddressTable',
  props: {
    listTransactions: {
      type: Array as PropType<IListTransactions>,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },
  setup: () => ({
    columns: TABLE_COLUMNS,
  }),
})
</script>
