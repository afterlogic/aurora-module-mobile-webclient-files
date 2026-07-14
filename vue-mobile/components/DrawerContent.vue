<template>
  <div>
    <div class="contacts__drawer-head q-pl-lg" style="padding-top: 32px">
      {{ $t('FILESMOBILEWEBCLIENT.LABEL_STORAGES') }}
    </div>
    <q-separator spaced class="separator-color"/>

    <StorageItem
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
