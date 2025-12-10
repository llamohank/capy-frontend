<template>
  <div class="course-info">
    <!-- Title -->
    <h3 class="course-title">{{ course.title }}</h3>

    <!-- Tags (below title) - Limited to 3 tags -->
    <div class="course-tags" v-if="!hideTags && course.tags && course.tags.length > 0">
      <span
        v-for="tag in visibleTags"
        :key="tag"
        class="tag-item"
        @click="handleTagClick(tag, $event)"
      >
        {{ tag }}
      </span>
      <span v-if="remainingTagsCount > 0" class="tag-more">
        +{{ remainingTagsCount }}
      </span>
    </div>

    <!-- Teacher -->
    <p class="course-teacher">{{ course.instructorName || course.instructor_name || '未知' }} 老師</p>

    <!-- Rating -->
    <div class="course-rating">
      <el-rate
        :model-value="parseFloat(course.averageRating) || 0"
        disabled
        allow-half
        :max="5"
        :colors="['#E6A23C', '#E6A23C', '#E6A23C']"
        void-color="#d0d0d0"
        disabled-void-color="#d0d0d0"
      />
      <span class="rating-score">{{ course.averageRating ? Number(course.averageRating).toFixed(1) : '0.0' }}</span>
      <span class="rating-count">({{ formatCount(course.reviewCount) }})</span>
    </div>

    <!-- Price -->
    <div class="course-price">
      <span class="price">NT$ {{ formatPrice(course.price) }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  course: {
    type: Object,
    required: true
  },
  hideTags: {
    type: Boolean,
    default: false
  },
  maxTags: {
    type: Number,
    default: 3
  }
})

const emit = defineEmits(['tag-click'])

// 限制顯示的標籤數量
const visibleTags = computed(() => {
  if (!props.course.tags || props.course.tags.length === 0) {
    return []
  }
  return props.course.tags.slice(0, props.maxTags)
})

// 計算剩餘標籤數量
const remainingTagsCount = computed(() => {
  if (!props.course.tags || props.course.tags.length <= props.maxTags) {
    return 0
  }
  return props.course.tags.length - props.maxTags
})

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
</script>


<style scoped>
.course-info {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
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
}

.course-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: var(--capy-spacing-sm);
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
}

.tag-item:hover {
  background: rgba(84, 205, 242, 0.15);
  border-color: var(--capy-primary);
  transform: translateY(-1px);
}

.tag-more {
  display: inline-block;
  padding: 3px 10px;
  background: rgba(144, 147, 153, 0.1);
  color: var(--capy-text-secondary);
  font-size: var(--capy-font-size-xs);
  font-weight: var(--capy-font-weight-semibold);
  border-radius: 12px;
  border: 1px solid rgba(144, 147, 153, 0.2);
  cursor: default;
}

.course-teacher {
  font-size: 13px;
  color: var(--capy-text-primary);
  font-weight: 500;
  margin: 0 0 12px 0;
}

.course-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.course-rating :deep(.el-rate) {
  height: auto;
}

.rating-score {
  font-size: 14px;
  font-weight: 600;
  color: var(--capy-warning);
  margin-left: 4px;
}

/* 只對已填滿的星星設定橘色 */
.course-rating :deep(.el-rate__icon.is-active) {
  color: var(--capy-warning);
}

/* 空星星使用灰色 */
.course-rating :deep(.el-rate__icon:not(.is-active)) {
  color: #d0d0d0;
}

.rating-count {
  font-size: 13px;
  color: var(--capy-text-secondary);
}

.rating-count::before {
  content: '';
}

.rating-count::after {
  content: '則評價';
}

.course-price {
  display: flex;
  align-items: center;
  margin-top: auto;
  padding-top: 8px;
}

.price {
  font-size: var(--capy-font-size-xl);
  font-weight: 700;
  color: var(--capy-danger);
  letter-spacing: 0.5px;
}

/* RWD */
@media (max-width: 768px) {
  .course-title {
    font-size: 15px;
  }

  .course-info {
    padding: 14px;
  }
}
</style>
