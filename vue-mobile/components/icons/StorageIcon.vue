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
      const type = typeof this.storageType === 'string' && this.storageType.length
        ? this.storageType
        : 'personal'
      const name = type[0].toUpperCase() + type.slice(1)
      return defineAsyncComponent(() =>
        import(`./storage/${name}StorageIcon`).catch(() => import('./storage/PersonalStorageIcon'))
      )
    }
  }
}
</script>
