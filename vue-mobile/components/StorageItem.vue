<template>
  <q-item class="storage" :active="active" clickable v-ripple @click.prevent="selectStorage">
    <q-item-section side>
      <storage-icon :color="active ? '#469CF8' : '#969494'" :storage-type="storage.Type" />
    </q-item-section>
    <q-item-section class="storage__name">
      {{ storage.DisplayName }}
    </q-item-section>
  </q-item>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
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
  // computed: {
  //   ...mapGetters('filesmobile', ['currentStorage']),
  // },
  methods: {
    ...mapActions('filesmobile', [
      'changeCurrentStorage',
      // 'asyncGetFiles',
      // 'changeCurrentPath'
    ]),
    selectStorage() {
      this.changeCurrentStorage(this.storage)
      const path = {
        path: '',
        name: this.storage.DisplayName,
      }
      this.$router.push(`/files/${this.storage.Type}/`)
      // this.changeCurrentPath({ path, lastStorage: true })
      eventBus.$emit('closeDrawer')
      // await this.asyncGetFiles()
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
