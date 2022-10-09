<template>
  <app-item
    v-if="folder"
    :item="folder"
    :isSelected="folder.isSelected"
    :disable="folder.isCopied"
    :clickable="!isCopied"
    :active="folder.isSelected"
    :isChoice="isSelectMode"
    @click="listItemClick(folder)"
  >
    <q-item-section class="folder__metadata" side>
      <folder-icon color="secondary" />
      <share-with-me-item-icon v-if="folder.sharedWithMeAccess" class="absolute" style="left: 21px; top: 11px"/>
    </q-item-section>

    <q-item-section class="list-item__text">
      <q-item-label class="list-item__text_primary folder__name">{{ folderName }}</q-item-label>
      <q-item-label v-if="isShared" class="list-item__text_secondary folder__info">
        <shared-item-icon />
      </q-item-label>
    </q-item-section>

    <q-item-section v-if="!isSelectMode" class="folder__menu" side>
      <q-btn icon="more_vert" @click.stop="menuClick" color="grey" flat round />
    </q-item-section>
  </app-item>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import { getShortName } from '../utils/common'

import FolderIcon from './icons/FolderIcon'
import SharedItemIcon from './icons/item/SharedItemIcon'
import ShareWithMeItemIcon from './icons/ShareWithMeItemIcon'
import AppItem from 'src/components/common/AppItem'

export default {
  name: 'FolderItem',
  components: {
    FolderIcon,
    SharedItemIcon,
    ShareWithMeItemIcon,
    AppItem
  },
  props: {
    folder: { type: Object, default: null },
    isSelectMode: { type: Boolean, default: false },
    isCopied: { type: Boolean, default: false },
    selectItemHandler: { type: Function, default: null, require: true },
    openMenuHandler: { type: Function, default: null, require: true },
  },
  computed: {
    ...mapGetters('filesmobile', [
      'currentStorage'
    ]),
    folderName() {
      return this.folder ? getShortName(this.folder.name, 50) : ''
    },
    isShared() {
      return !!this.folder.shares.length || this.folder.sharedWithMeAccess
    }
  },
  data() {
    return {
      isMoved: false,
    }
  },
  methods: {
    ...mapActions('filesmobile', [
      'changeCurrentPaths',
      'asyncGetFiles',
      'changeCurrentHeader',
      'changeSearchText'
    ]),
    async openFolder() {
      if (!this.isSelectMode && !this.folder.isCopied && !this.isMoved) {
        const path = {
          path: this.folder.fullPath,
          name: this.folder.name,
        }
        await this.changeSearchText('')
        this.changeCurrentHeader('')
        await this.changeCurrentPaths({ path, lastStorage: false })
        await this.asyncGetFiles()
      } else {
        this.isMoved = false
      }
    },
    listItemClick(item) {
      if (this.isSelectMode) {
        this.selectItemHandler(item)
      } else {
        this.openFolder()
      }
    },
    menuClick() {
      if (!this.isSelectMode && !this.isCopied) {
        this.openMenuHandler({
          file: this.folder,
          component: 'FileMenuDialog',
        })
      }
    },
  },
}
</script>
