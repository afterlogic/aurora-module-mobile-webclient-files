<template>
  <q-input class="form-input" :model-value="value" :label="label" stack-label dense />
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

<style>
.form-input input {
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 0.3px;
  border-bottom: 1px solid #C6C6C6;
}
</style>
