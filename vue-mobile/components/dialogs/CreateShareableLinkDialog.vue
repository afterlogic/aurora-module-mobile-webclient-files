<template>
  <app-dialog :close="cancelDialog">
    <template v-slot:head>
      <div v-if="file && (!file.paranoidKey || file.publicLink)">
        <div v-if="!file.publicLink">
          <div class="q-px-lg dialog__title-text">
            <span>{{
                $t('OPENPGPFILESWEBCLIENT.HEADING_CREATE_PUBLIC_LINK')
              }}</span>
            </div>
          <app-checkbox
              class="q-pl-lg q-py-lg q-pr-md"
              v-model="withPassword"
              leftLabel
              label="Protect public link with password"
          />
        </div>
        <div v-if="file.publicLink">
          <div class="q-px-lg">
            <div class="dialog__title-text">
              <span>{{
                  file.linkPassword ? 'Protected public link' : $t('FILESWEBCLIENT.LABEL_PUBLIC_LINK')
                }}</span>
            </div>
            <div class="q-mb-md q-mt-lg" @click.stop="copyText(file.publicLink, $t('FILESWEBCLIENT.LABEL_PUBLIC_LINK'))">
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
        </div>
      </div>
      <div v-else>
        <component
            v-if="resultingComponents && resultingComponents.head"
            @close="cancelDialog"
            :is="resultingComponents.head"
        />
      </div>
    </template>
    <template v-slot:actions>
      <div v-if="file && (!file.paranoidKey || file.publicLink)" class="full-width q-mx-lg q-mb-sm">
        <div v-if="!file.publicLink" class="flex justify-end q-pr-sm">
          <button-dialog
              :saving="saving"
              :action="createShareableLink"
              :label="createBtnLabel"
          />
        </div>
        <div v-if="file.publicLink" class="full-width flex justify-between q-px-sm">
          <button-dialog
              :saving="saving"
              :action="removeLink"
              :label="$t('FILESWEBCLIENT.ACTION_REMOVE_PUBLIC_LINK')"
          />
          <button-dialog
              :saving="saving"
              :action="createShareableLink"
              :label="$t('OPENPGPFILESWEBCLIENT.ACTION_SEND_EMAIL')"
          />
        </div>
      </div>
      <div v-else>
        <component
            v-if="resultingComponents && resultingComponents.actions"
            :is="resultingComponents.actions"
        />
      </div>
    </template>
  </app-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import eventBus from 'src/event-bus'

import notification from 'src/utils/notification'

import AppDialog from "components/common/AppDialog";
import AppDialogInput from 'src/components/common/AppDialogInput'
import ButtonDialog from 'src/components/common/ButtonDialog'
import AppCheckbox from "src/components/common/AppCheckbox";
import CopyIcon from "../icons/CopyIcon";

export default {
  name: 'CreateShareableLinkDialog',
  components: { ButtonDialog, AppDialogInput, AppDialog, CopyIcon, AppCheckbox },
  props: {
    file: { type: Object, default: null },
    dialog: { type: Boolean, default: false },
  },
  mounted() {
    this.publicLink = this.file.publicLink
    this.linkPassword = this.file.linkPassword

    if (this.file.paranoidKey) {
      eventBus.$emit('FilesMobile::GetEncryptedShareableLinkDialog', this.setComponents)
    }

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
    resultingComponents: null
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
    setComponents(components) {
      this.resultingComponents = components
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
