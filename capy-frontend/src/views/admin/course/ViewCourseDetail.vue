<script setup>
import CourseAttachment from "@/components/admin/CourseAttachment.vue";
import CourseDetailForm from "@/components/admin/CourseDetailForm.vue";
import CoursePlaylist from "@/components/admin/CoursePlaylist.vue";
const props = defineProps({
  viewtype: {
    type: String,
    default: null,
  },
});
</script>
<template>
  <h2 class="section-heading">
    {{ props.viewtype === "apply" ? "課程申請詳情" : "課程狀態詳情" }}
  </h2>
  <div style="display: flex; flex-direction: column; gap: 50px">
    <CourseDetailForm />
    <CoursePlaylist />
    <CourseAttachment />
    <div class="operation-btns">
      <el-button size="large" type="info"
        ><el-icon style="margin-right: 4px" size="large"><ArrowLeftBold /></el-icon
        >返回課程列表</el-button
      >
      <div v-if="props.viewtype === 'apply'">
        <el-button type="danger" size="large">審核拒絕</el-button>
        <el-button type="primary" size="large">審核通過</el-button>
      </div>
      <div v-else>
        <!-- 用pinia 的課程狀態判斷 -->
        <el-button type="danger" size="large">強制下架</el-button>
        <el-button type="primary" size="large">恢復上架</el-button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.operation-btns {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}
</style>
