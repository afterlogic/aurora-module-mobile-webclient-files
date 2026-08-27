<template>
  <AppDialog
    data-test-id="files-create-link-dialog"
    v-model="openDialog"
    :close="cancelDialog"
  >
    <template v-slot:title>
      <div>
        <span>{{ $t('FILESWEBCLIENT.ACTION_CREATE_SHORTCUT') }}</span>
      </div>
    </template>
    <template v-slot:content>
      <div v-if="preview" class="q-mx-lg q-mb-md create-link__preview">
        <div
          v-if="preview.thumbnailUrl"
          class="create-link__thumb"
          :style="{ backgroundImage: `url(${previewThumbnail})` }"
        />
        <FileItemIcon v-else :file="previewIconFile" :width="40" :height="40" />
        <div class="create-link__preview-name q-mt-sm">{{ preview.name }}</div>
      </div>
      <AppDialogInput
        data-test-id="files-create-link-url"
        class="q-mx-lg"
        v-model="link"
        autofocus
        outlined
        :placeholder="$t('FILESWEBCLIENT.LABEL_EXTERNAL_DOC_URL')"
        @keyup.enter.stop="createLink"
      />
      <div class="q-mx-lg q-mt-sm text-caption text-grey-7">
        {{ $t('FILESWEBCLIENT.INFO_UPLOAD_FILE_AS_LINK') }}
      </div>
    </template>
    <template v-slot:actions>
      <ButtonDialog
        data-test-id="files-create-link-submit"
        class="q-ma-sm"
        :saving="saving"
        :disabled="submitDisabled"
        :action="createLink"
        :label="$t('FILESWEBCLIENT.ACTION_ADD_SHORTCUT')"
      />
    </template>
  </AppDialog>
</template>

<script>
import { mapActions } from 'pinia'
import { useFilesStore } from '../../store/index-pinia'

import AppDialog from 'components/common/AppDialog'
import AppDialogInput from 'components/common/AppDialogInput'
import ButtonDialog from 'src/components/common/ButtonDialog'
import FileItemIcon from '../icons/FileItemIcon'
import {
  prepareLinkData,
  resolveThumbnailUrl,
} from '../../utils/common'

const CHECK_DEBOUNCE_MS = 1000

export default {
  name: 'CreateLinkDialog',

  components: {
    AppDialogInput,
    ButtonDialog,
    AppDialog,
    FileItemIcon,
  },

  props: {
    dialog: { type: Boolean, default: false },
  },

  data() {
    return {
      link: '',
      linkChecked: '',
      openDialog: false,
      saving: false,
      checking: false,
      preview: null,
      checkTimer: null,
    }
  },

  computed: {
    submitDisabled() {
      return this.saving || !this.preview || this.link.trim() !== this.linkChecked
    },
    previewThumbnail() {
      return resolveThumbnailUrl(this.preview?.thumbnailUrl)
    },
    previewIconFile() {
      return {
        isLink: true,
        linkType: this.preview?.linkType || '',
        name: this.preview?.name || '',
        paranoidKey: '',
      }
    },
  },

  watch: {
    dialog(val) {
      this.openDialog = val
      if (val) {
        this.resetState()
        this.scheduleCheck()
      } else {
        this.clearCheckTimer()
      }
    },
    link() {
      this.preview = null
      this.scheduleCheck()
    },
  },

  beforeUnmount() {
    this.clearCheckTimer()
  },

  methods: {
    ...mapActions(useFilesStore, [
      'asyncCheckUrl',
      'asyncCreateLink',
      'asyncGetFiles',
    ]),

    resetState() {
      this.link = ''
      this.linkChecked = ''
      this.saving = false
      this.checking = false
      this.preview = null
      this.clearCheckTimer()
    },

    clearCheckTimer() {
      if (this.checkTimer) {
        clearTimeout(this.checkTimer)
        this.checkTimer = null
      }
    },

    scheduleCheck() {
      this.clearCheckTimer()
      const url = this.link.trim()
      if (!url) {
        this.preview = null
        this.linkChecked = ''
        return
      }
      this.checkTimer = setTimeout(() => {
        this.checkUrl(url)
      }, CHECK_DEBOUNCE_MS)
    },

    async checkUrl(url) {
      if (!url || url !== this.link.trim()) {
        return
      }
      this.checking = true
      const result = await this.asyncCheckUrl({ url })
      this.checking = false
      if (url !== this.link.trim()) {
        return
      }
      if (result) {
        this.preview = prepareLinkData(result, url)
        this.linkChecked = url
      } else {
        this.preview = null
        this.linkChecked = ''
      }
    },

    async createLink() {
      if (this.saving || this.submitDisabled) {
        return
      }
      this.saving = true
      const result = await this.asyncCreateLink({
        link: this.preview.linkUrl,
        name: this.preview.name,
      })
      this.saving = false
      if (result) {
        this.$emit('closeDialog')
        await this.asyncGetFiles()
      }
    },

    cancelDialog() {
      this.clearCheckTimer()
      this.$emit('closeDialog')
    },
  },
}
</script>

<style lang="scss" scoped>
.create-link {
  &__preview {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  &__thumb {
    width: 96px;
    height: 64px;
    background-color: #eee;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    border-radius: 4px;
  }

  &__preview-name {
    font-size: 14px;
    font-weight: 500;
    word-break: break-word;
  }
}
</style>
