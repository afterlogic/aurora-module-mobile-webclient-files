<template>
  <app-item
    v-if="file"
    :item="file"
    :isSelected="file.isSelected"
    :disable="file.isCopied"
    :clickable="!isCopied"
    :active="file.isSelected"
    :isChoice="isSelectMode"
    @click="listItemClick(file)"
  >
    <q-item-section side>
      <file-item-icon v-if="file.paranoidKey || !file.isImg" :file="file" />
      <div v-if="file.isImg && !file.paranoidKey" class="text-primary relative-position">
        <div
          class="img-preview"
          :style="{
            background: `url(${filePreview}) no-repeat center`,
            'background-size': 'contain',
            width: '32px',
            height: '32px',
          }"
        />
        <share-with-me-item-icon
            v-if="file.sharedWithMeAccess"
            class="absolute"
            style="left: 18px; top: -8px"
        />
      </div>
    </q-item-section>
    <q-item-section>
      <q-item-label class="text-subtitle1 text-dark file__name">{{
        fileName
      }}</q-item-label>
      <q-item-label class="text-secondary file__info flex items-center no-wrap" v-if="!file.downloading">
        <encrypted-item-icon v-if="file.paranoidKey" class="q-mr-xs"/>
        <shared-item-icon v-if="isShared" class="q-mr-xs" width="14" height="14" />
        <link-item-icon v-if="file.publicLink" class="q-mr-xs"/>
        <div class="items-center justify-center text-center text-no-wrap">{{ fileSize }}</div>
        <div class="q-mx-xs text-no-wrap">|</div>
        <div class=" text-no-wrap" style="overflow: hidden">{{ fileDate }}</div>
      </q-item-label>
      <q-item-label v-if="file.downloading">
        <downloading-progress :file="file" />
      </q-item-label>
    </q-item-section>
    <q-item-section v-if="!isSelectMode" side>
      <q-btn
          size="14px"
          color="grey"
          flat
          round
          icon="more_vert"
          @click.stop="menuClick"
      />
    </q-item-section>
  </app-item>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import text from 'src/utils/text'
import date from 'src/utils/date'
import { getApiHost } from 'src/api/helpers'

import { getShortName } from '../utils/common'

import FileItemIcon from './icons/FileItemIcon'
import DownloadingProgress from './common/DownloadingProgress'
import EncryptedItemIcon from "./icons/item/EncryptedItemIcon";
import LinkItemIcon from "./icons/item/LinkItemIcon";
import SharedItemIcon from "./icons/item/SharedItemIcon";
import ShareWithMeItemIcon from "./icons/ShareWithMeItemIcon";
import AppItem from "../../../CoreMobileWebclient/vue-mobile/src/components/common/AppItem";

export default {
  name: 'FileItem',
  components: {
    ShareWithMeItemIcon,
    FileItemIcon,
    DownloadingProgress,
    EncryptedItemIcon,
    LinkItemIcon,
    SharedItemIcon,
    AppItem
  },
  props: {
    file: { type: Object, default: null },
    isSelectMode: { type: Boolean, default: false },
    isCopied: { type: Boolean, default: false },
    selectItemHandler: { type: Function, default: null, require: true },
    openMenuHandler: { type: Function, default: null, require: true },
  },
  data() {
    return {
      isMoved: false,
    }
  },
  computed: {
    ...mapGetters('filesmobile', ['copiedFiles', 'isArchive']),
    fileName() {
      if (this.file) {
        return getShortName(this.file.name, 30)
      }
      return ''
    },
    filePreview() {
      if (this.file) {
        const api = getApiHost()
        if (this.file.thumbnailUrl) {
          return api + this.file.thumbnailUrl
        }
        return ''
      }
      return ''
    },
    fileSize() {
      return text.getFriendlySize(this.file.size)
    },
    fileDate() {
      return date.getDate(this.file.lastModified)
    },
    isShared() {
      if (this.file.sharedWithMeAccess) return false
      return !!this.file.shares.length || this.file.sharedWithMeAccess
    },
  },
  methods: {
    ...mapActions('filesmobile', [
      'changeCurrentPaths',
      'changeCurrentHeader',
      'asyncGetFiles',
    ]),
    async openFile() {
      if (
        !this.isSelectMode &&
        !this.isMoved &&
        !this.copiedFiles.length &&
        !this.file.downloading &&
        this.file.isArchive
      ) {
        const path = {
          path: this.file.fullPath,
          name: this.file.name,
        }
        this.changeCurrentHeader('')
        await this.changeCurrentPaths({ path, lastStorage: false })
        await this.asyncGetFiles()
      } else if (
        !this.isSelectMode &&
        !this.isMoved &&
        !this.file.downloading &&
        !this.copiedFiles.length &&
        !this.isArchive
      ) {
        await this.$router.push({ path: `/file/${this.file.id}` })
      } else {
        this.isMoved = false
      }
    },
    listItemClick(item) {
      if (this.isSelectMode) {
        this.selectItemHandler(item)
      } else {
        this.openFile()
      }
    },
    menuClick() {
      if (!this.isSelectMode && !this.isCopied) {
        this.openMenuHandler({
          file: this.file,
          component: 'FileMenuDialog',
        })
      }
    },
  },
}
</script>

<style scoped>
.button-enter-active {
  transition: opacity 0.5s ease;
}
.button-leave-active {
  transition: opacity 0.2s ease;
}

.button-enter-from,
.button-leave-to {
  opacity: 0;
}
</style>
