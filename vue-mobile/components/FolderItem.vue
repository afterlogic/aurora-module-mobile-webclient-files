<template>
  <q-item
    v-if="folder"
    :disable="folder.isCopied"
    v-ripple="!isSelected && !folder.isCopied"
    :active="folder.isSelected"
    clickable
    @touchstart="touchstart(folder)"
    @touchend="openFolder"
    @touchmove.stop="touchMove"
  >
    <q-item-section avatar>
      <folder-icon color="secondary"></folder-icon>
    </q-item-section>
    <q-item-section>
      <q-item-label class="file__name">{{ folderName }}</q-item-label>
      <q-item-label></q-item-label>
    </q-item-section>
    <q-item-section avatar side>
      <q-btn
        v-if="!folder.isSelected"
        size="14px"
        color="grey"
        :disable="isSelected"
        v-ripple="!isSelected"
        flat
        round
        icon="more_vert"
        @touchstart.stop
        @touchend.stop="showDialog"
      />
      <q-btn
        v-ripple="false"
        v-if="folder.isSelected"
        size="14px"
        color="grey"
        flat
        round
        icon="done"
      />
    </q-item-section>
  </q-item>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import { getShortName } from '../utils/common'

import FolderIcon from './icons/FolderIcon'

export default {
  name: 'FolderItem',
  components: {
    FolderIcon,
  },
  props: {
    folder: { type: Object, default: null },
    isSelected: { type: Boolean, default: false },
    isCopied: { type: Boolean, default: false },
    touchstart: { type: Function, default: null, require: true },
    touchend: { type: Function, default: null, require: true },
  },
  computed: {
    ...mapGetters('filesmobile', ['currentStorage']),
    folderName() {
      if (this.folder) {
        return getShortName(this.folder.name, 30)
      }
      return ''
    },
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
    ]),
    async openFolder() {
      if (!this.isSelected && !this.folder.isCopied && !this.isMoved) {
        this.touchend()
        const path = {
          path: this.folder.fullPath,
          name: this.folder.name,
        }
        this.changeCurrentHeader('')
        await this.changeCurrentPaths({ path, lastStorage: false })
        await this.asyncGetFiles()
      } else {
        this.isMoved = false
      }
    },
    touchMove() {
      this.isMoved = true
      this.$emit('touchmove')
    },
    showDialog() {
      if (!this.isSelected && !this.isCopied) {
        this.$emit('showDialog', {
          file: this.folder,
          component: 'FileMenuDialog',
        })
      }
    },
  },
}
</script>

<style scoped></style>
