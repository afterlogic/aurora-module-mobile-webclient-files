<template>
  <q-select
    :model-value="model"
    dense
    outlined
    v-model="model"
    :options="options"
    @click="action"
  />
</template>

<script>
export default {
  name: 'SelectComponent',
  props: {
    options: { type: Array, default: () => [] },
    value: { type: [String, Object], default: '' },
    action: { type: Function, default: null },
  },
  data() {
    return {
      model: null,
    }
  },
  watch: {
    value(val) {
      this.model = val
    },
  },
}
</script>

<style scoped></style>
