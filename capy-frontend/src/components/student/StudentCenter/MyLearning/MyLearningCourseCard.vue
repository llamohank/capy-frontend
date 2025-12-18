<template>
  <div class="course-card" @click="handleCardClick">
    <!-- Thumbnail -->
    <div class="course-thumbnail">
      <img :src="course.coverImageUrl" :alt="course.courseTitle" />
    </div>

    <!-- Course Info -->
    <div class="course-info">
      <!-- Title -->
      <h3 class="course-title">{{ course.courseTitle }}</h3>

      <!-- Instructor -->
      <p class="course-instructor">
        <span
          class="teacher-link"
          @click.stop="handleTeacherClick"
        >
          {{ course.instructorName }}
        </span>
      </p>

      <!-- Last Watched Info -->
      <p v-if="lastWatchedInfo" class="last-watched-info">
        <el-icon><VideoPlay /></el-icon>
        <span>{{ lastWatchedInfo }}</span>
      </p>

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
          :percentage="completionPercentage"
          :stroke-width="6"
          :status="completionPercentage === 100 ? 'success' : ''"
        />
        <span class="progress-text">{{ completionPercentage }}%</span>
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
import { useRouter } from 'vue-router'
import { Star, VideoPlay } from '@element-plus/icons-vue'

const router = useRouter()

const props = defineProps({
  course: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['open-rate-dialog', 'card-click'])

// Icons
const StarIcon = Star

/**
 * 完成百分比 - 使用後端欄位名稱
 */
const completionPercentage = computed(() => {
  return Math.round(props.course.completionPercentage || 0)
})

/**
 * 上次觀看資訊
 */
const lastWatchedInfo = computed(() => {
  const sectionTitle = props.course.lastWatchedSectionTitle
  const lessonTitle = props.course.lastWatchedLessonTitle

  if (!sectionTitle && !lessonTitle) {
    return null
  }

  if (sectionTitle && lessonTitle) {
    return `${sectionTitle} / ${lessonTitle}`
  }

  return lessonTitle || sectionTitle
})

/**
 * Check if course is already rated
 */
const isRated = computed(() => {
  return props.course.rating !== null && props.course.rating !== undefined
})

/**
 * Display rating value
 */
const displayRating = computed({
  get() {
    return props.course.rating || 0
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
  const percentage = completionPercentage.value
  if (percentage === 0) {
    return '開始上課'
  } else if (percentage === 100) {
    return '查看內容'
  } else {
    return '繼續學習'
  }
})

const ctaButtonType = computed(() => {
  const percentage = completionPercentage.value
  if (percentage === 100) {
    return 'success'
  }
  return 'primary'
})

const ctaButtonPlain = computed(() => {
  const percentage = completionPercentage.value
  return percentage === 0 || percentage === 100
})

/**
 * Handle rating star click
 */
const handleRatingClick = (value) => {
  if (!isRated.value && value > 0) {
    emit('open-rate-dialog', {
      course: props.course,
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
      course: props.course,
      initialRating: 0
    })
  }
}

/**
 * Handle CTA button click
 */
const handleCtaClick = () => {
  emit('card-click', props.course.courseId)
}

/**
 * Handle card click (navigate to course)
 */
const handleCardClick = () => {
  emit('card-click', props.course.courseId)
}

/**
 * Handle teacher name click
 */
const handleTeacherClick = () => {
  const instructorId = props.course.instructorId
  if (instructorId) {
    router.push(`/teacherdetail/${instructorId}`)
  }
}
</script>

<style lang="scss" scoped>
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

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  @include mobile {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  @include small-mobile {
    padding: 16px;
  }
}

/* Thumbnail */
.course-thumbnail {
  flex-shrink: 0;
  width: 220px;
  height: 124px;
  border-radius: var(--capy-radius-md);
  overflow: hidden;
  background: var(--el-fill-color-light);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @include mobile {
    width: 100%;
    height: 180px;
  }
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

  @include mobile {
    font-size: 16px;
  }

  @include small-mobile {
    font-size: 15px;
  }
}

.course-instructor {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  margin: 0;
}

.last-watched-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--capy-primary);
  margin: 4px 0 0 0;

  .el-icon {
    font-size: 14px;
  }

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.teacher-link {
  cursor: pointer;
  transition: color var(--capy-transition-fast);

  &:hover {
    color: var(--capy-primary);
    text-decoration: underline;
  }
}

/* Card Actions Section */
.card-actions {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-end;
  min-width: 180px;

  /* 968px 不是標準斷點，這裡使用自定義 media query */
  @media (max-width: 968px) {
    min-width: 150px;
  }

  @include mobile {
    min-width: auto;
    width: 100%;
    align-items: stretch;
    gap: 10px;
  }
}

/* Progress Section */
.progress-section {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;

  :deep(.el-progress) {
    flex: 1;
  }

  :deep(.el-progress__text) {
    display: none;
  }
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

  @include small-mobile {
    flex-wrap: wrap;
  }
}

.rating-stars {
  cursor: pointer;

  :deep(.el-rate__icon) {
    font-size: 18px;
    margin-right: 4px;
  }

  /* Unrated stars - gray void icons */
  :deep(.el-rate__icon.el-icon) {
    color: #C0C4CC;
  }

  /* Rated stars - yellow filled */
  :deep(.el-rate__icon.is-active) {
    color: #FFD700;
  }

  /* Hover effect for unrated stars */
  &:not(.is-disabled):hover :deep(.el-rate__icon) {
    transform: scale(1.1);
    transition: transform 0.2s ease;
  }
}

.rating-text {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  white-space: nowrap;

  &.clickable {
    color: var(--capy-primary);
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;

    &:hover {
      color: var(--capy-primary-dark);
      text-decoration: underline;
    }
  }
}
</style>
