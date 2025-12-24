<template>
  <div class="rating-options">
    <div
      v-for="rating in computedRatingOptions"
      :key="rating.value"
      class="rating-option"
      :class="{ active: localRating === rating.value }"
      @click="handleRatingChange(rating.value)"
    >
      <div class="rating-content">
        <el-rate
          :model-value="rating.value"
          disabled
          size="small"
        />
        <span class="rating-label">
          <span class="rating-value">{{ Number.isInteger(rating.value) ? rating.value + '.0' : rating.value }}</span>
          <span class="rating-up"> & up</span>
        </span>
        <span class="rating-count">({{ rating.count }})</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  // 接收後端回傳的評分數量
  rateQuantities: {
    type: Object,
    default: () => ({
      oneStarQuantity: 0,
      twoStarQuantity: 0,
      threeStarQuantity: 0,
      fourStarQuantity: 0,
      fiveStarQuantity: 0
    })
  }
})

const emit = defineEmits(['update:modelValue'])

const localRating = ref(props.modelValue)

// 計算評分選項（使用後端數據或預設值）
const computedRatingOptions = computed(() => {
  const q = props.rateQuantities || {}
  return [
    { value: 4.5, count: q.fiveStarQuantity ?? 0 },
    { value: 4, count: q.fourStarQuantity ?? 0 },
    { value: 3, count: q.threeStarQuantity ?? 0 },
    { value: 2, count: q.twoStarQuantity ?? 0 },
    { value: 1, count: q.oneStarQuantity ?? 0 }
  ]
})

// Rating 改變處理
const handleRatingChange = (value) => {
  localRating.value = value
  emit('update:modelValue', value)
}

// 監聽 props 變化同步到內部狀態
watch(() => props.modelValue, (newVal) => {
  localRating.value = newVal
})
</script>

<style scoped>
.rating-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rating-option {
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.rating-option:hover {
  background: #f5f5f5;
}

.rating-option.active {
  background: #f0f9f4;
  border-color: #7ec8a3;
}

.rating-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 星星樣式 - 縮小尺寸 */
.rating-option :deep(.el-rate) {
  height: auto;
}

.rating-option :deep(.el-rate__icon) {
  font-size: 16px;
  margin-right: 2px;
}

/* 評分標籤 */
.rating-label {
  display: flex;
  align-items: center;
  font-size: 14px;
  margin-left: 4px;
}

.rating-value {
  color: #303133;
  font-weight: 500;
}

.rating-up {
  color: #909399;
  margin-left: 2px;
}

/* 課程數量 */
.rating-count {
  color: #909399;
  font-size: 13px;
  margin-left: 4px;
}

/* 選中狀態 */
.rating-option.active .rating-value {
  color: #7ec8a3;
  font-weight: 600;
}

.rating-option.active .rating-up {
  color: #7ec8a3;
}

.rating-option.active .rating-count {
  color: #7ec8a3;
  font-weight: 500;
}
</style>