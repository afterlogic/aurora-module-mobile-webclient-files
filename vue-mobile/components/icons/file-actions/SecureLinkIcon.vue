<template>
  <svg :width="width" :height="height" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_195_339)">
      <path d="M9 6.5L10 5.5C11.1046 4.39543 12.8954 4.39543 14 5.5V5.5C15.1046 6.60457 15.1046 8.39543 14 9.5L12.5 11" stroke="black" stroke-width="1.25"/>
      <path d="M10.5 13L9 14.5C7.89543 15.6046 6.10457 15.6046 5 14.5V14.5C3.89543 13.3954 3.89543 11.6046 5 10.5L7.5 8" stroke="black" stroke-width="1.25"/>
      <path d="M7.5 12L12 7.5" stroke="black"/>
      <path d="M3.375 3V2H2.625V3H3.375ZM5.625 2V3H6.375V2H5.625ZM4 1.375H4.5V0.625H4V1.375ZM4.5 1.375H5V0.625H4.5V1.375ZM6.375 2C6.375 1.24061 5.75939 0.625 5 0.625V1.375C5.34518 1.375 5.625 1.65482 5.625 2H6.375ZM3.375 2C3.375 1.65482 3.65482 1.375 4 1.375V0.625C3.24061 0.625 2.625 1.24061 2.625 2H3.375Z" fill="black"/>
      <path d="M2 3.5H7C7.27614 3.5 7.5 3.72386 7.5 4V8C7.5 8.27614 7.27614 8.5 7 8.5H2C1.72386 8.5 1.5 8.27614 1.5 8V4C1.5 3.72386 1.72386 3.5 2 3.5Z" fill="black" stroke="black"/>
    </g>
    <defs>
      <clipPath id="clip0_195_339">
        <rect width="16" height="16" fill="white"/>
      </clipPath>
    </defs>
  </svg>

</template>

<script>
export default {
  name: "SecureLinkIcon",
  props: {
    width: { type: Number, default: 16 },
    height: { type: Number, default: 16 },
  }
}
</script>

<style scoped>

</style>
