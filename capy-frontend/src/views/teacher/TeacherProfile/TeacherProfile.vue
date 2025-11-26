<script setup>
const formModel = ref({
  name: "",
  description: "",
  account_code: "",
  account_number: "",
});
</script>
<template>
  <h2 class="section-heading">教師個人詳情</h2>
  <div class="wrapper">
    <div class="profile-wrapper">
      <div
        style="
          display: flex;
          justify-content: center;
          flex-direction: column;
          align-items: center;
          gap: 24px;
        "
      >
        <el-avatar :size="180" circle src="https://picsum.photos/200" />
        <p style="font-weight: 500">mack</p>
      </div>
      <el-row :gutter="12">
        <el-col :span="6"
          ><div class="card-wrapper"><span class="data-text">4.8</span>總評分</div></el-col
        >
        <el-col :span="6"
          ><div class="card-wrapper"><span class="data-text">1200</span>學生總數</div></el-col
        >
        <el-col :span="6"
          ><div class="card-wrapper"><span class="data-text">5</span>課堂總數</div></el-col
        >
        <el-col :span="6"
          ><div class="card-wrapper"><span class="data-text">350</span>則評價</div></el-col
        >
      </el-row>
      <el-form :model="formModel" label-position="top">
        <el-form-item>
          <template #label> <span class="form-label">教師名 :</span> </template>
          <el-input style="width: auto" v-model="formModel.name" />
        </el-form-item>
        <el-form-item>
          <template #label> <span class="form-label">教師簡介 :</span> </template>
          <el-input v-model="formModel.description" type="textarea" :rows="5" />
        </el-form-item>
        <el-form-item>
          <template #label> <span class="form-label">銀行帳號 :</span> </template>
          <div style="display: flex; align-items: center; gap: 12px">
            <el-input v-model="formModel.account_code" style="width: 100px" /><el-icon
              ><Minus /></el-icon
            ><el-input v-model="formModel.account_number" />
          </div>
        </el-form-item>
        <el-form-item>
          <div
            style="width: 100%; display: flex; justify-content: center; gap: 24px; margin-top: 36px"
          >
            <el-button size="large" type="info">取消</el-button>
            <el-button size="large" type="primary">保存更新</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<style scoped>
/* :deep(div.el-col) { */
/* background-color: pink; */
/* border: 1px solid #d1d9e1;
  border-radius: 16px; */
/* height: auto !important; */
/* } */
.el-row {
  /* height: 88px; */
  height: auto;
}
.profile-wrapper {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 48px;
}
.card-wrapper {
  border: 1px solid #d1d9e1;
  border-radius: 16px;
  padding: 24px;
  /* height: 100%; */
  text-align: center;
  /* font-size: 18px; */
  color: #667f99;
}
.form-label {
  font-size: 18px;
}
.data-text {
  display: block;
  font-size: 32px;
  font-weight: 700;
  color: #409eff;
  margin-bottom: 8px;
  /* color: #667F99; */
}
</style>
