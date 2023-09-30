<template>
  <div>
    <q-item class="user-info flex column q-mb-xs">
      <div v-if="userName" class="user-name q-mx-md q-mb-xs">
        {{ userName }}
      </div>
      <div :class="`q-mx-md ${!userName ? 'user-name q-mb-xs' : 'user-email'}`">
        {{ userEmail }}
      </div>
    </q-item>
    <q-separator />
    <storage-item
      v-for="storage in storageList"
      :key="storage"
      :active="storage.Type === currentStorage?.Type"
      :storage="storage"
    />
  </div>
</template>

<script>
import { mapGetters } from 'pinia'
import { useFilesStore } from '../store/index-pinia'
import { useCoreStore } from 'src/stores/index-pinia'

import StorageItem from '../components/StorageItem'

export default {
  name: 'DrawerContent',

  components: {
    StorageItem,
  },
  computed: {
    ...mapGetters(useFilesStore, [
      'storageList',
      'currentStorage',
    ]),
    ...mapGetters(useCoreStore, [
      'userData',
      'userPublicId'
    ]),
    userName() {
      if (this.userData) return this.userData.Name
      return ''
    },
    userEmail() {
      return this.userPublicId
    },
  },
};
</script>
<style>
  .contacts__drawer-head {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 25px;
    color: #969494;
  }
  .separator-color {
    background: #F6F6F6;
  }
</style>
