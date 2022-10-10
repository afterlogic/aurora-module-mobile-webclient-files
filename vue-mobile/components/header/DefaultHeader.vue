<template>
  <q-toolbar class="app-header">
    <div class="col app-header__left">
      <q-btn icon="menu" @click="$emit('openDrawer')" v-if="currentPaths.length <= 1" color="black" round flat dense />
      <q-btn icon="chevron_left" @click="onPreviousPath" v-if="currentPaths.length > 1" color="black" round flat dense />
    </div>
    
    <div class="col app-header__title" _style="flex-grow: 1">
      <span class="app-header__title-main" v-if="currentPaths.length == 1">
        {{ $t('FILESWEBCLIENT.HEADING_BROWSER_TAB') }}
      </span>

      <q-btn-dropdown
        v-if="currentPaths.length > 1"
        model-value
        v-model="isOpen"
        :ripple="false"
        dropdown-icon="arrow_drop_down"
        class="files-dropdown"
        dense
        no-caps
        flat
        :label="getShortName(currentPaths[currentPaths.length - 1].name, 20)"
      >
        <q-list>
          <div v-for="(path, index) in currentPaths" :key="path.path">
            <q-item v-if="currentPaths.length - 1 !== index" @click="openPath(path)" clickable dense v-close-popup>
              <div class="files-dropdown__item">
                {{ getShortName(path.name, 20) }}
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

<style lang="scss">
// .header-storage__name {
//   position: absolute;
//   top: 35px;
//   left: calc(50%);
//   transform: translate(-50%, 0);
//   font-style: normal;
//   font-weight: 400;
//   font-size: 12px;
//   line-height: 10px;
//   color: #969494;
// }

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
