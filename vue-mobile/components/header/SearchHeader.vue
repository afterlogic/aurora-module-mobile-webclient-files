<template>
  <div>
    <q-toolbar class="app-header search-toolbar">
      <div class="col">
        <q-btn @click="onCloseSearch" color="black" icon="close" flat round dense />
      </div>
      <div class="col flex text-center items-center text-black search" style="overflow: hidden">
        <div class="full-width">
          <span class="text-bold search-title">
            Search
          </span>
        </div>
        <div class="search-path flex no-wrap justify-center full-width">
          <span>{{ currentStorage.DisplayName }}{{currentPath.length ? '/' : ''}}</span>
          <div class="flex" style="direction: rtl; overflow: hidden;">
            <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-left: -0.6em;">
              i{{currentFolder}}
            </span>
          </div>
        </div>
      </div>
      <div class="col" />
    </q-toolbar>
    <q-toolbar class="flex row search-toolbar-input">
      <q-input
        v-model="text"
        :style="{ height: '48px' }"
        :input-style="{ height: '48px' }"
        placeholder="Search"
        autofocus
        borderless
        outlined
        class="col-12 q-px-md search"
        model-value=""
        debounce="400"
      />
    </q-toolbar>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'SearchHeader',
  data() {
    return {
      text: '',
    }
  },
  computed: {
    ...mapGetters('filesmobile', [
      'currentStorage',
      'searchText',
      'currentPath'
    ]),
    currentFolder() {
      // const paths = this.currentPath.split('/')
      // if (this.currentPath.length > 20) {
      //   if (paths[paths.length - 1].length > 15) {
      //     let lastFolder = paths[paths.length - 1]
      //     return `${this.currentStorage.DisplayName}/.../...${lastFolder.slice(lastFolder.length - 15, lastFolder.length)}`
      //   }
      //   return `${this.currentStorage.DisplayName}/.../${paths[paths.length - 1]}`
      // }
      // return `${this.currentStorage.DisplayName}${this.currentPath}`
      const paths = this.currentPath.split('/')
      if (paths.length < 1) return ''
      return this.currentPath
    }
  },
  mounted() {
    this.text = this.searchText
  },
  watch: {
    text() {
      this.search()
    }
  },
  methods: {
    ...mapActions('filesmobile', [
      'asyncGetFiles',
      'changeCurrentHeader',
      'changeSearchText'
    ]),
    async search() {
      this.changeSearchText(this.text)
      const result = await this.asyncGetFiles()
    },
    async onCloseSearch() {
      this.changeSearchText('')
      this.changeCurrentHeader('')
      await this.asyncGetFiles()
    },
  },
}
</script>

<style>
.search .q-field__control {
  height: 48px;
}
.search-title {
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 20px;
  margin-top: 5px
}
.search-path {
  font-weight: 400;
  font-size: 12px;
  line-height: 10px;
  color: #B6B5B5;
}
.search-toolbar-input {
  height: 74px;
  font-size: 16px;
  padding: 0
}
</style>
