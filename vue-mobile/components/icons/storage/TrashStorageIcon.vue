<template>
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.5 4H13.5" :stroke="color" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M6 4V2.5C6 2.22386 6.22386 2 6.5 2H9.5C9.77614 2 10 2.22386 10 2.5V4" :stroke="color" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M3.5 4L3.97 13.0533C3.99728 13.5789 4.43146 14 4.958 14H11.042C11.5685 14 12.0027 13.5789 12.03 13.0533L12.5 4" :stroke="color" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M6.5 6.5V11.5" :stroke="color" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M9.5 6.5V11.5" :stroke="color" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</template>

<script>
export default {
  name: "TrashStorageIcon",
  props: {
    color: {
      type: String,
      default: '#B6B5B5',
    },
  },
}
</script>
