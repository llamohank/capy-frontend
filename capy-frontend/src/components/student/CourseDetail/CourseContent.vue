<template>
  <div class="course-content-wrapper">
    <!-- Course Header Section (只有麵包屑和標題) -->
    <div v-if="showHeader" class="course-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/explore' }">Courses</el-breadcrumb-item>
        <el-breadcrumb-item>{{ title }}</el-breadcrumb-item>
      </el-breadcrumb>

      <h1 class="course-title">{{ title }}</h1>
    </div>

    <!-- Course Content Section (可獨立移動) -->
    <div v-if="showContent" class="course-content">
      <h2 class="section-title-student">Course Content</h2>
    <el-collapse v-model="activeNames" accordion>
      <el-collapse-item
        v-for="(section, index) in sections"
        :key="index"
        :name="index"
      >
        <template #title>
          <div class="section-header">
            <span class="section-name">{{ section.name }}</span>
            <el-icon class="collapse-icon"><ArrowRight /></el-icon>
          </div>
        </template>
        <div class="section-content">
          <div
            v-for="(lesson, lessonIndex) in section.lessons"
            :key="lessonIndex"
            class="lesson-item"
            :class="{ 'clickable': isEnrolled || lesson.preview }"
            @click="handleLessonItemClick(lesson, index, lessonIndex)"
          >
            <span class="lesson-number">{{ lessonIndex + 1 }}.</span>
            <span class="lesson-title">{{ lesson.title }}</span>
            <span class="lesson-duration">{{ lesson.duration }}</span>
            <a
              v-if="!isEnrolled && lesson.preview"
              href="javascript:void(0)"
              class="preview-link"
              @click.stop="handlePreviewClick(lesson, index, lessonIndex)"
            >
              預覽
            </a>
          </div>
        </div>
      </el-collapse-item>
      </el-collapse>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  sections: {
    type: Array,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  showHeader: {
    type: Boolean,
    default: true
  },
  showContent: {
    type: Boolean,
    default: true
  },
  isEnrolled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['preview', 'lesson-click'])

const activeNames = ref([0])

/**
 * 處理課程項目點擊（整行點擊）
 */
const handleLessonItemClick = (lesson, sectionIndex, lessonIndex) => {
  // 如果用戶已購買，或者是免費試看課程，才允許點擊
  if (props.isEnrolled || lesson.preview) {
    emit('lesson-click', {
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      isFreePreview: lesson.preview,
      sectionIndex,
      lessonIndex
    })
  }
}

/**
 * 處理預覽按鈕點擊（僅訪客用戶顯示）
 */
const handlePreviewClick = (lesson, sectionIndex, lessonIndex) => {
  emit('preview', {
    lessonId: lesson.id,
    lessonTitle: lesson.title,
    sectionIndex,
    lessonIndex
  })
}
</script>

<style scoped>
.course-content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* Course Header Styles */
.course-header {
  color: black;
  padding: 40px 24px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 24px;
}

/* Course Content Styles */
.course-content {
  background: #fff;
  border-radius: 8px;
  padding: 0;
  margin-bottom: 24px;
}

.course-header :deep(.el-breadcrumb__inner) {
  color: black;
}

.course-header :deep(.el-breadcrumb__inner:hover) {
  color: black;
}

.course-header :deep(.el-breadcrumb__separator) {
  color: black;
}

.course-title {
  font-size: 36px;
  font-weight: 700;
  margin: 20px 0 0 0;
  line-height: 1.3;
}

.section-title-student {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 20px 0;
  padding: 24px 24px 0 24px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-weight: 600;
  font-size: 16px;
}

.section-name {
  flex: 1;
}

.collapse-icon {
  margin-left: 8px;
  transition: transform 0.3s;
}

.el-collapse-item.is-active .collapse-icon {
  transform: rotate(90deg);
}

.section-content {
  padding: 12px 24px;
}

.el-collapse {
  padding: 0 24px 24px 24px;
}

.lesson-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  gap: 12px;
  transition: background-color 0.2s ease;
}

.lesson-item:last-child {
  border-bottom: none;
}

/* 可點擊的課程項目 */
.lesson-item.clickable {
  cursor: pointer;
}

.lesson-item.clickable:hover {
  background-color: #f8f9fa;
}

.lesson-number {
  color: #666;
  font-size: 14px;
  min-width: 24px;
}

.lesson-title {
  flex: 1;
  color: #333;
  font-size: 14px;
}

.lesson-duration {
  color: #999;
  font-size: 13px;
  display: flex;
  align-items: center;
}

/* 預覽連結樣式 */
.preview-link {
  color: var(--capy-primary, #54CDF2);
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  padding: 6px 16px;
  border-radius: 4px;
  transition: all 0.3s ease;
  border: 1px solid var(--capy-primary, #54CDF2);
  background: transparent;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
}

.preview-link:hover {
  background: var(--capy-primary, #54CDF2);
  color: white;
  text-decoration: none;
}

:deep(.el-collapse) {
  border: none;
}

/* Responsive Design */
@media (max-width: 768px) {
  .course-header {
    padding: 24px 16px;
  }

  .course-title {
    font-size: 24px;
  }

  .course-description {
    font-size: 14px;
  }

  .section-title-student {
    padding: 24px 16px 0 16px;
  }

  .el-collapse {
    padding: 0 16px 24px 16px;
  }

  .section-content {
    padding: 12px 16px;
  }
}

:deep(.el-collapse-item__header) {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 8px;
  border: none;
  font-size: 16px;
}

:deep(.el-collapse-item__wrap) {
  border: none;
  background: transparent;
}

:deep(.el-collapse-item__content) {
  padding: 0;
}
</style>
