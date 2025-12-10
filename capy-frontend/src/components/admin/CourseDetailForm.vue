<script setup>
import { inject, computed } from "vue";

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
    <el-form size="large" label-position="top">
      <el-form-item label="課程名稱 :">
        {{ courseData?.title || "-" }}
      </el-form-item>
      <el-form-item label="課程封面 :">
        <img
          v-if="courseData?.coverImageUrl"
          style="max-width: 300px; border-radius: 8px"
          :src="courseData.coverImageUrl"
        />
        <span v-else>-</span>
      </el-form-item>
      <el-form-item label="課程價格 :">
        {{ formatPrice(courseData?.price) }}
      </el-form-item>
      <el-form-item label="課程分類 :">
        {{ categoryDisplay }}
      </el-form-item>
      <el-form-item label="課程標籤 :">
        <div v-if="tagsDisplay.length > 0" class="tags-container">
          <el-tag v-for="tag in tagsDisplay" :key="tag" size="default" style="margin-right: 8px; margin-bottom: 4px;">
            {{ tag }}
          </el-tag>
        </div>
        <span v-else>-</span>
      </el-form-item>
      <el-form-item label="課程狀態 :">
        <el-tag v-if="courseData?.status" :type="statusTagType(courseData.status)" size="large">
          {{ statusMap[courseData.status] || courseData.status }}
        </el-tag>
        <span v-else>-</span>
      </el-form-item>
      <el-form-item label="課程簡介 :">
        <p style="white-space: pre-wrap">{{ courseData?.description || "-" }}</p>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
:deep(.el-form-item__content) {
  padding-left: 12px;
}
:deep(.el-form-item__label) {
  font-weight: 500;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}
:deep(.el-form-item) {
  margin-bottom: 12px;
}
.tags-container {
  display: flex;
  flex-wrap: wrap;
}
</style>
