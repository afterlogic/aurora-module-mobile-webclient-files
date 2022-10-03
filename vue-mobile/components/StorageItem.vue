<template>
  <q-item class="q-px-lg" v-if="storage" clickable v-ripple @click.prevent="selectStorage">
    <q-item-section side>
      <storage-icon :storage-type="storage.Type" :color="iconColor" />
    </q-item-section>
    <q-item-section class="storage-name" :style="{color: textColor}">
      {{ storage.DisplayName }}
    </q-item-section>
  </q-item>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import eventBus from "src/event-bus";

import StorageIcon from './icons/StorageIcon'

export default {
  name: 'StorageItem',
  components: {
    StorageIcon,
  },
  props: {
    storage: { type: Object, default: null },
  },
  computed: {
    ...mapGetters('filesmobile', ['currentStorage']),
    iconColor() {
      return this.storage.Type === this.currentStorage.Type ? '#469CF8' : '#B6B5B5'
    },
    textColor() {
      return this.storage.Type === this.currentStorage.Type ? '#469CF8' : '#000000'
    }
  },
  methods: {
    ...mapActions('filesmobile', [
      'changeCurrentStorage',
      'asyncGetFiles',
      'changeCurrentPaths'
    ]),
    async selectStorage() {
      this.changeCurrentStorage(this.storage)
      const path = {
        path: '',
        name: this.storage.DisplayName,
      }
      this.changeCurrentPaths({ path, lastStorage: true })
      eventBus.$emit('closeDrawer')
      await this.getFiles()
    },
    async getFiles() {
      await this.asyncGetFiles()
    },
  },
}
</script>

<style scoped>
.storage-name {
  font-size: 14px;
  line-height: 16px;

  letter-spacing: 0.3px;
}
</style>
