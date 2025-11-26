<script setup>
const chapteroptions = ref([
  {
    value: "Option1",
    label: "Option1",
  },
  {
    value: "Option2",
    label: "Option2",
  },
  {
    value: "Option3",
    label: "Option3",
  },
  {
    value: "Option4",
    label: "Option4",
  },
  {
    value: "Option5",
    label: "Option5",
  },
]);
const currentchapter = ref(null);
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
const deleteAttachment = async () => {
  try {
    await ElMessageBox.confirm("是否確認刪除此文件?", "提示", {
      confirmButtonText: "確認",
      cancelButtonText: "取消",
      type: "warning",
      center: true,
    });
    ElMessage({
      type: "success",
      message: "Delete completed",
    });
  } catch (error) {
    ElMessage({
      type: "info",
      message: "Delete canceled",
    });
  }
};
</script>
<template>
  <div class="wrapper">
    <h2 class="section-title">課程附件一覽</h2>
    <el-select
      v-model="currentchapter"
      placeholder="選擇章節"
      style="width: 240px; margin-bottom: 12px"
    >
      <el-option
        v-for="item in chapteroptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="date" label="所屬章節" width="180" />
      <el-table-column prop="name" label="所屬單元" width="180" />
      <el-table-column prop="address" label="文件名稱" />
      <el-table-column label="操作">
        <template #default>
          <div style="display: flex; flex-wrap: wrap; gap: 8px">
            <el-button type="primary">下載</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<style scoped></style>
