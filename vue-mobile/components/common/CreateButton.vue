<template>
  <plus-btn-icon @click="showDialog" :class="`create-btn ${classes}`" />
</template>

<script>
import PlusBtnIcon from 'components/common/icons/PlusBtnIcon'

export default {
  name: 'CreateButton',
  components: {
    PlusBtnIcon,
  },
  props: {
    classes: { type: String, default: 'z-index-min' },
    showDialog: { type: Function, default: () => null }
  },
}
</script>

<style scoped>
.create-btn {
  position: fixed;
  bottom: 68px;
  right: 10px;
  transition-duration: 300ms;
}
.rotate {
  transform: rotate(225deg);
}
.z-index-max {
  z-index: 10000;
}
.z-index-min {
  z-index: 1;
}
</style>
