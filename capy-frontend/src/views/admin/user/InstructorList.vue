<script setup>
import useIndex from "@/utils/useIndex";
const tableData = ref([
  {
    application_id: 1,
    application_time: "2025-10-31",
    avatar_url: "https://picsum.photos/200",
    username: "emily",
    isFirsttime: true,
  },
  {
    application_id: 1,
    application_time: "2025-10-31",
    avatar_url: "https://picsum.photos/200",
    username: "emily",
    isFirsttime: false,
  },
]);
const data = computed(() => useIndex(tableData.value));
</script>
<template>
  <h2 class="section-heading">教師申請列表</h2>
  <div class="wrapper">
    <el-table
      stripe
      :row-class-name="() => 'table-row'"
      :cell-class-name="() => 'tbody-cell'"
      :header-cell-class-name="() => 'table-head'"
      size="large"
      :data="data"
      style="width: 100%"
    >
      <el-table-column label="序號" width="80">
        <template #default="{ row }">
          <span class="index"><span style="margin-right: 8px">#</span>{{ row.index }}</span>
        </template>
      </el-table-column>

      <el-table-column label="申請者" width="300">
        <template #default="{ row }">
          <div style="display: flex; gap: 28px; align-items: center; padding: 8px 0">
            <div style="display: flex; align-items: center">
              <el-avatar :size="50" :src="row.avatar_url" />
            </div>

            <p style="font-weight: 500">{{ row.username }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="申請時間">
        <template #default="{ row }">
          <span style="font-style: italic; font-weight: 500">{{ row.application_time }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="是否為第一次申請">
        <template #default="{ row }">
          <span style="font-size: 20px" :class="{ 'highlight-record': !row.isFirsttime }">{{
            row.isFirsttime ? "是" : "否"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="檢視">
        <el-button
          @click="$router.push({ name: 'instructor_detail', params: { instructorId: 1 } })"
          type="primary"
          link
          >查看詳情</el-button
        >
      </el-table-column>
    </el-table>
    <div class="pagination-btn">
      <el-pagination size="large" background layout="prev, pager, next" :total="100" />
    </div>
  </div>
</template>
<style scoped>
:deep(.tbody-cell .cell) {
  display: flex;
  justify-content: center;
}

:deep(.table-head .cell) {
  font-size: 18px;
  text-align: center;
  padding: 4px 0 28px 0;
}
.index {
  font-style: italic;
  font-weight: 500;
  font-size: 24px;
  color: #909399;
  opacity: 0.3;
  transition: opacity 0.2s;
}
.table-row:hover .index {
  opacity: 1;
}
.highlight-record {
  color: #409eff;
  font-weight: 500;
}
</style>
