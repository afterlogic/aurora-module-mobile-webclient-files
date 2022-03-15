<template>
  <app-dialog v-model="openDialog" :close="cancelDialog">
    <template v-slot:head>
      <div class="q-px-lg dialog__title-text">
        <span>{{ $t('MAILWEBCLIENT.ACTION_ADD_NEW_FOLDER') }}</span>
      </div>
      <q-item class="q-px-lg">
        <app-input
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
          :saving="saving"
          :action="createFolder"
          :label="$t('COREWEBCLIENT.ACTION_CREATE')"
      />
    </template>
  </app-dialog>
</template>

<script>
import { mapActions } from 'vuex'

import AppDialog from "components/common/AppDialog";
import AppInput from 'src/components/common/AppInput'
import ButtonDialog from 'src/components/common/ButtonDialog'

export default {
  name: 'CreateFolderDialog',
  components: { AppInput, ButtonDialog, AppDialog },
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
