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
      >
        <template #error>
          <div class="image-placeholder">
            <span class="placeholder-icon">📚</span>
          </div>
        </template>
      </el-image>

      <!-- Wishlist Button -->
      <WishlistButton
        :is-wishlisted="course.isWishlisted"
        @toggle="toggleWishlist"
      />
    </div>

    <!-- Course Info -->
    <CourseInfo :course="course" @tag-click="handleTagClick" :hide-tags="false" />
  </el-card>
</template>

<script setup>
import { useRouter } from 'vue-router'
import WishlistButton from '../FilterDrawer/WishlistButton.vue'
import CourseInfo from './CourseInfo.vue'

const router = useRouter()

const props = defineProps({
  course: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['toggle-wishlist', 'tag-click'])

const toggleWishlist = () => {
  emit('toggle-wishlist', props.course.id)
}

const handleTagClick = (tag) => {
  emit('tag-click', tag)
}

const goToCourseDetail = () => {
  router.push(`/course/${props.course.id}`)
}
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
  border-color: var(--capy-primary);
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

</style>
