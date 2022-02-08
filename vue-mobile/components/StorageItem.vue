<template>
  <q-item v-if="storage" clickable v-ripple @click.prevent="selectStorage">
    <q-item-section avatar>
      <storage-icon></storage-icon>
    </q-item-section>
    <q-item-section>
      <q-item-label class="text-subtitle1">{{
        storage.DisplayName
      }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { mapActions } from 'vuex'

import StorageIcon from './icons/StorageIcon'

export default {
  name: 'StorageItem',
  components: {
    StorageIcon,
  },
  props: {
    storage: { type: Object, default: null },
  },
  methods: {
    ...mapActions('filesmobile', [
      'changeCurrentStorage',
      'asyncGetFiles',
      'changeCurrentPaths',
    ]),
    selectStorage() {
      this.changeCurrentStorage(this.storage)
      const path = {
        path: '',
        name: this.storage.DisplayName,
      }
      this.changeCurrentPaths({ path, lastStorage: true })
      this.getFiles()
    },
    async getFiles() {
      await this.asyncGetFiles()
    },
  },
}
</script>

<style scoped></style>
