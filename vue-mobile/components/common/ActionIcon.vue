<template>
  <div
    class="action-icon flex justify-center items-center"
    :class="{
      'action-icon_with-cross': withCross,
      'action-icon_decorative': !isInteractive,
    }"
    :style="iconStyle"
    :role="isInteractive ? 'button' : undefined"
    :tabindex="isInteractive ? 0 : undefined"
    @click="onClick"
    @keydown.enter.prevent="onClick"
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
    // Interactive only when a parent listens to @click — otherwise stay
    // decorative so nested use inside q-btn / wrappers does not create a
    // second button hit-target. Declared emits are omitted from $attrs,
    // so read the listener from the vnode props.
    isInteractive() {
      return typeof this.$.vnode.props?.onClick === 'function'
    },
    componentInstance () {
      const name = this.icon ? this.icon : ''
      return defineAsyncComponent(() => import(`../icons/file-actions/${name}`))
    },
    iconStyle() {
      return this.color ? { color: this.color } : null
    },
  },
  methods: {
    onClick(event) {
      if (!this.isInteractive) {
        return
      }
      this.$emit('click', event)
    },
  },
}
</script>

<style scoped>
.action-icon {
  width: 16px;
  cursor: pointer;
}

.action-icon_decorative {
  cursor: inherit;
  pointer-events: none;
}

.action-icon_with-cross {
  position: relative;
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
