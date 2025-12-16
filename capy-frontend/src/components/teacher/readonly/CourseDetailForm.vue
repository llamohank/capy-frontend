<script setup>
import { useCourse } from "@/composable/useCourse";
import { useCourseStore } from "@/stores/course";
const courseStore = useCourseStore();
const { categoryOptions, setCourseInfo, tagList, courseInfo, currentCourseId } = useCourse();

// onMounted(() => {
//   if (!currentCourseId.value) {
//     setDefaultCourseInfo();
//     formModel.value = { ...courseInfo.value };
//     console.log("init form");
//   }
// });
const formModel = ref({ ...courseInfo.value });
console.log(courseStore.categoryList);
// console.log(courseStore.tagList);
console.log(courseStore.currentCourseCategory);
// const next = async () => {
//   // formModel.value.coverImageUrl = previewUrl.value;
//   try {
//     await validate();
//   } catch (e) {
//     throw new Error("表單驗證失敗，請填寫必要欄位");
//   }
//   try {
//     if (currentCourseId) {
//       formModel.value.courseId = currentCourseId;
//     }
//     const fd = new FormData();

//     fd.append(
//       "course",
//       new Blob([JSON.stringify(requestCourseData.value)], { type: "application/json" })
//     );
//     fd.append("cover", uploadFile.value);
//     await setCourseInfo(fd);
//   } catch (err) {
//     throw err;
//   }
// };
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
        <p>{{ formModel.title }}</p>
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
        <p>{{ formModel.description }}</p>
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
