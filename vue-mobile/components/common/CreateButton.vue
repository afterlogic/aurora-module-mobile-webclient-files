<template>
  <plus-btn-icon @click="showDialog" :class="`create-btn ${classes}`" />
</template>

<script>
import PlusBtnIcon from 'components/common/icons/PlusBtnIcon'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'CreateButton',
  components: {
    PlusBtnIcon,
  },
  props: {
    icon: { type: String, default: '' },
  },
  computed: {
    ...mapGetters('files', ['dialogComponent']),
    classes() {
      if (this.dialogComponent.component === 'CreateButtonsDialogs') {
        return 'z-index-max rotate'
      }
      return 'z-index-min'
    },
  },
  methods: {
    ...mapActions('files', ['changeDialogComponent']),
    showDialog() {
      if (this.dialogComponent.component === 'CreateButtonsDialogs') {
        this.changeDialogComponent({ component: '' })
      } else {
        this.changeDialogComponent({ component: 'CreateButtonsDialogs' })
      }
    },
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
