<script setup>
import { ref, provide, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import CourseAttachment from "@/components/admin/CourseAttachment.vue";
import CourseDetailForm from "@/components/admin/CourseDetailForm.vue";
import CoursePlaylist from "@/components/admin/CoursePlaylist.vue";
import { getCourseOverview, approveCourse, rejectCourse, forceUnpublishCourse, restoreCourse, getAllCategories, getAllTags } from "@/api/admin/course";

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
      getAllTags(),
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
  <h2 class="section-heading">
    {{ props.viewtype === "apply" ? "課程申請詳情" : "課程狀態詳情" }}
  </h2>
  <div v-loading="loading" style="display: flex; flex-direction: column; gap: 50px">
    <CourseDetailForm />
    <CoursePlaylist />
    <CourseAttachment />
    <div class="operation-btns">
      <el-button @click="$router.go(-1)" size="large" type="info">
        <el-icon style="margin-right: 4px" size="large"><ArrowLeftBold /></el-icon>
        返回課程列表
      </el-button>
      <div class="operation-btns" v-if="props.viewtype === 'apply'">
        <el-button type="danger" size="large" @click="handleReject">審核拒絕</el-button>
        <el-button type="primary" size="large" @click="handleApprove">審核通過</el-button>
      </div>
      <div class="operation-btns" v-else>
        <el-button
          v-if="courseData?.status !== 'force_unpublish'"
          type="danger"
          size="large"
          @click="handleForceUnpublish"
        >
          強制下架
        </el-button>
        <el-button
          v-if="courseData?.status === 'force_unpublish'"
          type="primary"
          size="large"
          @click="handleRestore"
        >
          恢復上架
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.operation-btns {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24px;
}
</style>
