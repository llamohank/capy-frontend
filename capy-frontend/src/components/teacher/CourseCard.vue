<template>
  <el-card :body-style="{ padding: '0' }" shadow="hover" class="course-card">
    <!-- Cover Image -->
    <div class="course-cover">
      <el-image :src="course.coverImageUrl" fit="cover" class="cover-image">
        <template #error>
          <div class="image-placeholder">
            <span class="placeholder-icon">📚</span>
          </div>
        </template>
      </el-image>

      <!-- Wishlist Button -->
      <!-- <WishlistButton
        :is-wishlisted="course.isWishlisted"
        @toggle="toggleWishlist"
      /> -->
    </div>

    <!-- Course Info -->
    <!-- <CourseCardInfo :course="course" /> -->
    <div class="course-info">
      <!-- Title -->
      <h3 class="course-title">{{ course.title }}</h3>
      <p><el-tag>555</el-tag></p>
      <!-- Rating -->
      <div class="course-rating">
        <el-rate
          v-model="course.averageRating"
          disabled
          :show-score="Boolean(course.averageRating)"
        />

        <span class="rating-count">({{ formatCount(course.reviewCount) }})</span>
      </div>

      <!-- Price -->
      <div class="course-price">
        <span class="price">NT$ {{ formatPrice(course.price) }}</span>
      </div>
    </div>
  </el-card>
</template>

<script setup>
const props = defineProps({
  course: {
    type: Object,
    required: true,
  },
});
//評論人數
const formatCount = (count) => {
  if (count == null) {
    return "0";
  }

  const num = Number(count);
  if (Number.isNaN(num)) {
    return String(count);
  }

  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
};
//價格
const formatPrice = (price) => {
  if (price == null) {
    return "0";
  }
  return price.toLocaleString("zh-TW");
};
</script>

<style scoped>
.course-card {
  border-radius: var(--capy-radius-lg);
  overflow: hidden;
  transition: all var(--capy-transition-base);
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--capy-border-lighter);
}

.course-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--capy-shadow-lg);
  /* border-color: var(--capy-primary); */
}

.course-cover {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 aspect ratio */
  overflow: hidden;
  background: #f5f5f5;
}

.cover-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #a8d5ba 0%, #7ec8a3 100%);
}

.placeholder-icon {
  font-size: 48px;
}
.course-info {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  /* height: 100%; */
  height: fit-content;
}

.course-title {
  font-size: 16px;
  flex: 1;
  font-weight: 600;
  color: #2c3e50;
  /* margin: 0 0 12px 0; */
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  /* min-height: 44px; */
}

.course-rating {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  /* margin-bottom: 12px; */
}

.course-rating :deep(.el-rate) {
  height: auto;
}

.course-rating :deep(.el-rate__text) {
  font-size: 14px;
  font-weight: 600;
  color: var(--capy-warning);
}

.rating-count {
  font-size: 13px;
  color: #909399;
}

.price {
  font-size: 18px;
  font-weight: 700;
  color: var(--capy-primary);
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
