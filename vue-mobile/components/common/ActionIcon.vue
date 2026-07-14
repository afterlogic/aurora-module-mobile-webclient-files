<template>
  <div
    class="action-icon flex justify-center items-center"
    role="button"
    tabindex="0"
    @click="$emit('click', $event)"
    @keydown.enter.prevent="$emit('click', $event)"
  >
    <component :is="componentInstance" />
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";

export default {
  name: 'ActionIcon',
  emits: ['click'],
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
  min-height: 32px;
  min-width: 32px;
  cursor: pointer;
}
</style>
