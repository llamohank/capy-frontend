<template>
  <InfoPageLayout>
    <!-- 品牌故事區塊 -->
    <div class="about-hero">
      <div class="hero-content">
        <h1 class="hero-title">關於 CapyCourse</h1>
        <p class="hero-tagline">像水豚一樣，穩健前行 🦫</p>
      </div>
    </div>

    <!-- 品牌理念 -->
    <section class="brand-story">
      <h2 class="section-title">我們的故事</h2>
      <div class="story-content">
        <p class="story-text">
          CapyCourse 的誕生源自一個簡單的信念：<strong>學習應該像水豚一樣，從容而堅定</strong>。
        </p>
        <p class="story-text">
          水豚是世界上最大的齧齒動物，以其溫和、友善的性格聞名。牠們總是以自己的步調生活，
          不急不徐，卻能在各種環境中茁壯成長。這正是我們希望帶給每位學習者的精神。
        </p>
        <p class="story-text">
          在這個快節奏的時代，我們相信<strong>穩健的學習比快速的學習更重要</strong>。
          CapyCourse 致力於打造一個讓每個人都能按照自己的節奏學習、成長的平台。
        </p>
      </div>
    </section>

    <!-- 核心價值 -->
    <section class="core-values">
      <h2 class="section-title">核心價值</h2>
      <div class="values-grid">
        <div class="value-card">
          <div class="value-icon">🎯</div>
          <h3 class="value-title">品質至上</h3>
          <p class="value-description">
            我們嚴格審核每一門課程，確保內容的專業性與實用性。
            只有真正優質的課程才能在 CapyCourse 上架。
          </p>
        </div>

        <div class="value-card">
          <div class="value-icon">🤝</div>
          <h3 class="value-title">講師優先</h3>
          <p class="value-description">
            我們提供業界最高的收益分潤（70%），並持續投資於講師支援工具，
            讓講師能專注於創作優質內容。
          </p>
        </div>

        <div class="value-card">
          <div class="value-icon">🌱</div>
          <h3 class="value-title">持續成長</h3>
          <p class="value-description">
            學習是一輩子的旅程。我們鼓勵學員按照自己的步調學習，
            培養終身學習的習慣。
          </p>
        </div>

        <div class="value-card">
          <div class="value-icon">💡</div>
          <h3 class="value-title">創新思維</h3>
          <p class="value-description">
            我們運用最新的技術（如 AI 推薦、自適應學習路徑）
            提升學習體驗，讓學習更有效率。
          </p>
        </div>

        <div class="value-card">
          <div class="value-icon">🌍</div>
          <h3 class="value-title">開放包容</h3>
          <p class="value-description">
            我們歡迎各領域的專業人士分享知識，也歡迎所有渴望學習的人加入。
            知識無國界，學習無止境。
          </p>
        </div>

        <div class="value-card">
          <div class="value-icon">🔒</div>
          <h3 class="value-title">安全可靠</h3>
          <p class="value-description">
            我們重視用戶隱私與資料安全，採用業界標準的加密技術，
            確保您的個人資訊與課程內容受到保護。
          </p>
        </div>
      </div>
    </section>

    <!-- 平台特色 -->
    <section class="platform-features">
      <h2 class="section-title">為什麼選擇 CapyCourse？</h2>
      <div class="features-list">
        <div class="feature-item">
          <el-icon class="feature-icon" :size="32"><VideoPlay /></el-icon>
          <div class="feature-content">
            <h3 class="feature-title">高品質影片</h3>
            <p class="feature-description">
              所有課程影片均為 1080p 以上高畫質，支援多種畫質選擇，
              讓您在任何網路環境下都能流暢學習。
            </p>
          </div>
        </div>

        <div class="feature-item">
          <el-icon class="feature-icon" :size="32"><Clock /></el-icon>
          <div class="feature-content">
            <h3 class="feature-title">永久存取</h3>
            <p class="feature-description">
              購買課程後即可永久觀看，不限次數、不限時間。
              隨時回來複習，鞏固您的學習成果。
            </p>
          </div>
        </div>

        <div class="feature-item">
          <el-icon class="feature-icon" :size="32"><Download /></el-icon>
          <div class="feature-content">
            <h3 class="feature-title">教材下載</h3>
            <p class="feature-description">
              課程附帶的講義、程式碼、素材等資源均可下載，
              方便您離線學習或實作練習。
            </p>
          </div>
        </div>

        <div class="feature-item">
          <el-icon class="feature-icon" :size="32"><ChatDotRound /></el-icon>
          <div class="feature-content">
            <h3 class="feature-title">問答互動</h3>
            <p class="feature-description">
              每門課程都有專屬問答區，您可以向講師提問，
              也可以參考其他學員的問題與解答。
            </p>
          </div>
        </div>

        <div class="feature-item">
          <el-icon class="feature-icon" :size="32"><Monitor /></el-icon>
          <div class="feature-content">
            <h3 class="feature-title">跨裝置學習</h3>
            <p class="feature-description">
              支援電腦、平板、手機等多種裝置，學習進度自動同步，
              讓您隨時隨地都能學習。
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 數據統計 -->
    <section class="statistics">
      <h2 class="section-title">我們的成就</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-number">10,000+</div>
          <div class="stat-label">活躍學員</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">500+</div>
          <div class="stat-label">優質課程</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">200+</div>
          <div class="stat-label">專業講師</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">4.8/5</div>
          <div class="stat-label">平均評分</div>
        </div>
      </div>
    </section>

    <!-- 團隊介紹 -->
    <section class="team-section">
      <h2 class="section-title">我們的團隊</h2>
      <p class="team-description">
        CapyCourse 由一群熱愛教育與技術的專業人士組成。我們來自不同的背景，
        但都懷抱著相同的使命：<strong>讓優質教育觸手可及</strong>。
      </p>
      <div class="team-values">
        <div class="team-value-item">
          <span class="team-value-icon">🎓</span>
          <span class="team-value-text">教育專家</span>
        </div>
        <div class="team-value-item">
          <span class="team-value-icon">💻</span>
          <span class="team-value-text">技術工程師</span>
        </div>
        <div class="team-value-item">
          <span class="team-value-icon">🎨</span>
          <span class="team-value-text">設計師</span>
        </div>
        <div class="team-value-item">
          <span class="team-value-icon">📊</span>
          <span class="team-value-text">數據分析師</span>
        </div>
        <div class="team-value-item">
          <span class="team-value-icon">🤝</span>
          <span class="team-value-text">客服團隊</span>
        </div>
      </div>
    </section>

    <!-- 聯絡我們 -->
    <section class="contact-cta">
      <div class="cta-card">
        <h2 class="cta-title">加入 CapyCourse 社群</h2>
        <p class="cta-description">
          無論您是想學習新技能的學員，還是想分享專業知識的講師，
          我們都歡迎您加入 CapyCourse 大家庭！
        </p>
        <div class="cta-buttons">
          <router-link to="/explore" class="cta-button primary">
            <el-icon><Search /></el-icon>
            <span>探索課程</span>
          </router-link>
          <router-link to="/instructor/landing" class="cta-button secondary">
            <el-icon><User /></el-icon>
            <span>成為講師</span>
          </router-link>
        </div>
      </div>
    </section>
  </InfoPageLayout>
</template>

<script setup>
import InfoPageLayout from '@/layouts/InfoPageLayout.vue'
import {
  VideoPlay,
  Clock,
  Download,
  ChatDotRound,
  Medal,
  Monitor,
  Search,
  User
} from '@element-plus/icons-vue'
</script>

<style scoped>
/* Hero 區塊 */
.about-hero {
  text-align: center;
  padding: 48px 0;
  margin-bottom: 48px;
  background: linear-gradient(135deg, rgba(84, 205, 242, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%);
  border-radius: var(--capy-radius-lg);
}

.hero-title {
  font-size: 42px;
  font-weight: 600;
  color: var(--capy-text-primary);
  margin: 0 0 16px 0;
}

.hero-tagline {
  font-size: 20px;
  color: var(--capy-secondary);
  font-weight: 500;
  margin: 0;
}

/* 品牌故事 */
.brand-story {
  margin-bottom: 64px;
}

.section-title {
  font-size: 32px;
  font-weight: 600;
  color: var(--capy-text-primary);
  margin: 0 0 24px 0;
  text-align: center;
}

.story-content {
  max-width: 800px;
  margin: 0 auto;
}

.story-text {
  font-size: 16px;
  line-height: 1.8;
  color: var(--capy-text-regular);
  margin-bottom: 20px;
}

.story-text strong {
  color: var(--capy-text-primary);
  font-weight: 600;
}

/* 核心價值 */
.core-values {
  margin-bottom: 64px;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 32px;
}

.value-card {
  background-color: var(--capy-bg-base);
  border-radius: var(--capy-radius-lg);
  padding: 32px;
  text-align: center;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.value-card:hover {
  transform: translateY(-4px);
  border-color: var(--capy-primary);
  box-shadow: 0 8px 24px rgba(84, 205, 242, 0.2);
}

.value-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.value-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--capy-text-primary);
  margin: 0 0 12px 0;
}

.value-description {
  font-size: 14px;
  line-height: 1.6;
  color: var(--capy-text-regular);
  margin: 0;
}

/* 平台特色 */
.platform-features {
  margin-bottom: 64px;
}

.features-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
  margin-top: 32px;
}

.feature-item {
  display: flex;
  gap: 20px;
  padding: 24px;
  background-color: var(--capy-bg-base);
  border-radius: var(--capy-radius-lg);
  transition: all 0.3s ease;
}

.feature-item:hover {
  transform: translateX(8px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.feature-icon {
  color: var(--capy-primary);
  flex-shrink: 0;
}

.feature-content {
  flex: 1;
}

.feature-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--capy-text-primary);
  margin: 0 0 8px 0;
}

.feature-description {
  font-size: 14px;
  line-height: 1.6;
  color: var(--capy-text-regular);
  margin: 0;
}

/* 數據統計 */
.statistics {
  margin-bottom: 64px;
  padding: 48px;
  background: linear-gradient(135deg, var(--capy-primary) 0%, var(--capy-primary-dark) 100%);
  border-radius: var(--capy-radius-lg);
  color: white;
}

.statistics .section-title {
  color: white;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 32px;
  margin-top: 32px;
}

.stat-card {
  text-align: center;
}

.stat-number {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 16px;
  opacity: 0.9;
}

/* 團隊介紹 */
.team-section {
  margin-bottom: 64px;
}

.team-description {
  text-align: center;
  font-size: 16px;
  line-height: 1.8;
  color: var(--capy-text-regular);
  max-width: 800px;
  margin: 24px auto 32px;
}

.team-description strong {
  color: var(--capy-text-primary);
  font-weight: 600;
}

.team-values {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 24px;
  margin-top: 32px;
}

.team-value-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background-color: var(--capy-bg-base);
  border-radius: var(--capy-radius-round);
  font-size: 16px;
  color: var(--capy-text-primary);
}

.team-value-icon {
  font-size: 24px;
}

/* 聯絡 CTA */
.contact-cta {
  margin-top: 64px;
}

.cta-card {
  background-color: var(--capy-bg-base);
  border-radius: var(--capy-radius-lg);
  padding: 48px;
  text-align: center;
}

.cta-title {
  font-size: 32px;
  font-weight: 600;
  color: var(--capy-text-primary);
  margin: 0 0 16px 0;
}

.cta-description {
  font-size: 16px;
  line-height: 1.8;
  color: var(--capy-text-regular);
  max-width: 600px;
  margin: 0 auto 32px;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 32px;
  border-radius: var(--capy-radius-round);
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
}

.cta-button.primary {
  background-color: var(--capy-primary);
  color: white;
}

.cta-button.primary:hover {
  background-color: var(--capy-primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(84, 205, 242, 0.4);
}

.cta-button.secondary {
  background-color: var(--capy-secondary);
  color: white;
}

.cta-button.secondary:hover {
  background-color: #8D6E63;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(161, 136, 127, 0.4);
}

/* 響應式設計 */
@media (max-width: 768px) {
  .hero-title {
    font-size: 32px;
  }

  .hero-tagline {
    font-size: 18px;
  }

  .section-title {
    font-size: 28px;
  }

  .values-grid,
  .features-list {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .statistics {
    padding: 32px 24px;
  }

  .stat-number {
    font-size: 36px;
  }

  .cta-card {
    padding: 32px 24px;
  }

  .cta-title {
    font-size: 24px;
  }

  .cta-buttons {
    flex-direction: column;
  }

  .cta-button {
    width: 100%;
    justify-content: center;
  }
}
</style>
