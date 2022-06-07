<template>
  <app-item
    v-if="file"
    :disable="file.isCopied"
    :clickable="!isCopied"
    :item="file"
    :isSelected="file.isSelected"
    :isChoice="isSelected"
    :active="file.isSelected"
    @start="touchstart(file)"
    @move="touchMove"
    @end="selectFile"
  >
    <share-with-me-item-icon v-if="file.sharedWithMeAccess" class="absolute" style="left: 48px; top: 6px"/>
    <q-item-section class="q-ml-lg" avatar>
      <file-item-icon v-if="file.paranoidKey || !file.isImg" :file="file" />
      <div v-if="file.isImg && !file.paranoidKey" class="text-primary">
        <div
          class="img-preview"
          :style="{
            background: `url(${filePreview}) no-repeat center`,
            'background-size': 'contain',
            width: '32px',
            height: '32px',
          }"
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
    <transition name="button">
      <q-item-section v-if="!isSelected" class="q-mr-sm" avatar side>
        <q-btn
            size="14px"
            color="grey"
            flat
            round
            icon="more_vert"
            @touchstart.stop
            @touchend.stop="showDialog"
        />
      </q-item-section>
    </transition>
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
    isSelected: { type: Boolean, default: false },
    isCopied: { type: Boolean, default: false },
    touchstart: { type: Function, default: null, require: true },
    touchend: { type: Function, default: null, require: true },
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
    async selectFile() {
      this.touchend()
      if (
        !this.isSelected &&
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
        !this.isSelected &&
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
    touchMove() {
      this.isMoved = true
      this.$emit('touchmove')
    },
    showDialog() {
      if (!this.isSelected && !this.isCopied) {
        this.$emit('showDialog', {
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
