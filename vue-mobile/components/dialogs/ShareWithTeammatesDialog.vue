<template>
  <app-dialog v-model="openDialog" :close="cancel" width="calc(100vw - 20px)" >
    <template v-slot:head>
      <div class="q-px-md dialog__header-text">
        <span>{{ $t('SHAREDFILES.ACTION_SHARE') }}</span>
      </div>
      <div class="q-pl-md q-mt-md flex full-width row">
        <div class="col-10">
          <q-select
              use-input
              model-value=""
              @filter="filterContacts"
              dense
              outlined
              v-model="currentUser"
              :options="selectOptions"
          />
        </div>
        <div class="flex col-2 justify-center items-center dropdown-plus">
          <dropdown-contact-status :current-user="currentUser" :action="selectUser">
            <template v-slot:label>
              <plus-icon
                  class="text-center items-center justify-center"
                  style="fill: #d0d0d0"
              />
            </template>
          </dropdown-contact-status>
        </div>
      </div>
      <div
          style="height: 150px; overflow-y: scroll"
          class="flex q-ma-md users-list"
      >
        <div
            v-if="!contactsList.length"
            class="users-list__title q-ma-md text-center full-width"
        >
          No shares yet
        </div>
        <div class="full-width" v-if="contactsList.length">
          <div
              class="q-ma-sm flex row no-wrap"
              v-for="contact in contactsList"
              :key="contact.value"
          >
            <div style="overflow: hidden" class="flex col-7 items-center">
              <p class="full-width">
                {{ contact.email }}
              </p>
            </div>
            <div class="flex items-start col-4">
              <dropdown-contact-status ref="dropdown" :menu-offset="[85, 0]" :current-user="contact" :action="changeStatus">
                <template v-slot:label>
                  <span class="contact-status text-primary">{{
                      statuses[contact.status]
                    }}</span>
                </template>
              </dropdown-contact-status>
            </div>
            <div class="flex col-1 items-center" @click="removeContact(contact)">
              <q-icon color="grey-5" name="close" />
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:actions>
      <button-dialog
          :saving="saving"
          :action="showHistory"
          :label="$t('SHAREDFILES.ACTION_SHOW_HISTORY')"
      />
      <button-dialog
          :saving="saving"
          :action="save"
          :label="$t('COREWEBCLIENT.ACTION_SAVE')"
      />
    </template>
    <template v-slot:dialogs>
      <show-history-dialog ref="showHistoryDialog" />
      <not-added-user-dialog
          @onContinueSaving="onContinueSaving"
          @cancel="onContinueTyping"
          ref="notAddedUserDialog"
      />
    </template>
  </app-dialog>
</template>

<script>
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'

import { getContactsSelectOptions } from 'src/utils/contacts/utils'

import { getParametersForShare } from '../../utils/common'

import AppDialog from "components/common/AppDialog";
import DropdownContactStatus from "../common/DropdownContactStatus";
import ShowHistoryDialog from './ShowHistoryDialog'
import ButtonDialog from 'src/components/common/ButtonDialog'
import PlusIcon from 'src/components/common/icons/PlusIcon'
import NotAddedUserDialog from "./NotAddedUserDialog";

export default {
  name: 'ShareWithTeammatesDialog',
  components: {
    ButtonDialog,
    PlusIcon,
    ShowHistoryDialog,
    NotAddedUserDialog,
    DropdownContactStatus,
    AppDialog
  },
  created() {
    this.init()
  },
  props: {
    file: { type: Object, default: null },
    dialog: { type: Boolean, default: false },
  },
  data() {
    return {
      itemName: this.file.name,
      openDialog: false,
      saving: false,
      currentUser: null,
      userName: '',
      contactsList: [],
      selectOptions: [],
      defaultSelectOptions: [],
      statuses: {
        1: 'read',
        2: 'read/write',
        3: 'r/w/r',
      },
    }
  },
  computed: {
    ...mapGetters('filesmobile', ['currentStorage']),
  },
  watch: {
    dialog(val) {
      this.openDialog = val
    },
  },
  methods: {
    ...mapActions('contactsmobile', ['asyncGetContactsSuggestions']),
    ...mapActions('filesmobile', ['asyncUpdateShare', 'changeItemProperty']),
    selectUser(status) {
      if (this.currentUser) {
        this.currentUser.status = status
        this.contactsList.push(this.currentUser)
        this.removeFindContact(this.currentUser)
      }
      this.currentUser = null
    },
    removeFindContact(currentUser) {
      const userIndex = this.selectOptions.findIndex(
        (user) => user.email === currentUser.email
      )
      if (userIndex !== -1) this.selectOptions.splice(userIndex, 1)
    },
    async init() {
      if (this.file.shares.length) {
        this.contactsList = this.file.shares.map((contact) => {
          return {
            email: contact.PublicId,
            status: contact.Access,
          }
        })
      }
      const parameters = {
        Search: '',
        Storage: 'team',
        SortField: 3,
        SortOrder: 1,
        WithGroups: false,
        WithoutTeamContactsDuplicates: true,
      }
      const contacts = await this.asyncGetContactsSuggestions(parameters)
      this.selectOptions = getContactsSelectOptions(contacts?.List, this.contactsList)
      this.defaultSelectOptions = _.cloneDeep(this.selectOptions)
      if (this.contactsList.length) {
        this.contactsList.forEach((contact) => this.removeFindContact(contact))
      }
    },
    filterContacts(search, update) {
      update(async () => {
        this.selectOptions = this.defaultSelectOptions.filter(
          (option) => option.email.indexOf(search) + 1
        )
      })
    },
    removeContact(contact) {
      const userIndex = this.contactsList.findIndex(
        (user) => user.email === contact.email
      )
      if (userIndex !== -1) this.contactsList.splice(userIndex, 1)
    },
    showHistory() {
      this.$refs.showHistoryDialog.openDialog(
        this.file,
        this.$t('SHAREDFILES.HEADING_HISTORY_POPUP')
      )
    },
    async save() {
      if (this.currentUser) {
        this.$refs.notAddedUserDialog.openDialog(this.currentUser)
      } else {
        await this.onContinueSaving()
      }
    },
    async onContinueSaving() {
      this.saving = true
      const parameters = getParametersForShare(this.contactsList, this.file)
      const result = await this.asyncUpdateShare(parameters)
      if (result) {
        this.openDialog = false
        this.$emit('closeDialog')
      }
      this.saving = false
    },
    onContinueTyping() {
      if (this.contactsList.length) {
        this.$refs.dropdown.$refs.dropdown.show()
      }
    },
    changeStatus(status, contact) {
      contact.status = status
    },
    cancel() {
      this.$emit('closeDialog')
    },
  },
}
</script>

<style>
.users-list {
  border: 1px solid #d0d0d0;
  border-radius: 10px;
}
.users-list__title {
  font-size: 18px;
  color: #d0d0d0;
}
.dropdown-plus .q-btn-dropdown__arrow {
  display: none;
}
.contact-status {
  border-bottom: 1px dotted;
}
</style>
