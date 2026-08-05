<template>
  <AppDialog
    data-test-id="files-share-leave-dialog"
    v-model="openDialog"
    :close="cancelDialog"
  >
    <template v-slot:content>
      <q-item class="dialog__header-text">
        <p>Leave share of the <span class="text-bold">{{ currentFile.name }}</span> file?</p>
      </q-item>
    </template>
    <template v-slot:actions>
      <ButtonDialog
          data-test-id="files-share-leave-confirm"
          :saving="saving"
          :action="leaveShare"
          :label="$t('SHAREDFILES.ACTION_LEAVE_SHARE')"
      />
    </template>
  </AppDialog>
</template>

<script>
import { mapGetters, mapActions } from 'pinia'
import { useFilesStore } from '../../store/index-pinia'

import AppDialog from 'components/common/AppDialog'
import ButtonDialog from 'components/common/ButtonDialog'

export default {
  name: "ShareLeaveDialog",
  components: {
    AppDialog,
    ButtonDialog
  },
  computed: {
    ...mapGetters(useFilesStore, ['currentFile', 'selectedFiles']),
  },
  data: () => ({
    openDialog: false,
    saving: false
  }),
  methods: {
    ...mapActions(useFilesStore, ['asyncLeaveShare', 'selectFile']),
    async leaveShare() {
      this.saving = true
      try {
        const result = await this.asyncLeaveShare()
        if (result) {
          this.selectFile(null)
          this.$emit('closeDialog')
        }
      } finally {
        this.saving = false
      }
    },
    cancelDialog() {
      this.$emit('closeDialog')
    }
  }
}
</script>
