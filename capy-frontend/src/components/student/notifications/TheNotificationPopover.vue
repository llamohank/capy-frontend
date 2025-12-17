<template>
  <el-popover
    v-model:visible="visible"
    placement="bottom-end"
    :width="360"
    trigger="click"
    popper-class="notification-popover"
  >
    <template #reference>
      <slot name="trigger">
        <el-button circle>
          <el-icon><Bell /></el-icon>
        </el-button>
      </slot>
    </template>

    <NotificationContent @close="visible = false" />
  </el-popover>
</template>

<script setup>
import { ref } from 'vue'
import { Bell } from '@element-plus/icons-vue'
import NotificationContent from './NotificationContent.vue'

const visible = ref(false)
</script>

<style>
.notification-popover.el-popper {
  padding: var(--capy-spacing-md) !important;
}
</style>