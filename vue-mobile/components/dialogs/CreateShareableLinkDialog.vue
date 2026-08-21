<template>
  <AppDialog
    data-test-id="files-share-link-dialog"
    head-max-height="60vh"
    :close="cancelDialog"
  >
    <template v-slot:title>
      <span>{{ $t('FILESWEBCLIENT.LABEL_PUBLIC_LINK') }}</span>
    </template>
    <template v-slot:content>
      <div v-if="file && file.publicLink" class="q-px-lg">
        <div
          class="q-mb-md q-mt-lg"
          data-test-id="files-share-link-url"
          @click.stop="copyText(file.publicLink, $t('FILESWEBCLIENT.LABEL_PUBLIC_LINK'))"
        >
          <div class="q-mb-sm field__title">{{ $t('FILESWEBCLIENT.LABEL_PUBLIC_LINK') }}</div>
          <div class="flex no-wrap">
            <div class="flex justify-center items-center q-mr-sm">
              <CopyIcon />
            </div>
            <div class="text__caption flex items-center">
              <span>{{ file.publicLink }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:actions>
      <div class="full-width q-mx-lg q-mb-sm">
        <div v-if="file && !file.publicLink" class="flex justify-end q-pr-sm">
          <ButtonDialog
            data-test-id="files-share-link-create"
            :saving="saving"
            :action="createShareableLink"
            :label="$t('FILESWEBCLIENT.LABEL_PUBLIC_LINK')"
          />
        </div>
        <div v-else-if="file && file.publicLink" class="full-width flex justify-end q-px-sm">
          <ButtonDialog
            data-test-id="files-share-link-remove"
            :saving="saving"
            :action="removeLink"
            :label="$t('FILESWEBCLIENT.ACTION_REMOVE_PUBLIC_LINK')"
          />
        </div>
      </div>
    </template>
  </AppDialog>
</template>

<script>
import { mapActions } from 'pinia'
import { useFilesStore } from '../../store/index-pinia'

import notification from 'src/utils/notification'

import AppDialog from 'components/common/AppDialog'
import ButtonDialog from 'src/components/common/ButtonDialog'
import CopyIcon from '../icons/CopyIcon'

export default {
  name: 'CreateShareableLinkDialog',
  components: { ButtonDialog, AppDialog, CopyIcon },
  props: {
    file: { type: Object, default: null },
    dialog: { type: Boolean, default: false },
  },
  data: () => ({
    saving: false,
  }),
  methods: {
    ...mapActions(useFilesStore, [
      'asyncCreateShareableLink',
      'asyncDeletePublicLink',
    ]),
    async createShareableLink() {
      this.saving = true
      try {
        await this.asyncCreateShareableLink()
      } finally {
        this.saving = false
      }
    },
    async removeLink() {
      this.saving = true
      try {
        const result = await this.asyncDeletePublicLink()
        if (result) {
          this.$emit('closeDialog')
        }
      } finally {
        this.saving = false
      }
    },
    copyText(text, valueName) {
      navigator.clipboard.writeText(text).then(() => {
        notification.showReport(`The ${valueName} has been copied to the clipboard.`)
      })
    },
    cancelDialog() {
      this.$emit('closeDialog')
    },
  },
}
</script>

<style scoped>
.field__title {
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 0.3px;
}
</style>
