<template>
  <div>
    <q-dialog v-model="confirm" @escape-key="cancel">
      <q-card class="q-dialog-size q-px-sm history-card">
        <h6 class="q-mx-md q-my-md">{{ title }}</h6>
        <div class="q-mx-md q-mt-sm history-table-scroll">
          <table class="history-table">
            <thead>
              <tr>
                <th class="col-date">Date</th>
                <th class="col-action">Action</th>
                <th class="col-ip">IP</th>
                <th class="col-user">User</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!historyList.length">
                <td colspan="4" class="no-history">There is no history yet</td>
              </tr>
              <tr v-for="item in historyList" :key="item.Timestamp">
                <td class="col-date">
                  <div>{{ getDatePart(item.Timestamp) }}</div>
                  <div>{{ getTimePart(item.Timestamp) }}</div>
                </td>
                <td class="col-action">{{ item.Action }}</td>
                <td class="col-ip">{{ item.IpAddress }}</td>
                <td class="col-user">{{ item.GuestPublicId }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <AppPaginator
          :currentPage="currentPage"
          :itemsPerPage="10"
          :itemsCount="itemsCount"
          :changePage="changePage"
          :border="false"
        ></AppPaginator>
        <q-card-actions align="right">
          <ButtonDialog
            :disable="!historyList.length"
            label="Clear"
            :action="openClearDialog"
          />
          <ButtonDialog label="Cancel" :action="cancel" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="confirmClearDialog">
      <q-card class="q-dialog-size" style="min-width: 300px">
        <q-item class="q-mt-md">
          <q-item-section>
            <q-item-label>Are you sure you want to clear the entire activity history?</q-item-label>
          </q-item-section>
        </q-item>
        <q-card-actions align="right">
          <ButtonDialog :action="clearHistory" label="Ok" />
          <ButtonDialog :action="() => (this.confirmClearDialog = false)" label="Cancel" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapActions } from 'pinia'
import { useFilesStore } from '../../store/index-pinia'

import moment from 'moment'

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
    ...mapActions(useFilesStore, ['asyncGetHistory', 'asyncClearHistory']),
    changePage(page) {
      this.currentPage = page
      this.offset = (page - 1) * 10
      this.getHistory(this.file)
    },
    getDatePart(timestamp) {
      return moment(timestamp * 1000).format('DD.MM.YYYY')
    },
    getTimePart(timestamp) {
      return moment(timestamp * 1000).format('hh:mm A')
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

<style lang="scss" scoped>
.history-card {
  min-width: calc(100vw - 20px);
  max-width: calc(100vw - 20px);
}

.history-table-scroll {
  height: 200px;
  overflow: auto;
  border: 1px solid #d5d9dc;
  border-radius: 3px;
}

.history-table {
  border-collapse: collapse;
  width: auto;
  font-size: 10pt;

  th,
  td {
    padding: 4px 8px;
    text-align: left;
    border-bottom: 1px solid #d5d9dc;
    vertical-align: middle;
    white-space: nowrap;
    width: 1px;
  }

  thead th {
    position: sticky;
    top: 0;
    z-index: 1;
    background: #e0e0e0;
    font-weight: bold;
  }

  .col-action {
    width: 65px;
    min-width: 65px;
    max-width: 65px;
    white-space: normal;
    word-break: break-word;
  }

  .no-history {
    width: auto;
    white-space: normal;
    text-align: center;
  }
}
</style>
