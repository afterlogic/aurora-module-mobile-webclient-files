<template>
  <svg :width="width" :height="height" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 15H4C2.89543 15 2 14.1046 2 13V2C2 1.44772 2.44772 1 3 1H10L13 4V7M9 1V6H13" stroke="black" stroke-width="2"/>
    <path d="M7 11.5L7 9.5L13 9.5L13 8L16 10.5L13 13L13 11.5L7 11.5Z" fill="black"/>
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
