<script setup>
import CommentDetailDialog from "./CommentDetailDialog.vue";
const queryForm = ref({});
const isVisible = ref(false);
const currentComment = ref({
  questionid: 1,
  answerId: 2,
});
const open = () => {
  isVisible.value = true;
};
</script>
<template>
  <div>
    <CommentDetailDialog v-model:isVisible="isVisible" :detail="currentComment" />
    <h2 class="section-heading">課程留言</h2>
    <div>
      <el-select
        size="large"
        v-model="value"
        placeholder="全部課程"
        style="width: 240px; margin-right: 24px"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select size="large" v-model="value" placeholder="顯示全部" style="width: 240px">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <ul class="comment-list">
      <li class="comment-list-item" @click="open">
        <el-tag type="info" color="#fff" round size="large">未回覆</el-tag>
        <div>
          <el-avatar
            :size="60"
            src="https://picsum.photos/200
"
          />
        </div>
        <div class="comment-text">
          <p style="font-weight: 500; font-size: 18px">somebody</p>
          <p>老師上的好棒喔</p>
          <div style="font-size: 14px; font-weight: 400">
            <p style="margin-bottom: 8px">來自: Java零基礎入門 - 1-1 認識Java中的資料型別</p>
            <span>1個月前</span>
          </div>
        </div>
      </li>
      <li class="comment-list-item">
        <el-tag type="primary" color="#fff" round size="large">未回覆</el-tag>
        <div>
          <el-avatar
            :size="60"
            src="https://picsum.photos/200
"
          />
        </div>
        <div class="comment-text">
          <p style="font-weight: 500; font-size: 18px">somebody</p>
          <p>23:02的部分聽不懂...</p>
          <div style="font-size: 14px">
            <p style="margin-bottom: 8px">來自: Java零基礎入門 - 1-1 認識Java中的資料型別</p>
            <span>1個月前</span>
          </div>
        </div>
      </li>
    </ul>
    <p class="end-text">已經到底了</p>
  </div>
</template>
<style scoped>
.comment-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 48px;
}
.comment-list-item {
  padding: 12px 20px;
  display: flex;
  gap: 20px;
  border-radius: 8px;
  position: relative;
  background-color: #fcfcfd;
  border-left: 5px solid rgb(216, 230, 237);
  /* transition:; */
}
.el-tag {
  position: absolute;
  top: 8%;
  right: 2%;
  border-width: 2px;
}
.comment-text {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.comment-list-item:hover {
  cursor: pointer;
}
.end-text {
  margin-top: 12px;
  text-align: center;
  color: rgb(153, 173, 183);
}
</style>
