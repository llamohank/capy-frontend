<script setup>
import { inject, computed } from "vue";
import { Picture } from "@element-plus/icons-vue";

const courseData = inject("courseData");
const allCategories = inject("allCategories");
const allTags = inject("allTags");

// 根據課程的 categories ID 找出分類名稱 (categories 是 [父類別id, 子類別id])
const categoryDisplay = computed(() => {
  const categoryIds = courseData.value?.categories || [];
  const categories = allCategories.value || [];

  if (categoryIds.length < 2 || categories.length === 0) return "-";

  const parentId = categoryIds[0];
  const childId = categoryIds[1];

  // 從樹狀結構中找出父類別和子類別名稱
  for (const parent of categories) {
    if (parent.id === parentId) {
      const child = parent.children?.find(c => c.id === childId);
      if (child) {
        return `${parent.name} > ${child.name}`;
      }
      return parent.name;
    }
  }
  return "-";
});

// 根據課程的 tagIds 找出標籤名稱
const tagsDisplay = computed(() => {
  const tagIds = courseData.value?.tagIds || [];
  const tags = allTags.value || [];

  if (tagIds.length === 0 || tags.length === 0) return [];

  // 建立 id -> tag 的映射
  const tagMap = {};
  tags.forEach(tag => {
    tagMap[tag.id] = tag.name;
  });

  return tagIds
    .map(id => tagMap[id])
    .filter(name => name);
});

const statusMap = {
  draft: "草稿",
  pending_review: "待審核",
  submitted_approved: "審核通過",
  submitted_rejected: "審核拒絕",
  transcoding: "轉碼中",
  transcoding_failed: "轉碼失敗",
  published: "已發布",
  force_unpublish: "強制下架",
};

const statusTagType = (status) => {
  const typeMap = {
    draft: "info",
    pending_review: "warning",
    submitted_approved: "success",
    submitted_rejected: "danger",
    transcoding: "warning",
    transcoding_failed: "danger",
    published: "success",
    force_unpublish: "danger",
  };
  return typeMap[status] || "info";
};

const formatPrice = (price) => {
  if (price === 0) return "免費";
  return `NT$ ${Number(price || 0).toLocaleString()}`;
};
</script>

<template>
  <div class="wrapper">
    <h2 class="section-title">課程基本資訊</h2>

    <div class="detail-layout">
      <!-- 封面圖片區塊 -->
      <div class="cover-section">
        <div class="cover-container">
          <img
            v-if="courseData?.coverImageUrl"
            class="cover-image"
            :src="courseData.coverImageUrl"
            alt="課程封面"
          />
          <div v-else class="cover-placeholder">
            <el-icon :size="40"><Picture /></el-icon>
            <span>尚未上傳封面</span>
          </div>
        </div>
        <!-- 狀態標籤放在封面下方 -->
        <div class="status-badge">
          <el-tag
            v-if="courseData?.status"
            :type="statusTagType(courseData.status)"
            size="large"
            effect="dark"
          >
            {{ statusMap[courseData.status] || courseData.status }}
          </el-tag>
        </div>
      </div>

      <!-- 資訊區塊 -->
      <div class="info-section">
        <!-- 課程標題 -->
        <h3 class="course-title">{{ courseData?.title || "未命名課程" }}</h3>

        <!-- 資訊網格 -->
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">課程價格</span>
            <span class="info-value price">{{ formatPrice(courseData?.price) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">課程分類</span>
            <span class="info-value">{{ categoryDisplay }}</span>
          </div>
        </div>

        <!-- 標籤 -->
        <div class="tags-section" v-if="tagsDisplay.length > 0">
          <span class="info-label">課程標籤</span>
          <div class="tags-list">
            <el-tag
              v-for="tag in tagsDisplay"
              :key="tag"
              size="default"
              effect="plain"
              class="tag-item"
            >
              {{ tag }}
            </el-tag>
          </div>
        </div>

        <!-- 課程簡介 -->
        <div class="description-section">
          <span class="info-label">課程簡介</span>
          <div class="description-content">
            {{ courseData?.description || "尚未填寫課程簡介" }}
          </div>
        </div>
      </div>
    </div>
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

.status-badge {
  display: flex;
  justify-content: center;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.course-title {
  font-size: 20px;
  font-weight: 600;
  color: #1F2937;
  margin: 0;
  line-height: 1.4;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--el-text-color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 14px;
  color: var(--el-text-color-primary);
  line-height: 1.5;
}

.info-value.price {
  font-size: 18px;
  font-weight: 600;
  color: #4F46E5;
}

.tags-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag-item {
  border-radius: 4px;
}

.description-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 4px;
}

.description-content {
  font-size: 14px;
  line-height: 1.7;
  color: var(--el-text-color-regular);
  white-space: pre-wrap;
  padding: 12px 14px;
  background-color: #F9FAFB;
  border-radius: 8px;
  border: 1px solid #F3F4F6;
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
