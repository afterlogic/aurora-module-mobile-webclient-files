<template>
  <q-dialog v-model="openDialog">
    <q-card
      v-if="!file.publicLink"
      class="q-dialog-size q-pt-md q-px-sm"
      style="min-width: 350px"
    >
      <div style="font-size: 15px" class="q-px-md text-bold text-black text">
        <span>{{
          $t('OPENPGPFILESWEBCLIENT.HEADING_CREATE_PUBLIC_LINK')
        }}</span>
      </div>
      <q-checkbox
        v-model="withPassword"
        class="q-ma-sm"
        label="Protect public link with password"
        color="primary"
      />
      <q-card-actions align="right">
        <button-dialog
          :saving="saving"
          :action="createShareableLink"
          :label="createBtnLabel"
        />
        <button-dialog :saving="saving" :action="cancelDialog" label="Cancel" />
      </q-card-actions>
    </q-card>
    <q-card
      v-if="file.publicLink"
      class="q-dialog-size q-pt-md q-px-sm"
      style="min-width: 350px"
    >
      <div class="q-pa-sm">
        <app-dialog-input
          :placeholder="$t('FILESWEBCLIENT.LABEL_PUBLIC_LINK')"
          ref="link"
          v-model="publicLink"
          readonly
          @click.stop="
            copyText(publicLink, $t('FILESWEBCLIENT.LABEL_PUBLIC_LINK'))
          "
        />
        <app-dialog-input
          v-if="file.linkPassword"
          :placeholder="$t('COREWEBCLIENT.LABEL_PASSWORD')"
          ref="pass"
          v-model="linkPassword"
          @click.stop="
            copyText(linkPassword, $t('COREWEBCLIENT.LABEL_PASSWORD'))
          "
          readonly
        />
      </div>
      <q-card-actions align="right">
        <button-dialog
          :saving="saving"
          :action="createShareableLink"
          :label="$t('OPENPGPFILESWEBCLIENT.ACTION_SEND_EMAIL')"
        />
        <button-dialog
          :saving="saving"
          :action="removeLink"
          :label="$t('FILESWEBCLIENT.ACTION_REMOVE_PUBLIC_LINK')"
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

import notification from 'src/utils/notification'

import AppDialog from "components/common/AppDialog";
import AppDialogInput from 'src/components/common/AppDialogInput'
import ButtonDialog from 'src/components/common/ButtonDialog'

export default {
  name: 'CreateShareableLinkDialog',
  components: { ButtonDialog, AppDialogInput, AppDialog },
  props: {
    file: { type: Object, default: null },
    dialog: { type: Boolean, default: false },
  },
  mounted() {
    this.publicLink = this.file.publicLink
    this.linkPassword = this.file.linkPassword
  },
  computed: {
    createBtnLabel() {
      return this.withPassword
        ? 'Create protected link'
        : 'Create shareable link'
    },
  },
  data: () => ({
    withPassword: false,
    openDialog: false,
    saving: false,
    publicLink: '',
    linkPassword: '',
  }),
  watch: {
    dialog(val) {
      this.openDialog = val
    },
  },
  methods: {
    ...mapActions('filesmobile', [
      'asyncCreateShareableLink',
      'asyncDeletePublicLink',
    ]),
    async createShareableLink() {
      await this.asyncCreateShareableLink({ withPassword: this.withPassword })
      this.publicLink = this.file.publicLink
      this.linkPassword = this.file.linkPassword
    },
    async removeLink() {
      this.saving = true
      const result = await this.asyncDeletePublicLink()
      this.saving = false
      if (result) this.$emit('closeDialog')
    },
    copyText(text, valueName) {
      navigator.clipboard.writeText(text).then(() => {
        notification.showReport(
          `The ${valueName} has been copied to the clipboard.`
        )
      })
    },
    cancelDialog() {
      this.$emit('closeDialog')
    },
  },
}
</script>

<style scoped></style>
