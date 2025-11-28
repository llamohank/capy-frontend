<template>
  <div class="apply-teacher">
    <h1>申請成為教師</h1>
    <div class="apply-form">
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="name">姓名 *</label>
          <input 
            type="text" 
            id="name" 
            v-model="formData.name" 
            required 
            placeholder="請輸入您的姓名"
          />
        </div>

        <div class="form-group">
          <label for="email">電子郵件 *</label>
          <input 
            type="email" 
            id="email" 
            v-model="formData.email" 
            required 
            placeholder="請輸入您的電子郵件"
          />
        </div>

        <div class="form-group">
          <label for="phone">聯絡電話 *</label>
          <input 
            type="tel" 
            id="phone" 
            v-model="formData.phone" 
            required 
            placeholder="請輸入您的聯絡電話"
          />
        </div>

        <div class="form-group">
          <label for="expertise">專業領域 *</label>
          <input 
            type="text" 
            id="expertise" 
            v-model="formData.expertise" 
            required 
            placeholder="例如：程式設計、數據分析等"
          />
        </div>

        <div class="form-group">
          <label for="experience">教學經驗 *</label>
          <textarea 
            id="experience" 
            v-model="formData.experience" 
            required 
            rows="5"
            placeholder="請描述您的教學經驗"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="introduction">自我介紹 *</label>
          <textarea 
            id="introduction" 
            v-model="formData.introduction" 
            required 
            rows="5"
            placeholder="請簡單介紹您自己"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="resume">履歷上傳</label>
          <input 
            type="file" 
            id="resume" 
            @change="handleFileUpload"
            accept=".pdf,.doc,.docx"
          />
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-submit">提交申請</button>
          <button type="button" class="btn-cancel" @click="handleCancel">取消</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const formData = ref({
  name: '',
  email: '',
  phone: '',
  expertise: '',
  experience: '',
  introduction: '',
  resume: null
})

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    formData.value.resume = file
    console.log('上傳文件:', file.name)
  }
}

const handleSubmit = () => {
  // 處理表單提交
  console.log('提交申請:', formData.value)
  alert('申請已提交！我們會盡快與您聯繫。')
  // 可以在這裡添加 API 調用
}

const handleCancel = () => {
  router.back()
}
</script>

<style scoped>
.apply-teacher {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

.apply-form {
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #007bff;
}

.form-group textarea {
  resize: vertical;
  font-family: inherit;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 30px;
}

.btn-submit,
.btn-cancel {
  padding: 12px 30px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-submit {
  background: #007bff;
  color: white;
}

.btn-submit:hover {
  background: #0056b3;
}

.btn-cancel {
  background: #6c757d;
  color: white;
}

.btn-cancel:hover {
  background: #5a6268;
}
</style>