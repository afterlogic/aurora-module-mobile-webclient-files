<template>
  <q-dialog v-model="showDialog">
    <q-card v-if="user" class="q-dialog-size q-pt-md" style="min-width: 300px">
      <q-item>
        <span>
          Last entered teammate
          <span class="text-bold">{{ user.email }}</span>
          was not added to the list. Proceed without them?
        </span>
      </q-item>
      <q-card-actions align="right">
        <button-dialog
            :action="onContinueExecution"
            :label="$t('COREWEBCLIENT.ACTION_OK')"
        />
        <button-dialog
            :label="$t('COREWEBCLIENT.ACTION_CLOSE')"
            :action="closeDialog"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import ButtonDialog from 'src/components/common/ButtonDialog'
export default {
  name: "NotAddedUserDialog",
  components: {
    ButtonDialog
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
