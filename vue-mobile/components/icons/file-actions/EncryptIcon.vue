<template>
  <svg :width="width" :height="height" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="16" height="16" fill="white"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M2 6.5C2 4.00125 3.5 2 8 2C11.75 2 14 4.00125 14 6.5C14 8.83716 10.7426 14 8 14C5.25735 14 2 8.99875 2 6.5ZM6.5 9.875C7.4286 9.4167 7.64337 8.21708 6.83195 7.01568C6.02053 5.81428 4.60997 5.21188 3.68137 5.67018C2.75278 6.12847 2.65778 7.47393 3.4692 8.67533C4.28062 9.87673 5.5714 10.3333 6.5 9.875ZM9.16805 7.01568C8.35663 8.21708 8.5714 9.4167 9.5 9.875C10.4286 10.3333 11.7614 9.81458 12.5728 8.61317C13.3843 7.41177 13.2472 6.12847 12.3186 5.67018C11.39 5.21188 9.97947 5.81428 9.16805 7.01568ZM6.5 11C6.58333 11.5 7 12.5 8 12.5C9 12.5 9.41667 11.5 9.5 11C8.61111 11.6667 7.38889 11.6667 6.5 11Z" fill="black"/>
  </svg>

</template>

<script>
export default {
  name: "EncryptIcon",
  props: {
    width: { type: Number, default: 16 },
    height: { type: Number, default: 16 },
  }
}
</script>

<style scoped>

</style>
