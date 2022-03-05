<template>
  <component :is="componentInstance" />
</template>

<script>
import { defineAsyncComponent } from "vue";

export default {
  name: 'StorageIcon',
  props: {
    storageType: { type: String, default: 'Personal' }
  },
  computed: {
    componentInstance() {
      const name = this.storageType[0].toUpperCase() + this.storageType.slice(1)
      return defineAsyncComponent(() => import(`./storage/${name}StorageIcon`))
    }
  }
}
</script>

<style scoped></style>
