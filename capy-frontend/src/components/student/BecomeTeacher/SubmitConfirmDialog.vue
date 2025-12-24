<template>
  <el-dialog
    v-model="dialogVisible"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="640px"
    align-center
    class="submit-confirm-dialog"
  >
    <template #header>
      <div class="dialog-header">
        <el-icon class="warning-icon"><WarningFilled /></el-icon>
        <h3 class="dialog-title">確認送出</h3>
      </div>
    </template>

    <div class="dialog-content">
      <p class="content-text">確定要送出申請嗎？送出後銀行資訊將無法修改。</p>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button
          size="large"
          @click="handleCancel"
          class="cancel-button"
        >
          再檢查一次
        </el-button>
        <el-button
          type="warning"
          size="large"
          @click="handleConfirm"
          class="confirm-button"
        >
          確定送出
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { WarningFilled } from '@element-plus/icons-vue'

const dialogVisible = ref(false)

const emit = defineEmits(['confirm', 'cancel'])

const show = () => {
  dialogVisible.value = true
}

const hide = () => {
  dialogVisible.value = false
}

const handleConfirm = () => {
  emit('confirm')
  hide()
}

const handleCancel = () => {
  emit('cancel')
  hide()
}

defineExpose({
  show,
  hide
})
</script>

<style scoped>
.submit-confirm-dialog :deep(.el-dialog) {
  border-radius: 16px;
  padding: 0;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
}

.submit-confirm-dialog :deep(.el-dialog__header) {
  padding: 48px 40px 0 40px;
  margin: 0;
}

.submit-confirm-dialog :deep(.el-dialog__body) {
  padding: 28px 40px;
}

.submit-confirm-dialog :deep(.el-dialog__footer) {
  padding: 0 40px 36px 40px;
}

.dialog-header {
  display: flex;
  align-items: center;
  gap: 18px;
}

.warning-icon {
  font-size: 32px;
  color: #E6A23C;
  flex-shrink: 0;
}

.dialog-title {
  font-size: 22px;
  font-weight: 600;
  color: #303133;
  margin: 0;
  line-height: 1.4;
}

.dialog-content {
  padding: 0;
}

.content-text {
  font-size: 16px;
  line-height: 1.7;
  color: #606266;
  margin: 0;
}

.dialog-footer {
  display: flex;
  gap: 14px;
  justify-content: flex-end;
}

.cancel-button,
.confirm-button {
  padding: 14px 28px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  min-width: 120px;
  transition: all 0.3s ease;
}

.cancel-button {
  background-color: #FFFFFF;
  border: 1px solid #DCDFE6;
  color: #606266;
}

.cancel-button:hover {
  background-color: #F5F7FA;
  border-color: #C0C4CC;
  color: #303133;
}

.cancel-button:active {
  background-color: #EBEEF5;
}

.confirm-button {
  background-color: #E6A23C;
  border-color: #E6A23C;
  color: #FFFFFF;
  box-shadow: 0 2px 8px rgba(230, 162, 60, 0.3);
}

.confirm-button:hover {
  background-color: #eebe77;
  border-color: #eebe77;
  box-shadow: 0 4px 12px rgba(230, 162, 60, 0.4);
  transform: translateY(-1px);
}

.confirm-button:active {
  background-color: #b88230;
  border-color: #b88230;
  box-shadow: 0 2px 6px rgba(230, 162, 60, 0.3);
  transform: translateY(0);
}

/* 響應式設計 */
@media (max-width: 768px) {
  .submit-confirm-dialog :deep(.el-dialog) {
    width: calc(100vw - 32px) !important;
    max-width: 400px;
  }

  .submit-confirm-dialog :deep(.el-dialog__header) {
    padding: 32px 24px 0 24px;
  }

  .submit-confirm-dialog :deep(.el-dialog__body) {
    padding: 24px;
  }

  .submit-confirm-dialog :deep(.el-dialog__footer) {
    padding: 0 24px 24px 24px;
  }

  .dialog-title {
    font-size: 18px;
  }

  .content-text {
    font-size: 14px;
  }

  /* 保持水平並排 */
  .dialog-footer {
    flex-direction: row;
  }

  /* 按鈕平均分配寬度 */
  .cancel-button,
  .confirm-button {
    flex: 1;
    width: auto;
    padding: 12px; /* 稍微縮小內距以適應小螢幕 */
    font-size: 14px;
  }
}
</style>
