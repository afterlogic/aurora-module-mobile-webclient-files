<template>
  <div class="action-icon flex justify-center items-center">
    <component :is="componentInstance" />
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";

export default {
  name: 'ActionIcon',
  props: {
    icon: { type: String, required: true },
  },
  computed: {
    componentInstance () {
      const name = this.icon ? this.icon : ''
      return defineAsyncComponent(() => import(`../icons/file-actions/${name}`))
    }
  },
}
</script>

<style scoped>
.action-icon {
  width: 16px;
}
</style>
