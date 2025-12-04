<template>
  <div class="course-card" @click="handleCardClick">
    <!-- Thumbnail -->
    <div class="course-thumbnail">
      <img :src="enrollment.course.cover_image_url" :alt="enrollment.course.title" />
    </div>

    <!-- Course Info -->
    <div class="course-info">
      <!-- Title -->
      <h3 class="course-title">{{ enrollment.course.title }}</h3>

      <!-- Instructor -->
      <p class="course-instructor">{{ enrollment.course.instructor_name }}</p>

      <!-- Rating Section -->
      <div class="rating-section" @click.stop>
        <el-rate
          v-model="displayRating"
          :disabled="isRated"
          :void-icon="StarIcon"
          :colors="ratingColors"
          @change="handleRatingClick"
          class="rating-stars"
        />
        <span
          class="rating-text"
          :class="{ 'clickable': !isRated }"
          @click="handleRatingTextClick"
        >
          {{ ratingText }}
        </span>
      </div>
    </div>

    <!-- Card Actions (Progress + CTA Button) -->
    <div class="card-actions">
      <!-- Progress Bar -->
      <div class="progress-section">
        <el-progress
          :percentage="enrollment.completion_percentage"
          :stroke-width="6"
          :status="enrollment.completion_percentage === 100 ? 'success' : ''"
        />
        <span class="progress-text">{{ enrollment.completion_percentage }}%</span>
      </div>

      <!-- CTA Button -->
      <el-button
        :type="ctaButtonType"
        :plain="ctaButtonPlain"
        class="cta-button"
        @click.stop="handleCtaClick"
      >
        {{ ctaButtonText }}
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Star } from '@element-plus/icons-vue'

const props = defineProps({
  enrollment: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['open-rate-dialog', 'card-click'])

// Icons
const StarIcon = Star

/**
 * Check if course is already rated
 */
const isRated = computed(() => {
  return !!props.enrollment.my_review
})

/**
 * Display rating value
 */
const displayRating = computed({
  get() {
    return props.enrollment.my_review?.rating || 0
  },
  set(value) {
    // This will be handled by handleRatingClick
  }
})

/**
 * Rating text
 */
const ratingText = computed(() => {
  if (isRated.value) {
    return '您的評分'
  }
  return '前往評價'
})

/**
 * Rating colors
 */
const ratingColors = computed(() => {
  return ['#FFD700', '#FFD700', '#FFD700']
})

/**
 * CTA Button Configuration
 */
const ctaButtonText = computed(() => {
  const percentage = props.enrollment.completion_percentage
  if (percentage === 0) {
    return '開始上課'
  } else if (percentage === 100) {
    return '查看內容'
  } else {
    return '繼續學習'
  }
})

const ctaButtonType = computed(() => {
  const percentage = props.enrollment.completion_percentage
  if (percentage === 100) {
    return 'success'
  }
  return 'primary'
})

const ctaButtonPlain = computed(() => {
  const percentage = props.enrollment.completion_percentage
  return percentage === 0 || percentage === 100
})

/**
 * Handle rating star click
 */
const handleRatingClick = (value) => {
  if (!isRated.value && value > 0) {
    emit('open-rate-dialog', {
      enrollment: props.enrollment,
      initialRating: value
    })
  }
}

/**
 * Handle rating text click (for unrated courses)
 */
const handleRatingTextClick = () => {
  if (!isRated.value) {
    emit('open-rate-dialog', {
      enrollment: props.enrollment,
      initialRating: 0
    })
  }
}

/**
 * Handle CTA button click
 */
const handleCtaClick = () => {
  emit('card-click', props.enrollment.course.id)
}

/**
 * Handle card click (navigate to course)
 */
const handleCardClick = () => {
  emit('card-click', props.enrollment.course.id)
}
</script>

<style scoped>
.course-card {
  display: flex;
  align-items: center;
  gap: 20px;
  background: white;
  border-radius: var(--capy-radius-lg);
  padding: 20px;
  box-shadow: var(--capy-shadow-sm);
  transition: all 0.3s ease;
  cursor: pointer;
}

.course-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

/* Thumbnail */
.course-thumbnail {
  flex-shrink: 0;
  width: 220px;
  height: 124px;
  border-radius: var(--capy-radius-md);
  overflow: hidden;
  background: var(--el-fill-color-light);
}

.course-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Course Info */
.course-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}

.course-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin: 0;
  line-height: 1.4;
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

/* Card Actions Section */
.card-actions {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-end;
  min-width: 180px;
}

/* Progress Section */
.progress-section {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.progress-section :deep(.el-progress) {
  flex: 1;
}

.progress-section :deep(.el-progress__text) {
  display: none;
}

.progress-text {
  font-size: 14px;
  font-weight: 600;
  color: var(--capy-primary);
  min-width: 45px;
  text-align: right;
}

/* CTA Button */
.cta-button {
  width: 100%;
  font-weight: 500;
  border-radius: var(--capy-radius-md);
}

/* Rating Section */
.rating-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 4px;
}

.rating-stars {
  cursor: pointer;
}

.rating-stars :deep(.el-rate__icon) {
  font-size: 18px;
  margin-right: 4px;
}

/* Unrated stars - gray void icons */
.rating-stars :deep(.el-rate__icon.el-icon) {
  color: #C0C4CC;
}

/* Rated stars - yellow filled */
.rating-stars :deep(.el-rate__icon.is-active) {
  color: #FFD700;
}

/* Hover effect for unrated stars */
.rating-stars:not(.is-disabled):hover :deep(.el-rate__icon) {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}

.rating-text {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  white-space: nowrap;
}

.rating-text.clickable {
  color: var(--capy-primary);
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.rating-text.clickable:hover {
  color: var(--capy-primary-dark);
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 968px) {
  .card-actions {
    min-width: 150px;
  }
}

@media (max-width: 768px) {
  .course-card {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .course-thumbnail {
    width: 100%;
    height: 180px;
  }

  .course-title {
    font-size: 16px;
  }

  .card-actions {
    min-width: auto;
    width: 100%;
    align-items: stretch;
  }

  .cta-button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .course-card {
    padding: 16px;
  }

  .course-title {
    font-size: 15px;
  }

  .rating-section {
    flex-wrap: wrap;
  }

  .card-actions {
    gap: 10px;
  }
}
</style>
