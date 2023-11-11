<template>
  <AppDialog v-model="openDialog" :close="cancelDialog">
    <template v-slot:content>
      <q-item class="dialog__header-text">
        <p>Leave share of the <span class="text-bold">{{ currentFile.name }}</span> file?</p>
      </q-item>
    </template>
    <template v-slot:actions>
      <ButtonDialog
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
    ...mapActions(useFilesStore, ['asyncLeaveShare', 'changeItemsLists', 'selectFile']),
    leaveShare() {
      const result = this.asyncLeaveShare()
      if (result) {
        this.changeItemsLists({ items: this.selectedFiles.length ? this.selectedFiles : [this.currentFile] })
        this.selectFile(null)
        this.$emit('closeDialog')
      }
    },
    cancelDialog() {
      this.$emit('closeDialog')
    }
  }
}
</script>
