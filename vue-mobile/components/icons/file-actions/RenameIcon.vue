<template>
  <svg :width="width" :height="height" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.5858 2.41421L11 3L14 6L14.5858 5.41421C15.3668 4.63317 15.3668 3.36683 14.5858 2.58579L14.4142 2.41421C13.6332 1.63316 12.3668 1.63316 11.5858 2.41421Z" fill="black" stroke="#B6B5B5" stroke-width="0.125"/>
    <path d="M2 15V12L10 4L13 7L5 15H2Z" fill="black" stroke="#B6B5B5" stroke-width="0.125"/>
  </svg>

</template>

<script>
export default {
  name: "RenameIcon",
  props: {
    width: { type: Number, default: 16 },
    height: { type: Number, default: 16 },
  }
}
</script>

<style scoped>

</style>
