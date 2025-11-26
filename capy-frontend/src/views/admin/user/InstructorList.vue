<script setup>
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
</script>
<template>
  <h2 class="section-heading">教師申請列表</h2>
  <div class="wrapper">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column>
        <div><el-avatar :size="50" src="https://picsum.photos/200" /></div>
      </el-table-column>
      <el-table-column prop="date" label="姓名" />
      <el-table-column prop="name" label="申請時間" />
      <el-table-column prop="name" label="是否為第一次申請" />
      <el-table-column prop="address" label="檢視">
        <el-button>查看詳情</el-button>
      </el-table-column>
    </el-table>
    <div class="pagination-btn">
      <el-pagination size="large" background layout="prev, pager, next" :total="100" />
    </div>
  </div>
</template>
<style scoped></style>
