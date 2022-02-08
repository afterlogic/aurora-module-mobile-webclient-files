<template>
  <q-dialog v-model="openDialog">
    <div class="q-dialog-size bg-white q-pt-md q-px-sm" style="width: 400px">
      <div style="font-size: 15px" class="q-px-md text-bold text-black text">
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
          <q-btn-dropdown
            :disable="!currentUser"
            flat
            unelevated
            dense
            dropdown-icon="none"
            :ripple="false"
          >
            <template v-slot:label>
              <plus-icon
                class="text-center items-center justify-center"
                style="fill: #d0d0d0"
              />
            </template>
            <q-list>
              <q-item clickable v-close-popup @click="selectUser(1)">
                <q-item-section>
                  <q-item-label>{{ statuses[1] }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="selectUser(2)">
                <q-item-section>
                  <q-item-label>{{ statuses[2] }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="selectUser(3)">
                <q-item-section>
                  <q-item-label>{{ statuses[3] }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </div>
      <div
        style="height: 150px; overflow: hidden; overflow-y: scroll"
        class="flex q-ma-md users-list"
      >
        <div
          v-if="!contactsList.length"
          class="users-list__title q-ma-md text-center full-width"
        >
          No shares yet
        </div>
        <div style="width: 250px" v-if="contactsList.length">
          <div
            class="q-ma-sm flex full-width no-wrap justify-between row"
            v-for="contact in contactsList"
            :key="contact.value"
          >
            <div class="q-mx-sm col-8">
              <p style="overflow: hidden" class="full-width">
                {{ contact.email }}
              </p>
            </div>
            <div class="q-mx-sm col-2">
              <span class="contact-status text-primary">{{
                statuses[contact.status]
              }}</span>
            </div>
            <div class="col-2 text-center" @click="removeContact(contact)">
              <q-icon class="q-pl-xs" color="grey-5" name="close" />
            </div>
          </div>
        </div>
      </div>
      <q-card-actions class="q-my-sm" align="right">
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
        <button-dialog
          :saving="saving"
          :action="cancel"
          :label="$t('COREWEBCLIENT.ACTION_CLOSE')"
        />
      </q-card-actions>
    </div>
    <show-history-dialog ref="showHistoryDialog" />
  </q-dialog>
</template>

<script>
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'

import { getContactsSelectOptions } from 'src/utils/contacts/utils'
import { getParametersForShare } from 'src/utils/files/utils'

import ShowHistoryDialog from './ShowHistoryDialog'
import ButtonDialog from 'src/components/common/ButtonDialog'
import PlusIcon from 'src/components/common/icons/PlusIcon'

export default {
  name: 'ShareWithTeammatesDialog',
  components: {
    ButtonDialog,
    PlusIcon,
    ShowHistoryDialog,
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
    ...mapActions('contactsmobile', ['asyncGetContacts']),
    ...mapActions('filesmobile', ['asyncUpdateShare']),
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
      const contacts = await this.asyncGetContacts(parameters)
      this.selectOptions = getContactsSelectOptions(contacts?.List)
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
      this.saving = true
      const parameters = getParametersForShare(this.contactsList, this.file)
      const result = await this.asyncUpdateShare(parameters)
      this.saving = false
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
