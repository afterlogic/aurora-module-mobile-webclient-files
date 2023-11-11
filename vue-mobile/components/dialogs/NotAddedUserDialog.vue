<template>
  <AppDialog v-model="showDialog" :close="closeDialog">
    <template v-slot:content>
      <div class="dialog__header-text q-mx-lg q-mt-lg">
        <span>
          Last entered teammate
          <span class="text-bold">{{ user.email }}</span>
          was not added to the list. Proceed without them?
        </span>
      </div>
    </template>
    <template v-slot:actions>
      <ButtonDialog
          class="q-ma-sm"
          :action="onContinueExecution"
          label="Proceed"
      />
    </template>
  </AppDialog>
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
      this.$emit('onContinueSaving', true)
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
