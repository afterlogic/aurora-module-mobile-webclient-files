<template>
  <svg :width="width" :height="height" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9 6.5L10 5.5C11.1046 4.39543 12.8954 4.39543 14 5.5V5.5C15.1046 6.60457 15.1046 8.39543 14 9.5L12.5 11"
      :stroke="color"
      stroke-width="1.25"
    />
    <path
      d="M7 9.5L6 10.5C4.89543 11.6046 3.10457 11.6046 2 10.5V10.5C0.895431 9.39543 0.895431 7.60457 2 6.5L3.5 5"
      :stroke="color"
      stroke-width="1.25"
    />
    <path d="M6 10L10 6" :stroke="color" stroke-width="1.25" />
  </svg>
</template>

<script>
export default {
  name: 'OpenLinkIcon',
  props: {
    width: { type: Number, default: 16 },
    height: { type: Number, default: 16 },
    color: { type: String, default: 'currentColor' },
  },
}
</script>
