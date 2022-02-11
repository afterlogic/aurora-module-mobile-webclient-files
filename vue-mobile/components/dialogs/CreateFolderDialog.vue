<template>
  <q-dialog v-model="openDialog">
    <q-card class="q-dialog-size q-pt-md q-px-sm" style="min-width: 300px">
      <div style="font-size: 15px" class="q-px-md text-bold text-primary text">
        <span>{{ $t('MAILWEBCLIENT.ACTION_ADD_NEW_FOLDER') }}</span>
      </div>
      <q-item>
        <app-input
          placeholder="Enter folder name"
          outlined
          autofocus
          dense
          v-model="folderName"
          style="width: 250px"
          @keyup.enter="createFolder"
        />
      </q-item>
      <q-card-actions align="right">
        <button-dialog
          :saving="saving"
          :action="createFolder"
          :label="$t('COREWEBCLIENT.ACTION_CREATE')"
        />
        <button-dialog
          :saving="saving"
          :action="cancelDialog"
          :label="$t('COREWEBCLIENT.ACTION_CLOSE')"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapActions } from 'vuex'

import AppInput from 'src/components/common/AppInput'
import ButtonDialog from 'src/components/common/ButtonDialog'

export default {
  name: 'CreateFolderDialog',
  components: { AppInput, ButtonDialog },
  props: {
    file: { type: Object, default: null },
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
    ...mapActions('filesmobile', ['asyncCreateFolder', 'asyncGetFiles']),
    async createFolder() {
      this.saving = true
      const result = await this.asyncCreateFolder({ name: this.folderName })
      if (result) {
        this.$emit('closeDialog')
        await this.asyncGetFiles()
      }
      this.saving = false
    },
    cancelDialog() {
      this.$emit('closeDialog')
    },
  },
}
</script>

<style scoped></style>
