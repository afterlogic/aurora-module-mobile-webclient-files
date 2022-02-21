<template>
  <app-dialog v-model="openDialog" :close="cancelDialog">
    <template v-slot:head>
      <div v-if="!file.publicLink">
        <div style="font-size: 15px" class="q-px-md dialog__title-text">
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
      </div>
      <div v-if="file.publicLink">
        <div class="q-px-md">
          <div class="dialog__title-text">
            <span>{{
                file.linkPassword ? 'Protected public link' : $t('FILESWEBCLIENT.LABEL_PUBLIC_LINK')
              }}</span>
          </div>
          <div class="q-my-md" @click.stop="copyText(file.publicLink, $t('FILESWEBCLIENT.LABEL_PUBLIC_LINK'))">
            <div class="q-mb-sm field__title">Link text</div>
            <div class="flex no-wrap">
              <div class="flex justify-center items-center q-mr-sm">
                <copy-icon/>
              </div>
              <div class="text__caption flex items-center">
                <span>{{ file.publicLink }}</span>
              </div>
            </div>
          </div>
          <div
              v-if="file.linkPassword"
              @click.stop="copyText(file.linkPassword, $t('COREWEBCLIENT.LABEL_PASSWORD'))"
          >
            <div class="q-mb-sm field__title">{{ $t('COREWEBCLIENT.LABEL_PASSWORD') }}</div>
            <div class="flex no-wrap">
              <div class="q-mt-xs q-mr-sm">
                <copy-icon/>
              </div>
              <div class="text__caption flex items-center">
                <span>{{ file.linkPassword }}</span>
              </div>
            </div>
          </div>
        </div>
<!--        <app-dialog-input-->
<!--            :placeholder="$t('FILESWEBCLIENT.LABEL_PUBLIC_LINK')"-->
<!--            ref="link"-->
<!--            v-model="publicLink"-->
<!--            readonly-->
<!--            @click.stop="-->
<!--              copyText(publicLink, $t('FILESWEBCLIENT.LABEL_PUBLIC_LINK'))-->
<!--            "-->
<!--        />-->
<!--        <app-dialog-input-->
<!--            v-if="file.linkPassword"-->
<!--            :placeholder="$t('COREWEBCLIENT.LABEL_PASSWORD')"-->
<!--            ref="pass"-->
<!--            v-model="linkPassword"-->
<!--            @click.stop="-->
<!--              copyText(linkPassword, $t('COREWEBCLIENT.LABEL_PASSWORD'))-->
<!--            "-->
<!--            readonly-->
<!--        />-->
      </div>
    </template>
    <template v-slot:actions>
      <div v-if="!file.publicLink">
        <button-dialog
            :saving="saving"
            :action="createShareableLink"
            :label="createBtnLabel"
        />
      </div>
      <div v-if="file.publicLink">
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
      </div>
    </template>
  </app-dialog>
</template>

<script>
import { mapActions } from 'vuex'

import notification from 'src/utils/notification'

import AppDialog from "components/common/AppDialog";
import AppDialogInput from 'src/components/common/AppDialogInput'
import ButtonDialog from 'src/components/common/ButtonDialog'
import CopyIcon from "../icons/CopyIcon";

export default {
  name: 'CreateShareableLinkDialog',
  components: { ButtonDialog, AppDialogInput, AppDialog, CopyIcon },
  props: {
    file: { type: Object, default: null },
    dialog: { type: Boolean, default: false },
  },
  mounted() {
    console.log(this.file, 'file')
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

<style scoped>
.field__title {
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 0.3px;
}
</style>
