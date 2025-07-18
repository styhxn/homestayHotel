<template>
  <div class="page-container">
    <AppNavbar />
    <main class="main-content">
      <!-- 现代化英雄区域 -->
      <section class="hero-section">
        <div class="hero-background">
          <div class="carousel-container">
            <div class="carousel-slide active" data-bg="@/assets/images/环境展示/酒店门口3（夜视）.jpg">
              <div class="slide-overlay"></div>
            </div>
            <div class="carousel-slide" data-bg="@/assets/images/环境展示/庄园内部1.jpg">
              <div class="slide-overlay"></div>
            </div>
            <div class="carousel-slide" data-bg="@/assets/images/环境展示/4.jpg">
              <div class="slide-overlay"></div>
            </div>
            <div class="carousel-slide" data-bg="@/assets/images/环境展示/5.jpg">
              <div class="slide-overlay"></div>
            </div>
            <div class="carousel-slide" data-bg="@/assets/images/环境展示/屋顶.jpg">
              <div class="slide-overlay"></div>
            </div>
          </div>

          <!-- 装饰性粒子效果 -->
          <div class="hero-particles">
            <div class="particle" v-for="n in 20" :key="n" :style="getParticleStyle(n)"></div>
          </div>

          <!-- 浮动装饰元素 -->
          <div class="floating-elements">
            <div class="floating-leaf floating-leaf-1"></div>
            <div class="floating-leaf floating-leaf-2"></div>
            <div class="floating-leaf floating-leaf-3"></div>
          </div>
        </div>

        <!-- 英雄内容 -->
        <div class="hero-content-wrapper">
          <div class="hero-content">
            <div class="hero-badge">
              <span class="badge-icon">🍄</span>
              <span class="badge-text">生态民宿体验</span>
            </div>
            <h1 class="hero-title">
              <span class="title-main">普洱蘑菇庄园民宿</span>
            </h1>
            <p class="hero-subtitle">
              隐于森林深处，与自然共生<br>
              <span class="subtitle-highlight">体验云南原生态茶乡风情</span>
            </p>
            <div class="hero-features">
              <div class="feature-item">
                <SvgIcon name="leaf" size="24" color="#10b981" />
                <span>原生态环境</span>
              </div>
              <div class="feature-item">
                <SvgIcon name="spa" size="24" color="#549688" />
                <span>蘑菇采摘</span>
              </div>
              <div class="feature-item">
                <SvgIcon name="coffee" size="24" color="#8b4513" />
                <span>普洱茶文化</span>
              </div>
            </div>
            <div class="hero-buttons">
              <button @click="handleBookingClick" class="btn btn-primary btn-large btn-glow">
                <span class="btn-text">立即预订</span>
                <SvgIcon name="chevron-right" size="20" />
              </button>
              <button @click="handleExploreClick" class="btn btn-outline-white btn-large btn-glass">
                <span class="btn-text">探索庄园</span>
                <SvgIcon name="chevron-down" size="20" />
              </button>
            </div>
          </div>
        </div>

        <!-- 现代化轮播控制 -->
        <div class="carousel-controls">
          <button class="carousel-btn prev-btn" @click="prevSlide">
            <SvgIcon name="chevron-left" size="24" />
          </button>
          <button class="carousel-btn next-btn" @click="nextSlide">
            <SvgIcon name="chevron-right" size="24" />
          </button>
        </div>

        <!-- 现代化指示器 -->
        <div class="carousel-indicators">
          <button
            v-for="index in 5"
            :key="index"
            :class="['indicator', { active: currentSlide === index }]"
            @click="goToSlide(index)"
          >
            <span class="indicator-progress"></span>
          </button>
        </div>

        <!-- 滚动提示 -->
        <div class="scroll-indicator">
          <div class="scroll-text">向下探索</div>
          <div class="scroll-arrow">
            <SvgIcon name="chevron-down" size="20" />
          </div>
        </div>
      </section>

      <!-- 现代化介绍区域 -->
      <section class="intro-section">
        <div class="intro-background">
          <div class="intro-pattern"></div>
        </div>
        <div class="container">
          <div class="intro-content">
            <div class="intro-badge">
              <span class="badge-dot"></span>
              <span>生态民宿体验</span>
            </div>
            <h2 class="section-title">
              <span class="title-highlight">普洱蘑菇庄园</span>
              <span class="title-main">民宿生态体验</span>
            </h2>
            <div class="intro-description">
              <p class="intro-text">
                坐落在普洱茶山深处的生态庄园，这里有原始森林中的蘑菇小屋、茶香四溢的品茶空间，
                以及丰富的蘑菇采摘体验。每一间小屋都融入自然环境，让您在享受现代舒适的同时，
                深度体验云南的生态文化与茶乡风情。
              </p>
            </div>

            <!-- 特色亮点 -->
            <div class="intro-highlights">
              <div class="highlight-item" data-aos="fade-up" data-aos-delay="100">
                <div class="highlight-icon">
                  <SvgIcon name="leaf" size="32" color="#10b981" />
                </div>
                <div class="highlight-content">
                  <h4>原生态环境</h4>
                  <p>森林深处的纯净空气，负氧离子丰富</p>
                  <div class="highlight-stats">
                    <span class="stat-number">98%</span>
                    <span class="stat-label">森林覆盖率</span>
                  </div>
                </div>
              </div>
              <div class="highlight-item" data-aos="fade-up" data-aos-delay="200">
                <div class="highlight-icon">
                  <SvgIcon name="spa" size="32" color="#549688" />
                </div>
                <div class="highlight-content">
                  <h4>蘑菇采摘体验</h4>
                  <p>亲手采摘新鲜蘑菇，体验自然馈赠</p>
                  <div class="highlight-stats">
                    <span class="stat-number">20+</span>
                    <span class="stat-label">蘑菇品种</span>
                  </div>
                </div>
              </div>
              <div class="highlight-item" data-aos="fade-up" data-aos-delay="300">
                <div class="highlight-icon">
                  <SvgIcon name="coffee" size="32" color="#8b4513" />
                </div>
                <div class="highlight-content">
                  <h4>普洱茶文化</h4>
                  <p>品味千年茶香文化，感受茶道精神</p>
                  <div class="highlight-stats">
                    <span class="stat-number">500+</span>
                    <span class="stat-label">年茶树历史</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="intro-buttons">
              <button @click="handleBookingClick" class="btn btn-primary btn-large btn-modern">
                <span>立即预订</span>
                <SvgIcon name="chevron-right" size="20" />
              </button>
              <button @click="handleLearnMoreClick" class="btn btn-outline btn-large btn-modern">
                <span>了解更多</span>
                <SvgIcon name="chevron-down" size="20" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- 彩色特色展示区域 -->
      <section class="colorful-features-section">
        <div class="container">
          <div class="features-grid">
            <!-- 茶文化体验 -->
            <div class="feature-card tea-culture" data-aos="fade-right">
              <div class="feature-background">
                <div class="feature-pattern tea-pattern"></div>
              </div>
              <div class="feature-content">
                <div class="feature-icon">
                  <SvgIcon name="leaf" size="48" color="#10b981" />
                </div>
                <h3>茶文化深度体验</h3>
                <p>从茶园采摘到制茶工艺，体验完整的普洱茶文化之旅</p>
                <div class="feature-highlights">
                  <div class="highlight-tag">专业茶艺师指导</div>
                  <div class="highlight-tag">古法制茶工艺</div>
                  <div class="highlight-tag">品茶文化讲解</div>
                </div>
                <TeaExperienceBooking />
              </div>
            </div>

            <!-- 蘑菇采摘体验 -->
            <div class="feature-card mushroom-picking" data-aos="fade-up">
              <div class="feature-background">
                <div class="feature-pattern mushroom-pattern"></div>
              </div>
              <div class="feature-content">
                <div class="feature-icon">
                  <SvgIcon name="spa" size="48" color="#549688" />
                </div>
                <h3>蘑菇采摘探险</h3>
                <p>深入原始森林，寻找珍贵野生蘑菇，体验自然馈赠</p>
                <div class="feature-highlights">
                  <div class="highlight-tag">专业向导带领</div>
                  <div class="highlight-tag">安全装备提供</div>
                  <div class="highlight-tag">蘑菇知识科普</div>
                </div>
                <button class="feature-btn">
                  <span>立即预约</span>
                  <SvgIcon name="chevron-right" size="16" />
                </button>
              </div>
            </div>

            <!-- 周边产品 -->
            <div class="feature-card products-showcase" data-aos="fade-left">
              <div class="feature-background">
                <div class="feature-pattern products-pattern"></div>
              </div>
              <div class="feature-content">
                <div class="feature-icon">
                  <SvgIcon name="gift" size="48" color="#e74c3c" />
                </div>
                <h3>精选周边产品</h3>
                <p>精心挑选的茶叶、蘑菇制品和手工艺品，带走庄园记忆</p>
                <div class="feature-highlights">
                  <div class="highlight-tag">有机认证产品</div>
                  <div class="highlight-tag">手工制作工艺</div>
                  <div class="highlight-tag">包装精美礼盒</div>
                </div>
                <button @click="$router.push('/surrounding-products')" class="feature-btn">
                  <span>浏览商品</span>
                  <SvgIcon name="shopping-cart" size="16" />
                </button>
              </div>
            </div>

            <!-- 庄园活动体验 -->
            <div class="feature-card estate-activities" data-aos="fade-up" data-aos-delay="400">
              <div class="feature-background">
                <div class="feature-pattern activities-pattern"></div>
              </div>
              <div class="feature-content">
                <div class="feature-icon">
                  <SvgIcon name="calendar-alt" size="48" color="#8b5cf6" />
                </div>
                <h3>庄园活动体验</h3>
                <p>丰富多彩的庄园活动，从森林徒步到星空观测，感受自然魅力</p>
                <div class="feature-highlights">
                  <div class="highlight-tag">森林徒步</div>
                  <div class="highlight-tag">星空观测</div>
                  <div class="highlight-tag">农耕体验</div>
                </div>
                <EstateActivityBooking />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 现代化设施展示区域 -->
      <section class="facilities-section">
        <div class="facilities-background">
          <div class="facilities-pattern"></div>
        </div>
        <div class="container">
          <div class="section-header">
            <div class="section-badge">
              <span class="badge-dot"></span>
              <span>精选设施</span>
            </div>
            <h2 class="section-title">
              <span class="title-highlight">生态设施</span>
              <span class="title-main">享受原生态的自然环境</span>
            </h2>
            <p class="section-subtitle">与贴心的生态服务，体验云南独特的自然魅力</p>
          </div>

          <!-- 主要设施展示 -->
          <div class="facilities-showcase">
            <div class="facility-card facility-primary" @click="handleBookingClick">
              <div class="facility-image">
                <img src="@/assets/images/实地调研/房间参观/房间参观1.jpg" alt="蘑菇森林小屋">
                <div class="facility-overlay">
                  <div class="overlay-gradient"></div>
                  <div class="facility-badge">
                    <SvgIcon name="home" size="20" />
                    <span>住宿体验</span>
                  </div>
                </div>
              </div>
              <div class="facility-content">
                <div class="facility-header">
                  <h3 class="facility-title">蘑菇森林小屋</h3>
                  <div class="facility-rating">
                    <SvgIcon name="star" size="16" color="#f59e0b" />
                    <span>4.9</span>
                  </div>
                </div>
                <p class="facility-desc">隐于原始森林中的生态小屋，与自然零距离接触，享受宁静的森林时光</p>
                <div class="facility-features">
                  <span class="feature-tag">
                    <SvgIcon name="leaf" size="14" color="#10b981" />
                    生态环保
                  </span>
                  <span class="feature-tag">
                    <SvgIcon name="wifi" size="14" color="#3b82f6" />
                    现代设施
                  </span>
                </div>
                <div class="facility-action">
                  <span class="action-text">立即预订</span>
                  <SvgIcon name="chevron-right" size="16" />
                </div>
              </div>
            </div>

            <div class="facility-card facility-primary" @click="handleTeaCultureClick">
              <div class="facility-image">
                <img src="@/assets/images/实地调研/茶叶产品调研/茶叶产品调研5.jpg" alt="普洱茶园">
                <div class="facility-overlay">
                  <div class="overlay-gradient"></div>
                  <div class="facility-badge">
                    <SvgIcon name="coffee" :size="20" />
                    <span>茶文化</span>
                  </div>
                </div>
              </div>
              <div class="facility-content">
                <div class="facility-header">
                  <h3 class="facility-title">普洱茶园</h3>
                  <div class="facility-rating">
                    <SvgIcon name="star" :size="16" />
                    <span>4.8</span>
                  </div>
                </div>
                <p class="facility-desc">千年茶树环绕，品味正宗普洱茶文化，体验从茶叶到茶杯的完整旅程</p>
                <div class="facility-features">
                  <span class="feature-tag">
                    <SvgIcon name="history" :size="14" />
                    千年传承
                  </span>
                  <span class="feature-tag">
                    <SvgIcon name="users" :size="14" />
                    专业导览
                  </span>
                </div>
                <div class="facility-action">
                  <span class="action-text">探索茶文化</span>
                  <SvgIcon name="arrow-right" :size="16" />
                </div>
              </div>
            </div>
          </div>

          <!-- 次要设施网格 -->
          <div class="facilities-grid">
            <div class="facility-card facility-secondary">
              <div class="facility-image-small">
                <img src="@/assets/images/环境展示/庄园内部1.jpg" alt="蘑菇生态园">
                <div class="facility-overlay-small">
                  <SvgIcon name="spa" :size="24" />
                </div>
              </div>
              <div class="facility-info">
                <h4 class="facility-name">蘑菇生态园</h4>
                <p class="facility-brief">亲手采摘新鲜蘑菇</p>
              </div>
            </div>

            <div class="facility-card facility-secondary">
              <div class="facility-image-small">
                <img src="@/assets/images/实地调研/茶叶产品调研/茶叶产品调研12.jpg" alt="茶文化体验馆">
                <div class="facility-overlay-small">
                  <SvgIcon name="university" :size="24" />
                </div>
              </div>
              <div class="facility-info">
                <h4 class="facility-name">茶文化体验馆</h4>
                <p class="facility-brief">深度了解茶文化历史</p>
              </div>
            </div>
            <div class="facility-card facility-secondary">
              <div class="facility-image-small">
                <img src="@/assets/images/环境展示/酒店门口2.jpg" alt="生态餐厅">
                <div class="facility-overlay-small">
                  <SvgIcon name="utensils" :size="24" />
                </div>
              </div>
              <div class="facility-info">
                <h4 class="facility-name">生态餐厅</h4>
                <p class="facility-brief">品尝地道云南美食</p>
              </div>
            </div>

            <div class="facility-card facility-secondary">
              <div class="facility-image-small">
                <img src="@/assets/images/实地调研/室外调研/室外1.jpg" alt="户外活动区">
                <div class="facility-overlay-small">
                  <SvgIcon name="hiking" :size="24" />
                </div>
              </div>
              <div class="facility-info">
                <h4 class="facility-name">户外活动区</h4>
                <p class="facility-brief">森林徒步与自然探索</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 现代化客户评价区域 -->
      <section class="reviews-section">
        <div class="reviews-background">
          <div class="reviews-pattern"></div>
        </div>
        <div class="container">
          <div class="section-header">
            <div class="section-badge">
              <span class="badge-dot"></span>
              <span>客户反馈</span>
            </div>
            <h2 class="section-title">
              <span class="title-highlight">客户评价</span>
              <span class="title-main">听听客人们的真实体验</span>
            </h2>
            <div class="reviews-stats">
              <div class="stat-item">
                <div class="stat-number">4.9</div>
                <div class="stat-label">平均评分</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">500+</div>
                <div class="stat-label">客户评价</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">98%</div>
                <div class="stat-label">推荐率</div>
              </div>
            </div>
          </div>

          <div class="reviews-showcase">
            <div class="review-card review-featured">
              <div class="review-quote">
                <SvgIcon name="quote-left" :size="32" />
              </div>
              <div class="review-content">
                <div class="review-rating">
                  <div class="stars">
                    <SvgIcon v-for="n in 5" :key="n" name="star" :size="16" class="active" />
                  </div>
                  <span class="rating-score">5.0</span>
                </div>
                <p class="review-text">
                  "这里真的是一个神奇的地方！蘑菇森林小屋让我感受到了与自然的完美融合，
                  茶道体验更是让人印象深刻。服务团队非常专业贴心，每一个细节都体现了对客人的用心。
                  强烈推荐给所有想要逃离城市喧嚣的朋友们！"
                </p>
                <div class="review-author">
                  <div class="author-avatar">
                    <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face" alt="张女士">
                  </div>
                  <div class="author-info">
                    <h4 class="author-name">张女士</h4>
                    <p class="author-details">上海 · 企业高管</p>
                    <div class="author-tags">
                      <span class="tag">茶文化爱好者</span>
                      <span class="tag">自然体验</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="reviews-grid">
              <div class="review-card review-compact">
                <div class="review-header">
                  <div class="review-rating">
                    <div class="stars">
                      <SvgIcon v-for="n in 5" :key="n" name="star" :size="14" class="active" />
                    </div>
                    <span class="rating-score">5.0</span>
                  </div>
                  <div class="review-date">2024年12月</div>
                </div>
                <p class="review-text">"山景房的视野太棒了！早上在阳台品茶看日出，感受到了前所未有的宁静与美好。"</p>
                <div class="review-author">
                  <div class="author-avatar">
                    <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" alt="李先生">
                  </div>
                  <div class="author-info">
                    <h5 class="author-name">李先生</h5>
                    <p class="author-location">北京</p>
                  </div>
                </div>
              </div>

              <div class="review-card review-compact">
                <div class="review-header">
                  <div class="review-rating">
                    <div class="stars">
                      <SvgIcon v-for="n in 5" :key="n" name="star" :size="14" class="active" />
                    </div>
                    <span class="rating-score">5.0</span>
                  </div>
                  <div class="review-date">2024年11月</div>
                </div>
                <p class="review-text">"蘑菇采摘体验太有趣了！孩子们玩得很开心，晚餐的蘑菇料理也特别美味。"</p>
                <div class="review-author">
                  <div class="author-avatar">
                    <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face" alt="王女士">
                  </div>
                  <div class="author-info">
                    <h5 class="author-name">王女士</h5>
                    <p class="author-location">深圳</p>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>
      </section>
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3 class="footer-logo">普洱蘑菇庄园</h3>
            <p class="footer-desc">云南山居度假体验的领导者，为您提供难忘的奢华住宿体验。</p>
            <div class="social-links">
              <a href="#" class="social-link">
                <SvgIcon name="facebook-f" :size="20" />
              </a>
              <a href="#" class="social-link">
                <SvgIcon name="weibo" :size="20" />
              </a>
              <a href="#" class="social-link">
                <SvgIcon name="wechat" :size="20" />
              </a>
            </div>
          </div>

          <div class="footer-section">
            <h4 class="footer-title">快速链接</h4>
            <ul class="footer-links">
              <li><a href="#" class="footer-link">精品客房</a></li>
              <li><a href="#" class="footer-link">餐饮美食</a></li>
              <li><a href="#" class="footer-link">休闲娱乐</a></li>
              <li><a href="#" class="footer-link">会议宴会</a></li>
            </ul>
          </div>

          <div class="footer-section">
            <h4 class="footer-title">服务支持</h4>
            <ul class="footer-links">
              <li><a @click.prevent="handleBookingClick" href="#" class="footer-link">在线预订</a></li>
              <li><a href="#" class="footer-link">客户服务</a></li>
              <li><a href="#" class="footer-link">常见问题</a></li>
              <li><a href="#" class="footer-link">联系我们</a></li>
            </ul>
          </div>

          <div class="footer-section">
            <h4 class="footer-title">联系信息</h4>
            <div class="contact-info">
              <div class="contact-item">
                <SvgIcon name="map-marker-alt" :size="16" />
                <span>云南省大理市古城区</span>
              </div>
              <div class="contact-item">
                <SvgIcon name="phone" :size="16" />
                <span>400-888-8888</span>
              </div>
              <div class="contact-item">
                <SvgIcon name="envelope" :size="16" />
                <span>info@hotel.com</span>
              </div>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <div class="footer-bottom-content">
            <p>&copy; 2025 普洱蘑菇庄园民宿. 保留所有权利.</p>
            <router-link to="/admin/login" class="admin-entrance-link">
              管理入口
            </router-link>
          </div>
        </div>
      </div>
    </footer>

    <!-- 全局IP助手 -->
    <!-- <GlobalIPAssistant /> -->

    <!-- AI推荐面板 -->
    <AIRecommendationPanel
      @room-selected="handleRoomSelected"
      @room-booked="handleRoomBooked"
      @room-viewed="handleRoomViewed"
    />

    <!-- 订单详情面板 -->
    <OrderDetailsPanel
      @package-selected="handlePackageSelected"
      @order-closed="handleOrderClosed"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import AppNavbar from '../components/AppNavbar.vue'
import SvgIcon from '../components/SvgIcon.vue'
import TeaExperienceBooking from '../components/TeaExperienceBooking.vue'
import EstateActivityBooking from '../components/EstateActivityBooking.vue'
import AIRecommendationPanel from '../components/AIRecommendationPanel.vue'
import OrderDetailsPanel from '../components/OrderDetailsPanel.vue'
// import GlobalIPAssistant from '../components/GlobalIPAssistant.vue'

const router = useRouter()
const auth = useAuthStore()

// 轮播图状态
const currentSlide = ref(0)
const totalSlides = 5
let slideInterval: number | null = null

// 粒子效果样式生成
const getParticleStyle = (_index: number) => {
  const size = Math.random() * 4 + 2
  const left = Math.random() * 100
  const animationDelay = Math.random() * 10
  const animationDuration = Math.random() * 20 + 10

  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    animationDelay: `${animationDelay}s`,
    animationDuration: `${animationDuration}s`
  }
}

// 处理预订按钮点击
const handleBookingClick = () => {
  if (auth.isAuthenticated) {
    router.push('/ai-rooms')
  } else {
    router.push('/login')
  }
}

// 处理了解更多按钮点击
const handleLearnMoreClick = () => {
  router.push('/ai-rooms')
}

// 处理茶文化点击
const handleTeaCultureClick = () => {
  if (auth.isAuthenticated) {
    router.push('/tea-culture')
  } else {
    router.push('/login')
  }
}

// 处理探索庄园点击
const handleExploreClick = () => {
  // 平滑滚动到介绍区域
  const introSection = document.querySelector('.intro-section')
  if (introSection) {
    introSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }
}

// 轮播图功能
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % totalSlides
  updateSlides()
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + totalSlides) % totalSlides
  updateSlides()
}

const goToSlide = (index: number) => {
  currentSlide.value = index
  updateSlides()
}

const updateSlides = () => {
  const slides = document.querySelectorAll('.carousel-slide')
  const indicators = document.querySelectorAll('.indicator')

  slides.forEach((slide, index) => {
    slide.classList.toggle('active', index === currentSlide.value)
  })

  indicators.forEach((indicator, index) => {
    indicator.classList.toggle('active', index === currentSlide.value)
  })
}

const startAutoSlide = () => {
  slideInterval = setInterval(nextSlide, 5000) // 每5秒切换
}

const stopAutoSlide = () => {
  if (slideInterval) {
    clearInterval(slideInterval)
    slideInterval = null
  }
}

// 初始化轮播图
const initCarousel = () => {
  // 设置背景图片
  const slides = document.querySelectorAll('.carousel-slide')
  const images = [
    '/src/assets/images/环境展示/酒店门口3（夜视）.jpg',
    '/src/assets/images/环境展示/庄园内部1.jpg',
    '/src/assets/images/环境展示/4.jpeg',
    '/src/assets/images/环境展示/5.jpeg',
    '/src/assets/images/环境展示/屋顶.jpg'
  ]

  slides.forEach((slide, index) => {
    const element = slide as HTMLElement
    element.style.backgroundImage = `url('${images[index]}')`
    element.style.backgroundSize = 'cover'
    element.style.backgroundPosition = 'center'
    element.style.backgroundRepeat = 'no-repeat'
  })

  // 开始自动播放
  startAutoSlide()

  // 鼠标悬停时停止自动播放
  const carouselContainer = document.querySelector('.carousel-container')
  if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', stopAutoSlide)
    carouselContainer.addEventListener('mouseleave', startAutoSlide)
  }
}

onMounted(() => {
  initCarousel()
})

// AI推荐面板处理方法
const handleRoomSelected = (room: any) => {
  console.log('房间被选中:', room)
  // 可以跳转到房间详情页面
  router.push(`/rooms/${room.id}`)
}

const handleRoomBooked = (room: any) => {
  console.log('预订房间:', room)
  // 可以跳转到预订页面
  if (auth.isAuthenticated) {
    router.push(`/booking/${room.id}`)
  } else {
    router.push('/login')
  }
}

const handleRoomViewed = (room: any) => {
  console.log('查看房间:', room)
  // 可以跳转到房间详情页面
  router.push(`/rooms/${room.id}`)
}

// 订单详情面板处理方法
const handlePackageSelected = (packageData: any) => {
  console.log('选择套餐:', packageData)
  // 处理套餐选择逻辑
}

const handleOrderClosed = () => {
  console.log('订单面板关闭')
  // 处理订单面板关闭逻辑
}

onMounted(() => {
  initCarousel()
})

onUnmounted(() => {
  stopAutoSlide()
})
</script>

<style scoped>
/* 基础样式 */
.page-container {
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.main-content {
  padding-top: 70px; /* 为固定导航栏留出空间 */
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* 现代化英雄区域样式 */
.hero-section {
  position: relative;
  height: 100vh;
  min-height: 700px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.carousel-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.carousel-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: all 1.5s cubic-bezier(0.4, 0, 0.2, 1);
  transform: scale(1.1);
}

.carousel-slide.active {
  opacity: 1;
  transform: scale(1);
}

.slide-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.4) 0%,
    rgba(0, 0, 0, 0.2) 50%,
    rgba(0, 0, 0, 0.6) 100%
  );
  z-index: 2;
}

/* 粒子效果 */
.hero-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  pointer-events: none;
}

.particle {
  position: absolute;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: float 15s infinite linear;
}

@keyframes float {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) rotate(360deg);
    opacity: 0;
  }
}

/* 浮动装饰元素 */
.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  pointer-events: none;
}

.floating-leaf {
  position: absolute;
  width: 20px;
  height: 20px;
  background: rgba(84, 150, 136, 0.3);
  border-radius: 50% 0;
  animation: leafFloat 20s infinite ease-in-out;
}

.floating-leaf-1 {
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.floating-leaf-2 {
  top: 60%;
  right: 15%;
  animation-delay: 7s;
}

.floating-leaf-3 {
  top: 40%;
  left: 80%;
  animation-delay: 14s;
}

@keyframes leafFloat {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-20px) rotate(90deg);
  }
  50% {
    transform: translateY(-10px) rotate(180deg);
  }
  75% {
    transform: translateY(-30px) rotate(270deg);
  }
}

/* 英雄内容区域 */
.hero-content-wrapper {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
}

.hero-content {
  animation: heroFadeIn 1.5s ease-out;
}

@keyframes heroFadeIn {
  0% {
    opacity: 0;
    transform: translateY(50px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  padding: 0.5rem 1.5rem;
  margin-bottom: 2rem;
  animation: badgeFloat 3s ease-in-out infinite;
}

@keyframes badgeFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.badge-icon {
  font-size: 1.2rem;
}

.badge-text {
  color: white;
  font-weight: 500;
  font-size: 0.9rem;
}

.hero-title {
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 800;
  color: white;
  margin-bottom: 1.5rem;
  line-height: 1.1;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.hero-title .title-main {
  display: inline-block;
  background: linear-gradient(to bottom, #b3c7a5 0%, #d9e1c7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: none;
}

.title-sub {
  display: block;
  font-size: 0.7em;
  background: linear-gradient(to bottom, #a7ca87 0%, #0cd398 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-top: 0.5rem;
}

.hero-subtitle {
  font-size: clamp(1.1rem, 2.5vw, 1.5rem);
  color: #7e9e68;
  font-weight: 600;
  margin-bottom: 2.5rem;
  line-height: 1.6;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.subtitle-highlight {
  color: #549688;
  font-weight: 600;
}

.hero-features {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  font-size: 0.9rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  padding: 0.75rem 1.5rem;
  transition: all 0.3s ease;
}

.feature-item:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.feature-item i {
  color: #549688;
  font-size: 1.1rem;
}

.hero-buttons {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-glow {
  position: relative;
  overflow: hidden;
}

.btn-glow::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.btn-glow:hover::before {
  left: 100%;
}

.btn-glass {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
}

.btn-glass:hover {
  background: rgba(255, 255, 255, 0.2) !important;
}

.btn-text {
  margin-right: 0.5rem;
}

.btn-icon {
  transition: transform 0.3s ease;
}

.btn:hover .btn-icon {
  transform: translateX(3px);
}

/* 现代化轮播控制 */
.carousel-controls {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  padding: 0 2rem;
  z-index: 15;
}

.carousel-btn {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 20px;
  color: white;
  opacity: 0.7;
}

.carousel-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
  opacity: 1;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.carousel-btn:active {
  transform: scale(0.95);
}

/* 现代化指示器 */
.carousel-indicators {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1rem;
  z-index: 15;
}

.indicator {
  position: relative;
  width: 40px;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border: none;
  border-radius: 2px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
}

.indicator:hover {
  background: rgba(255, 255, 255, 0.5);
}

.indicator.active {
  background: rgba(255, 255, 255, 0.6);
}

.indicator-progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: white;
  border-radius: 2px;
  width: 0;
  transition: width 0.3s ease;
}

.indicator.active .indicator-progress {
  width: 100%;
}

/* 滚动提示 */
.scroll-indicator {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: white;
  z-index: 15;
  animation: scrollPulse 2s ease-in-out infinite;
}

@keyframes scrollPulse {
  0%, 100% {
    opacity: 0.7;
    transform: translateX(-50%) translateY(0);
  }
  50% {
    opacity: 1;
    transform: translateX(-50%) translateY(-5px);
  }
}

.scroll-text {
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.scroll-arrow {
  font-size: 1.2rem;
  animation: bounce 1s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(5px);
  }
}



/* 按钮样式 */
.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 25px;
  font-weight: 600;
  text-decoration: none;
  display: inline-block;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-primary {
  background: linear-gradient(to bottom, #a7ca87 0%, #0cd398 100%);
  color: white;
}

.btn-primary:hover {
  background: linear-gradient(to bottom, #549688 0%, #7e9e68 100%);
}

.btn-outline {
  background-color: transparent;
  color: #549688;
  border: 2px solid #549688;
}

.btn-outline:hover {
  background-color: #549688;
  color: white;
}

.btn-outline-white {
  background-color: transparent;
  color: white;
  border: 2px solid white;
}

.btn-outline-white:hover {
  background-color: white;
  color: #549688;
}

.btn-large {
  padding: 16px 32px;
  font-size: 18px;
}

/* 现代化介绍区域样式 */
.intro-section {
  position: relative;
  padding: 120px 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  overflow: hidden;
}

.intro-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.intro-pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    radial-gradient(circle at 25% 25%, rgba(84, 150, 136, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(84, 150, 136, 0.05) 0%, transparent 50%);
  background-size: 400px 400px;
  animation: patternMove 20s ease-in-out infinite;
}

@keyframes patternMove {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(20px, -20px);
  }
}

.intro-content {
  position: relative;
  z-index: 10;
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.intro-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(84, 150, 136, 0.1);
  border: 1px solid rgba(84, 150, 136, 0.2);
  border-radius: 50px;
  padding: 0.75rem 1.5rem;
  margin-bottom: 2rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: #549688;
  animation: badgeGlow 3s ease-in-out infinite;
}

@keyframes badgeGlow {
  0%, 100% {
    box-shadow: 0 0 0 rgba(84, 150, 136, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(84, 150, 136, 0.3);
  }
}

.badge-dot {
  width: 8px;
  height: 8px;
  background: #549688;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
}

.section-title {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 800;
  margin-bottom: 2rem;
  line-height: 1.2;
}

.title-highlight {
  display: block;
  background: linear-gradient(to bottom, #a7ca87 0%, #0cd398 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 0.8em;
  margin-bottom: 0.5rem;
}

.intro-description {
  max-width: 800px;
  margin: 0 auto 3rem;
}

.intro-text {
  font-size: 1.2rem;
  color: #6b7280;
  line-height: 1.8;
  margin-bottom: 0;
}

.intro-highlights {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin: 4rem 0;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

.highlight-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid rgba(212, 175, 55, 0.1);
}

.highlight-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  border-color: rgba(212, 175, 55, 0.3);
}

.highlight-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #549688 0%, #7e9e68 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.highlight-content h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.highlight-content p {
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0;
}

.intro-buttons {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 3rem;
}

.btn-modern {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn-modern::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.btn-modern:hover::before {
  left: 100%;
}

.btn-modern i {
  transition: transform 0.3s ease;
}

.btn-modern:hover i {
  transform: translateX(3px);
}

/* 现代化设施区域样式 */
.facilities-section {
  position: relative;
  padding: 120px 0;
  background: #ffffff;
  overflow: hidden;
}

.facilities-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.facilities-pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    linear-gradient(45deg, rgba(212, 175, 55, 0.03) 25%, transparent 25%),
    linear-gradient(-45deg, rgba(212, 175, 55, 0.03) 25%, transparent 25%);
  background-size: 60px 60px;
  background-position: 0 0, 30px 30px;
}

.facilities-showcase {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 3rem;
  margin-bottom: 4rem;
}

.facility-card.facility-primary {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(212, 175, 55, 0.1);
}

.facility-card.facility-primary:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border-color: rgba(212, 175, 55, 0.3);
}

.facility-image {
  position: relative;
  height: 280px;
  overflow: hidden;
}

.facility-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.facility-card:hover .facility-image img {
  transform: scale(1.1);
}

.facility-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}

.overlay-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.3) 0%,
    rgba(0, 0, 0, 0.1) 50%,
    rgba(0, 0, 0, 0.4) 100%
  );
}

.facility-badge {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 25px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: #d4af37;
}

.facility-content {
  padding: 2rem;
}

.facility-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.facility-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.facility-rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: #f59e0b;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.9rem;
  font-weight: 600;
}

.facility-desc {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.facility-features {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.feature-tag {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: rgba(212, 175, 55, 0.1);
  color: #d4af37;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.facility-action {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #d4af37;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.facility-action:hover {
  gap: 1rem;
}

.facilities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.facility-card.facility-secondary {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid rgba(212, 175, 55, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.facility-card.facility-secondary:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  border-color: rgba(212, 175, 55, 0.3);
}

.facility-image-small {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
}

.facility-image-small img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.facility-overlay-small {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(212, 175, 55, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.facility-card.facility-secondary:hover .facility-overlay-small {
  opacity: 1;
}

.facility-info h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.facility-brief {
  color: #6b7280;
  font-size: 0.9rem;
  margin: 0;
}

/* 现代化评价区域样式 */
.reviews-section {
  position: relative;
  padding: 120px 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  overflow: hidden;
}

.reviews-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.reviews-pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    radial-gradient(circle at 20% 80%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.05) 0%, transparent 50%);
  background-size: 600px 600px;
  animation: patternMove 25s ease-in-out infinite;
}

.reviews-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin: 2rem 0 4rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(to bottom, #a7ca87 0%, #0cd398 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #6b7280;
  font-weight: 500;
}

.reviews-showcase {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: start;
}

.review-featured {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.1);
  position: relative;
}

.review-quote {
  position: absolute;
  top: -15px;
  left: 3rem;
  width: 40px;
  height: 40px;
  background: #549688;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

.review-content .review-rating {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stars {
  display: flex;
  gap: 0.25rem;
  color: #f59e0b;
}

.rating-score {
  font-weight: 600;
  color: #1f2937;
}

.review-text {
  font-size: 1.1rem;
  line-height: 1.7;
  color: #374151;
  margin-bottom: 2rem;
}

.review-author {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.author-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.author-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-info h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.author-details {
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
}

.author-tags {
  display: flex;
  gap: 0.5rem;
}

.tag {
  background: rgba(84, 150, 136, 0.1);
  color: #549688;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.reviews-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.review-compact {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(212, 175, 55, 0.1);
  transition: all 0.3s ease;
}

.review-compact:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.review-date {
  color: #9ca3af;
  font-size: 0.8rem;
}

.review-compact .review-text {
  font-size: 0.95rem;
  margin-bottom: 1rem;
  font-style: normal;
}

.review-compact .review-author {
  gap: 0.75rem;
}

.review-compact .author-avatar {
  width: 40px;
  height: 40px;
}

.review-compact .author-info h5 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.author-location {
  color: #6b7280;
  font-size: 0.8rem;
  margin: 0;
}



/* 页脚样式 */
.footer {
  background-color: #1f2937;
  color: white;
  padding: 60px 0 20px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-bottom: 40px;
}

.footer-logo {
  font-size: 1.75rem;
  font-weight: bold;
  background: linear-gradient(to bottom, #a7ca87 0%, #0cd398 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
}

.footer-desc {
  color: #d1d5db;
  line-height: 1.6;
  margin-bottom: 24px;
}

.footer-bottom {
  border-top: 1px solid #374151;
  padding-top: 24px;
  text-align: center;
  color: #9ca3af;
}

.footer-bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.admin-entrance-link {
  color: #9ca3af;
  text-decoration: none;
  font-size: 0.8rem;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.3s ease;
  opacity: 0.6;
}

.admin-entrance-link:hover {
  color: #4caf50;
  background: rgba(76, 175, 80, 0.1);
  opacity: 1;
}

/* 动画效果 */
.fade-in {
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}









/* 响应式设计 */
@media (max-width: 1200px) {
  .hero-content-wrapper {
    padding: 0 1.5rem;
  }

  .intro-highlights {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
  }

  .facilities-showcase {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .reviews-showcase {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .reviews-stats {
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  .hero-section {
    min-height: 600px;
  }

  .hero-content-wrapper {
    padding: 0 1rem;
  }

  .hero-features {
    flex-direction: column;
    gap: 1rem;
  }

  .hero-buttons {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .btn-large {
    width: 100%;
    max-width: 280px;
  }

  .carousel-controls {
    padding: 0 1rem;
  }

  .carousel-btn {
    width: 50px;
    height: 50px;
    font-size: 18px;
  }

  .intro-section {
    padding: 80px 0;
  }

  .intro-content {
    padding: 0 1rem;
  }

  .intro-highlights {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin: 2rem 0;
  }

  .highlight-item {
    padding: 1rem;
  }

  .highlight-icon {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }

  .intro-buttons {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  /* 设施区域移动端优化 */
  .facilities-section {
    padding: 80px 0;
  }

  .facilities-showcase {
    gap: 1.5rem;
  }

  .facility-card.facility-primary {
    border-radius: 16px;
  }

  .facility-image {
    height: 200px;
  }

  .facility-content {
    padding: 1.5rem;
  }

  .facility-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .facilities-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .facility-card.facility-secondary {
    padding: 1rem;
  }

  /* 评价区域移动端优化 */
  .reviews-section {
    padding: 80px 0;
  }

  .reviews-stats {
    flex-direction: column;
    gap: 1.5rem;
  }

  .review-featured {
    padding: 2rem;
    border-radius: 16px;
  }

  .review-author {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .author-tags {
    flex-wrap: wrap;
  }

  .footer-bottom-content {
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }
}

/* 彩色特色展示区域样式 */
.colorful-features-section {
  padding: 120px 0;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  position: relative;
  overflow: hidden;
}



.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  position: relative;
  z-index: 1;
}

.feature-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.feature-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.1;
  transition: opacity 0.3s ease;
}

.feature-card:hover .feature-background {
  opacity: 0.2;
}

.feature-pattern {
  width: 100%;
  height: 100%;
  background-size: 60px 60px;
}

.tea-pattern {
  background: linear-gradient(45deg, rgba(16, 185, 129, 0.1) 25%, transparent 25%);
}

.mushroom-pattern {
  background: radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.1) 20%, transparent 21%);
}

.products-pattern {
  background: linear-gradient(45deg, rgba(231, 76, 60, 0.1) 25%, transparent 25%);
}

.activities-pattern {
  background: linear-gradient(45deg, rgba(139, 92, 246, 0.1) 25%, transparent 25%);
}

.feature-content {
  padding: 2.5rem;
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.feature-icon {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  width: fit-content;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.feature-card h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.feature-card p {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  flex-grow: 1;
}

.feature-highlights {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.highlight-tag {
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
  color: #374151;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.feature-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #549688, #7e9e68);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: fit-content;
  margin-top: auto;
}

.feature-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(84, 150, 136, 0.3);
}

/* 特色卡片特定样式 */
.tea-culture {
  border-left: 4px solid #10b981;
}

.mushroom-picking {
  border-left: 4px solid #549688;
}

.products-showcase {
  border-left: 4px solid #e74c3c;
}

.estate-activities {
  border-left: 4px solid #8b5cf6;
}

/* 统计数据样式增强 */
.highlight-stats {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(84, 150, 136, 0.1);
  border-radius: 8px;
  border-left: 3px solid #549688;
}

@media (max-width: 480px) {
  .hero-section {
    min-height: 500px;
  }

  .hero-badge {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }

  .hero-features,
  .scroll-indicator {
    display: none;
  }

  .carousel-indicators {
    bottom: 1rem;
  }

  .indicator {
    width: 30px;
    height: 3px;
  }

  .intro-badge {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }

  .highlight-item {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }

  /* 彩色特色区域移动端优化 */
  .colorful-features-section {
    padding: 80px 0;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .feature-content {
    padding: 2rem;
  }

  .feature-card h3 {
    font-size: 1.25rem;
  }

  .feature-highlights {
    gap: 0.25rem;
  }

  .highlight-tag {
    font-size: 0.75rem;
    padding: 0.375rem 0.75rem;
  }

  /* 设施区域小屏优化 */
  .facility-content {
    padding: 1rem;
  }

  .facility-features {
    flex-direction: column;
    gap: 0.5rem;
  }

  .feature-tag {
    justify-content: center;
  }

  .facility-card.facility-secondary {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }

  .facility-image-small {
    width: 60px;
    height: 60px;
  }

  /* 评价区域小屏优化 */
  .review-featured {
    padding: 1.5rem;
  }

  .review-text {
    font-size: 1rem;
  }

  .author-tags {
    justify-content: center;
  }

  .reviews-stats {
    gap: 1rem;
  }

  .stat-number {
    font-size: 2rem;
  }
}
</style>
