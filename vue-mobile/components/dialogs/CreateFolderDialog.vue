<template>
  <app-dialog v-model="openDialog" :close="cancelDialog">
    <template v-slot:title>
      <div>
        <span>{{ $t('MAILWEBCLIENT.ACTION_ADD_NEW_FOLDER') }}</span>
      </div>
    </template>
    <template v-slot:content>
      <q-item class="q-px-lg">
        <AppInput
            placeholder="Enter folder name"
            outlined
            autofocus
            dense
            v-model="folderName"
            style="width: 100%"
            @keyup.enter="createFolder"
        />
      </q-item>
    </template>
    <template v-slot:actions>
      <button-dialog
          class="q-ma-sm"
          :saving="saving"
          :action="createFolder"
          :label="$t('COREWEBCLIENT.ACTION_CREATE')"
      />
    </template>
  </app-dialog>
</template>

<script>
import { mapActions } from 'pinia'
import { useFilesStore } from '../../store/index-pinia'

import { i18n } from 'boot/i18n'

import AppDialog from "components/common/AppDialog";
import AppInput from 'src/components/common/AppInput'
import ButtonDialog from 'src/components/common/ButtonDialog'
import notification from 'src/utils/notification'

import { validateFileOrFolderName } from '../../utils/common'

export default {
  name: 'CreateFolderDialog',
  components: { AppInput, ButtonDialog, AppDialog },
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
          notification.showError(i18n.global.tc('FILESWEBCLIENT.ERROR_INVALID_FOLDER_NAME'))
        }
      }
    },
    cancelDialog() {
      this.$emit('closeDialog')
    },
  },
}
</script>
