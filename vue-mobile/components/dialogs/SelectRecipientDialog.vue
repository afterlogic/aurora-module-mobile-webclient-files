<template>
  <AppDialog :close="close">
    <template v-slot:title>
      <div>
        <span>{{ $t('OPENPGPFILESWEBCLIENT.HEADING_SEND_ENCRYPTED_FILE') }}</span>
      </div>
      <q-input
          v-model="searchText"
          :style="{ height: '36px' }"
          :input-style="{ height: '36px' }"
          placeholder="Search"
          autofocus
          borderless
          outlined
          dense
          class="q-mt-lg contact-search"
          debounce="400"
      />
    </template>
    <template v-slot:content>
      <div class="q-px-lg" style="margin-top: 32px">
        <AppListLoader v-if="isWaitingContacts" />
        <q-scroll-area v-else class="full-width" :thumb-style="{width: '0'}" style="height: 300px">
          <div>
            <AppContactItem
                v-for="contact in contacts"
                :contact="contact"
                :key="contact.ETag"
                @click="selectContact(contact)"
                class="q-mb-md"
            />
          </div>
        </q-scroll-area>
      </div>
    </template>
  </AppDialog>
</template>
<script>
import AppDialog from "components/common/AppDialog";
import AppContactItem from "components/common/AppContactItem";
import AppListLoader from "components/common/AppListLoader";
import KeyIcon from "components/common/icons/KeyIcon";

export default {
  name: "SelectRecipientDialog",
  components: {
    KeyIcon,
    AppDialog,
    AppContactItem,
    AppListLoader,
  },
  props: {
    onGetContacts: { type: Function, default: null }
  },
  watch: {
    async searchText(searchText) {
      this.contacts = await this.onGetContacts({
        Search: searchText,
        Storage:"all",
        SortField:3,
        SortOrder:1,
        WithGroups:false,
        WithoutTeamContactsDuplicates:true
      })
    }
  },
  async mounted() {
    this.isWaitingContacts = true
    this.contacts = await this.onGetContacts({
      Search:"",
      Storage:"all",
      SortField:3,
      SortOrder:1,
      WithGroups:false,
      WithoutTeamContactsDuplicates:true
    })
    this.isWaitingContacts = false
  },
  data: () => ({
    contacts: [],
    isWaitingContacts: false,
    searchText: ''
  }),
  methods: {
    selectContact(contact) {
      this.$emit('selectContact', contact)
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.contact {
  &__name {
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.3px;
    color: #000000;
  }
  &__email {
    font-size: 12px;
    line-height: 10px;
    color: #969494;
  }
}
</style>
