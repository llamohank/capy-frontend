<template>
  <footer class="footer-wrapper">
    <!-- Main Footer Section (Fat Footer) -->
    <div class="main-footer">
      <div class="footer-container">
        <div class="footer-grid">
          <!-- Column 1: Brand -->
          <div class="footer-column brand-column">
            <div class="footer-logo">
              <h3>CapyCourse</h3>
            </div>
            <p class="brand-tagline">Empowering your learning journey.</p>
            <div class="social-links">
              <a href="#" class="social-link" aria-label="Facebook">
                <i class="el-icon-share"></i>
              </a>
              <a href="#" class="social-link" aria-label="Twitter">
                <i class="el-icon-share"></i>
              </a>
              <a href="#" class="social-link" aria-label="LinkedIn">
                <i class="el-icon-share"></i>
              </a>
            </div>
          </div>

          <!-- Column 2: Discover -->
          <div class="footer-column">
            <h4 class="column-title">探索課程</h4>
            <ul class="footer-links">
              <li><a href="/explore?category=web">網頁開發</a></li>
              <li><a href="/explore?category=data">數據科學</a></li>
              <li><a href="/explore?category=design">設計創作</a></li>
              <li><a href="/explore?category=business">商業管理</a></li>
              <li><a href="/explore">所有課程</a></li>
            </ul>
          </div>

          <!-- Column 3: Support -->
          <div class="footer-column">
            <h4 class="column-title">支援服務</h4>
            <ul class="footer-links">
              <li><a href="/help">幫助中心</a></li>
              <li><a href="/contact">聯絡我們</a></li>
              <li><a href="/become-instructor">成為講師</a></li>
              <li><a href="/faq">常見問題</a></li>
              <li><a href="/about">關於我們</a></li>
            </ul>
          </div>

          <!-- Column 4: Legal -->
          <div class="footer-column">
            <h4 class="column-title">法律條款</h4>
            <ul class="footer-links">
              <li><a href="/terms">服務條款</a></li>
              <li><a href="/privacy">隱私政策</a></li>
              <li><a href="/cookie-policy">Cookie 政策</a></li>
              <li><a href="/refund-policy">退款政策</a></li>
              <li><a href="/accessibility">無障礙聲明</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Copyright Bar -->
    <div class="copyright-bar">
      <div class="footer-container">
        <p class="copyright-text">© 2025 CapyCourse. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.footer-wrapper {
  width: 100%;
}

/* Main Footer (Fat Footer) */
.main-footer {
  background: #232f3e;
  color: #ffffff;
  padding: 60px 0;
}

.footer-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--capy-spacing-lg);
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 48px;
}

/* Brand Column */
.brand-column {
  grid-column: span 1;
}

.footer-logo h3 {
  font-size: 24px;
  font-weight: var(--capy-font-weight-bold);
  color: var(--capy-primary);
  margin: 0 0 12px 0;
}

.brand-tagline {
  font-size: 14px;
  color: #b3b9c5;
  line-height: 1.6;
  margin: 0 0 24px 0;
}

.social-links {
  display: flex;
  gap: 12px;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: #b3b9c5;
  transition: all 0.3s ease;
  text-decoration: none;
}

.social-link:hover {
  background: var(--capy-primary);
  color: #ffffff;
  transform: translateY(-2px);
}

/* Footer Columns */
.footer-column {
  display: flex;
  flex-direction: column;
}

.column-title {
  font-size: 16px;
  font-weight: var(--capy-font-weight-semibold);
  color: #ffffff;
  margin: 0 0 20px 0;
  letter-spacing: 0.5px;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-links li {
  margin: 0;
}

.footer-links a {
  font-size: 14px;
  color: #b3b9c5;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-block;
}

.footer-links a:hover {
  color: var(--capy-primary);
  transform: translateX(4px);
}

/* Copyright Bar */
.copyright-bar {
  background: #1a252f;
  padding: 24px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.copyright-text {
  text-align: center;
  font-size: 14px;
  color: #b3b9c5;
  margin: 0;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .footer-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 40px;
  }

  .brand-column {
    grid-column: span 2;
  }
}

@media (max-width: 768px) {
  .main-footer {
    padding: 40px 0;
  }

  .footer-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .brand-column {
    grid-column: span 1;
    text-align: center;
  }

  .social-links {
    justify-content: center;
  }

  .footer-column {
    text-align: center;
  }

  .footer-links {
    align-items: center;
  }

  .footer-links a:hover {
    transform: translateX(0);
  }
}

@media (max-width: 480px) {
  .main-footer {
    padding: 32px 0;
  }

  .footer-container {
    padding: 0 var(--capy-spacing-md);
  }

  .footer-grid {
    gap: 24px;
  }

  .footer-logo h3 {
    font-size: 20px;
  }

  .column-title {
    font-size: 15px;
    margin-bottom: 16px;
  }

  .copyright-bar {
    padding: 20px 0;
  }

  .copyright-text {
    font-size: 13px;
  }
}
</style>
