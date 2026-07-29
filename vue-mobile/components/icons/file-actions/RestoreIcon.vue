<template>
  <svg :width="width" :height="height" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 1C4.68629 1 2 3.68629 2 7H0L2.5 10L5 7H3C3 4.23858 5.23858 2 8 2C10.7614 2 13 4.23858 13 7C13 9.76142 10.7614 12 8 12C6.933 12 5.93986 11.6662 5.134 11.1056L4.366 12.2764C5.392 13.0522 6.644 13.5 8 13.5C11.5899 13.5 14.5 10.5899 14.5 7C14.5 3.41015 11.5899 1 8 1Z" fill="black"/>
  </svg>
</template>

<script>
export default {
  name: 'RestoreIcon',
  props: {
    width: { type: Number, default: 16 },
    height: { type: Number, default: 16 },
  },
}
</script>
