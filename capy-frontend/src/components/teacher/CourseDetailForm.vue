<script setup>
import { Picture } from "@element-plus/icons-vue";
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
    categoryIds: formModel.value.categories,
  };
});
const uploadRef = ref(null);
const uploadFile = ref(null);

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
  uploadFile.value = file.raw;
};
const next = async () => {
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
</script>

<template>
  <div class="wrapper">
    <h2 class="section-title">課程基本資訊</h2>

    <el-form
      ref="formRef"
      :model="formModel"
      :rules="courseInfoRules"
      label-position="top"
      scroll-to-error
      status-icon
    >
      <div class="detail-layout">
        <!-- 封面圖片區塊 -->
        <div class="cover-section">
          <div class="form-label">課程封面</div>
          <div class="cover-container">
            <img
              v-if="formModel.coverImageUrl"
              class="cover-image"
              :src="formModel.coverImageUrl"
              alt="課程封面"
            />
            <div v-else class="cover-placeholder">
              <el-icon :size="40"><Picture /></el-icon>
              <span>尚未上傳封面</span>
            </div>
          </div>
          <el-form-item prop="coverImageUrl" class="upload-form-item">
            <el-upload
              ref="uploadRef"
              class="cover-upload"
              :limit="1"
              :on-remove="handleUploadRemove"
              :on-exceed="handleUploadExceed"
              :on-change="handleUploadChange"
              :auto-upload="false"
              :show-file-list="false"
            >
              <template #trigger>
                <el-button type="primary" size="default">選擇圖片</el-button>
              </template>
              <el-button type="info" size="default" @click.stop="handleUploadRemove">清空</el-button>
            </el-upload>
            <div class="upload-tip">建議尺寸 16:9，支援 JPG、PNG 格式</div>
          </el-form-item>
        </div>

        <!-- 資訊區塊 -->
        <div class="info-section">
          <!-- 課程標題 -->
          <el-form-item prop="title" class="form-item-styled">
            <template #label>
              <span class="form-label">課程名稱</span>
            </template>
            <el-input
              v-model="formModel.title"
              placeholder="請輸入課程名稱（最多15字）"
              maxlength="15"
              show-word-limit
            />
          </el-form-item>

          <!-- 資訊網格 -->
          <div class="info-grid">
            <el-form-item prop="price" class="form-item-styled">
              <template #label>
                <span class="form-label">課程價格</span>
              </template>
              <el-input
                v-model="formModel.price"
                placeholder="輸入課程價格"
                :formatter="(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
              />
            </el-form-item>
            <el-form-item prop="categories" class="form-item-styled">
              <template #label>
                <span class="form-label">課程分類</span>
              </template>
              <el-cascader
                v-model="formModel.categories"
                :options="categoryOptions"
                placeholder="選擇課程分類"
                style="width: 100%"
              />
            </el-form-item>
          </div>

          <!-- 標籤 -->
          <div class="tags-section">
            <span class="form-label">課程標籤</span>
            <div class="tags-input">
              <TagPool v-model="formModel.tagIds" v-if="tagList.length > 0" :optionList="tagList" />
              <span v-else class="no-tags">載入標籤中...</span>
            </div>
          </div>

          <!-- 課程簡介 -->
          <el-form-item prop="description" class="form-item-styled">
            <template #label>
              <span class="form-label">課程簡介</span>
            </template>
            <el-input
              v-model="formModel.description"
              type="textarea"
              :rows="5"
              placeholder="輸入課程簡介（100到250字）"
              maxlength="250"
              show-word-limit
            />
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>

<style scoped>
.detail-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 28px;
}

.cover-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cover-container {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 10px;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--el-text-color-placeholder);
  font-size: 13px;
}

.upload-form-item {
  margin-bottom: 0;
}

.cover-upload {
  display: flex;
  gap: 8px;
}

.upload-tip {
  font-size: 12px;
  color: var(--el-text-color-placeholder);
  margin-top: 8px;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--el-text-color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.form-item-styled {
  margin-bottom: 0;
}

.form-item-styled :deep(.el-form-item__label) {
  padding-bottom: 0;
}

.form-item-styled :deep(.el-input__wrapper),
.form-item-styled :deep(.el-textarea__inner) {
  border-radius: 8px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.tags-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tags-input {
  padding: 12px 14px;
  background-color: #F9FAFB;
  border-radius: 8px;
  border: 1px solid #F3F4F6;
  min-height: 48px;
}

.no-tags {
  color: var(--el-text-color-placeholder);
  font-size: 13px;
}

@media (max-width: 640px) {
  .detail-layout {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .cover-container {
    max-width: 280px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
