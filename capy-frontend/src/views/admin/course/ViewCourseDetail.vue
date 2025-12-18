<script setup>
import { ref, provide, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import CourseAttachment from "@/components/admin/CourseAttachment.vue";
import CourseDetailForm from "@/components/admin/CourseDetailForm.vue";
import CoursePlaylist from "@/components/admin/CoursePlaylist.vue";
import { getCourseOverview, approveCourse, rejectCourse, forceUnpublishCourse, restoreCourse, getAllCategories } from "@/api/admin/course";
import { listAllTags } from "@/api/admin/tag";

const props = defineProps({
  viewtype: {
    type: String,
    default: null,
  },
});

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const courseData = ref(null);
const sectionsData = ref([]);
const attachmentsData = ref([]);
const allCategories = ref([]);
const allTags = ref([]);

// Provide data to child components
provide("courseData", courseData);
provide("sectionsData", sectionsData);
provide("attachmentsData", attachmentsData);
provide("allCategories", allCategories);
provide("allTags", allTags);

const fetchCourseOverview = async () => {
  const courseId = route.params.courseId;
  if (!courseId) return;

  try {
    loading.value = true;
    const [courseResult, categoriesResult, tagsResult] = await Promise.all([
      getCourseOverview(courseId),
      getAllCategories(),
      listAllTags(),
    ]);
    if (courseResult) {
      courseData.value = courseResult.course || null;
      sectionsData.value = courseResult.sections || [];
      attachmentsData.value = courseResult.attachments || [];
    }
    allCategories.value = categoriesResult || [];
    allTags.value = tagsResult || [];
  } catch (error) {
    console.error("Failed to fetch course overview:", error);
    ElMessage.error("取得課程資料失敗");
  } finally {
    loading.value = false;
  }
};

// 審核通過
const handleApprove = async () => {
  try {
    await ElMessageBox.confirm("確定要審核通過此課程嗎？", "審核通過", {
      confirmButtonText: "確認",
      cancelButtonText: "取消",
      type: "success",
      customClass: "audit-message-box",
    });

    const courseId = route.params.courseId;
    await approveCourse(courseId);
    ElMessage.success("審核通過成功");
    router.go(-1);
  } catch (error) {
    if (error !== "cancel") {
      console.error("Failed to approve course:", error);
      ElMessage.error("審核通過失敗");
    }
  }
};

// 審核拒絕
const handleReject = async () => {
  try {
    const { value: reason } = await ElMessageBox.prompt("請輸入拒絕原因", "審核拒絕", {
      confirmButtonText: "確認",
      cancelButtonText: "取消",
      type: "warning",
      inputType: "textarea",
      inputPlaceholder: "請輸入拒絕原因...",
      inputValidator: (value) => {
        if (!value || !value.trim()) {
          return "請輸入拒絕原因";
        }
        return true;
      },
      customClass: "audit-message-box",
    });

    const courseId = route.params.courseId;
    await rejectCourse(courseId, reason);
    ElMessage.success("審核拒絕成功");
    router.go(-1);
  } catch (error) {
    if (error !== "cancel") {
      console.error("Failed to reject course:", error);
      ElMessage.error("審核拒絕失敗");
    }
  }
};

// 強制下架
const handleForceUnpublish = async () => {
  try {
    const { value: reason } = await ElMessageBox.prompt("請輸入下架原因", "強制下架", {
      confirmButtonText: "確認",
      cancelButtonText: "取消",
      type: "warning",
      inputType: "textarea",
      inputPlaceholder: "請輸入下架原因...",
      inputValidator: (value) => {
        if (!value || !value.trim()) {
          return "請輸入下架原因";
        }
        return true;
      },
      customClass: "audit-message-box",
    });

    const courseId = route.params.courseId;
    await forceUnpublishCourse(courseId, reason);
    ElMessage.success("強制下架成功");
    router.go(-1);
  } catch (error) {
    if (error !== "cancel") {
      console.error("Failed to force unpublish course:", error);
      ElMessage.error("強制下架失敗");
    }
  }
};

// 恢復上架
const handleRestore = async () => {
  try {
    const { value: reason } = await ElMessageBox.prompt("請輸入恢復原因", "恢復上架", {
      confirmButtonText: "確認",
      cancelButtonText: "取消",
      type: "success",
      inputType: "textarea",
      inputPlaceholder: "請輸入恢復原因...",
      inputValidator: (value) => {
        if (!value || !value.trim()) {
          return "請輸入恢復原因";
        }
        return true;
      },
      customClass: "audit-message-box",
    });

    const courseId = route.params.courseId;
    await restoreCourse(courseId, reason);
    ElMessage.success("恢復上架成功");
    router.go(-1);
  } catch (error) {
    if (error !== "cancel") {
      console.error("Failed to restore course:", error);
      ElMessage.error("恢復上架失敗");
    }
  }
};

onMounted(() => {
  fetchCourseOverview();
});
</script>

<template>
  <div class="page-container">
    <header class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          {{ props.viewtype === "apply" ? "課程申請詳情" : "課程狀態詳情" }}
        </h1>
      </div>
      <div class="header-actions">
        <template v-if="props.viewtype === 'apply'">
          <el-button type="danger" @click="handleReject">
            <el-icon><CloseBold /></el-icon>
            審核拒絕
          </el-button>
          <el-button type="primary" @click="handleApprove">
            <el-icon><Select /></el-icon>
            審核通過
          </el-button>
        </template>
        <template v-else>
          <el-button
            v-if="courseData?.status !== 'force_unpublish'"
            type="danger"
            @click="handleForceUnpublish"
          >
            <el-icon><CircleClose /></el-icon>
            強制下架
          </el-button>
          <el-button
            v-if="courseData?.status === 'force_unpublish'"
            type="primary"
            @click="handleRestore"
          >
            <el-icon><RefreshRight /></el-icon>
            恢復上架
          </el-button>
        </template>
      </div>
    </header>

    <div v-loading="loading" class="content-sections">
      <CourseDetailForm />
      <CoursePlaylist />
      <CourseAttachment />
    </div>
  </div>
</template>

<style scoped>
.page-container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px 0;
  border-bottom: 1px solid #E5E7EB;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
}

.page-title {
  font-size: 22px;
  font-weight: 600;
  color: #1F2937;
  margin: 0;
  display: flex;
  align-items: center;
  letter-spacing: -0.025em;
  white-space: nowrap;
}

.page-title::before {
  content: "";
  display: block;
  width: 10px;
  height: 10px;
  background-color: #4F46E5;
  border-radius: 50%;
  margin-right: 12px;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
  flex-shrink: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.header-actions .el-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  font-weight: 500;
}

.content-sections {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

@media (max-width: 640px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-content {
    width: 100%;
    margin-bottom: 4px;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-end;
  }
  
  .header-actions .el-button {
    flex: 1;
    justify-content: center;
  }
}
</style>
