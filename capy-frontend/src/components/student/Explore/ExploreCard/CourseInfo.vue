<template>
  <div class="course-info">
    <!-- Title -->
    <h3 class="course-title">{{ course.title }}</h3>

    <!-- Tags (Scrollable) -->
    <div class="course-tags" v-if="!hideTags && course.tags && course.tags.length > 0">
      <span
        v-for="tag in course.tags"
        :key="tag"
        class="tag-item"
        @click="handleTagClick(tag, $event)"
      >
        {{ tag }}
      </span>
    </div>

    <!-- Teacher -->
    <p class="course-teacher">
      <span
        class="teacher-link"
        @click="handleTeacherClick"
      >
        {{ course.instructorName || course.instructor_name || '未知' }} 老師
      </span>
    </p>

    <!-- Rating -->
    <div class="course-rating">
      <el-rate
        :model-value="parseFloat(course.averageRating || course.rating) || 0"
        disabled
        allow-half
        :max="5"
        :colors="['#E6A23C', '#E6A23C', '#E6A23C']"
        void-color="#d0d0d0"
        disabled-void-color="#d0d0d0"
      />
      <span class="rating-score">{{ (course.averageRating || course.rating) ? Number(course.averageRating || course.rating).toFixed(1) : '0.0' }}</span>
      <span class="rating-count">({{ formatCount(course.reviewCount || course.review_count) }})</span>
    </div>

    <!-- Price -->
    <div class="course-price">
      <span class="price">NT$ {{ formatPrice(course.price) }}</span>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  course: {
    type: Object,
    required: true
  },
  hideTags: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['tag-click'])

const formatCount = (count) => {
  if (count == null) {
    return '0'
  }

  const num = Number(count)
  if (Number.isNaN(num)) {
    return String(count)
  }

  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`
  }
  return num.toString()
}

const formatPrice = (price) => {
  if (price == null) {
    return '0'
  }
  return price.toLocaleString('zh-TW')
}

const handleTagClick = (tag, event) => {
  // 阻止事件冒泡，避免觸發卡片的點擊事件
  event.stopPropagation()
  emit('tag-click', tag)
}

const handleTeacherClick = (event) => {
  // 阻止事件冒泡，避免觸發卡片的點擊事件
  event.stopPropagation()

  const instructorId = props.course.instructorId || props.course.instructor_id
  if (instructorId) {
    router.push(`/teacherdetail/${instructorId}`)
  }
}
</script>


<style lang="scss" scoped>
.course-info {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 防止內容溢出撐開寬度 */

  @include mobile {
    padding: 14px;
  }
}

.course-title {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 var(--capy-spacing-sm) 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 48px; /* 2 lines * 24px (16px * 1.5) */
  max-height: 48px;

  @include mobile {
    font-size: 15px;
  }
}

.course-tags {
  display: flex;
  flex-wrap: nowrap; /* 不換行 */
  gap: 6px;
  margin-bottom: var(--capy-spacing-sm);
  overflow-x: auto; /* 允許橫向捲動 */
  -webkit-overflow-scrolling: touch; /* iOS 滑動順暢 */
  scrollbar-width: none; /* Firefox 隱藏捲軸 */
  margin-right: -16px; /* 抵消父層 padding，讓標籤可以滑到邊緣 */
  padding-right: 16px; /* 補回 padding，確保最後一個標籤有空間 */
  
  /* Chrome, Safari, Edge 隱藏捲軸 */
  &::-webkit-scrollbar {
    display: none;
  }

  @include mobile {
    margin-right: -14px;
    padding-right: 14px;
  }
}

.tag-item {
  display: inline-block;
  padding: 3px 10px;
  background: rgba(84, 205, 242, 0.1);
  color: var(--capy-primary);
  font-size: var(--capy-font-size-xs);
  font-weight: var(--capy-font-weight-semibold);
  border-radius: 12px;
  border: 1px solid rgba(84, 205, 242, 0.2);
  cursor: pointer;
  transition: all var(--capy-transition-fast);
  white-space: nowrap; /* 確保標籤內容不換行 */
  flex-shrink: 0; /* 防止標籤被壓縮 */

  &:hover {
    background: rgba(84, 205, 242, 0.15);
    border-color: var(--capy-primary);
    transform: translateY(-1px);
  }
}

.course-teacher {
  font-size: 13px;
  color: var(--capy-text-primary);
  font-weight: 500;
  margin: 0 0 12px 0;
}

.teacher-link {
  cursor: pointer;
  transition: color var(--capy-transition-fast);

  &:hover {
    color: var(--capy-primary);
    text-decoration: underline;
  }
}

.course-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;

  :deep(.el-rate) {
    height: auto;
  }

  /* 只對已填滿的星星設定橘色 */
  :deep(.el-rate__icon.is-active) {
    color: var(--capy-warning);
  }

  /* 空星星使用灰色 */
  :deep(.el-rate__icon:not(.is-active)) {
    color: #d0d0d0;
  }
}

.rating-score {
  font-size: 14px;
  font-weight: 600;
  color: var(--capy-warning);
  margin-left: 4px;
}

.rating-count {
  font-size: 13px;
  color: var(--capy-text-secondary);

  &::after {
    content: '則評價';
  }
}

.course-price {
  display: flex;
  align-items: center;
  margin-top: auto;
  padding-top: 8px;
  justify-content: flex-start;

  @include mobile {
    justify-content: space-between;
  }
}

.price {
  font-size: var(--capy-font-size-xl);
  font-weight: 700;
  color: var(--capy-danger);
  letter-spacing: 0.5px;

  @include mobile {
    font-size: 16px;
    font-weight: 600;
    color: var(--capy-text-primary); /* 手機版使用深色文字，視覺上更穩重 */
  }
}
</style>
