<template>
  <q-toolbar class="app-header">
    <div class="col app-header__left">
      <q-btn icon="menu" @click="$emit('openDrawer')" v-if="isStorageRoot" color="black" round flat dense />
      <q-btn icon="chevron_left" @click="onPreviousPath" v-if="!isStorageRoot" color="black" round flat dense />
    </div>
    
    <div class="col app-header__title" _style="flex-grow: 1">
      <span class="app-header__title-main" v-if="isStorageRoot">
        {{ $t('FILESWEBCLIENT.HEADING_BROWSER_TAB') }}
      </span>

      <q-btn-dropdown
        v-if="!isStorageRoot"
        model-value
        v-model="isPathMenuOpen"
        :ripple="false"
        :label="getShortName(currentPath[currentPath.length - 1], 20)"
        dropdown-icon="arrow_drop_down"
        class="files-dropdown"
        dense
        no-caps
        flat
      >
        <q-list>
          <div v-for="(path, index) in currentPath" :key="path">
            <q-item v-if="currentPath.length - 1 !== index" @click="openPath(index)" clickable dense v-close-popup>
              <div class="files-dropdown__item">
                {{ getShortName(path, 20) }}
              </div>
            </q-item>
          </div>
        </q-list>
      </q-btn-dropdown>
      <span class="app-header__title-secondary">
        {{ storageName }}
      </span>
    </div>

    <div class="col app-header__right">
      <q-btn icon="search" @click="showSearchHeader" size="15px" color="black" flat round dense />
    </div>
  </q-toolbar>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import { getShortName } from '../../utils/common'

export default {
  name: 'DefaultHeader',
  data() {
    return {
      isPathMenuOpen: false,
    }
  },
  computed: {
    ...mapGetters('filesmobile', [
      'currentPath',
      'currentStorage'
    ]),
    isStorageRoot() {
      return this.currentPath.length === 0
    },
    storageName() {
      return  this.currentStorage?.DisplayName || ''
    },
  },
  methods: {
    ...mapActions('filesmobile', [
      'changeCurrentPath',
      // 'asyncGetFiles',
      'changeCurrentHeader',
      // 'changeSearchText'
    ]),
    getShortName,
    async openPath(pathIndex) {
      this.isPathMenuOpen = false
      const newPath = this.currentPath.filter((item,index) => index <= pathIndex)
      this.$router.push({ path: `/files/${this.currentStorage.Type}/${newPath.join('/')}/` })
    },
    showSearchHeader() {
      this.changeCurrentHeader('SearchHeader')
    },
    onPreviousPath() {
      this.$router.back()
    },
  },
}
</script>

<style lang="scss">
.files-dropdown {
  padding: 0 0 0 24px;
  min-height: auto;

  &__item {
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 20px !important;
    display: flex;
    align-items: center;
  }

  .block {
    font-size: 18px;
    line-height: 20px;
  }
  .q-icon {
    height: 20px;
  }
}
</style>
