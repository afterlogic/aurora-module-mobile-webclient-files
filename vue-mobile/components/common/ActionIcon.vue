<template>
  <div
    class="action-icon flex justify-center items-center"
    :class="{ 'action-icon_with-cross': withCross }"
    :style="iconStyle"
    role="button"
    tabindex="0"
    @click="$emit('click', $event)"
    @keydown.enter.prevent="$emit('click', $event)"
  >
    <component :is="componentInstance" :color="color" />
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";

export default {
  name: 'ActionIcon',
  emits: ['click'],
  props: {
    icon: { type: String, required: true },
    color: { type: String, default: 'currentColor' },
    withCross: { type: Boolean, default: false },
  },
  computed: {
    componentInstance () {
      const name = this.icon ? this.icon : ''
      return defineAsyncComponent(() => import(`../icons/file-actions/${name}`))
    },
    iconStyle() {
      return this.color ? { color: this.color } : null
    },
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

.action-icon_with-cross {
  position: relative;
  min-height: unset;
  min-width: unset;
  cursor: inherit;

  &::before,
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 9px;
    width: 5px;
    height: 1.5px;
    background: currentColor;
    transform-origin: center;
  }

  &::before {
    transform: translateX(-50%) rotate(45deg);
  }

  &::after {
    transform: translateX(-50%) rotate(-45deg);
  }
}
</style>
