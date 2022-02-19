<template>
  <app-dialog v-model="showDialog" :close="closeDialog" :show-cross="false">
    <template v-slot:head>
      <q-item class="dialog__header-text">
          <span>
          Last entered teammate
          <span class="text-bold">{{ user.email }}</span>
          was not added to the list. Proceed without them?
        </span>
      </q-item>
    </template>
    <template v-slot:actions>
      <button-dialog
          :action="onContinueExecution"
          :label="$t('COREWEBCLIENT.ACTION_OK')"
      />
      <button-dialog
          :label="$t('COREWEBCLIENT.ACTION_CLOSE')"
          :action="closeDialog"
      />
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from "components/common/AppDialog";
import ButtonDialog from 'src/components/common/ButtonDialog'
export default {
  name: "NotAddedUserDialog",
  components: {
    ButtonDialog,
    AppDialog
  },
  data: () => ({
    showDialog: false,
    user: null,
  }),
  methods: {
    onContinueExecution() {
      this.$emit('onContinueSaving')
      this.showDialog = false
    },
    openDialog(user) {
      this.user = user
      this.showDialog = true
    },
    closeDialog() {
      this.showDialog = false
      this.$emit('cancel')
    }
  }
}
</script>

<style scoped>
</style>
