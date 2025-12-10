<template>
  <div class="ratings-reviews">
    <h2 class="section-title-student">Ratings & Reviews</h2>

    <!-- 評分總覽 -->
    <div class="rating-overview">
      <div class="rating-score">
        <div class="score-number">{{ averageRating }}</div>
        <el-rate
          :model-value="averageRating"
          disabled
          show-score
          text-color="#ff9900"
          score-template=""
        />
        <div class="total-reviews">{{ totalReviews }} reviews</div>
      </div>

      <div class="rating-bars">
        <div
          v-for="star in [5, 4, 3, 2, 1]"
          :key="star"
          class="rating-bar-item"
        >
          <span class="star-label">{{ star }}</span>
          <div class="progress-wrapper">
            <el-progress
              :percentage="getRatingPercentage(star)"
              :show-text="false"
              :stroke-width="8"
              color="#ff9900"
            />
          </div>
          <span class="percentage-label">{{ getRatingPercentage(star) }}%</span>
        </div>
      </div>
    </div>

    <!-- 評論列表 -->
    <div class="reviews-list">
      <div
        v-for="review in reviews"
        :key="review.id"
        class="review-item"
      >
        <div class="review-header">
          <el-avatar :size="40" :src="review.avatar" />
          <div class="reviewer-info">
            <h4 class="reviewer-name">{{ review.name }}</h4>
            <span class="review-date">{{ review.date }}</span>
          </div>
        </div>
        <el-rate
          :model-value="review.rating"
          disabled
          size="small"
          class="review-rating"
        />
        <p class="review-text">{{ review.text }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'

const props = defineProps({
  averageRating: {
    type: Number,
    required: true
  },
  totalReviews: {
    type: Number,
    required: true
  },
  ratingDistribution: {
    type: Object,
    required: true
  },
  reviews: {
    type: Array,
    required: true
  }
})

const getRatingPercentage = (star) => {
  const percentage = props.ratingDistribution[star] || 0
  console.log(`⭐ ${star} 星評分:`, percentage, '%')
  return percentage
}

onMounted(() => {
  console.log('📊 RatingsReviews 元件載入')
  console.log('平均評分:', props.averageRating)
  console.log('總評論數:', props.totalReviews)
  console.log('評分分佈:', props.ratingDistribution)
  console.log('評論列表:', props.reviews)
})
</script>

<style scoped>
.ratings-reviews {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
}

.section-title-student {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 24px 0;
}

.rating-overview {
  display: flex;
  gap: 48px;
  margin-bottom: 32px;
  padding-bottom: 32px;
  border-bottom: 1px solid #e8e8e8;
}

.rating-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.score-number {
  font-size: 48px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1;
}

.total-reviews {
  font-size: 14px;
  color: #666;
}

.rating-bars {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rating-bar-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.star-label {
  font-size: 14px;
  color: #666;
  min-width: 12px;
}

.progress-wrapper {
  flex: 1;
  min-width: 200px;
}

.progress-wrapper :deep(.el-progress) {
  width: 100%;
}

.progress-wrapper :deep(.el-progress-bar) {
  padding-right: 0;
}

.progress-wrapper :deep(.el-progress-bar__outer) {
  background-color: #f0f0f0;
}

.progress-wrapper :deep(.el-progress-bar__inner) {
  background-color: #ff9900;
}

.percentage-label {
  font-size: 14px;
  color: #666;
  min-width: 40px;
  text-align: right;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.review-item {
  padding-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;
}

.review-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.review-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.reviewer-info {
  flex: 1;
}

.reviewer-name {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 4px 0;
}

.review-date {
  font-size: 13px;
  color: #999;
}

.review-rating {
  margin-bottom: 12px;
}

.review-text {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 768px) {
  .rating-overview {
    flex-direction: column;
    gap: 24px;
  }
}
</style>
