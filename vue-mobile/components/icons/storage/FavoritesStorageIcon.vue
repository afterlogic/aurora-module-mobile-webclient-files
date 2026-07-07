<template>
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 1.75L9.8175 5.43179L13.8817 6.02229L10.9409 8.88821L11.635 12.9327L8 11.0218L4.365 12.9327L5.05913 8.88821L2.11827 6.02229L6.1825 5.43179L8 1.75Z" :stroke="color" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</template>

<script>
export default {
  name: "FavoritesStorageIcon",
  props: {
    color: {
      type: String,
      default: '#B6B5B5',
    },
  },
}
</script>
