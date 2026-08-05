<template>
  <AppItem
    v-if="file"
    data-test-id="files-item"
    :item="file"
    :isSelected="file.isSelected"
    :disable="file.isCopied"
    :clickable="!isCopied"
    :active="file.isSelected"
    :isChoice="isSelectMode"
    @click="listItemClick(file)"
  >
    <q-item-section class="file__thumb" side>
      <FileItemIcon v-if="file.paranoidKey || !file.isImg" :file="file" class="file__thumb-icon" />
      <div class="file__thumb-image"
        v-if="file.isImg && !file.paranoidKey"
        :style="{ 'background-image': `url(${filePreview})`}"
      />
      <ShareWithMeItemIcon v-if="file.sharedWithMeAccess" class="file__thumb-share-icon" />
    </q-item-section>

    <q-item-section class="list-item__text">
      <q-item-label class="list-item__text_primary file__name">
        {{ fileName }}
      </q-item-label>
      <q-item-label v-if="!file.downloading" class="list-item__text_secondary file__info">
        <EncryptedItemIcon v-if="file.paranoidKey" class="file__info-icon_encrypted"/>
        <SharedItemIcon v-if="isShared" class="file__info-icon_shared" width="14" height="14" />
        <LinkItemIcon v-if="file.publicLink" class="file__info-icon_link"/>
        <FavoriteItemIcon v-if="file.favorite" class="file__info-icon_favorite"/>
        <span class="file__size">{{ fileSize }}</span>
        <span class="file__separator">|</span>
        <span class="file__date">{{ fileDate }}</span>
      </q-item-label>
      <q-item-label v-if="file.downloading" class="file__download-progress">
        <DownloadingProgress :file="file" />
      </q-item-label>
    </q-item-section>
    <q-item-section v-if="!isSelectMode" class="file__menu" side>
      <q-btn
        data-test-id="files-item-more"
        icon="more_vert"
        @click.stop="menuClick"
        color="grey"
        flat
        round
      />
    </q-item-section>
  </AppItem>
</template>

<script>
import { mapActions, mapGetters } from 'pinia'
import { useFilesStore } from '../store/index-pinia'

import text from 'src/utils/text'
import date from 'src/utils/date'
import { getApiHost } from 'src/api/helpers'

import { getShortName } from '../utils/common'
import { buildItemRouteFromContext } from '../utils/path'

import { SHARING_LEVELS } from '../enums'
import AppItem from 'src/components/common/AppItem'
import FileItemIcon from './icons/FileItemIcon'
import DownloadingProgress from './common/DownloadingProgress'
import EncryptedItemIcon from './icons/item/EncryptedItemIcon'
import LinkItemIcon from './icons/item/LinkItemIcon'
import FavoriteItemIcon from './icons/item/FavoriteItemIcon'
import SharedItemIcon from './icons/item/SharedItemIcon'
import ShareWithMeItemIcon from './icons/ShareWithMeItemIcon'

export default {
  name: 'FileItem',
  components: {
    ShareWithMeItemIcon,
    FileItemIcon,
    DownloadingProgress,
    EncryptedItemIcon,
    LinkItemIcon,
    FavoriteItemIcon,
    SharedItemIcon,
    AppItem
  },
  props: {
    file: { type: Object, default: null },
    isSelectMode: { type: Boolean, default: false },
    isCopied: { type: Boolean, default: false },
    selectItemHandler: { type: Function, default: null, require: true },
    openMenuHandler: { type: Function, default: null, require: true },
  },
  data() {
    return {
      isMoved: false,
    }
  },
  computed: {
    ...mapGetters(useFilesStore, [
      'copiedFiles',
      'isArchive',
      'currentStorage',
      'currentPathString',
      'isTrashStorage',
    ]),
    fileName() {
      let name = this.file.name
      // Path suffix is for Favorites (items from different folders). In Trash the
      // physical path is always /.trash and must not be shown in the list.
      if (
        !this.isTrashStorage &&
        this.currentPathString !== this.file.path &&
        this.file.path
      ) {
        name += ' (' + this.file.path + ')'
      }
      return getShortName(name, 30)
    },
    filePreview() {
      return this.file?.thumbnailUrl ? getApiHost() + (this.file?.thumbnailUrl) : ''
    },
    fileSize() {
      return text.getFriendlySize(this.file.size)
    },
    fileDate() {
      return date.getDate(this.file.lastModified)
    },
    isShared() {
      return !!this.file.shares.length || this.file.sharedWithMeAccess === SHARING_LEVELS.RESHARE
    },
  },
  methods: {
    ...mapActions(useFilesStore, [
      'changeCurrentHeader',
      'selectFile',
    ]),
    openFile() {
      if (
        !this.isSelectMode &&
        !this.isMoved &&
        !this.copiedFiles.length &&
        !this.file.downloading &&
        this.file.isArchive
      ) {
        // const path = {
        //   path: this.file.fullPath,
        //   name: this.file.name,
        // }
        this.changeCurrentHeader('')
      } else if (
        !this.isSelectMode &&
        !this.isMoved &&
        !this.copiedFiles.length &&
        !this.file.downloading &&
        !this.isArchive
      ) {
        if (!this.currentStorage?.Type) {
          return
        }
        this.selectFile(this.file)
        this.$router.push({
          path: buildItemRouteFromContext(this.currentStorage?.Type, this.file, {
            currentPathString: this.currentPathString,
            fileId: this.file.id,
          }),
        })
      } else {
        this.isMoved = false
      }
    },
    listItemClick(item) {
      if (this.isSelectMode) {
        this.selectItemHandler(item)
      } else {
        this.openFile()
      }
    },
    menuClick() {
      if (!this.isSelectMode && !this.isCopied) {
        this.openMenuHandler({
          file: this.file,
          component: 'FileMenuDialog',
        })
      }
    },
  },
}
</script>

<style lang="scss">
.file {
  // &__name {
  // }
  &__thumb {
    position: relative;
  }
  
  &__thumb-image {
    background-color: #eee;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    width: 32px;
    height: 32px;
  }
  &__thumb-share-icon {
    position: absolute;
    right: 6px;
    top: 0px;
  }

  &__info {
    display: flex;
    align-items: center;
  }
  &__info-icon_encrypted,
  &__info-icon_shared,
  &__info-icon_link,
  &__info-icon_favorite {
    fill: $secondary;
  }

  .list-item__selected &__info-icon_encrypted,
  .list-item__selected &__info-icon_shared,
  .list-item__selected &__info-icon_link,
  .list-item__selected &__info-icon_favorite {
    fill: #000;
  }
  // &__size,
  // &__separator,
  // &__date {
  // }
  &__separator {
    margin: -1px 4px 0;
  }
}
/* .button-enter-active {
  transition: opacity 0.5s ease;
}
.button-leave-active {
  transition: opacity 0.2s ease;
}

.button-enter-from,
.button-leave-to {
  opacity: 0;
} */


</style>
