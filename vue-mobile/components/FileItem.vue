<template>
  <q-item
    v-if="file"
    :disable="file.isCopied"
    :clickable="!isCopied"
    v-ripple="!isSelected && !isCopied"
    :active="file.isSelected"
    @touchstart.stop="touchstart(file)"
    @touchmove.stop="touchMove"
    @touchend.stop="selectFile"
  >
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
      <q-item-label class="text-secondary file__info" v-if="!file.downloading">
        <div class="flex">
          <div class="q-mr-xs" v-if="isShared">
            <q-icon style="margin-bottom: 2px" size="11px" name="share" />
          </div>
          <div class="q-mr-xs" v-if="file.publicLink">
            <q-icon style="margin-bottom: 2px" name="link" />
          </div>
          <div>{{ fileSize }}</div>
          <div class="q-mx-xs">|</div>
          <div>{{ fileDate }}</div>
        </div>
      </q-item-label>
      <q-item-label v-if="file.downloading">
        <downloading-progress :file="file" />
      </q-item-label>
    </q-item-section>
    <q-item-section class="q-mr-sm" avatar side>
      <q-btn
        v-if="!file.isSelected"
        v-ripple="!isCopied && !isSelected"
        :disable="isSelected"
        size="14px"
        color="grey"
        flat
        round
        icon="more_vert"
        @touchstart.stop
        @touchend.stop="showDialog"
      />
      <q-btn
        v-ripple="!isCopied"
        v-if="file.isSelected"
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
import { mapActions, mapGetters } from 'vuex'

import text from 'src/utils/text'
import date from 'src/utils/date'
import { getApiHost } from 'src/api/helpers'

import { getShortName } from '../utils/common'

import FileItemIcon from './icons/FileItemIcon'
import DownloadingProgress from './common/DownloadingProgress'

export default {
  name: 'FileItem',
  components: {
    FileItemIcon,
    DownloadingProgress,
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
      return !!this.file.shares.length
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

<style scoped></style>
