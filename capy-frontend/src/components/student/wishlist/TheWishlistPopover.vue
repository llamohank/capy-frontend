<template>
  <el-popover
    v-model:visible="visible"
    placement="bottom"
    :width="300"
    trigger="click"
    popper-class="wishlist-popover"
  >
    <template #reference>
      <slot name="trigger">
        <el-button circle>
          <el-icon><Star /></el-icon>
        </el-button>
      </slot>
    </template>

    <WishlistContent @close="visible = false" />
  </el-popover>
</template>

<script setup>
import { ref } from 'vue'
import { Star } from '@element-plus/icons-vue'
import WishlistContent from './WishlistContent.vue'

const visible = ref(false)
</script>

<style>
.wishlist-popover.el-popper {
  padding: var(--capy-spacing-md) !important;
}
</style>