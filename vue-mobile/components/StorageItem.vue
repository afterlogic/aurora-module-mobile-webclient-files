<template>
  <q-item class="storage" :active="active" clickable v-ripple @click.prevent="selectStorage">
    <q-item-section side>
      <StorageIcon :color="active ? '#469CF8' : '#969494'" :storage-type="storage.Type" />
    </q-item-section>
    <q-item-section class="storage__name">
      {{ storage.DisplayName }}
    </q-item-section>
  </q-item>
</template>

<script>
import {mapActions, mapGetters} from 'pinia'
import { useFilesStore } from '../store/index-pinia'
import eventBus from 'src/event-bus'

import StorageIcon from './icons/StorageIcon'

export default {
  name: 'StorageItem',
  components: {
    StorageIcon,
  },
  props: {
    storage: { type: Object, default: null },
    active: { type: Boolean, default: false },
  },
  methods: {
    ...mapActions(useFilesStore, [
      'changeCurrentStorage',
    ]),
    selectStorage() {
      this.changeCurrentStorage(this.storage)
      this.$router.push(`/files/${this.storage.Type}/`)
      eventBus.$emit('closeDrawer')
    },
  },
}
</script>

<style lang="scss" scoped>
.storage {
  padding: 0 24px;

  &__name {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.3px;
  }
}
</style>
