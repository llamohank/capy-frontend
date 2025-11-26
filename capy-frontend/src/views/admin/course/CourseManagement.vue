<script setup>
import { useRouter } from "vue-router";
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
    params: { courseId },
  });
};
</script>
<template>
  <h2 class="section-heading">課程狀態管理</h2>
  <div class="wrapper">
    <el-table size="large" :data="tableData" style="width: 100%">
      <el-table-column prop="date" label="課程名稱" width="180" />
      <el-table-column prop="name" label="講師" width="180" />
      <el-table-column prop="date" label="分類" width="180" />
      <el-table-column prop="date" label="狀態" width="180" />
      <el-table-column prop="date" label="上架日期" width="180" />
      <el-table-column label="操作">
        <el-button @click="viewCourseDetail(1)">查看詳情</el-button></el-table-column
      >
    </el-table>
    <div class="pagination-btn">
      <el-pagination size="large" background layout="prev, pager, next" :total="100" />
    </div>
  </div>
</template>
<style scoped></style>
