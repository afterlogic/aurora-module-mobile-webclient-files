<template>
  <div>
    <q-toolbar class="search-toolbar">
      <q-card-actions align="left" class="col-2">
        <q-btn
          flat
          size="15px"
          color="black"
          round
          dense
          icon="close"
          @click="close"
        />
      </q-card-actions>
      <div class="flex column text-center text-black col-8 search">
        <span class="text-bold search-title"
          >Search</span
        >
        <span class="text__caption" style="margin-top: -3px">{{
            currentFolder
        }}</span>
      </div>
      <div class="col-2 flex justify-end q-pr-sm" />
    </q-toolbar>
    <q-toolbar
      class="flex row search-toolbar-input"
    >
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
    ...mapGetters('filesmobile', ['currentStorage', 'searchText', 'currentPath']),
    currentFolder() {
      const paths = this.currentPath.split('/')
      if (this.currentPath.length > 20) {
        if (paths[paths.length - 1].length > 15) {
          let lastFolder = paths[paths.length - 1]
          return `${this.currentStorage.DisplayName}/.../...${lastFolder.slice(lastFolder.length - 15, lastFolder.length)}`
        }
        return `${this.currentStorage.DisplayName}/.../${paths[paths.length - 1]}`
      }
      return `${this.currentStorage.DisplayName}${this.currentPath}`
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
    async close() {
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
  font-size: 17px;
  margin-top: 5px
}
.search-toolbar {
  height: 55px;
  font-size: 16px;
  padding: 0
}
.search-toolbar-input {
  height: 74px;
  font-size: 16px;
  padding: 0
}
</style>
