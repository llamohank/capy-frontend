<template>
  <el-dialog
    v-model="dialogVisible"
    title="評價此課程"
    width="500px"
    :before-close="handleClose"
    class="rating-dialog"
  >
    <div class="dialog-content">
      <!-- Course Info -->
      <div v-if="courseInfo" class="course-info-section">
        <img :src="courseInfo.coverImageUrl" :alt="courseInfo.courseTitle" class="course-thumbnail" />
        <div class="course-details">
          <h4 class="course-title">{{ courseInfo.courseTitle }}</h4>
          <p class="course-instructor">{{ courseInfo.instructorName }}</p>
        </div>
      </div>

      <!-- Rating Stars -->
      <div class="rating-section">
        <label class="section-label">您的評分</label>
        <el-rate
          v-model="rating"
          :size="32"
          :colors="['#FFD700', '#FFD700', '#FFD700']"
          show-text
          :texts="['非常差', '差', '普通', '好', '非常好']"
          class="large-rate"
        />
      </div>

      <!-- Comment Textarea -->
      <div class="comment-section">
        <label class="section-label">分享您的學習體驗</label>
        <el-input
          v-model="comment"
          type="textarea"
          :rows="4"
          placeholder="請描述您的學習體驗、課程內容的優缺點等..."
          maxlength="500"
          show-word-limit
        />
      </div>

      <!-- Guidelines (Collapsible) -->
      <el-collapse v-model="activeGuidelines" class="guidelines-section">
        <el-collapse-item name="1">
          <template #title>
            <span class="guidelines-title">
              <el-icon><InfoFilled /></el-icon>
              評論指南
            </span>
          </template>
          <div class="guidelines-content">
            <ul>
              <li>請具體描述課程內容和您的學習體驗</li>
              <li>保持建設性和禮貌的態度</li>
              <li>避免使用不當或冒犯性語言</li>
              <li>分享對其他學習者有幫助的資訊</li>
            </ul>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>

    <!-- Dialog Actions -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose" size="large">取消</el-button>
        <el-button
          type="success"
          @click="handleSubmit"
          :loading="submitting"
          :disabled="!rating"
          size="large"
        >
          提交評論
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { InfoFilled } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  courseInfo: {
    type: Object,
    default: null
  },
  initialRating: {
    type: Number,
    default: 0
  },
  initialComment: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'review-submitted'])

// Dialog visibility
const dialogVisible = ref(props.modelValue)

// Form data
const rating = ref(props.initialRating)
const comment = ref(props.initialComment)
const submitting = ref(false)
const activeGuidelines = ref([])

// Watch for prop changes
watch(() => props.modelValue, (newVal) => {
  dialogVisible.value = newVal
  if (newVal) {
    // Reset or set initial values when dialog opens
    rating.value = props.initialRating
    comment.value = props.initialComment
  }
})

watch(dialogVisible, (newVal) => {
  emit('update:modelValue', newVal)
})

/**
 * Handle dialog close
 */
const handleClose = () => {
  dialogVisible.value = false
}

/**
 * Handle submit review
 */
const handleSubmit = async () => {
  if (!rating.value) {
    ElMessage.warning('請選擇評分')
    return
  }

  submitting.value = true

  try {
    // Emit event with review data - 父組件會處理 API 呼叫
    emit('review-submitted', {
      rating: rating.value,
      comment: comment.value
    })

    // Close dialog
    dialogVisible.value = false
  } catch (error) {
    console.error('提交評論失敗:', error)
    ElMessage.error('提交評論失敗，請稍後再試')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.rating-dialog :deep(.el-dialog__header) {
  padding: 20px 24px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.rating-dialog :deep(.el-dialog__title) {
  font-size: 20px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.rating-dialog :deep(.el-dialog__body) {
  padding: 24px;
}

.dialog-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Course Info Section */
.course-info-section {
  display: flex;
  gap: 16px;
  padding: 16px;
  background-color: var(--el-fill-color-light);
  border-radius: 8px;
}

.course-thumbnail {
  width: 120px;
  height: 68px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
}

.course-details {
  flex: 1;
  min-width: 0;
}

.course-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin: 0 0 8px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.course-instructor {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  margin: 0;
}

/* Rating Section */
.rating-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.large-rate {
  display: flex;
  align-items: center;
  gap: 12px;
}

.large-rate :deep(.el-rate__icon) {
  font-size: 32px;
}

.large-rate :deep(.el-rate__text) {
  font-size: 16px;
  font-weight: 500;
  color: var(--capy-primary);
}

/* Comment Section */
.comment-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.comment-section :deep(.el-textarea__inner) {
  font-size: 14px;
  line-height: 1.6;
}

/* Guidelines Section */
.guidelines-section {
  border: none;
}

.guidelines-section :deep(.el-collapse-item__header) {
  background-color: transparent;
  border: none;
  padding: 0;
  height: auto;
  line-height: 1.5;
}

.guidelines-section :deep(.el-collapse-item__wrap) {
  border: none;
  background-color: transparent;
}

.guidelines-section :deep(.el-collapse-item__content) {
  padding: 12px 0 0 0;
}

.guidelines-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.guidelines-title .el-icon {
  font-size: 16px;
}

.guidelines-content ul {
  margin: 0;
  padding-left: 20px;
}

.guidelines-content li {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  line-height: 1.8;
  margin-bottom: 4px;
}

/* Dialog Footer */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.dialog-footer .el-button {
  min-width: 100px;
}

/* Responsive */
@media (max-width: 768px) {
  .rating-dialog :deep(.el-dialog) {
    width: 90% !important;
  }

  .course-info-section {
    flex-direction: column;
  }

  .course-thumbnail {
    width: 100%;
    height: 120px;
  }

  .large-rate :deep(.el-rate__icon) {
    font-size: 28px;
  }
}
</style>
