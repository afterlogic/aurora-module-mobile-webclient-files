<template>
  <svg :width="width" :height="height" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 14V3V2C0 1.44772 0.447715 1 1 1H5.69722C5.89465 1 6.08766 1.05844 6.25192 1.16795L8.74808 2.83205C8.91234 2.94156 9.10535 3 9.30278 3H15C15.5523 3 16 3.44772 16 4V14C16 14.5523 15.5523 15 15 15H1C0.447715 15 0 14.5523 0 14Z" fill="black"/>
    <path d="M3 10L3 9L10 9L10 7L13 9.5L10 12L10 10L3 10Z" fill="white" stroke="white" stroke-width="0.5"/>
  </svg>

</template>

<script>
export default {
  name: "CopyMoveIcon",
  props: {
    width: { type: Number, default: 16 },
    height: { type: Number, default: 16 },
  }
}
</script>

<style scoped>

</style>
