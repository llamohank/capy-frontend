<script setup>
import { useCourseStore } from "@/stores/course";
const courseStore = useCourseStore();

const formModel = ref(courseStore.courseInfo);

const formatPrice = (value) => {
  return `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
</script>
<template>
  <div class="wrapper">
    <h2 class="section-title">課程基本資訊</h2>
    <el-form
      scroll-to-error
      status-icon
      size="large"
      label-position="top"
      label-width="auto"
      :model="formModel"
    >
      <el-form-item label="課程名稱 :">
        <p tyle="overflow-wrap: break-word; line-height: 1.5">{{ formModel.title }}</p>
      </el-form-item>
      <el-form-item label="課程封面 :">
        <img
          style="max-width: 100%"
          v-show="formModel.coverImageUrl"
          :src="formModel.coverImageUrl"
        />
      </el-form-item>
      <el-form-item label="課程價格 :">
        <p>{{ formatPrice(formModel.price) }}</p>
      </el-form-item>
      <el-form-item prop="categories" label="課程分類 :">
        <el-tag
          class="course-category"
          size="large"
          effect="plain"
          v-for="item in courseStore.currentCourseCategory"
          :key="item.id"
        >
          {{ item.name }}
        </el-tag>
      </el-form-item>
      <el-form-item label="課程標籤 :">
        <div class="tag-container" v-if="courseStore.currentCourseTag?.length > 0">
          <el-tag
            class="course-tag"
            round
            size="large"
            :key="item.id"
            v-for="item in courseStore.currentCourseTag"
          >
            {{ item.name }}
          </el-tag>
        </div>
        <p v-else>尚無課程標籤</p>
      </el-form-item>
      <el-form-item prop="description" label="課程簡介 :">
        <p style="overflow-wrap: break-word; word-break: break-all; line-height: 1.5">
          {{ formModel.description }}
        </p>
      </el-form-item>
    </el-form>
  </div>
</template>
<style scoped>
:deep(.el-form-item__content) {
  padding-left: 12px;
  font-size: 16px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}
:deep(.el-form-item) {
  margin-bottom: 24px;
}
.course-tag {
  padding: 18px 24px;
  font-weight: 600;
  font-size: 14px;
}
.course-category {
  /* position: relative; */
  /* display: flex; */
  font-size: 16px;
  padding: 18px 24px;
  border-width: 2px;
  font-weight: 600;
}
.course-category + .course-category {
  margin-left: 8px;
}
/* .course-category + .course-category::before {
  content: "/";
  margin: 0 20px;
  position: absolute;
  left: -20%;
  margin-left: 8px;
} */
.tag-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
