<template>
  <form
    name="airdrop-create-form"
    @submit.prevent
  >
    <q-input
      v-model="form.tokenAddress"
      label="Адрес токена"
      :disable="!connected"
      outlined
      square
      class="q-mb-sm"
      @update:model-value="validateError = ''"
    />

    <q-input
      v-model="form.listTransactions"
      label="Список адресов"
      :disable="!connected"
      placeholder="
        Введите список адресов и количество через запятую:
        address,mount. Каждый с новой строки
      "
      :autogrow="autogrow"
      type="textarea"
      outlined
      square
      rows="10"
      class="q-mb-sm"
      @update:model-value="validateError = ''"
    />

    <q-banner
      v-if="validateError"
      dense
      class="bg-grey-3 text-red q-mb-sm"
    >
      {{ validateError }}
    </q-banner>

    <q-btn
      v-if="!connected"
      color="primary"
      outline
      label="Подключить кошелек"
      @click="$emit('connect')"
    />

    <q-btn
      v-else
      :disabled="disabledNext"
      color="primary"
      unelevated
      label="Дальше"
      @click="onNext"
    />
  </form>
</template>

<script lang="ts">
import {
  PropType,
  defineComponent,
  ref,
  computed,
} from 'vue'
import {
  parseListTransactions,
  validateForm,
  IData,
} from '../utils'


const createFormData = (data?: IData) => ({
  tokenAddress: data?.tokenAddress || '',
  listTransactions: data?.listTransactions.map((_) => _.join(',')).join('\n') || '',
})

export default defineComponent({
  name: 'AirdropCreateForm',
  props: {
    connected: {
      type: Boolean,
      required: true,
    },
    data: {
      type: Object as PropType<IData>,
    },
  },
  emits: [
    'connect',
    'next',
  ],
  setup: (props, ctx) => {
    const validateError = ref('')
    const form = ref(createFormData(props.data))

    const autogrow = computed(() => (
      form.value.listTransactions.split('\n').length > 10
    ))

    const disabledNext = computed(() => (
      !form.value.tokenAddress
      || !form.value.listTransactions
    ))

    const onNext = () => {
      const data = {
        ...form.value,
        listTransactions: parseListTransactions(form.value.listTransactions),
      }

      const result = validateForm(data)

      if (result === true) {
        ctx.emit('next', data)
      } else {
        validateError.value = result
      }
    }

    return {
      form,
      autogrow,
      disabledNext,
      validateError,

      onNext,
    }
  },
})
</script>
