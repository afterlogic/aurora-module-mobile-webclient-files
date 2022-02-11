<template>
  <svg :width="width" :height="height" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_34_29)">
      <circle cx="2" cy="8" r="2" transform="rotate(-90 2 8)" fill="black"/>
      <circle cx="8" cy="8" r="2" transform="rotate(-90 8 8)" fill="black"/>
      <circle cx="14" cy="8" r="2" transform="rotate(-90 14 8)" fill="black"/>
    </g>
    <defs>
      <clipPath id="clip0_34_29">
        <rect width="16" height="16" fill="white" transform="translate(0 16) rotate(-90)"/>
      </clipPath>
    </defs>
  </svg>

</template>

<script>
export default {
  name: "MoreIcon",
  props: {
    width: { type: Number, default: 16 },
    height: { type: Number, default: 16 },
  }
}
</script>

<style scoped>

</style>
