<template>
  <MainLayout>
    <template v-slot:header>
      <FilesHeader />
    </template>

    <template v-slot:drawer>
      <DrawerContent />
    </template>

    <q-linear-progress v-if="loadingStatus" class="full-width" indeterminate track-color="grey-1" color="primary" />

    <router-view></router-view>

    <AppCreateButton :rotate="appButtonRotate" @click="showCreateButtonsDialog" v-if="isShowCreateButtons" />

    <DialogsList />
  </MainLayout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import MainLayout from 'src/layouts/MainLayout'
import AppCreateButton from 'src/components/common/AppCreateButton'
import FilesHeader from '../components/header/FilesHeader'
import DrawerContent from '../components/DrawerContent'
import DialogsList from '../components/DialogsList'

export default {
  name: 'Files',

  components: {
    MainLayout,
    FilesHeader,
    DrawerContent,
    DialogsList,
    AppCreateButton,
  },

  computed: {
    ...mapGetters('filesmobile', [
      'storageList',
      'copiedFiles',
      'loadingStatus',
      'currentStorage',
      'currentHeader',
      'dialogComponent',
    ]),
    appButtonRotate() {
      return this.dialogComponent.component === 'CreateButtonsDialogs'
    },
    // isCopied() {
    //   return !!this.copiedFiles.length
    // },
    isShowCreateButtons() {
      //TODO remove copiedFiles from here
      return this.currentStorage?.Type !== 'shared' && !this.copiedFiles.length && this.currentHeader !== 'SearchHeader'
    },
    fileListHeight() {
      if (this.currentHeader === 'SearchHeader') return 'files__list-search'
      return 'files__list-default'
    },
  },

  watch: {
    // selectedFiles(items) {
    //   if (!items.length) {
    //     this.isSelectMode = false
    //   }
    // },
    '$route.params.storageId': {
      handler: async function (storageId) {
        this.changeLoadingStatus(true)
        if (!this.storageList?.length) {
          await this.asyncGetStorages()
        }
        this.changeLoadingStatus(false)

        if (!storageId) {
          //TODO add detection of a default storage
          this.$router.push(`/files/${this.storageList[0].Type}/`)
        } else {
          const storage = this.storageList.length ? this.storageList.find((storage) => storage.Type === storageId) : {}
          if (storage) {
            this.changeCurrentStorage(storage)
          }
        }
      },
      immediate: true,
    },
    '$route.params.path': {
      handler: function (path) {
        this.changeSearchText('')
        this.changeCurrentPath({ path })
      },
      immediate: true,
    },
  },

  methods: {
    ...mapActions('filesmobile', [
      'asyncGetStorages',
      'changeDialogComponent',
      'changeLoadingStatus',
      'changeCurrentStorage',
      'changeCurrentPath',
      'changeSearchText',
    ]),
    showCreateButtonsDialog() {
      if (this.dialogComponent.component === 'CreateButtonsDialogs') {
        this.changeDialogComponent({ component: '' })
      } else {
        this.changeDialogComponent({ component: 'CreateButtonsDialogs' })
      }
    },
  },
}
</script>

<style lang="scss">
.files__list-default {
  height: 100%;
}
.files__list-search {
  height: 100%;
}
.files__list .q-scrollarea__content {
  width: 100vw;
}
.user-email {
  font-weight: 400;
  font-size: 14px;
  line-height: 25px;
  color: rgba(0, 0, 0, 0.6);
}
.user-name {
  font-weight: 700;
  font-size: 18px;
  line-height: 20px;
  color: #000000;
}
.user-info {
  padding-top: 36px;
}
</style>
