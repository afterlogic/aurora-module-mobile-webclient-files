<template>
  <q-toolbar style="height: 55px" class="justify-between">
    <q-btn
      flat
      v-if="currentPaths.length <= 1"
      size="15px"
      @click="$emit('openDrawer')"
      color="black"
      round
      dense
      icon="menu"
    />
    <q-btn
      v-if="currentPaths.length > 1"
      flat
      size="15px"
      color="black"
      round
      dense
      icon="chevron_left"
      @click="onPreviousPath"
    />
    <div class="flex column">
      <q-btn-dropdown
        model-value
        v-model="isOpen"
        :ripple="false"
        :dropdown-icon="currentPaths.length > 1 ? 'arrow_drop_down' : 'none'"
        dense
        :content-style="{
          'font-size': '18px',
          'line-height': '20px'
        }"
        class="text-bold text-black files-dropdown"
        no-caps
        flat
        :label="
          currentPaths.length <= 1
            ? $t('FILESWEBCLIENT.HEADING_BROWSER_TAB')
            : getShortName(currentPaths[currentPaths.length - 1].name, 20)
        "
      >
        <q-list>
          <div v-for="(path, index) in currentPaths" :key="path.path">
            <q-item
              clickable
              v-close-popup
              @click="openPath(path)"
              v-if="currentPaths.length - 1 !== index"
            >
              <q-item-section>
                <q-item-label>{{ getShortName(path.name, 20) }}</q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </q-list>
      </q-btn-dropdown>
      <span
        class="text-center storage-name"
        >{{ storageName }}</span
      >
    </div>
    <q-btn
      flat
      size="15px"
      color="black"
      round
      dense
      icon="search"
      @click="showSearchHeader"
    />
  </q-toolbar>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import { getShortName } from '../../utils/common'

export default {
  name: 'DefaultHeader',
  data() {
    return {
      isOpen: false,
    }
  },
  computed: {
    ...mapGetters('filesmobile', ['currentPaths', 'currentStorage']),
    storageName() {
      if(!this.currentStorage) return ''
      let storageType = this.currentStorage.Type
      return storageType[0].toUpperCase() + storageType.slice(1)
    },
  },
  methods: {
    ...mapActions('filesmobile', [
      'changeCurrentPaths',
      'asyncGetFiles',
      'changeCurrentHeader',
      'changeSearchText'
    ]),
    getShortName,
    async openPath(path) {
      this.isOpen = false
      await this.changeCurrentPaths({ path, lastStorage: false })
      await this.asyncGetFiles()
    },
    showSearchHeader() {
      this.changeCurrentHeader('SearchHeader')
    },
    async onPreviousPath() {
      this.changeSearchText('')
      await this.changeCurrentPaths({
        path: this.currentPaths[this.currentPaths.length - 2],
        lastStorage: false,
      })
      await this.asyncGetFiles()
    },
  },
}
</script>

<style scoped>
.storage-name {
  margin-top: -5px;
  font-style: normal;
  font-weight: normal;
  font-size: 10px;
  line-height: 10px;
  color: #969494;
}
.files-dropdown {
  padding-left: 41px;
  margin-top: -12px;
  width: 250px;
  font-size: 18px;
  line-height: 20px;
}
</style>
