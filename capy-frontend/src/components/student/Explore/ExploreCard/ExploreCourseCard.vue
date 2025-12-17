<template>
  <el-card
    :body-style="{ padding: '0' }"
    shadow="hover"
    class="course-card"
    @click="goToCourseDetail"
  >
    <!-- Cover Image -->
    <div class="course-cover">
      <el-image
        :src="course.coverImageUrl"
        fit="cover"
        class="cover-image"
        loading="lazy"
      >
        <template #error>
          <div class="image-placeholder">
            <span class="placeholder-icon">📚</span>
          </div>
        </template>
      </el-image>

      <!-- Wishlist Button -->
      <WishlistButton
        :is-wishlisted="isWishlisted"
        @toggle="toggleWishlist"
      />

      <!-- Enrolled Badge (右下角) -->
      <div v-if="course.isEnrolled" class="enrolled-badge-corner">
        已購買
      </div>
    </div>

    <!-- Course Info -->
    <CourseInfo :course="course" @tag-click="handleTagClick" :hide-tags="false" />
  </el-card>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useWishlistStore } from '@/stores/wishlist'
import WishlistButton from '../FilterDrawer/WishlistButton.vue'
import CourseInfo from './CourseInfo.vue'

const router = useRouter()
const wishlistStore = useWishlistStore()

const props = defineProps({
  course: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['toggle-wishlist', 'tag-click'])

/**
 * 判斷課程是否在願望清單中
 * 優先使用後端提供的 isWishlisted，如果沒有則使用 wishlistStore 判斷
 * computed 會自動追蹤 wishlistStore.items 的變化，無需額外 watch
 */
const isWishlisted = computed(() => {
  // 如果後端有提供 isWishlisted 欄位，優先使用（適用於 WishlistPage）
  if (props.course.isWishlisted !== undefined) {
    return props.course.isWishlisted
  }
  // 否則使用 wishlistStore 判斷（實現跨頁面同步，適用於 ExplorePage）
  // computed 會自動追蹤 wishlistStore.items 的變化並重新計算
  return wishlistStore.hasItem(props.course.id)
})

const toggleWishlist = () => {
  emit('toggle-wishlist', props.course.id)
}

const handleTagClick = (tag) => {
  emit('tag-click', tag)
}

const goToCourseDetail = () => {
  router.push(`/courses/${props.course.id}`)
}
</script>

<style lang="scss" scoped>
/* 由於 vite.config.js 已配置自動引入，這裡可以直接使用 mixins 和 variables */

.course-card {
  border-radius: var(--capy-radius-lg);
  overflow: hidden;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s ease, border-color 0.3s ease;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--capy-border-lighter);

  &:hover {
    transform: scale(1.01);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
    border-color: var(--capy-primary);
  }
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
  object-fit: cover;
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
  font-size: $font-3xl; /* 48px */
}

/* Enrolled Badge - 右下角 */
.enrolled-badge-corner {
  position: absolute;
  bottom: 12px;
  right: 12px;
  padding: 6px 14px;
  background: linear-gradient(135deg, #54CDF2 0%, #0EA5E9 100%);
  color: #fff;
  font-size: $font-xs;
  font-weight: 600;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(84, 205, 242, 0.3);
  letter-spacing: 0.5px;
  z-index: 2;
}
</style>
