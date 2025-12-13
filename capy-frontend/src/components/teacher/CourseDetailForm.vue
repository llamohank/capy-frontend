<script setup>
import TagPool from "./TagPool.vue";

import { useCourse } from "@/composable/useCourse";
import { useCreateCourse } from "@/composable/useCreateCourse";

const { categoryOptions, setCourseInfo, tagList, courseInfo, currentCourseId } = useCourse();
const { setDefaultCourseInfo, courseInfoRules, reset, validate, formRef } = useCreateCourse();

onMounted(() => {
  if (!currentCourseId.value) {
    setDefaultCourseInfo();
    formModel.value = { ...courseInfo.value };
    console.log("init form");
  }
});
const formModel = ref({ ...courseInfo.value });
const requestCourseData = computed(() => {
  return {
    ...formModel.value,
    id: formModel.value.courseId,
    // title: formModel.value.title,
    // description: formModel.value.description,
    categoryIds: formModel.value.categories,
    // tagIds: formModel.value.tagIds,
  };
});
const uploadRef = ref(null);
const uploadFile = ref(null);
// const previewUrl = ref(null);
const handleUploadExceed = (files) => {
  uploadRef.value.clearFiles();
  const file = files[0];
  uploadRef.value.handleStart(file);
};
const handleUploadRemove = () => {
  uploadRef.value.clearFiles();
  if (formModel.value.coverImageUrl) {
    URL.revokeObjectURL(formModel.value.coverImageUrl);
  }
  uploadFile.value = null;
  formModel.value.coverImageUrl = null;
};
const handleUploadChange = (file) => {
  if (!file) return;
  if (formModel.value.coverImageUrl) {
    URL.revokeObjectURL(formModel.value.coverImageUrl);
  }
  formModel.value.coverImageUrl = URL.createObjectURL(file.raw);
  // console.log(file.raw);
  uploadFile.value = file.raw;
};
const next = async () => {
  // formModel.value.coverImageUrl = previewUrl.value;
  try {
    await validate();
  } catch (e) {
    throw new Error("表單驗證失敗，請填寫必要欄位");
  }
  try {
    if (currentCourseId) {
      formModel.value.courseId = currentCourseId;
    }
    const fd = new FormData();

    fd.append(
      "course",
      new Blob([JSON.stringify(requestCourseData.value)], { type: "application/json" })
    );
    fd.append("cover", uploadFile.value);
    await setCourseInfo(fd);
  } catch (err) {
    throw err;
  }
};
defineExpose({
  next,
});
//tags
// const tagpoolRef = ref(null);
</script>
<template>
  <div class="wrapper">
    <h2 class="section-title">課程基本資訊</h2>
    <el-form
      scroll-to-error
      status-icon
      ref="formRef"
      :rules="courseInfoRules"
      size="large"
      label-position="top"
      label-width="auto"
      :model="formModel"
    >
      <el-form-item prop="title" label="課程名稱 :">
        <el-input
          placeholder="請輸入課程名稱(最多15字)"
          style="width: 80%; font-size: 16px"
          v-model="formModel.title"
        />
      </el-form-item>
      <el-form-item prop="coverImageUrl" label="課程封面 :">
        <img
          style="max-width: 100%"
          v-show="formModel.coverImageUrl"
          :src="formModel.coverImageUrl"
        />
        <el-upload
          style="width: 100%; margin-top: 24px"
          ref="uploadRef"
          class="upload-demo"
          :limit="1"
          :on-remove="handleUploadRemove"
          :on-exceed="handleUploadExceed"
          :on-change="handleUploadChange"
          :auto-upload="false"
        >
          <template #trigger>
            <el-button type="primary">選擇檔案</el-button>
          </template>
          <el-button type="info" @click="handleUploadRemove"> 清空 </el-button>

          <template #tip>
            <div class="el-upload__tip text-red">
              limit 1 file, new file will cover the old file
            </div>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item prop="price" label="課程價格 :">
        <el-input
          v-model="formModel.price"
          style="width: auto; font-size: 16px"
          placeholder="輸入課程價格"
          :formatter="(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
          :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
        />
      </el-form-item>
      <el-form-item prop="categories" label="課程分類 :">
        <el-cascader
          placeholder="選擇課程分類"
          style="width: 40%"
          v-model="formModel.categories"
          :options="categoryOptions"
        />
      </el-form-item>
      <el-form-item label="課程標籤 :">
        <div style="width: 80%">
          <TagPool v-model="formModel.tagIds" v-if="tagList.length > 0" :optionList="tagList" />
        </div>
      </el-form-item>
      <el-form-item prop="description" label="課程簡介 :">
        <el-input
          style="width: 80%"
          type="textarea"
          v-model="formModel.description"
          :rows="5"
          placeholder="輸入課程簡介(100到250字)"
        />
      </el-form-item>
    </el-form>
  </div>
</template>
<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #8c939d;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

:deep(.el-form-item__content) {
  padding-left: 12px;
  font-size: 16px;
}
:deep(.el-form-item__error) {
  margin-left: 12px;
  margin-bottom: 12px;
}
:deep(.el-form-item__label) {
  font-weight: 500;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}
:deep(.el-form-item) {
  margin-bottom: 24px;
}
</style>
