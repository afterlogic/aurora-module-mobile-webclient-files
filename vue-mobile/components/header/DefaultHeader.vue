<template>
  <q-toolbar class="app-header">
    <q-btn icon="menu" @click="$emit('openDrawer')" v-if="currentPaths.length <= 1" color="black" round flat dense />
    <q-btn icon="chevron_left" @click="onPreviousPath" v-if="currentPaths.length > 1" color="black" round flat dense />
    
    <div class="flex column q-px-lg" style="flex-grow: 1">
      <q-btn-dropdown
        model-value
        :menu-offset="[8,-8]"
        v-model="isOpen"
        :ripple="false"
        :dropdown-icon="currentPaths.length > 1 ? 'arrow_drop_down' : 'none'"
        dense
        class="text-black files-dropdown"
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
              dense
              v-close-popup
              @click="openPath(path)"
              v-if="currentPaths.length - 1 !== index"
            >
              <div class="files-dropdown__item flex items-center">
                <span>{{ getShortName(path.name, 20) }}</span>
              </div>
            </q-item>
          </div>
        </q-list>
      </q-btn-dropdown>
      <span class="header-storage__name">
        {{ storageName }}
      </span>
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
      return this.currentStorage.DisplayName
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

<style>
.header-storage__name {
  position: absolute;
  top: 35px;
  left: calc(50%);
  transform: translate(-50%, 0);
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 10px;
  color: #969494;
}
.files-dropdown {
  padding-left: 41px;
  margin-top: -8px;
  font-size: 18px;
  line-height: 20px;
}
.files-dropdown span .block {
  font-weight: 400;
  font-size: 18px;
  line-height: 20px;
}
.files-dropdown__item {
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px !important;
}
</style>
