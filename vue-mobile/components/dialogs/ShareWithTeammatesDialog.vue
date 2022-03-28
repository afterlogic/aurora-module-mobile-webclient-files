<template>
  <app-dialog v-model="openDialog" :close="cancel" width="calc(100vw - 20px)" >
    <template v-slot:head>
      <div class="q-px-lg q-pb-md dialog__title-text">
        <span>{{ $t('SHAREDFILES.ACTION_SHARE') }}</span>
      </div>
      <div class="q-pl-lg q-pr-sm q-mt-md flex full-width row">
        <div class="col-10 select-contact">
          <q-select
              use-input
              model-value=""
              @filter="filterContacts"
              dense
              outlined
              v-model="currentUser"
              :options="selectOptions"

          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section class="non-selectable">
                  <q-item-label class="flex">
                    <div v-if="isGroup(scope)" class="q-mr-sm">
                      <q-icon size="16px" name="tag" color="grey" />
                    </div>
                    <span class="q-mr-sm">
                      {{ scope.opt.label }}
                    </span>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div class="flex col-2 justify-center items-center dropdown-plus">
          <dropdown-contact-status
              ref="dropdown"
              :current-user="currentUser"
              :action="selectUser"
              :statuses="dropdownStatuses"
          >
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
          class="flex q-ma-md users-list q-mx-lg"
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
              <dropdown-contact-status
                  :menu-offset="[85, 0]"
                  :current-user="contact"
                  :action="changeStatus"
                  :statuses="statuses"
              >
                <template v-slot:label>
                  <span class="contact-status text-primary">{{
                      statuses[contact.status]
                    }}</span>
                </template>
              </dropdown-contact-status>
            </div>
            <div v-if="!loading" class="flex col-1 items-center" @click="removeContact(contact)">
              <q-icon color="grey-5" name="close" />
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:actions>
      <button-dialog
          class="q-ma-sm"
          :saving="saving"
          :action="showHistory"
          :label="$t('SHAREDFILES.ACTION_SHOW_HISTORY')"
      />
      <button-dialog
          class="q-ma-sm"
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

import { getContactsSelectOptions, getAllContactsSelectOptions } from 'src/utils/contacts/utils'

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
      allContactsSelectOptions: [],
      shares: [],
      loading: false
    }
  },
  computed: {
    ...mapGetters('filesmobile', ['currentStorage']),
    statuses() {
      const statuses = {
        2: 'read',
        1: 'read/write',
        0: 'no access'
      }
      if (!this.file?.paranoidKey) {
        statuses[3] = 'r/w/reshare'
      }
      return statuses
    },
    dropdownStatuses() {
      const statuses = {
        2: 'read',
        1: 'read/write',
        0: 'no access',
      }
      if (!this.file?.paranoidKey) {
        statuses[3] = 'read/write/reshare'
      }
      return statuses
    },
  },
  watch: {
    dialog(val) {
      this.openDialog = val
    },
  },
  methods: {
    ...mapActions('contactsmobile', ['asyncGetContactsSuggestions']),
    ...mapActions('filesmobile', ['asyncUpdateShare', 'changeItemProperty', 'asyncGetExtendedPropsShares']),
    isGroup(scope) {
      return scope.opt?.isGroup
    },
    hasChanges() {
      if (this.currentUser) return true
      const oldContactsList = this.file.shares.map((contact) => {
        return {
          email: contact.PublicId,
          status: contact.Access,
        }
      })

      if (oldContactsList.length !== this.contactsList.length) return true

      if (oldContactsList.length >= this.contactsList.length) {
        return this.compareArrays(oldContactsList, this.contactsList)
      }

      if (oldContactsList.length < this.contactsList.length) {
        return this.compareArrays(this.contactsList, oldContactsList)
      }
    },
    compareArrays(firstArray, secondArray) {
      for (let elemFirstArray of firstArray) {
        const index = secondArray.findIndex( elemSecondArray => {
          if (elemSecondArray.IsGroup || elemSecondArray.isGroup) {
            return elemSecondArray.email === elemFirstArray.email && elemSecondArray.status === elemFirstArray.status
          } else {
            return elemSecondArray.email === elemFirstArray.email && elemSecondArray.status === elemFirstArray.status
          }
        })
        if (index === -1) return true
      }
      return false
    },
    compareShares(firstArray, secondArray) {
      for (let elemFirstArray of firstArray) {
        const index = secondArray.findIndex( elemSecondArray => {
          return elemSecondArray.PublicId === elemFirstArray.PublicId && elemSecondArray.Access === elemFirstArray.Access
        })
        console.log(index, 'index')
        if (index === -1) return true
      }
      return false
    },
    selectUser(status) {
      if (this.currentUser) {
        this.currentUser.status = status
        this.contactsList.push(this.currentUser)

        this.$nextTick(() => {
          this.removeFindContact(this.currentUser)
          this.currentUser = null
        })
      }
    },
    removeFindContact(currentUser) {
      const userIndex = this.selectOptions.findIndex(
        (user) => user.email === currentUser.email
      )
      if (userIndex !== -1) this.selectOptions.splice(userIndex, 1)
    },
    async init() {
      if (this.file.shares.length) {
        this.setContactList(this.file.shares)
      }

      this.loading = true
      const shares = await this.asyncGetExtendedPropsShares({
        Type: this.file.type,
        Path: this.file.path,
        Name: this.file.name
      })
      this.shares = _.cloneDeep(shares)
      this.setContactList(shares)
      this.loading = false

      const parameters = {
        Search: '',
        Storage: 'team',
        SortField: 3,
        SortOrder: 1,
        WithGroups: false,
        WithUserGroups: true,
        WithoutTeamContactsDuplicates: true,
      }
      const contacts = await this.asyncGetContactsSuggestions(parameters)

      this.selectOptions = getContactsSelectOptions(contacts?.List, this.contactsList)
      this.allContactsSelectOptions = getAllContactsSelectOptions(contacts?.List)
      this.defaultSelectOptions = _.cloneDeep(this.selectOptions)
      if (this.contactsList.length) {
        this.contactsList.forEach((contact) => this.removeFindContact(contact))
      }
    },
    setContactList(shares) {
      this.contactsList = shares.map((contact) => {
        if (contact.IsGroup) {
          return {
            publicId: contact.PublicId,
            status: contact.Access,
            isAll: contact.IsAll,
            isGroup:true,
            groupId: contact.GroupId,
            email: contact.PublicId,
          }
        } else {
          return {
            email: contact.PublicId,
            status: contact.Access,
          }
        }
      })
    },
    filterContacts(search, update) {
      update(async () => {
        this.selectOptions = this.allContactsSelectOptions.filter(
          (option) => {
            const currentUserEmail = this.$store.getters['core/userPublicId']
            const indexSearch = option.email.indexOf(search) + 1
            const indexSelectedContact = this.contactsList.findIndex((contact) => {
              return contact.email === option.email
            }) + 1
            return indexSearch && !indexSelectedContact && currentUserEmail !== option.email
          }
        )
      })
    },
    removeContact(contact) {
      const userIndex = this.contactsList.findIndex(
        (user) => user.email === contact.email
      )
      if (userIndex !== -1) this.contactsList.splice(userIndex, 1)
      this.selectOptions = getContactsSelectOptions(this.allContactsSelectOptions, this.contactsList)
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
        if (this.file.paranoidKey) {
          // eventBus.$emit('FilesMobileWebclient::ShareEncryptFile', {
          //   contactsList: this.contactsList,
          //   onContinueSaving: this.onContinueSaving,
          //   getParentComponent: this.$root._getParentComponent
          // })
          await this.onContinueSaving(true)
        } else {
          await this.onContinueSaving(true)
        }
      }
    },
    async onContinueSaving(res) {
      if (res) {

        const shares = await this.asyncGetExtendedPropsShares({
          Type: this.file.type,
          Path: this.file.path,
          Name: this.file.name
        })

        if (shares.length !== this.shares.length) {
          this.showWarning()
          return
        }
        if (this.compareShares(this.shares, shares)) {
          this.showWarning()
          return
        }

        this.saving = true
        const parameters = getParametersForShare(this.contactsList, this.file)
        const result = await this.asyncUpdateShare(parameters)
        if (result) {
          this.openDialog = false
          this.$emit('closeDialog')
        }
      }
      this.saving = false
    },
    showWarning() {
      console.log('warning')
    },
    onContinueTyping() {
      this.$refs.dropdown.$refs.dropdown.show()
    },
    changeStatus(status, contact) {
      contact.status = status
    },
    cancel() {
      this.$emit('closeDialog', this.hasChanges)
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

.q-field__inner .relative-position .col .self-stretch {
  margin: 8px;
}

.q-field--filled .q-field__control:before {
  border: 2px solid;
  border-radius: 6px;
  background: #ffffff;
}
.q-field--filled .q-field__control:after {
  transform-origin: center;
  transform: none;
  transition: none;
  height: 0 !important;
}
.q-select__dialog label {
  margin: 8px;
  border-radius: 6px;
  background: #ffffff;
}
.q-field--filled.q-field--highlighted .q-field__control:before {
  background: #ffffff !important;
}
.q-field--filled .q-field__control:before {
  background: #ffffff !important;
}
.q-field--filled .q-field__control {
  background: #ffffff !important;
}
</style>
