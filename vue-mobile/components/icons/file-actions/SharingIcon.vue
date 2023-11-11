<template>
  <svg :width="width" :height="height" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="3" r="1.5" fill="black" stroke="black"/>
    <circle cx="4" cy="8" r="1.5" fill="black" stroke="black"/>
    <circle cx="12" cy="13" r="1.5" fill="black" stroke="black"/>
    <path d="M12 3L4 8L12 13" stroke="black"/>
  </svg>
</template>

<script>
export default {
  name: "SharingIcon",
  props: {
    width: { type: Number, default: 16 },
    height: { type: Number, default: 16 },
  }
}
</script>
