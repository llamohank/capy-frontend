<script setup>
import { useRouter } from "vue-router";

// useRouter
const router = useRouter();

const tableData = [
  {
    date: "2016-05-03",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-02",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-04",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-01",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
];
const viewCourseDetail = (courseId) => {
  router.push({
    name: "viewCourseDetail",
    params: {
      courseId,
    },
    query: {
      viewtype: "apply",
    },
  });
};
</script>
<template>
  <h2 class="section-heading">上架申請列表</h2>
  <div class="wrapper">
    <el-table size="large" :data="tableData" style="width: 100%">
      <el-table-column prop="date" label="課程名稱" width="180" />
      <el-table-column prop="date" label="分類" width="180" />
      <el-table-column prop="date" label="申請人" width="180" />
      <el-table-column prop="date" label="申請時間" width="180" />

      <el-table-column label="檢視"
        ><el-button @click="viewCourseDetail(1)">查看</el-button>
      </el-table-column>
    </el-table>
    <div class="pagination-btn">
      <el-pagination size="large" background layout="prev, pager, next" :total="100" />
    </div>
  </div>
</template>
<style scoped>
.pagination-btn {
  margin-top: 48px;
  display: flex;
  justify-content: flex-end;
}
</style>
