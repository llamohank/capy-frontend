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
  <h2 class="section-heading">用戶狀態管理</h2>
  <div class="wrapper">
    <el-table size="large" :data="tableData" style="width: 100%">
      <el-table-column width="350" label="用戶資訊">
        <div style="display: flex; gap: 36px">
          <div>
            <el-avatar :size="50" src="https://picsum.photos/200 " />
          </div>

          <div>
            <h3 style="margin-bottom: 12px; font-weight: 500">Emily Chen</h3>
            <p>example@gmail.com</p>
          </div>
        </div>
      </el-table-column>
      <el-table-column prop="date" label="身分" />
      <el-table-column prop="name" label="狀態" />
      <el-table-column prop="name" label="最後更新時間" />
    </el-table>
    <div class="pagination-btn">
      <el-pagination size="large" background layout="prev, pager, next" :total="100" />
    </div>
  </div>
</template>
<style scoped></style>
