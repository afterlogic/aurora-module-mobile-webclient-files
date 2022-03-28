<template>
  <app-dialog v-model="showDialog" :close="closeDialog">
    <template v-slot:head>
      <div class="dialog__header-text q-mx-lg q-mt-lg">
        <span>
          {{$t('SHAREDFILES.WARNING_SHARES_CHANGED_BY_OTHER_USER')}}
        </span>
      </div>
    </template>
    <template v-slot:actions>
      <button-dialog
          class="q-ma-sm"
          :action="closeDialog"
          label="Ok"
      />
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from "src/components/common/AppDialog";
import ButtonDialog from "src/components/common/ButtonDialog";

export default {
  name: "ShareWarningDialog",
  components: {
    AppDialog,
    ButtonDialog
  },
  data: () => ({
    showDialog: false
  }),
  methods: {
    closeDialog() {
      this.showDialog = false
    },
    openDialog() {
      this.showDialog = true
    },
  }
}
</script>

<style scoped>

</style>
