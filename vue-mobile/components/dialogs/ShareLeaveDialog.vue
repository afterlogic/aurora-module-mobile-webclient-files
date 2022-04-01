<template>
  <app-dialog v-model="openDialog" :close="cancelDialog">
    <template v-slot:content>
      <q-item class="dialog__header-text">
      <p>
        Leave share of the <span class="text-bold">{{ currentFile.name }}</span> file?
      </p>
      </q-item>
    </template>
    <template v-slot:actions>
      <button-dialog
          :saving="saving"
          :action="leaveShare"
          :label="$t('SHAREDFILES.ACTION_LEAVE_SHARE')"
      />
    </template>
  </app-dialog>
</template>

<script>

import AppDialog from "components/common/AppDialog";
import ButtonDialog from "components/common/ButtonDialog";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "ShareLeaveDialog",
  components: {
    AppDialog,
    ButtonDialog
  },
  computed: {
    ...mapGetters('filesmobile', ['currentFile', 'selectedFiles']),
  },
  data: () => ({
    openDialog: false,
    saving: false
  }),
  methods: {
    ...mapActions('filesmobile', ['asyncLeaveShare', 'changeItemsLists', 'selectFile']),
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

<style scoped>

</style>
