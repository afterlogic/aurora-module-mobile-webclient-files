<template>
  <div>
    <q-dialog v-model="confirm" @escape-key="cancel">
      <q-card class="q-dialog-size q-px-sm" style="min-width: 300px">
        <h6 class="q-mx-md q-my-md">{{ title }}</h6>
        <div
          class="q-mx-md q-mt-sm"
          style="
            border-color: #d5d9dc;
            border-style: solid;
            border-width: 1px 1px 0 1px;
            border-radius: 3px;
            font-size: 10pt;
          "
        >
          <q-item
            class="bg-grey-4"
            style="border-bottom: 1px solid #d5d9dc"
            dense
          >
            <q-item-section>
              <q-item-label><b>Date</b></q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label><b>Action</b></q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label><b>IP</b></q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label><b>User</b></q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            v-if="!historyList.length"
            clickable
            style="border-bottom: 1px solid #d5d9dc"
          >
            <q-item-section>
              <q-item-label
                ><div style="text-align: center">
                  There is no history yet
                </div></q-item-label
              >
            </q-item-section>
          </q-item>
          <q-item
            clickable
            v-for="item in historyList"
            :key="item.Timestamp"
            style="border-bottom: 1px solid #d5d9dc"
            dense
          >
            <q-item-section>
              <q-item-label>{{ getDate(item.Timestamp) }}</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ item.Action }}</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ item.IpAddress }}</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ item.GuestPublicId }}</q-item-label>
            </q-item-section>
          </q-item>
        </div>
        <app-paginator
          :currentPage="currentPage"
          :itemsPerPage="10"
          :itemsCount="itemsCount"
          :changePage="changePage"
          :border="false"
        ></app-paginator>
        <q-card-actions align="right">
          <button-dialog
            :disable="!historyList.length"
            label="Clear"
            :action="openClearDialog"
          />
          <button-dialog label="Cancel" :action="cancel" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="confirmClearDialog">
      <q-card class="q-dialog-size" style="min-width: 300px">
        <q-item class="q-mt-md">
          <q-item-section>
            <q-item-label
              >Are you sure you want to clear the entire activity
              history?</q-item-label
            >
          </q-item-section>
        </q-item>
        <q-card-actions align="right">
          <button-dialog :action="clearHistory" label="Ok" />
          <button-dialog
            :action="() => (this.confirmClearDialog = false)"
            label="Cancel"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

import date from 'src/utils/date'

import AppPaginator from 'src/components/common/AppPaginator'
import ButtonDialog from 'src/components/common/ButtonDialog'

export default {
  name: 'ShowHistoryDialog',
  components: {
    AppPaginator,
    ButtonDialog,
  },
  data() {
    return {
      confirm: false,
      confirmClearDialog: false,
      file: null,
      title: '',
      historyList: [],
      itemsCount: 0,
      offset: 0,
      currentPage: 1,
    }
  },
  methods: {
    ...mapActions('filesmobile', ['asyncGetHistory', 'asyncClearHistory']),
    changePage(page) {
      this.currentPage = page
      this.offset = (page - 1) * 10
      this.getHistory(this.file)
    },
    getDate(timestamp) {
      return date.getFullDate(timestamp)
    },
    openDialog(file, title) {
      this.title = title
      this.currentPage = 1
      this.offset = 0
      this.historyList = []
      this.getHistory(file)
      this.confirm = true
    },
    async getHistory(file) {
      this.file = file
      const resourceId = file.type + file.path + '/' + file.name
      const result = await this.asyncGetHistory({
        resourceType: 'file',
        resourceId: resourceId,
        offset: this.offset,
        limit: 5,
      })
      if (result) {
        this.historyList = result.Items
        this.itemsCount = result.Count
      }
    },
    openClearDialog() {
      this.confirmClearDialog = true
    },
    async clearHistory() {
      this.confirmClearDialog = false
      const resourceId = this.file.type + this.file.path + '/' + this.file.name
      const result = await this.asyncClearHistory({
        resourceType: 'file',
        resourceId: resourceId,
      })
      if (result) {
        await this.getHistory(this.file)
      }
    },
    cancel() {
      this.confirm = false
    },
  },
}
</script>

<style scoped></style>
