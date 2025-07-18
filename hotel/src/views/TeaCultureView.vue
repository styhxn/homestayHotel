<template>
  <div class="page-container fade-in">
    <AppNavbar />

    <main class="main-content">
      <!-- 现代化茶文化英雄区域 -->
      <section class="tea-hero-section">
        <div class="hero-background">
          <!-- 装饰性粒子效果 -->

          <img src="@/assets/images/环境展示/tea_bg.png" />
          <div class="hero-particles">
            <div class="particle" v-for="n in 15" :key="n" :style="getParticleStyle(n)"></div>
          </div>

          <!-- 浮动茶叶装饰 -->
          <div class="floating-elements">
            <div class="floating-tea-leaf floating-leaf-1">🍃</div>
            <div class="floating-tea-leaf floating-leaf-2">🌿</div>
            <div class="floating-tea-leaf floating-leaf-3">🍃</div>
            <div class="floating-tea-leaf floating-leaf-4">🌱</div>
          </div>
        </div>

        <!-- 英雄内容 -->
        <div class="hero-content-wrapper">
          <div class="hero-content">
            <!-- 左侧文字内容 -->
            <div class="hero-left">
              <div class="hero-badge" :class="{ 'animate-fade-in': isLoaded }">
                <span class="badge-icon">🍃</span>
                <span class="badge-text">千年茶韵传承</span>
              </div>
              <h1 class="hero-title" :class="{ 'animate-slide-in-left': isLoaded }">
                <span class="title-main">普洱茶文化</span>
                <span class="title-sub">深度体验之旅</span>
              </h1>
              <p class="hero-subtitle" :class="{ 'animate-fade-in-up': isLoaded }">
                探索千年茶马古道的文化传承<br>
                <span class="subtitle-highlight">感受普洱茶的深厚底蕴与匠心精神</span>
              </p>

              <!-- 英雄特色亮点 -->
              <div class="hero-features">
                <div class="hero-feature-item" :class="{ 'animate-fade-in-up': isLoaded }" style="animation-delay: 0.6s">
                  <div class="feature-icon">🏔️</div>
                  <div class="feature-text">
                    <span class="feature-number">1200+</span>
                    <span class="feature-label">年古茶树</span>
                  </div>
                </div>
                <div class="hero-feature-item" :class="{ 'animate-fade-in-up': isLoaded }" style="animation-delay: 0.8s">
                  <div class="feature-icon">🎭</div>
                  <div class="feature-text">
                    <span class="feature-number">8</span>
                    <span class="feature-label">项文化体验</span>
                  </div>
                </div>
                <div class="hero-feature-item" :class="{ 'animate-fade-in-up': isLoaded }" style="animation-delay: 1.0s">
                  <div class="feature-icon">🏆</div>
                  <div class="feature-text">
                    <span class="feature-number">5★</span>
                    <span class="feature-label">茶艺师指导</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 右侧按钮操作区域 -->
            <div class="hero-right">
              <div class="hero-actions">
                <div class="action-card" :class="{ 'animate-slide-in-right': isLoaded }" style="animation-delay: 0.4s">
                  <h3 class="action-title">开始您的茶文化之旅</h3>
                  <p class="action-description">体验正宗普洱茶文化，感受千年传承的茶道精神</p>
                  <router-link to="/tea-experience-booking" class="btn btn-outline-light btn-large btn-modern">
                    <span>预约茶文化体验</span>
                    <!-- 手动绘制的茶壶图标 -->
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="margin-left: 8px;">
                      <path d="M18.5 3H16V2C16 0.9 15.1 0 14 0H10C8.9 0 8 0.9 8 2V3H5.5C4.67 3 4 3.67 4 4.5V5.5C4 6.33 4.67 7 5.5 7H6V17C6 18.1 6.9 19 8 19H16C17.1 19 18 18.1 18 17V7H18.5C19.33 7 20 6.33 20 5.5V4.5C20 3.67 19.33 3 18.5 3ZM10 2H14V3H10V2ZM16 17H8V7H16V17ZM18 5.5H6V4.5H18V5.5Z"/>
                      <circle cx="12" cy="12" r="2" fill="currentColor"/>
                    </svg>
                  </router-link>
                </div>
                <div class="action-card" :class="{ 'animate-slide-in-right': isLoaded }" style="animation-delay: 0.6s">
                  <h3 class="action-title">AI智能茶文化助手</h3>
                  <p class="action-description">专业茶文化知识问答，个性化茶叶推荐</p>
                  <button @click="scrollToAI" class="btn btn-outline-light btn-large btn-modern">
                    <span>AI茶文化助手</span>
                    <!-- 手动绘制的机器人图标 -->
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="margin-left: 8px;">
                      <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M12,4A0.5,0.5 0 0,0 11.5,4.5A0.5,0.5 0 0,0 12,5A0.5,0.5 0 0,0 12.5,4.5A0.5,0.5 0 0,0 12,4M5,9V20H19V9A5,5 0 0,0 14,4H10A5,5 0 0,0 5,9M8,10A1.5,1.5 0 0,1 9.5,11.5A1.5,1.5 0 0,1 8,13A1.5,1.5 0 0,1 6.5,11.5A1.5,1.5 0 0,1 8,10M16,10A1.5,1.5 0 0,1 17.5,11.5A1.5,1.5 0 0,1 16,13A1.5,1.5 0 0,1 14.5,11.5A1.5,1.5 0 0,1 16,10M9.5,16A0.5,0.5 0 0,1 10,16.5V17.5A0.5,0.5 0 0,1 9.5,18H8.5A0.5,0.5 0 0,1 8,17.5V16.5A0.5,0.5 0 0,1 8.5,16H9.5M14.5,16A0.5,0.5 0 0,1 15,16.5V17.5A0.5,0.5 0 0,1 14.5,18H13.5A0.5,0.5 0 0,1 13,17.5V16.5A0.5,0.5 0 0,1 13.5,16H14.5Z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 滚动指示器 -->
        <div class="scroll-indicator" :class="{ 'animate-fade-in': isLoaded }" style="animation-delay: 1.2s">
          <div class="scroll-text">探索茶文化</div>
          <div class="scroll-arrow">
            <!-- 手动绘制的向下箭头图标 -->
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
            </svg>
          </div>
        </div>
      </section>

      <!-- 现代化茶文化介绍区域 -->
      <section class="tea-intro-section">
        <div class="intro-background">
          <div class="intro-pattern"></div>
        </div>
        <div class="container">
          <div class="intro-content">
            <div class="intro-badge">
              <span class="badge-dot"></span>
              <span>千年传承</span>
            </div>
            <h2 class="section-title">
              <span class="title-highlight">普洱茶文化</span>
              <span class="title-main">深度体验之旅</span>
            </h2>
            <div class="intro-description">
              <p class="intro-text">
                普洱茶承载着千年茶马古道的历史记忆，每一片茶叶都诉说着时光的故事。
                在这里，您将深度体验从茶园采摘到茶艺表演的完整文化旅程，
                感受普洱茶独特的制作工艺和深厚的文化底蕴。
              </p>
            </div>

            <!-- 茶文化亮点 -->
            <div class="intro-highlights">
              <div class="highlight-item" data-aos="fade-up" data-aos-delay="100">
                <div class="highlight-icon">
                  <!-- 手动绘制的叶子图标 -->
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="#a7ca87">
                    <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/>
                  </svg>
                </div>
                <div class="highlight-content">
                  <h4>古茶树资源</h4>
                  <p>千年古茶树群落，原生态茶园环境</p>
                  <div class="highlight-stats">
                    <span class="stat-number">1200+</span>
                    <span class="stat-label">年古茶树历史</span>
                  </div>
                </div>
              </div>
              <div class="highlight-item" data-aos="fade-up" data-aos-delay="200">
                <div class="highlight-icon">
                  <!-- 手动绘制的咖啡/茶杯图标 -->
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="#4a7c59">
                    <path d="M2,21V19H20V21H2M20,8V5L18,5V8H20M20,3A2,2 0 0,1 22,5V8A2,2 0 0,1 20,10H18V13A4,4 0 0,1 14,17H8A4,4 0 0,1 4,13V3H20M16,5H6V13A2,2 0 0,0 8,15H14A2,2 0 0,0 16,13V5Z"/>
                  </svg>
                </div>
                <div class="highlight-content">
                  <h4>传统工艺</h4>
                  <p>传承千年的制茶工艺，匠心精神</p>
                  <div class="highlight-stats">
                    <span class="stat-number">8</span>
                    <span class="stat-label">道传统工序</span>
                  </div>
                </div>
              </div>
              <div class="highlight-item" data-aos="fade-up" data-aos-delay="300">
                <div class="highlight-icon">
                  <!-- 手动绘制的星星图标 -->
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="#0cd398">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                  </svg>
                </div>
                <div class="highlight-content">
                  <h4>文化传承</h4>
                  <p>茶马古道文化，非物质文化遗产</p>
                  <div class="highlight-stats">
                    <span class="stat-number">500+</span>
                    <span class="stat-label">年文化传承</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 彩色茶文化体验区域 -->
      <section class="colorful-tea-experiences">
        <div class="container">
          <div class="experiences-grid">
            <!-- 茶园采摘体验 -->
            <div class="experience-card tea-picking" data-aos="fade-right">
              <div class="experience-background">
                <div class="experience-pattern tea-picking-pattern"></div>
              </div>
              <div class="experience-content">
                <div class="experience-icon">
                  <!-- 手动绘制的大叶子图标 -->
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="#a7ca87">
                    <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/>
                  </svg>
                </div>
                <div class="experience-info">
                  <h3>茶园采摘体验</h3>
                  <p>走进千年古茶园，亲手采摘新鲜茶叶，体验茶农的辛勤劳作</p>
                  <div class="experience-features">
                    <span class="feature-tag">🌱 原生态茶园</span>
                    <span class="feature-tag">⏰ 3小时深度体验</span>
                    <span class="feature-tag">👨‍🌾 专业茶农指导</span>
                  </div>
                  <div class="experience-stats">
                    <div class="stat-item">
                      <span class="stat-number">98%</span>
                      <span class="stat-label">有机认证</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-number">1200+</span>
                      <span class="stat-label">年古茶树</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 制茶工艺体验 -->
            <div class="experience-card tea-making" data-aos="fade-left">
              <div class="experience-background">
                <div class="experience-pattern tea-making-pattern"></div>
              </div>
              <div class="experience-content">
                <div class="experience-icon">
                  <!-- 手动绘制的火焰图标 -->
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="#4a7c59">
                    <path d="M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.82 8.72C13.33 7.26 13 4.85 13.95 3C13.76 3.13 13.58 3.26 13.4 3.4C11.97 4.45 11.5 6.15 11.5 7.72C11.5 9.29 12.22 10.83 13.33 11.94C13.6 12.21 13.88 12.48 14.15 12.76C15.27 13.88 16 15.42 16 17C16 18.66 15.16 20.16 13.86 21.21C15.5 20.5 16.75 18.96 17.39 17.13C18.03 15.3 17.66 13.2 17.66 11.2Z"/>
                  </svg>
                </div>
                <div class="experience-info">
                  <h3>传统制茶工艺</h3>
                  <p>学习杀青、揉捻、晒干等传统工艺，感受千年制茶技艺</p>
                  <div class="experience-features">
                    <span class="feature-tag">🔥 传统杀青</span>
                    <span class="feature-tag">🤲 手工揉捻</span>
                    <span class="feature-tag">☀️ 自然晒干</span>
                  </div>
                  <div class="experience-stats">
                    <div class="stat-item">
                      <span class="stat-number">8</span>
                      <span class="stat-label">道传统工序</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-number">500+</span>
                      <span class="stat-label">年工艺传承</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 茶艺表演与品茶体验 -->
      <section class="tea-ceremony-section">
        <div class="ceremony-background">
          <div class="ceremony-pattern"></div>
        </div>
        <div class="container">
          <div class="ceremony-content">
            <div class="ceremony-left">
              <div class="section-badge">
                <span class="badge-dot"></span>
                <span>茶艺文化</span>
              </div>
              <h2 class="section-title">
                <span class="title-highlight">茶艺表演</span>
                <span class="title-main">与品茶体验</span>
              </h2>
              <p class="section-description">
                观赏专业茶艺师的精彩表演，学习正宗的普洱茶冲泡技巧。
                在茶香缭绕中，感受茶道精神的宁静致远。
              </p>

              <div class="ceremony-features">
                <div class="ceremony-feature">
                  <div class="feature-icon">
                    <!-- 手动绘制的星星图标 -->
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#0cd398">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                  </div>
                  <div class="feature-content">
                    <h4>专业茶艺师</h4>
                    <p>国家级茶艺师现场指导，传授正宗茶艺技巧</p>
                  </div>
                </div>
                <div class="ceremony-feature">
                  <div class="feature-icon">
                    <!-- 手动绘制的茶杯图标 -->
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#4a7c59">
                      <path d="M2,21V19H20V21H2M20,8V5L18,5V8H20M20,3A2,2 0 0,1 22,5V8A2,2 0 0,1 20,10H18V13A4,4 0 0,1 14,17H8A4,4 0 0,1 4,13V3H20M16,5H6V13A2,2 0 0,0 8,15H14A2,2 0 0,0 16,13V5Z"/>
                    </svg>
                  </div>
                  <div class="feature-content">
                    <h4>多样茶品</h4>
                    <p>品鉴不同年份、不同产区的精品普洱茶</p>
                  </div>
                </div>
                <div class="ceremony-feature">
                  <div class="feature-icon">
                    <!-- 手动绘制的心形图标 -->
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#a7ca87">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </div>
                  <div class="feature-content">
                    <h4>文化传承</h4>
                    <p>深度了解茶道精神和茶文化的历史传承</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="ceremony-right">
              <div class="ceremony-showcase">
                <div class="showcase-image">
                  <img src="/src/assets/images/实地调研/茶叶产品调研/茶叶产品调研8.jpg" alt="茶艺表演" />
                  <div class="showcase-overlay">
                    <div class="play-button" @click="playTeaCeremonyVideo">
                      <!-- 手动绘制的播放图标 -->
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                        <path d="M8,5.14V19.14L19,12.14L8,5.14Z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div class="showcase-stats">
                  <div class="stat-card">
                    <span class="stat-number">5★</span>
                    <span class="stat-label">茶艺师等级</span>
                  </div>
                  <div class="stat-card">
                    <span class="stat-number">20+</span>
                    <span class="stat-label">茶品种类</span>
                  </div>
                  <div class="stat-card">
                    <span class="stat-number">90min</span>
                    <span class="stat-label">体验时长</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 现代化AI茶文化助手区域 -->
      <section id="ai-tea-assistant" class="ai-assistant-section">
        <div class="ai-background">
          <div class="ai-particles"></div>
          <div class="ai-grid-pattern"></div>
        </div>
        <div class="container">
          <div class="ai-content">
            <div class="ai-header">
              <div class="section-badge">
                <span class="badge-dot ai-pulse"></span>
                <span>AI智能助手</span>
              </div>
              <h2 class="section-title">
                <span class="title-highlight">普普AI助手</span>
                <span class="title-main">您的专属茶文化顾问</span>
              </h2>
              <p class="section-subtitle">
                拥有丰富的普洱茶知识和文化底蕴，无论是茶叶识别、冲泡技巧，
                还是文化典故，普普都能为您详细解答。
              </p>
            </div>

            <div class="ai-showcase">
              <!-- AI助手展示卡片 -->
              <div class="ai-main-card">
                <div class="ai-avatar-section">
                  <div class="ai-avatar-container">
                    <div class="ai-avatar-circle">
                      <img src="/src/assets/images/IP形象/普普正面.png" alt="普普AI助手" class="ai-avatar-image">
                      <div class="ai-status-ring"></div>
                      <div class="ai-pulse-ring"></div>
                    </div>
                    <div class="ai-info">
                      <h3 class="ai-name">普普</h3>
                      <p class="ai-title">AI茶文化专家</p>
                      <div class="ai-status">
                        <span class="status-dot online"></span>
                        <span class="status-text">在线服务中</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="ai-capabilities">
                  <h4>AI能力展示</h4>
                  <div class="capability-grid">
                    <div class="capability-item">
                      <!-- 手动绘制的相机图标 -->
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="#a7ca87">
                        <path d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z"/>
                      </svg>
                      <span>茶叶识别</span>
                    </div>
                    <div class="capability-item">
                      <!-- 手动绘制的茶杯图标 -->
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="#4a7c59">
                        <path d="M2,21V19H20V21H2M20,8V5L18,5V8H20M20,3A2,2 0 0,1 22,5V8A2,2 0 0,1 20,10H18V13A4,4 0 0,1 14,17H8A4,4 0 0,1 4,13V3H20M16,5H6V13A2,2 0 0,0 8,15H14A2,2 0 0,0 16,13V5Z"/>
                      </svg>
                      <span>冲泡指导</span>
                    </div>
                    <div class="capability-item">
                      <!-- 手动绘制的书本图标 -->
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="#0cd398">
                        <path d="M18,22A2,2 0 0,0 20,20V4A2,2 0 0,0 18,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18M6,4H18V20H6V4M7,9V7H17V9H7M7,13V11H17V13H7M7,17V15H14V17H7Z"/>
                      </svg>
                      <span>文化知识</span>
                    </div>
                    <div class="capability-item">
                      <!-- 手动绘制的星星图标 -->
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="#549688">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                      </svg>
                      <span>茶艺师</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- AI功能卡片网格 -->
              <div class="ai-features-grid">
                <div class="ai-feature-card modern">
                  <div class="feature-icon-modern">
                    <!-- 手动绘制的相机图标 -->
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="#a7ca87">
                      <path d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z"/>
                    </svg>
                  </div>
                  <h4>智能茶叶识别</h4>
                  <p>上传茶叶照片，AI智能识别品种、年份、产地和品质等级</p>
                  <div class="feature-stats">
                    <span class="stat">95%+ 识别准确率</span>
                  </div>
                </div>

                <div class="ai-feature-card modern">
                  <div class="feature-icon-modern">
                    <!-- 手动绘制的茶杯图标 -->
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="#4a7c59">
                      <path d="M2,21V19H20V21H2M20,8V5L18,5V8H20M20,3A2,2 0 0,1 22,5V8A2,2 0 0,1 20,10H18V13A4,4 0 0,1 14,17H8A4,4 0 0,1 4,13V3H20M16,5H6V13A2,2 0 0,0 8,15H14A2,2 0 0,0 16,13V5Z"/>
                    </svg>
                  </div>
                  <h4>个性化冲泡指导</h4>
                  <p>根据茶叶特性提供精准的水温、时间、茶量建议</p>
                  <div class="feature-stats">
                    <span class="stat">专业级指导</span>
                  </div>
                </div>

                <div class="ai-feature-card modern">
                  <div class="feature-icon-modern">
                    <!-- 手动绘制的书本图标 -->
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="#0cd398">
                      <path d="M18,22A2,2 0 0,0 20,20V4A2,2 0 0,0 18,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18M6,4H18V20H6V4M7,9V7H17V9H7M7,13V11H17V13H7M7,17V15H14V17H7Z"/>
                    </svg>
                  </div>
                  <h4>茶文化知识库</h4>
                  <p>丰富的茶文化知识，历史典故、制作工艺、健康功效</p>
                  <div class="feature-stats">
                    <span class="stat">1000+ 知识条目</span>
                  </div>
                </div>

                <div class="ai-feature-card modern">
                  <div class="feature-icon-modern">
                    <!-- 手动绘制的星星图标 -->
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="#549688">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                  </div>
                  <h4>虚拟茶艺师</h4>
                  <p>学习专业茶艺表演技巧，掌握茶道礼仪和精神内涵</p>
                  <div class="feature-stats">
                    <span class="stat">5★ 茶艺师水准</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- AI交互按钮 -->
            <div class="ai-interaction-modern">
              <button @click="openTeaAI" class="btn btn-ai-primary btn-large btn-modern">
                <span>开始与普普对话</span>
                <!-- 手动绘制的消息图标 -->
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="margin-left: 8px;">
                  <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M7,13H17V11H7"/>
                </svg>
              </button>
              <button @click="openTeaAI" class="btn btn-ai-secondary btn-large btn-modern">
                <span>茶叶识别体验</span>
                <!-- 手动绘制的相机图标 -->
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="margin-left: 8px;">
                  <path d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- 茶文化AI助手组件 -->
    <TeaAIAssistant ref="teaAIAssistant" />

    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>普洱蘑菇庄园</h3>
          <p>隐于森林深处，与自然共生的生态民宿体验</p>
        </div>
        <div class="footer-section">
          <h4>联系我们</h4>
          <p>地址：云南省普洱市思茅区</p>
          <p>电话：400-123-4567</p>
          <p>邮箱：info@mushroomfarm.com</p>
        </div>
        <div class="footer-section">
          <h4>快速链接</h4>
          <router-link to="/" class="footer-link">首页</router-link>
          <router-link to="/tea-culture" class="footer-link">茶文化</router-link>
          <router-link to="/products" class="footer-link">民宿产品</router-link>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2024 普洱蘑菇庄园民宿. 保留所有权利.</p>
      </div>
    </footer>

    <!-- 滚动到顶部按钮 -->
    <button
      v-show="showScrollTop"
      @click="scrollToTop"
      class="scroll-top-btn floating"
      title="回到顶部"
    >
      <i class="fas fa-chevron-up"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import AppNavbar from '../components/AppNavbar.vue'
import TeaAIAssistant from '../components/TeaAIAssistant.vue'

// 响应式数据
const showScrollTop = ref(false)
const teaAIAssistant = ref()
const isLoaded = ref(false)

// 粒子动画样式
const getParticleStyle = (_index: number) => {
  const delay = Math.random() * 5
  const duration = 3 + Math.random() * 4
  const size = 2 + Math.random() * 4
  const left = Math.random() * 100

  return {
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    width: `${size}px`,
    height: `${size}px`,
    opacity: 0.3 + Math.random() * 0.4
  }
}

// 滚动到AI助手区域
const scrollToAI = () => {
  const element = document.getElementById('ai-tea-assistant')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

// 打开茶文化AI助手
const openTeaAI = () => {
  if (teaAIAssistant.value) {
    teaAIAssistant.value.open()
  }
}

// 播放茶艺表演视频
const playTeaCeremonyVideo = () => {
  // 这里可以集成视频播放功能
  console.log('播放茶艺表演视频')
}

// 滚动到顶部
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// 监听滚动事件
const handleScroll = () => {
  showScrollTop.value = window.scrollY > 300
}

// 生命周期钩子
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  // 触发进入动画
  setTimeout(() => {
    isLoaded.value = true
  }, 100)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>


.main-content {
  padding-top: 0;
}

/* 现代化英雄区域样式 - 金色绿色主题 */
.tea-hero-section {
  position: relative;
  height: 100vh;
  display: flex;
  background-color: #eaeff2;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.carousel-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel-slide {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 2s ease-in-out;
}

.carousel-slide.active {
  opacity: 0.4;
}

.slide-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgb(205, 199, 163)
}

/* 粒子效果 */
.hero-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  pointer-events: none;
}

.particle {
  position: absolute;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.8), rgba(16, 185, 129, 0.4));
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 0.8;
  }
}

/* 浮动茶叶装饰 */
.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  pointer-events: none;
}

.floating-tea-leaf {
  position: absolute;
  font-size: 2rem;
  animation: floatLeaf 8s ease-in-out infinite;
}

.floating-leaf-1 {
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.floating-leaf-2 {
  top: 60%;
  right: 15%;
  animation-delay: 2s;
}

.floating-leaf-3 {
  top: 40%;
  left: 80%;
  animation-delay: 4s;
}

.floating-leaf-4 {
  top: 80%;
  left: 20%;
  animation-delay: 6s;
}

@keyframes floatLeaf {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.6;
  }
  25% {
    transform: translateY(-15px) rotate(90deg);
    opacity: 0.8;
  }
  50% {
    transform: translateY(-30px) rotate(180deg);
    opacity: 1;
  }
  75% {
    transform: translateY(-15px) rotate(270deg);
    opacity: 0.8;
  }
}

/* 英雄内容样式 */
.hero-content-wrapper {
  position: relative;
  z-index: 3;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  color: white;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
  min-height: 70vh;
}

.hero-left {
  text-align: left;
}

.hero-right {
  display: flex;
  margin-left: 50px;
  justify-content: center;
  align-items: center;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(16, 185, 129, 0.2));
  padding: 10px 24px;
  border-radius: 30px;
  margin-bottom: 30px;
  backdrop-filter: blur(15px);
  border: 2px solid rgba(255, 215, 0, 0.3);
  font-weight: 700;
  color: white;
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.2);
}

.badge-icon {
  font-size: 1.2rem;
}

.hero-title {
  margin-bottom: 30px;
}

.title-main {
  display: block;
  font-size: 4.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #a7ca87 0%, #0cd398 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: none;
  margin-bottom: 10px;
  letter-spacing: 0.02em;
}



.title-sub {
  display: block;
  font-size: 1.8rem;
  font-weight: 500;
  background: linear-gradient(135deg, #a7ca87 0%, #0cd398 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  opacity: 1;
  margin-top: 10px;
  letter-spacing: 0.01em;
}

.hero-subtitle {
  font-size: 1.3rem;
  line-height: 1.6;
  opacity: 0.9;
  max-width: 700px;
  margin: 0 auto 40px;
}

.subtitle-highlight {
  color: #2d5016;
  font-weight: 600;
  text-shadow: none;
}

/* 英雄特色亮点 */
.hero-features {
  display: flex;
  justify-content: flex-start;
  gap: 30px;
  margin: 40px 0;
  flex-wrap: wrap;
}

.hero-feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(16, 185, 129, 0.15));
  padding: 18px 28px;
  border-radius: 20px;
  backdrop-filter: blur(15px);
  border: 2px solid rgba(255, 215, 0, 0.3);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.hero-feature-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(255, 215, 0, 0.2);
  border-color: rgba(255, 215, 0, 0.5);
}

.feature-icon {
  font-size: 1.5rem;
}

.feature-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.feature-number {
  font-size: 1.3rem;
  font-weight: 700;
  color: #2d5016;
  text-shadow: none;
}

.feature-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

/* 英雄按钮区域 */
.hero-actions {
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 100%;
  max-width: 400px;
}

.action-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08));
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 25px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.action-card:hover {
  transform: translateY(-5px);
  border-color: rgba(255, 215, 0, 0.5);
  box-shadow: 0 25px 70px rgba(255, 215, 0, 0.3);
}

.action-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: white;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #a7ca87 0%, #0cd398 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.action-description {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 20px;
  line-height: 1.5;
}

.btn-modern {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 15px 30px;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.btn-large {
  padding: 18px 36px;
  font-size: 1.1rem;
}

.btn-outline-light {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(16, 185, 129, 0.2));
  color: white;
  border-color: rgba(255, 215, 0, 0.4);
  backdrop-filter: blur(15px);
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.2);
}

.btn-outline-light:hover {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.3), rgba(16, 185, 129, 0.3));
  border-color: rgba(255, 215, 0, 0.6);
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(255, 215, 0, 0.3);
}

/* Router-link按钮样式 */
.btn-outline-light[href] {
  text-decoration: none;
  color: white;
}

/* 滚动指示器 */
.scroll-indicator {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  text-align: center;
  color: white;
  opacity: 0.8;
  animation: bounce 2s infinite;
}

.scroll-text {
  font-size: 0.9rem;
  margin-bottom: 10px;
  font-weight: 500;
}

.scroll-arrow {
  display: flex;
  justify-content: center;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  40% {
    transform: translateX(-50%) translateY(-10px);
  }
  60% {
    transform: translateX(-50%) translateY(-5px);
  }
}

/* 进入动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 动画类 */
.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}

.animate-slide-in-left {
  animation: slideInLeft 1s ease-out forwards;
}

.animate-slide-in-right {
  animation: slideInRight 1s ease-out forwards;
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
}

/* 初始状态 - 隐藏元素 */
.hero-badge,
.hero-title,
.hero-subtitle,
.hero-feature-item,
.action-card,
.scroll-indicator {
  opacity: 0;
  transform: translateY(20px);
}

/* 茶文化介绍区域 - 金色绿色主题 */
.tea-intro-section {
  position: relative;
  padding: 120px 0;
  background: linear-gradient(135deg, #e3f2fd 0%, #e8f5e8 30%, #e1f5fe 70%, #f0f8ff 100%);
}

.intro-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.08;
}

.intro-pattern {
  width: 100%;
  height: 100%;
  background-image: radial-gradient(circle at 25% 25%, #4a7c59 2px, transparent 2px),
                    radial-gradient(circle at 75% 75%, #6b8e5a 2px, transparent 2px);
  background-size: 60px 60px;
  animation: patternMove 20s linear infinite;
}

@keyframes patternMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(60px, 60px); }
}

.ai-assistant-section {
  position: relative;
  padding: 120px 0;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 30%, #334155 70%, #475569 100%);
  color: white;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 通用样式 - 金色绿色主题 */
.section-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(16, 185, 129, 0.15));
  color: white;
  padding: 10px 20px;
  border-radius: 30px;
  margin-bottom: 25px;
  font-weight: 700;
  font-size: 0.95rem;
  border: 2px solid rgba(255, 215, 0, 0.2);
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.1);
}

.badge-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  animation: pulse 2s infinite;
}

.section-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: #1a202c;
  text-align: center;
}

.title-highlight {
  background: linear-gradient(135deg, #2d5016, #4a7c59);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-main {
  display: block;
  color: #2d3748;
}

.section-subtitle {
  font-size: 1.2rem;
  color: #2d3748;
  line-height: 1.6;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  font-weight: 500;
}

/* 介绍区域样式 */
.intro-content {
  text-align: center;
}

.intro-description {
  margin: 40px 0;
}

.intro-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #2d3748;
  max-width: 900px;
  margin: 0 auto;
  font-weight: 500;
}

.intro-highlights {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  margin-top: 60px;
}

.highlight-item {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 35px;
  background: linear-gradient(135deg, #ffffff, #f8fafc);
  border-radius: 25px;
  box-shadow: 0 15px 50px rgba(16, 185, 129, 0.1);
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 215, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.highlight-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #2d5016, #4a7c59);
}

.highlight-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 25px 70px rgba(255, 215, 0, 0.2);
  border-color: rgba(255, 215, 0, 0.3);
}

.highlight-icon {
  flex-shrink: 0;
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #2d5016, #4a7c59);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.3);
  position: relative;
}

.highlight-icon::before {
  content: '';
  position: absolute;
  inset: 2px;
  background: linear-gradient(135deg, #ffffff, #f8fafc);
  border-radius: 18px;
  z-index: 1;
}

.highlight-icon > * {
  position: relative;
  z-index: 2;
}

.highlight-content h4 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 10px;
}

.highlight-content p {
  color: #2d3748;
  line-height: 1.6;
  margin-bottom: 15px;
  font-weight: 500;
}

.highlight-stats {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-number {
  font-size: 1.6rem;
  font-weight: 800;
  background: linear-gradient(135deg, #2d5016, #4a7c59);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 0.9rem;
  color: #4a5568;
  font-weight: 600;
}

/* 彩色茶文化体验区域 */
.colorful-tea-experiences {
  padding: 100px 0;
  background: linear-gradient(135deg, #e8f4fd 0%, #e8f5e8 25%, #e3f2fd 75%, #f0f8ff 100%);
}

.experiences-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 50px;
}

.experience-card {
  position: relative;
  background: white;
  border-radius: 30px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(16, 185, 129, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
}

.experience-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 30px 80px rgba(255, 215, 0, 0.2);
}

.experience-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.05;
}

.tea-picking-pattern {
  background: linear-gradient(45deg, #10b981 25%, transparent 25%),
              linear-gradient(-45deg, #10b981 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #10b981 75%),
              linear-gradient(-45deg, transparent 75%, #10b981 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
}

.tea-making-pattern {
  background: linear-gradient(45deg, #4a7c59 25%, transparent 25%),
              linear-gradient(-45deg, #4a7c59 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #4a7c59 75%),
              linear-gradient(-45deg, transparent 75%, #4a7c59 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
}

.experience-content {
  position: relative;
  z-index: 2;
}

.experience-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #ffd700, #10b981);
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 25px;
  box-shadow: 0 10px 30px rgba(255, 215, 0, 0.3);
}

.experience-info h3 {
  font-size: 2rem;
  font-weight: 800;
  color: #1a202c;
  margin-bottom: 15px;
}

.experience-info p {
  font-size: 1.1rem;
  color: #2d3748;
  line-height: 1.7;
  margin-bottom: 25px;
  font-weight: 500;
}

.experience-features {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 25px;
}

.feature-tag {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(16, 185, 129, 0.15));
  color: #047857;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 700;
  border: 1px solid rgba(255, 215, 0, 0.3);
}

.experience-stats {
  display: flex;
  gap: 30px;
}

.stat-item {
  text-align: center;
}

.stat-item .stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #ffd700, #10b981);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 5px;
}

.stat-item .stat-label {
  font-size: 0.9rem;
  color: #4a5568;
  font-weight: 700;
}

/* 茶艺表演区域 */
.tea-ceremony-section {
  position: relative;
  padding: 120px 0;
  background: linear-gradient(135deg, #f1f8fe 0%, #f0f9f0 50%, #e8f4fd 100%);
}

.ceremony-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.03;
}

.ceremony-pattern {
  width: 100%;
  height: 100%;
  background-image:
    radial-gradient(circle at 20% 20%, #ffd700 3px, transparent 3px),
    radial-gradient(circle at 80% 80%, #10b981 3px, transparent 3px),
    radial-gradient(circle at 40% 60%, #ffd700 2px, transparent 2px);
  background-size: 80px 80px, 80px 80px, 40px 40px;
  animation: ceremonyPattern 25s linear infinite;
}

@keyframes ceremonyPattern {
  0% { transform: translate(0, 0) rotate(0deg); }
  100% { transform: translate(80px, 80px) rotate(360deg); }
}

.ceremony-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

.ceremony-left {
  padding-right: 20px;
}

.ceremony-features {
  margin-top: 40px;
}

.ceremony-feature {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 25px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(16, 185, 129, 0.05));
  border-radius: 15px;
  border-left: 4px solid #ffd700;
}

.ceremony-feature .feature-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #ffd700, #10b981);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ceremony-feature h4 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 8px;
}

.ceremony-feature p {
  color: #2d3748;
  line-height: 1.6;
  font-weight: 500;
}

.ceremony-right {
  position: relative;
}

.ceremony-showcase {
  position: relative;
}

.showcase-image {
  position: relative;
  border-radius: 25px;
  overflow: hidden;
  box-shadow: 0 25px 70px rgba(16, 185, 129, 0.2);
}

.showcase-image img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.showcase-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.3), rgba(16, 185, 129, 0.3));
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.showcase-image:hover .showcase-overlay {
  opacity: 1;
}

.showcase-image:hover img {
  transform: scale(1.05);
}

.play-button {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.play-button:hover {
  transform: scale(1.1);
  background: white;
}

.showcase-stats {
  display: flex;
  gap: 20px;
  margin-top: 25px;
}

.stat-card {
  flex: 1;
  background: linear-gradient(135deg, #ffffff, #f8fafc);
  padding: 20px;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.1);
  border: 2px solid rgba(255, 215, 0, 0.1);
}

.stat-card .stat-number {
  display: block;
  font-size: 1.8rem;
  font-weight: 800;
  background: linear-gradient(135deg, #ffd700, #10b981);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 5px;
}

.stat-card .stat-label {
  font-size: 0.9rem;
  color: #4a5568;
  font-weight: 700;
}

/* AI助手区域详细样式 */
.ai-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.ai-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    radial-gradient(2px 2px at 20px 30px, rgba(255, 215, 0, 0.3), transparent),
    radial-gradient(2px 2px at 40px 70px, rgba(16, 185, 129, 0.3), transparent),
    radial-gradient(1px 1px at 90px 40px, rgba(255, 215, 0, 0.4), transparent),
    radial-gradient(1px 1px at 130px 80px, rgba(16, 185, 129, 0.4), transparent);
  background-repeat: repeat;
  background-size: 150px 150px;
  animation: aiParticles 20s linear infinite;
}

@keyframes aiParticles {
  0% { transform: translate(0, 0); }
  100% { transform: translate(150px, 150px); }
}

.ai-grid-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    linear-gradient(rgba(255, 215, 0, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.3;
}

.ai-content {
  position: relative;
  z-index: 2;
}

.ai-header {
  text-align: center;
  margin-bottom: 80px;
}

.ai-header .section-badge {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(16, 185, 129, 0.2));
  color: #2d5016;
  border-color: rgba(255, 215, 0, 0.4);
}

.ai-header .badge-dot.ai-pulse {
  background: #4a7c59;
  animation: aiPulse 2s infinite;
}

@keyframes aiPulse {
  0%, 100% {
    opacity: 1;
    box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.7);
  }
  50% {
    opacity: 0.7;
    box-shadow: 0 0 0 10px rgba(255, 215, 0, 0);
  }
}

.ai-header .section-title {
  color: white;
}

.ai-header .title-highlight {
  background: linear-gradient(135deg, #2d5016, #4a7c59);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.ai-header .section-subtitle {
  color: rgba(255, 255, 255, 0.8);
}

.ai-showcase {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 60px;
  align-items: flex-start;
}

.ai-main-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border-radius: 25px;
  padding: 40px;
  backdrop-filter: blur(15px);
  border: 2px solid rgba(255, 215, 0, 0.2);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.ai-avatar-section {
  margin-bottom: 30px;
}

.ai-avatar-container {
  display: flex;
  align-items: center;
  gap: 20px;
}

.ai-avatar-circle {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2d5016, #4a7c59);
  padding: 4px;
  box-shadow: 0 15px 40px rgba(255, 215, 0, 0.3);
}

.ai-avatar-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  background: white;
}

.ai-status-ring {
  position: absolute;
  top: -8px;
  left: -8px;
  right: -8px;
  bottom: -8px;
  border: 2px solid rgba(255, 215, 0, 0.5);
  border-radius: 50%;
  animation: rotate 8s linear infinite;
}

.ai-pulse-ring {
  position: absolute;
  top: -15px;
  left: -15px;
  right: -15px;
  bottom: -15px;
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 50%;
  animation: pulse-ring 2s ease-out infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse-ring {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.3);
    opacity: 0;
  }
}

.ai-info {
  color: white;
}

.ai-name {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 5px 0;
}

.ai-title {
  font-size: 1rem;
  opacity: 0.8;
  margin: 0 0 10px 0;
}

.ai-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #10b981;
  animation: pulse 2s infinite;
}

.status-dot.online {
  background: #10b981;
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
}

.ai-capabilities {
  color: white;
}

.ai-capabilities h4 {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: #2d5016;
}

.capability-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.capability-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.capability-item:hover {
  background: rgba(255, 215, 0, 0.2);
  transform: translateX(5px);
}

.ai-features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
}

.ai-feature-card.modern {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border-radius: 20px;
  padding: 30px;
  backdrop-filter: blur(15px);
  border: 2px solid rgba(255, 215, 0, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.ai-feature-card.modern::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(135deg, #ffd700, #10b981);
}

.ai-feature-card.modern:hover {
  transform: translateY(-5px);
  border-color: rgba(255, 215, 0, 0.4);
  box-shadow: 0 20px 60px rgba(255, 215, 0, 0.2);
}

.feature-icon-modern {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #ffd700, #10b981);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.3);
}

.ai-feature-card.modern h4 {
  font-size: 1.3rem;
  font-weight: 700;
  color: white;
  margin-bottom: 15px;
}

.ai-feature-card.modern p {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 15px;
}

.feature-stats {
  display: inline-block;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(16, 185, 129, 0.2));
  color: #fffef8;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
  border: 1px solid rgba(255, 215, 0, 0.3);
}

.ai-interaction-modern {
  display: flex;
  justify-content: center;
  gap: 25px;
  margin-top: 60px;
  flex-wrap: wrap;
}

.btn-ai-primary {
  background: linear-gradient(135deg, #4a7c59, #6b8e5a);
  color: white;
  border: 2px solid transparent;
  font-weight: 700;
}

.btn-ai-primary:hover {
  background: linear-gradient(135deg, #2d5016, #4a7c59);
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(74, 124, 89, 0.4);
}

.btn-ai-secondary {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: 2px solid rgba(255, 215, 0, 0.3);
}

.btn-ai-secondary:hover {
  background: linear-gradient(135deg, #059669, #10b981);
  border-color: rgba(255, 215, 0, 0.5);
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(16, 185, 129, 0.4);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .ai-showcase {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .ai-features-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .ceremony-content {
    grid-template-columns: 1fr;
    gap: 50px;
  }

  .experiences-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }
}

@media (max-width: 1024px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: center;
  }

  .hero-left {
    text-align: center;
  }

  .hero-features {
    justify-content: center;
  }

  .hero-actions {
    max-width: 500px;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .hero-title .title-main {
    font-size: 3rem;
  }

  .hero-features {
    flex-direction: column;
    gap: 20px;
    align-items: center;
  }

  .hero-actions {
    gap: 20px;
  }

  .action-card {
    padding: 25px;
  }

  .action-title {
    font-size: 1.2rem;
  }

  .ai-interaction-modern {
    flex-direction: column;
    gap: 15px;
  }

  .capability-grid {
    grid-template-columns: 1fr;
  }

  .experience-stats {
    flex-direction: column;
    gap: 15px;
  }

  .showcase-stats {
    flex-direction: column;
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .hero-content {
    gap: 30px;
  }

  .hero-title .title-main {
    font-size: 2.5rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .hero-features {
    gap: 15px;
  }

  .hero-feature-item {
    padding: 15px 20px;
  }

  .action-card {
    padding: 20px;
  }

  .ai-avatar-container {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 15px;
}

.section-subtitle {
  font-size: 1.1rem;
  color: #718096;
}

.ai-showcase {
  display: flex;
  justify-content: center;
}

.ai-avatar-container {
  display: flex;
  align-items: center;
  gap: 30px;
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(139, 69, 19, 0.15);
}

.ai-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFD700, #4CAF50);
  padding: 5px;
  box-shadow: 0 15px 40px rgba(139, 69, 19, 0.3);
}

.avatar-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  background: white;
}

.ai-info {
  text-align: left;
}

.ai-name {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 8px 0;
}

.ai-title {
  font-size: 1.1rem;
  color: #718096;
  margin: 0 0 15px 0;
}

.ai-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  color: #4a5568;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #4CAF50;
  animation: pulse 2s infinite;
}

.status-text {
  font-weight: 600;
}

.footer {
  background: #1e293b;
  color: white;
  padding: 40px 0;
  text-align: center;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .ai-avatar-container {
    flex-direction: column;
    text-align: center;
    padding: 30px;
  }
  
  .ai-avatar {
    width: 100px;
    height: 100px;
  }
}
</style>
