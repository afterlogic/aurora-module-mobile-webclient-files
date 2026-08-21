<template>
  <AppDialog
    data-test-id="files-share-link-dialog"
    :style="{display : !showSelectRecipientDialog ? '' : 'none'}"
    head-max-height="60vh"
    :close="cancelDialog"
  >
    <template v-slot:title>
      <div v-if="file && (!file.paranoidKey || file.publicLink)">
        <div v-if="!file.publicLink">
          <span>{{ $t(protectedLinksAvailable ? 'OPENPGPFILESWEBCLIENT.HEADING_CREATE_PUBLIC_LINK' : 'FILESWEBCLIENT.LABEL_PUBLIC_LINK') }}</span>
        </div>
        <div v-if="file.publicLink">
          <span>{{ file.linkPassword ? 'Protected public link' : $t('FILESWEBCLIENT.LABEL_PUBLIC_LINK') }}</span>
        </div>
      </div>
      <div v-else class="q-mb-lg">
        <span>{{ $t('OPENPGPFILESWEBCLIENT.HEADING_SEND_ENCRYPTED_FILE') }}</span>
      </div>
    </template>
    <template v-slot:content>
      <div v-if="file && (!file.paranoidKey || file.publicLink)">
        <div v-if="!file.publicLink && protectedLinksAvailable">
          <AppCheckbox
            class="q-pl-lg q-py-lg q-pr-md"
            v-model="withPassword"
            leftLabel
            label="Protect public link with password"
          />
        </div>
        <div v-if="file.publicLink">
          <div class="q-px-lg">
            <div class="q-mb-md q-mt-lg" data-test-id="files-share-link-url" @click.stop="copyText(file.publicLink, $t('FILESWEBCLIENT.LABEL_PUBLIC_LINK'))">
              <div class="q-mb-sm field__title">Link text</div>
              <div class="flex no-wrap">
                <div class="flex justify-center items-center q-mr-sm">
                  <CopyIcon />
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
                  <CopyIcon />
                </div>
                <div class="text__caption flex items-center">
                  <span>{{ file.linkPassword }}</span>
                </div>
              </div>
            </div>
            <div v-if="file.linkPassword" class="q-my-md">
              <span class="inscription">
                {{ $t('OPENPGPFILESWEBCLIENT.HINT_STORE_PASSWORD') }}
              </span>
            </div>
          </div>
          <div v-if="file.linkPassword" class="section-separator" />
          <div class="q-px-lg">
            <div @click="selectRecipient" class="q-mt-lg">
              <div class="q-mb-sm recipient">
                <span>{{ $t('OPENPGPFILESWEBCLIENT.LABEL_RECIPIENT') }}:</span>
              </div>
              <AppContactItem :contact="recipient" />
            </div>
            <div v-if="!recipient.empty" class="q-mt-sm">
              <span class="inscription">{{ sendLinkHintText }}</span>
            </div>
            <div v-if="showSignCheckbox" class="q-mt-md">
              <AppCheckbox
                  v-model="addDigitalSignature"
                  :disable="!isSigningAvailable"
                  leftLabel
                  :label="$t('OPENPGPFILESWEBCLIENT.LABEL_SIGN')"
              />
            </div>
            <div v-if="showSignCheckbox" class="q-mt-sm q-mb-md">
              <span class="inscription">{{ signEmailHintText }}</span>
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
          <ButtonDialog
              data-test-id="files-share-link-create"
              :saving="saving"
              :action="createShareableLink"
              :label="createBtnLabel"
          />
        </div>
        <div v-if="file.publicLink" :class="`full-width flex ${isCreatingLink ? 'justify-end' : 'justify-between'} q-px-sm`">
          <ButtonDialog
              v-if="!isCreatingLink"
              data-test-id="files-share-link-remove"
              :saving="saving"
              :action="removeLink"
              :label="$t('FILESWEBCLIENT.ACTION_REMOVE_PUBLIC_LINK')"
          />
          <ButtonDialog
              data-test-id="files-share-link-send"
              :disabled="recipient.empty || (isCreatingLink && !recipient?.HasPgpPublicKey && file.linkPassword)"
              :saving="saving"
              :action="sendViaMessage"
              :label="isCreatingLink ? sendLabel : $t('OPENPGPFILESWEBCLIENT.ACTION_SEND_EMAIL')"
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
    <template v-slot:dialogs>
      <SelectRecipientDialog
          v-model="showSelectRecipientDialog"
          :onGetContacts="getContacts"
          @close="closeSelectRecipientDialog"
          @selectContact="selectContact"
      />
    </template>
  </AppDialog>
</template>

<script>
import { mapActions, mapState } from 'pinia'
import { useFilesStore } from '../../store/index-pinia'
import { useOpenPGPStore } from '../../../../OpenPgpMobileWebclient/vue-mobile/store/index-pinia'
import { useCoreStore } from '../../../../CoreMobileWebclient/vue-mobile/src/stores/index-pinia'
import { sendShareableLinkViaEmail } from '../../../../OpenPgpFilesMobileWebclient/vue-mobile/utils/send-shareable-link-email'
import eventBus from 'src/event-bus'
import modulesManager from 'src/modules-manager'

import notification from 'src/utils/notification'

import AppDialog from 'components/common/AppDialog'
import AppDialogInput from 'src/components/common/AppDialogInput'
import ButtonDialog from 'src/components/common/ButtonDialog'
import AppCheckbox from 'src/components/common/AppCheckbox'
import CopyIcon from '../icons/CopyIcon'
import AppContactItem from 'src/components/common/AppContactItem'
import SelectRecipientDialog from './SelectRecipientDialog'
import { formatHintText } from '../../utils/common'

export default {
  name: 'CreateShareableLinkDialog',
  components: { ButtonDialog, AppDialogInput, AppDialog, CopyIcon, AppCheckbox, AppContactItem, SelectRecipientDialog },
  props: {
    file: { type: Object, default: null },
    dialog: { type: Boolean, default: false },
  },
  mounted() {
    this.init()
  },
  computed: {
    ...mapState(useOpenPGPStore, ['myPrivateKeys']),
    ...mapState(useCoreStore, ['userPublicId']),
    protectedLinksAvailable() {
      return modulesManager.isModuleAvailable('OpenPgpFilesWebclient')
    },
    createBtnLabel() {
      return this.withPassword && this.protectedLinksAvailable
        ? 'Create protected link'
        : 'Create shareable link'
    },
    sendLabel() {
      if (this.recipient.HasPgpPublicKey && this.file.linkPassword) {
        return this.$root.$t('OPENPGPFILESWEBCLIENT.ACTION_SEND_ENCRYPTED_EMAIL')
      }
      return this.$root.$t('OPENPGPFILESWEBCLIENT.ACTION_SEND_EMAIL')
    },
    isSigningAvailable() {
      return !!(this.file?.linkPassword && this.recipientHasPgpKey && this.myPrivateKeys?.length)
    },
    showSignCheckbox() {
      return !!(this.file?.linkPassword && this.recipientHasPgpKey)
    },
    recipientHasPgpKey() {
      return !!(this.recipient?.HasPgpPublicKey || this.recipient?.hasPgpPublicKey || this.recipient?.PublicPgpKey)
    },
    sendLinkHintText() {
      if (this.recipient?.empty) {
        return ''
      }
      if (this.recipientHasPgpKey) {
        if (this.file?.linkPassword) {
          if (this.addDigitalSignature && this.isSigningAvailable) {
            return formatHintText(this.$t('OPENPGPFILESWEBCLIENT.HINT_SEND_LINK_AND_PASSWORD_SIGNED'))
          }
          return formatHintText(this.$t('OPENPGPFILESWEBCLIENT.HINT_SEND_LINK_AND_PASSWORD'))
        }
        return formatHintText(this.$t('OPENPGPFILESWEBCLIENT.HINT_SEND_LINK'))
      }
      if (this.file?.linkPassword) {
        return formatHintText(this.$t('OPENPGPFILESWEBCLIENT.HINT_SEND_DIFFERENT_CHANNEL'))
      }
      return formatHintText(this.$t('OPENPGPFILESWEBCLIENT.HINT_SEND_LINK'))
    },
    signEmailHintText() {
      return formatHintText(this.addDigitalSignature
        ? this.$t('OPENPGPFILESWEBCLIENT.HINT_SIGN_EMAIL')
        : this.$t('OPENPGPFILESWEBCLIENT.HINT_NOT_SIGN_EMAIL'))
    },
  },
  data: () => ({
    withPassword: false,
    openDialog: false,
    saving: false,
    publicLink: '',
    linkPassword: '',
    resultingComponents: null,
    recipient: { FullName: 'Not Selected', empty: true },
    isCreatingLink: false,
    showSelectRecipientDialog: false,
    sendLinkLabel: '',
    isRecipientDisabled: false,
    addDigitalSignature: false,
  }),
  watch: {
    dialog(val) {
      if (val) {
        this.init()
      }
      this.openDialog = val
    },
    recipient: {
      handler(recipient) {
        this.addDigitalSignature = !!(this.recipientHasPgpKey && this.file?.linkPassword && this.myPrivateKeys?.length)
      },
      deep: true,
    },
  },
  methods: {
    ...mapActions(useFilesStore, [
      'asyncCreateShareableLink',
      'asyncDeletePublicLink',
      'changeItemProperty',
      'getContactSuggestions'
    ]),
    init() {
      this.publicLink = this.file.publicLink
      this.linkPassword = this.file.linkPassword
      this.sendLinkLabel = this.$t('OPENPGPFILESWEBCLIENT.ACTION_SEND_EMAIL')
      if (!this.recipient?.empty) {
        this.recipient = { FullName: 'Not Selected', empty: true }
      }
      this.isCreatingLink = false
      this.addDigitalSignature = false
      if (this.file.paranoidKey) {
        eventBus.$on('FilesMobile::SetRecipient', this.setRecipient)
        eventBus.$on('FilesMobile::IsCreatingLink', this.setIsCreatingLink)
        eventBus.$on('FilesMobile::IsRecipientDisabled', this.setIsRecipientDisabled)
        eventBus.$emit('FilesMobile::GetEncryptedShareableLinkDialog', this.setComponents)
      }
    },
    async getContacts(params) {
      return await this.getContactSuggestions(params)
    },
    async sendViaMessage() {
      if (this.recipient.empty || this.saving) {
        return
      }

      this.saving = true
      try {
        const result = await sendShareableLinkViaEmail({
          file: this.file,
          recipient: this.recipient,
          addDigitalSignature: this.addDigitalSignature,
          userEmail: this.userPublicId,
          router: this.$router,
          getParentComponent: this.$root._getParentComponent,
        })

        if (result) {
          this.$emit('closeDialog')
        }
      } finally {
        this.saving = false
      }
    },
    selectContact(contact) {
      this.recipient = { ...contact, empty: false }
      this.showSelectRecipientDialog = false
    },
    async createShareableLink() {
      if (this.withPassword && this.protectedLinksAvailable) {
        const { createProtectedPublicLink } = await import(
          '../../../../OpenPgpFilesMobileWebclient/vue-mobile/files/protected-public-link'
        )
        const created = await createProtectedPublicLink(this.file, { withPassword: true })
        if (created) {
          this.changeItemProperty({
            item: this.file,
            property: 'publicLink',
            value: created.publicLink,
          })
          this.changeItemProperty({
            item: this.file,
            property: 'linkPassword',
            value: created.linkPassword,
          })
        }
      } else {
        await this.asyncCreateShareableLink()
      }
      this.publicLink = this.file.publicLink
      this.linkPassword = this.file.linkPassword
    },
    selectRecipient() {
      if (!this.isRecipientDisabled) {
        this.showSelectRecipientDialog = true
      }
    },
    closeSelectRecipientDialog() {
      this.showSelectRecipientDialog = false
    },
    async removeLink() {
      this.saving = true
      const result = await this.asyncDeletePublicLink()
      this.saving = false
      if (result) this.$emit('closeDialog')
    },
    setRecipient(recipient) {
      this.recipient = recipient
    },
    copyText(text, valueName) {
      navigator.clipboard.writeText(text).then(() => {
        notification.showReport(`The ${valueName} has been copied to the clipboard.`)
      })
    },
    setComponents(components) {
      this.resultingComponents = components
    },
    setIsCreatingLink(value) {
      this.isCreatingLink = value
    },
    setIsRecipientDisabled() {
      this.isRecipientDisabled = true
    },
    cancelDialog() {
      this.changeItemProperty({
        item: this.file,
        property: 'linkPassword',
        value: ''
      })
      this.$emit('closeDialog')
    },
  },
  unmounted() {
    eventBus.$off('FilesMobile::SetRecipient', this.setRecipient)
    eventBus.$off('FilesMobile::IsCreatingLink', this.setIsCreatingLink)
    eventBus.$off('FilesMobile::IsRecipientDisabled', this.setIsRecipientDisabled)
  }
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
.section-separator {
  border-top: 1px solid #D3D3D3;
}
.recipient {
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 0.3px;
  color: #4B4A4A;
}
.inscription {
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: #B6B5B5;
}
</style>
