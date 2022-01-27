<template>
  <q-input :model-value="value" :label="label" stack-label dense />
</template>

<script>
export default {
  name: 'InputForm',
  props: {
    value: {
      type: [String, Number],
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
  },
}
</script>

<style scoped></style>
