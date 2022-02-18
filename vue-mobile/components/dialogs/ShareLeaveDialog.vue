<template>
  <app-dialog v-model="openDialog" :cancelDialog="cancelDialog">
    <template v-slot:head>
      <q-item>
      <p>
        Leave share of the <span class="text-bold">{{ currentFile.name }}</span> file?
      </p>
      </q-item>
    </template>
    <template v-slot:actions>
      <button-dialog
          :saving="saving"
          :action="leaveShare"
          :label="$t('FILESWEBCLIENT.ACTION_RENAME')"
      />
    </template>
  </app-dialog>
</template>

<script>

import AppDialog from "components/common/AppDialog";
import ButtonDialog from "components/common/ButtonDialog";
import {mapGetters} from "vuex";

export default {
  name: "ShareLeaveDialog",
  components: {
    AppDialog,
    ButtonDialog
  },
  computed: {
    ...mapGetters('filesmobile', ['currentFile']),
  },
  data: () => ({
    openDialog: false,
    saving: false
  }),
  methods: {
    leaveShare() {

    },
    cancelDialog() {

    }
  }
}
</script>

<style scoped>

</style>
