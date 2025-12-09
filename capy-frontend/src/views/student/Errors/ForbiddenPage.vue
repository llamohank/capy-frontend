<template>
  <div class="forbidden-page">
    <div class="forbidden-container">
      <!-- 403 水豚插圖 -->
      <div class="capybara-illustration">
        <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
          <!-- 背景閘門/柵欄 -->
          <g class="gate">
            <!-- 閘門柱子 -->
            <rect x="80" y="120" width="20" height="120" fill="#54CDF2" opacity="0.3" rx="4"/>
            <rect x="300" y="120" width="20" height="120" fill="#54CDF2" opacity="0.3" rx="4"/>

            <!-- 閘門橫條 -->
            <rect x="80" y="140" width="240" height="15" fill="#54CDF2" opacity="0.4" rx="4"/>
            <rect x="80" y="170" width="240" height="15" fill="#54CDF2" opacity="0.4" rx="4"/>
            <rect x="80" y="200" width="240" height="15" fill="#54CDF2" opacity="0.4" rx="4"/>

            <!-- 閘門頂部 -->
            <rect x="70" y="110" width="260" height="20" fill="#54CDF2" opacity="0.5" rx="6"/>
          </g>

          <!-- 水豚身體 -->
          <g class="capybara-body">
            <!-- 身體主體 -->
            <ellipse cx="200" cy="200" rx="60" ry="50" fill="#A1887F"/>

            <!-- 肚子 -->
            <ellipse cx="200" cy="210" rx="45" ry="35" fill="#BCAAA4"/>

            <!-- 腿 -->
            <ellipse cx="175" cy="235" rx="15" ry="20" fill="#8D6E63"/>
            <ellipse cx="225" cy="235" rx="15" ry="20" fill="#8D6E63"/>

            <!-- 腳掌 -->
            <ellipse cx="175" cy="250" rx="12" ry="8" fill="#6D4C41"/>
            <ellipse cx="225" cy="250" rx="12" ry="8" fill="#6D4C41"/>
          </g>

          <!-- 水豚頭部 -->
          <g class="capybara-head">
            <!-- 頭部 -->
            <ellipse cx="200" cy="160" rx="45" ry="40" fill="#A1887F"/>

            <!-- 耳朵 -->
            <ellipse cx="175" cy="140" rx="12" ry="18" fill="#8D6E63"/>
            <ellipse cx="225" cy="140" rx="12" ry="18" fill="#8D6E63"/>

            <!-- 耳朵內部 -->
            <ellipse cx="175" cy="145" rx="6" ry="10" fill="#BCAAA4"/>
            <ellipse cx="225" cy="145" rx="6" ry="10" fill="#BCAAA4"/>

            <!-- 鼻子 -->
            <ellipse cx="200" cy="165" rx="8" ry="6" fill="#6D4C41"/>

            <!-- 眼睛 (嚴肅表情) -->
            <ellipse cx="185" cy="155" rx="5" ry="6" fill="#3E2723"/>
            <ellipse cx="215" cy="155" rx="5" ry="6" fill="#3E2723"/>

            <!-- 眉毛 (嚴肅) -->
            <line x1="178" y1="150" x2="192" y2="152" stroke="#3E2723" stroke-width="2" stroke-linecap="round"/>
            <line x1="208" y1="152" x2="222" y2="150" stroke="#3E2723" stroke-width="2" stroke-linecap="round"/>
          </g>

          <!-- 保安帽 -->
          <g class="security-cap">
            <!-- 帽子主體 -->
            <ellipse cx="200" cy="130" rx="35" ry="12" fill="#54CDF2"/>
            <rect x="165" y="120" width="70" height="15" fill="#54CDF2" rx="3"/>

            <!-- 帽簷 -->
            <ellipse cx="200" cy="135" rx="40" ry="8" fill="#3FA9D4"/>

            <!-- 帽徽 -->
            <circle cx="200" cy="127" r="8" fill="#FB8C00"/>
            <text x="200" y="131" text-anchor="middle" font-size="10" font-weight="bold" fill="white">S</text>
          </g>

          <!-- 停止手勢 (左手) -->
          <g class="hand-gesture">
            <!-- 手臂 -->
            <rect x="140" y="180" width="15" height="35" fill="#A1887F" rx="7"/>

            <!-- 手掌 -->
            <ellipse cx="147" cy="175" rx="18" ry="22" fill="#BCAAA4"/>

            <!-- 手指 -->
            <rect x="135" y="160" width="5" height="18" fill="#BCAAA4" rx="2"/>
            <rect x="142" y="155" width="5" height="22" fill="#BCAAA4" rx="2"/>
            <rect x="149" y="157" width="5" height="20" fill="#BCAAA4" rx="2"/>
            <rect x="156" y="160" width="5" height="17" fill="#BCAAA4" rx="2"/>
          </g>

          <!-- STOP 標誌 (右手拿著) -->
          <g class="stop-sign">
            <!-- 標誌桿 -->
            <rect x="248" y="190" width="6" height="50" fill="#8D6E63" rx="3"/>

            <!-- 八角形標誌 -->
            <g transform="translate(251, 170)">
              <polygon points="15,0 25,0 35,10 35,20 25,30 15,30 5,20 5,10" fill="#FB8C00"/>
              <polygon points="16,2 24,2 32,10 32,20 24,28 16,28 8,20 8,10" fill="#FF9800"/>

              <!-- STOP 文字 -->
              <text x="20" y="20" text-anchor="middle" font-size="8" font-weight="bold" fill="white">STOP</text>
            </g>
          </g>

          <!-- 警告線條裝飾 -->
          <g class="warning-stripes" opacity="0.3">
            <rect x="50" y="260" width="300" height="8" fill="url(#warningGradient)"/>
          </g>

          <!-- 漸層定義 -->
          <defs>
            <linearGradient id="warningGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#FB8C00;stop-opacity:1" />
              <stop offset="25%" style="stop-color:#FFB74D;stop-opacity:1" />
              <stop offset="50%" style="stop-color:#FB8C00;stop-opacity:1" />
              <stop offset="75%" style="stop-color:#FFB74D;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#FB8C00;stop-opacity:1" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <!-- 錯誤訊息 -->
      <div class="error-content">
        <h1 class="error-code">403</h1>
        <h2 class="error-title">禁止訪問</h2>
        <p class="error-message">
          抱歉，您沒有權限訪問此頁面。<br>
          水豚保安已經攔下了您的請求！
        </p>
        <div class="error-actions">
          <button @click="goHome" class="btn-primary">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 6L8 2L14 6V13C14 13.55 13.55 14 13 14H3C2.45 14 2 13.55 2 13V6Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            返回首頁
          </button>
          <button @click="goBack" class="btn-secondary">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 2L4 8L10 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            返回上一頁
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.forbidden-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
  padding: 2rem;
}

.forbidden-container {
  max-width: 600px;
  width: 100%;
  text-align: center;
}

.capybara-illustration {
  width: 100%;
  max-width: 400px;
  margin: 0 auto 2rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.capybara-illustration svg {
  width: 100%;
  height: auto;
  filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.1));
}

/* SVG 動畫 */
.hand-gesture {
  animation: wave 1.5s ease-in-out infinite;
  transform-origin: 147px 195px;
}

@keyframes wave {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-5deg);
  }
  75% {
    transform: rotate(5deg);
  }
}

.stop-sign {
  animation: shake 2s ease-in-out infinite;
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-2px);
  }
  75% {
    transform: translateX(2px);
  }
}

.error-content {
  background: white;
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.error-code {
  font-size: 5rem;
  font-weight: 800;
  color: #FB8C00;
  margin: 0 0 1rem;
  line-height: 1;
  text-shadow: 2px 2px 4px rgba(251, 140, 0, 0.2);
}

.error-title {
  font-size: 2rem;
  font-weight: 700;
  color: #54CDF2;
  margin: 0 0 1rem;
}

.error-message {
  font-size: 1.1rem;
  color: #666;
  line-height: 1.6;
  margin: 0 0 2rem;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.btn-primary {
  background: linear-gradient(135deg, #54CDF2 0%, #3FA9D4 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(84, 205, 242, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(84, 205, 242, 0.4);
}

.btn-secondary {
  background: white;
  color: #54CDF2;
  border: 2px solid #54CDF2;
}

.btn-secondary:hover {
  background: #54CDF2;
  color: white;
  transform: translateY(-2px);
}

.btn-primary:active,
.btn-secondary:active {
  transform: translateY(0);
}

/* 響應式設計 */
@media (max-width: 768px) {
  .forbidden-page {
    padding: 1rem;
  }

  .error-code {
    font-size: 3.5rem;
  }

  .error-title {
    font-size: 1.5rem;
  }

  .error-message {
    font-size: 1rem;
  }

  .error-content {
    padding: 1.5rem;
  }

  .error-actions {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .capybara-illustration {
    max-width: 300px;
  }

  .error-code {
    font-size: 2.5rem;
  }

  .error-title {
    font-size: 1.25rem;
  }
}
</style>
