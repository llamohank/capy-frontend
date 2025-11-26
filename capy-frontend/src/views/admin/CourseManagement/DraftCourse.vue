<script setup>
// import DetailFormDrawer from "./component/DetailFormDrawer.vue";
// const tableData = [
//   {
//     id: 38,
//     cover_img: "https://picsum.photos/200",
//     name: "Java basic",
//     rate: 3,
//     price: "3360",
//   },
//   {
//     id: 42,
//     cover_img: "https://picsum.photos/200",
//     name: "Java expert",
//     rate: 4.5,
//     price: "3390",
//   },
// ];
// const showDrawer = ref(false);
// watch(
//   () => isEditDetail.value,
//   (val) => {
//     if (val) {
//       document.body.classList.add("no-scroll");
//     } else {
//       document.body.classList.remove("no-scroll");
//     }
//     // document.body.classList.toggle("no-scroll");
//     console.dir(document.body);
//   }
// );
// const handleOpen = (courseId) => {
//   console.log(courseId);
//   //TODO : 將courseid作為props傳入drawer 監聽drawer是否迦載好的emit 打開drawer 編輯課程詳情
//   showDrawer.value = true;
// };
</script>
<template>
  <div>
    <div>
      <!-- drawer -->
      <DetailFormDrawer v-model:isVisible="showDrawer"></DetailFormDrawer>

      <el-table row-class-name="tbodyy" table-layout="fixed" :data="tableData" style="width: 100%">
        <el-table-column label="封面">
          <template #default="scope">
            <div class="teacher_course_image">
              <img :src="scope.row.cover_img" alt="photo" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="說明">
          <template #default="scope">
            <div class="teacher_course_description">
              <div>
                <h2>{{ scope.row.name }}</h2>
                <!-- rate -->
                <el-rate v-model="scope.row.rate" disabled />
              </div>
              <!-- price -->
              <p>${{ scope.row.price }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <div class="operation">
              <p>課程狀態:上架中</p>
              <div>
                <el-tooltip content="編輯課程詳情" placement="bottom" effect="light">
                  <el-button @click="handleOpen(scope.row.id)" type="primary" round>
                    <el-icon><View /></el-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip content="編輯播放清單" placement="bottom" effect="light">
                  <el-button @click="handleOpen(scope.row.id)" type="success" round>
                    <el-icon><VideoCamera /></el-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip content="編輯課程附件" placement="bottom" effect="light">
                  <el-button @click="handleOpen(scope.row.id)" type="warning" round>
                    <el-icon><Link /></el-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip content="申請下架課程" placement="bottom" effect="light">
                  <el-button @click="handleOpen(scope.row.id)" type="danger" round>
                    <el-icon><Warning /></el-icon>
                  </el-button>
                </el-tooltip>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<style scoped>
.teacher_course_description {
  font-size: 20px;
  font-weight: 700;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 80px;
}
.teacher_course_image img {
  width: 200px;
  height: 200px;
  border-radius: 8px;
}
.operation {
  display: flex;
  flex-direction: column;
  gap: 80px;
}
.el-button {
  margin-bottom: 8px;
}
</style>
