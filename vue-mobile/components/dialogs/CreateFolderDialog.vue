<template>
  <AppDialog
    data-test-id="files-create-folder-dialog"
    v-model="openDialog"
    :close="cancelDialog"
  >
    <template v-slot:title>
      <div>
        <span>{{ $t('MAILWEBCLIENT.ACTION_ADD_NEW_FOLDER') }}</span>
      </div>
    </template>
    <template v-slot:content>
      <AppDialogInput
        data-test-id="files-create-folder-name"
        class="q-mx-lg"
        v-model="folderName"
        autofocus
        outlined
        @keyup.enter.stop="createFolder"
      />
    </template>
    <template v-slot:actions>
      <ButtonDialog
        data-test-id="files-create-folder-submit"
        class="q-ma-sm"
        :saving="saving"
        :action="createFolder"
        :label="$t('COREWEBCLIENT.ACTION_CREATE')"
      />
    </template>
  </AppDialog>
</template>

<script>
import { mapActions } from 'pinia'
import { useFilesStore } from '../../store/index-pinia'

import { i18n } from 'boot/i18n'

import AppDialog from 'components/common/AppDialog'
import AppDialogInput from 'components/common/AppDialogInput'
import ButtonDialog from 'src/components/common/ButtonDialog'
import notification from 'src/utils/notification'

import { validateFileOrFolderName } from '../../utils/common'

export default {
  name: 'CreateFolderDialog',

  components: {
    AppDialogInput,
    ButtonDialog,
    AppDialog,
  },

  props: {
    dialog: { type: Boolean, default: false },
  },

  data() {
    return {
      folderName: '',
      openDialog: false,
      saving: false,
    }
  },

  watch: {
    dialog(val) {
      this.openDialog = val
    },
  },

  methods: {
    ...mapActions(useFilesStore, ['asyncCreateFolder', 'asyncGetFiles']),

    async createFolder() {
      if (!this.saving) {
        if (validateFileOrFolderName(this.folderName)) {
          this.saving = true
          const result = await this.asyncCreateFolder({ name: this.folderName })
          if (result) {
            this.$emit('closeDialog')
            await this.asyncGetFiles()
          }
        } else {
          notification.showError(
            i18n.global.tc('FILESWEBCLIENT.ERROR_INVALID_FOLDER_NAME')
          )
        }
      }
    },

    cancelDialog() {
      this.$emit('closeDialog')
    },
  },
}
</script>
