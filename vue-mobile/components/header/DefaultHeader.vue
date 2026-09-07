<template>
  <q-toolbar class="app-header">
    <div class="col app-header__left">
      <AppHeaderButton
        data-test-id="files-folder-menu"
        icon="menu"
        @click="openDrawer"
        v-if="isStorageRoot"
      />
      <AppHeaderButton
        data-test-id="files-path-back"
        icon="chevron_left"
        @click="onPreviousPath"
        v-if="!isStorageRoot"
      />
    </div>

    <div class="col app-header__title" _style="flex-grow: 1">
      <span class="app-header__title-main" v-if="isStorageRoot">
        {{ $t('FILESWEBCLIENT.HEADING_BROWSER_TAB') }}
      </span>

      <q-btn
        v-if="parentPathOptions.length > 0"
        :ripple="false"
        :label="getShortName(currentPath[currentPath.length - 1], 20)"
        icon-right="arrow_drop_down"
        class="files-dropdown files-title"
        dense
        no-caps
        flat
      >
        <q-menu v-model="isPathMenuOpen">
          <q-list>
            <q-item
              v-for="option in parentPathOptions"
              :key="option.key"
              @click="openPath(option.index)"
              clickable
              dense
              v-close-popup
            >
              <div class="files-dropdown__item">
                {{ option.label }}
              </div>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
      <span v-else-if="!isStorageRoot" class="app-header__title-main files-title">
        {{ getShortName(currentPath[currentPath.length - 1], 20) }}
      </span>
      <span class="app-header__title-secondary" data-test-id="files-storage-name">
        {{ storageName }}
      </span>
    </div>

    <div class="col app-header__right">
      <AppHeaderButton
        data-test-id="files-search"
        icon="search"
        @click="showSearchHeader"
      />
    </div>
  </q-toolbar>
</template>

<script>
import { mapActions, mapGetters } from 'pinia'
import { useFilesStore } from '../../store/index-pinia'

import eventBus from 'src/event-bus'
import AppHeaderButton from 'src/components/common/AppHeaderButton'

import { getShortName } from '../../utils/common'

export default {
  name: 'DefaultHeader',
  components: {
    AppHeaderButton,
  },
  data() {
    return {
      isPathMenuOpen: false,
    }
  },
  computed: {
    ...mapGetters(useFilesStore, ['currentPath', 'currentStorage']),
    isStorageRoot() {
      return !this.currentPath?.length
    },
    parentPathOptions() {
      return (this.currentPath || [])
        .slice(0, -1)
        .map((path, index) => ({
          key: `${index}-${path}`,
          index,
          label: getShortName(path, 20),
        }))
    },
    storageName() {
      return this.currentStorage?.DisplayName || ''
    },
  },
  methods: {
    ...mapActions(useFilesStore, ['changeCurrentHeader']),
    getShortName,
    async openPath(pathIndex) {
      this.isPathMenuOpen = false
      const newPath = this.currentPath.filter((item, index) => index <= pathIndex)
      this.$router.push({ path: `/files/${this.currentStorage.Type}/${newPath.join('/')}/` })
    },
    showSearchHeader() {
      this.changeCurrentHeader('SearchHeader')
    },
    onPreviousPath() {
      this.$router.back()
    },
    openDrawer() {
      eventBus.$emit('openDrawer')
    },
  },
}
</script>

<style lang="scss">
.files-dropdown {
  padding: 0 0 0 24px;
  min-height: auto;
  max-width: 100%;
  min-width: 0;

  .q-btn__content {
    flex-wrap: nowrap;
  }

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

.files-title {
  display: block;
  max-width: 100%;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
