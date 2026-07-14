<template>
  <component :is="componentInstance" :color="color" />
</template>

<script>
import { defineAsyncComponent } from 'vue'

import { getStorageIconName } from '../../utils/common'

export default {
  name: 'StorageIcon',
  props: {
    storageType: { type: String, default: 'personal' },
    icon: { type: String, default: '' },
    color: { type: String, default: '#B6B5B5' },
  },
  computed: {
    componentInstance() {
      const name = this.icon || getStorageIconName(this.storageType)
      return defineAsyncComponent(() =>
        import(`./storage/${name}StorageIcon`).catch(() => import('./storage/PersonalStorageIcon'))
      )
    },
  },
}
</script>
