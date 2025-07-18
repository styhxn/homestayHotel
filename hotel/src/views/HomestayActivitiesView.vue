<template>
  <div class="page-container">
    <AppNavbar />
    <main class="main-content">
      <!-- 现代化庄园活动英雄区域 -->
      <section class="activities-hero">
        <div class="hero-background">
          <div class="hero-carousel">
            <div class="hero-slide active" style="background-image: url('/src/assets/images/实地调研/茶叶产品调研/茶叶产品调研10.jpg')">
              <div class="slide-overlay"></div>
            </div>
            <div class="hero-slide" style="background-image: url('/src/assets/images/实地调研/茶叶产品调研/茶叶产品调研15.jpg')">
              <div class="slide-overlay"></div>
            </div>
            <div class="hero-slide" style="background-image: url('/src/assets/images/实地调研/茶叶产品调研/茶叶产品调研8.jpg')">
              <div class="slide-overlay"></div>
            </div>
          </div>
        </div>

        <div class="hero-content">
          <div class="hero-badge slide-in-left">
            <span class="badge-icon">🎯</span>
            <span class="badge-text">精彩体验</span>
          </div>
          <h1 class="hero-title fade-in-up">
            <span class="title-main gradient-text">庄园活动体验</span>
            <span class="title-sub">沉浸式云南生态文化之旅</span>
          </h1>
          <p class="hero-subtitle slide-in-right">
            在这里，每一次体验都是难忘的庄园时光
          </p>

          <!-- 活动统计 -->
          <div class="hero-stats">
            <div class="stat-item">
              <div class="stat-number">20+</div>
              <div class="stat-label">精彩活动</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">4.9</div>
              <div class="stat-label">用户评分</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">1000+</div>
              <div class="stat-label">参与人次</div>
            </div>
          </div>

          <div class="hero-buttons fade-in-up">
            <button @click="scrollToActivities" class="btn btn-primary btn-large glowing glass-effect">
              <span class="btn-text">探索活动</span>
              <span class="btn-icon">🎯</span>
            </button>
            <button @click="goToAIRooms" class="btn btn-booking btn-large glass-effect">
              <span class="btn-text">立即预订</span>
              <span class="btn-icon">📅</span>
            </button>
            <button @click="scrollToCalendar" class="btn btn-outline-white btn-large glass-effect">
              <span class="btn-text">查看日程</span>
              <span class="btn-icon">📋</span>
            </button>
          </div>
        </div>

        <!-- 滚动提示 -->
        <div class="scroll-indicator">
          <div class="scroll-text">探索活动</div>
          <div class="scroll-arrow">
            <SvgIcon name="chevron-down" :size="20" />
          </div>
        </div>
      </section>

      <!-- 现代化活动分类导航 -->
      <section class="category-section">
        <div class="category-background">
          <div class="category-pattern"></div>
        </div>
        <div class="container">
          <div class="section-header">
            <div class="section-badge">
              <span class="badge-dot"></span>
              <span>活动分类</span>
            </div>
            <h2 class="section-title">
              <span class="title-highlight">精选体验</span>
              <span class="title-main">发现您感兴趣的活动类型</span>
            </h2>
          </div>

          <div class="category-showcase">
            <div
              v-for="category in categories"
              :key="category.id"
              @click="activeCategory = category.id"
              class="category-card"
              :class="{ active: activeCategory === category.id }"
            >
              <div class="category-icon">
                <SvgIcon :name="getCategoryIconName(category.icon)" :size="32" />
              </div>
              <div class="category-content">
                <h3 class="category-name">{{ category.name }}</h3>
                <p class="category-desc">{{ category.description }}</p>
                <div class="category-count">{{ getCategoryCount(category.id) }}个活动</div>
              </div>
              <div class="category-arrow">
                <SvgIcon name="arrow-right" :size="20" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 热门活动推荐 -->
      <section id="featured-activities" class="featured-section">
        <div class="featured-background">
          <div class="featured-pattern"></div>
        </div>
        <div class="container">
          <div class="section-header">
            <div class="section-badge">
              <span class="badge-dot pulse"></span>
              <span>热门推荐</span>
            </div>
            <h2 class="section-title">
              <span class="title-highlight">精选体验</span>
              <span class="title-main">最受欢迎的庄园活动</span>
            </h2>
            <p class="section-subtitle">
              精心挑选的特色体验项目，让您深度感受庄园魅力，
              每一个活动都经过专业设计，确保为您带来难忘的体验。
            </p>
          </div>

          <div class="featured-showcase">
            <div
              v-for="activity in featuredActivities"
              :key="activity.id"
              class="featured-card"
              @click="showActivityDetail(activity)"
            >
              <div class="activity-image-container">
                <div class="activity-image">
                  <img :src="activity.image" :alt="activity.name">
                  <div class="image-overlay">
                    <div class="overlay-content">
                      <button @click.stop="handleQuickBooking(activity)" class="quick-book-btn">
                        <SvgIcon name="calendar-plus" :size="16" />
                        快速预订
                      </button>
                      <button @click.stop="showActivityDetail(activity)" class="quick-view-btn">
                        <SvgIcon name="eye" :size="16" />
                        查看详情
                      </button>
                    </div>
                  </div>
                </div>
                <div class="activity-badges">
                  <span class="badge" :class="getBadgeClass(activity.badge)">{{ activity.badge }}</span>
                  <span v-if="activity.isNew" class="badge badge-new">新品</span>
                </div>
                <div class="activity-rating-overlay">
                  <div class="stars">
                    <SvgIcon v-for="n in 5" :key="n" name="star" :size="14" :class="{ active: n <= activity.rating }" />
                  </div>
                  <span class="rating-score">{{ activity.rating }}</span>
                </div>
              </div>

              <div class="activity-content">
                <div class="activity-category">{{ getCategoryName(activity.categoryId) }}</div>
                <h3 class="activity-title">{{ activity.name }}</h3>
                <p class="activity-desc">{{ activity.description }}</p>

                <div class="activity-highlights">
                  <div class="highlight-item">
                    <SvgIcon name="users" :size="14" />
                    <span>{{ activity.groupSize }}</span>
                  </div>
                  <div class="highlight-item">
                    <SvgIcon name="clock" :size="14" />
                    <span>{{ activity.duration }}</span>
                  </div>
                  <div class="highlight-item">
                    <SvgIcon name="map-marker-alt" :size="14" />
                    <span>{{ activity.location || '庄园内' }}</span>
                  </div>
                </div>

                <div class="activity-footer">
                  <div class="activity-price">
                    <span class="current-price">¥{{ activity.price }}</span>
                    <span v-if="activity.originalPrice" class="original-price">¥{{ activity.originalPrice }}</span>
                    <span class="price-unit">/人</span>
                  </div>
                  <div class="activity-actions">
                    <button @click.stop="handleActivityBooking(activity)" class="btn-book">
                      立即预订
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 全部活动列表区域 -->
      <section id="all-activities" class="activities-section">
        <div class="activities-background">
          <div class="activities-pattern"></div>
        </div>
        <div class="container">
          <div class="section-header">
            <div class="section-badge">
              <span class="badge-dot"></span>
              <span>全部活动</span>
            </div>
            <h2 class="section-title">
              <span class="title-highlight">精彩体验</span>
              <span class="title-main">发现更多庄园活动</span>
            </h2>
            <p class="section-subtitle">
              从传统文化到现代体验，从室内活动到户外探索，
              丰富多样的活动选择，满足不同兴趣和需求。
            </p>
          </div>

          <!-- 活动筛选器 -->
          <div class="activity-filters">
            <div class="filter-group">
              <label class="filter-label">活动类型：</label>
              <div class="filter-options">
                <button
                  v-for="category in categories"
                  :key="category.id"
                  @click="activeCategory = category.id"
                  class="filter-btn"
                  :class="{ active: activeCategory === category.id }"
                >
                  <i :class="category.icon"></i>
                  {{ category.name }}
                </button>
              </div>
            </div>
            <div class="filter-group">
              <label class="filter-label">价格范围：</label>
              <div class="filter-options">
                <button
                  v-for="priceRange in priceRanges"
                  :key="priceRange.id"
                  @click="activePriceRange = priceRange.id"
                  class="filter-btn"
                  :class="{ active: activePriceRange === priceRange.id }"
                >
                  {{ priceRange.label }}
                </button>
              </div>
            </div>
          </div>

          <div class="activities-grid">
            <div
              v-for="activity in filteredActivities"
              :key="activity.id"
              class="activity-card"
              @click="showActivityDetail(activity)"
            >
              <div class="activity-image-wrapper">
                <div class="activity-image">
                  <img :src="activity.image" :alt="activity.name">
                  <div class="image-gradient"></div>
                </div>
                <div class="activity-overlay">
                  <div class="overlay-actions">
                    <button @click.stop="handleQuickBooking(activity)" class="quick-action-btn">
                      <SvgIcon name="calendar-plus" :size="18" />
                    </button>
                    <button @click.stop="toggleFavorite(activity)" class="quick-action-btn">
                      <SvgIcon name="heart" :size="18" :class="{ active: activity.isFavorite }" />
                    </button>
                  </div>
                </div>
                <div class="activity-category-tag">{{ activity.category }}</div>
                <div class="activity-rating-badge">
                  <SvgIcon name="star" :size="14" />
                  <span>{{ activity.rating }}</span>
                </div>
              </div>

              <div class="activity-info">
                <div class="activity-header">
                  <h4 class="activity-name">{{ activity.name }}</h4>
                  <div class="activity-price-badge">
                    <span class="price">¥{{ activity.price }}</span>
                  </div>
                </div>
                <p class="activity-summary">{{ activity.summary }}</p>

                <div class="activity-meta">
                  <div class="meta-item">
                    <SvgIcon name="clock" :size="14" />
                    <span>{{ activity.duration }}</span>
                  </div>
                  <div class="meta-item">
                    <SvgIcon name="users" :size="14" />
                    <span>{{ activity.groupSize }}</span>
                  </div>
                  <div class="meta-item">
                    <SvgIcon name="map-marker-alt" :size="14" />
                    <span>{{ activity.location || '庄园内' }}</span>
                  </div>
                </div>

                <div class="activity-features">
                  <span v-for="feature in activity.features" :key="feature" class="feature-tag">
                    {{ feature }}
                  </span>
                </div>

                <div class="activity-footer">
                  <div class="reviews-info">
                    <div class="stars-small">
                      <SvgIcon v-for="n in 5" :key="n" name="star" :size="12" :class="{ active: n <= activity.rating }" />
                    </div>
                    <span class="reviews-count">({{ activity.reviews }}条评价)</span>
                  </div>
                  <div class="activity-actions">
                    <button @click.stop="showActivityDetail(activity)" class="btn-detail">
                      详情
                    </button>
                    <button @click.stop="handleActivityBooking(activity)" class="btn-book">
                      预订
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="section-footer">
            <div class="load-more-container">
              <button @click="loadMoreActivities" class="btn btn-outline btn-large" :disabled="isLoading">
                <span v-if="!isLoading">查看更多活动</span>
                <span v-else>
                  <SvgIcon name="spinner" :size="16" class="loading-spinner" />
                  加载中...
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- 活动日历区域 -->
      <section class="calendar-section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">活动日程</h2>
            <p class="section-subtitle">查看近期活动安排</p>
          </div>
          
          <div class="calendar-container">
            <div class="calendar-header">
              <button class="calendar-nav-btn">
                <SvgIcon name="chevron-left" :size="20" />
              </button>
              <h3 class="calendar-title">2025年1月</h3>
              <button class="calendar-nav-btn">
                <SvgIcon name="chevron-right" :size="20" />
              </button>
            </div>
            
            <div class="calendar-grid">
              <div class="calendar-day-header">日</div>
              <div class="calendar-day-header">一</div>
              <div class="calendar-day-header">二</div>
              <div class="calendar-day-header">三</div>
              <div class="calendar-day-header">四</div>
              <div class="calendar-day-header">五</div>
              <div class="calendar-day-header">六</div>
              
              <div 
                v-for="day in calendarDays" 
                :key="day.date"
                class="calendar-day"
                :class="{ 
                  'has-activity': day.hasActivity,
                  'today': day.isToday,
                  'other-month': day.isOtherMonth
                }"
              >
                <span class="day-number">{{ day.day }}</span>
                <div v-if="day.hasActivity" class="activity-indicator"></div>
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
            <p class="footer-desc">体验云南生态文化，享受自然庄园生活</p>
            <div class="social-links">
              <a href="#" class="social-link"><SvgIcon name="facebook-f" :size="20" /></a>
              <a href="#" class="social-link"><SvgIcon name="weibo" :size="20" /></a>
              <a href="#" class="social-link"><SvgIcon name="wechat" :size="20" /></a>
            </div>
          </div>
          <div class="footer-section">
            <h4 class="footer-title">活动分类</h4>
            <ul class="footer-links">
              <li><a href="#" class="footer-link">茶艺体验</a></li>
              <li><a href="#" class="footer-link">蘑菇采摘</a></li>
              <li><a href="#" class="footer-link">户外探索</a></li>
              <li><a href="#" class="footer-link">文化体验</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4 class="footer-title">预订服务</h4>
            <ul class="footer-links">
              <li><a href="#" class="footer-link">在线预订</a></li>
              <li><a href="#" class="footer-link">团体预订</a></li>
              <li><a href="#" class="footer-link">取消政策</a></li>
              <li><a href="#" class="footer-link">客户服务</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4 class="footer-title">联系我们</h4>
            <div class="contact-info">
              <div class="contact-item">
                <SvgIcon name="map-marker-alt" :size="16" />
                <span>云南省普洱市</span>
              </div>
              <div class="contact-item">
                <SvgIcon name="phone" :size="16" />
                <span>400-888-8888</span>
              </div>
              <div class="contact-item">
                <SvgIcon name="envelope" :size="16" />
                <span>activities@hotel.com</span>
              </div>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2025 普洱蘑菇庄园民宿. 保留所有权利.</p>
        </div>
      </div>
    </footer>

    <!-- 滚动到顶部按钮 -->
    <button
      v-show="showScrollTop"
      @click="scrollToTop"
      class="scroll-top-btn floating"
      title="回到顶部"
    >
      <SvgIcon name="chevron-up" :size="24" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import AppNavbar from '../components/AppNavbar.vue'
import SvgIcon from '../components/SvgIcon.vue'

const router = useRouter()
const auth = useAuthStore()

// 响应式数据
const activeCategory = ref('all')
const activePriceRange = ref('all')
const isLoading = ref(false)
const showScrollTop = ref(false)

// 活动分类
const categories = ref([
  {
    id: 'all',
    name: '全部活动',
    icon: 'fas fa-th-large',
    description: '探索所有精彩活动'
  },
  {
    id: 'tea',
    name: '茶艺体验',
    icon: 'fas fa-leaf',
    description: '品味千年茶文化'
  },
  {
    id: 'mushroom',
    name: '蘑菇采摘',
    icon: 'fas fa-seedling',
    description: '体验自然馈赠'
  },
  {
    id: 'outdoor',
    name: '户外探索',
    icon: 'fas fa-mountain',
    description: '拥抱大自然'
  },
  {
    id: 'culture',
    name: '文化体验',
    icon: 'fas fa-palette',
    description: '传承民族文化'
  },
  {
    id: 'wellness',
    name: '养生休闲',
    icon: 'fas fa-spa',
    description: '身心灵的放松'
  }
])

// 价格范围
const priceRanges = ref([
  { id: 'all', label: '全部价格' },
  { id: 'low', label: '¥100以下', min: 0, max: 100 },
  { id: 'medium', label: '¥100-200', min: 100, max: 200 },
  { id: 'high', label: '¥200以上', min: 200, max: 9999 }
])

// 热门活动
const featuredActivities = ref([
  {
    id: 1,
    name: '古树茶道体验',
    description: '在专业茶艺师指导下，学习传统普洱茶制作工艺，品味千年茶文化的深厚底蕴。从茶叶采摘到制作，从冲泡技巧到品茗礼仪，全方位体验茶文化的魅力。',
    image: '/src/assets/images/产品/茶饼/茶饼原料1.jpg',
    categoryId: 'tea',
    price: 188,
    originalPrice: 228,
    duration: '3小时',
    groupSize: '6-12人',
    location: '茶艺馆',
    rating: 4.9,
    reviews: 156,
    badge: '热门',
    isNew: false,
    features: ['专业指导', '茶具赠送', '茶叶品鉴'],
    isFavorite: false
  },
  {
    id: 2,
    name: '野生蘑菇采摘',
    description: '深入原始森林，在专业向导带领下寻找和采摘各种野生蘑菇，体验自然馈赠的神奇。学习蘑菇识别知识，了解生态环境，享受森林漫步的乐趣。',
    image: '/src/assets/images/产品/蘑菇/蘑菇1.jpg',
    categoryId: 'mushroom',
    price: 128,
    originalPrice: null,
    duration: '4小时',
    groupSize: '4-8人',
    location: '原始森林',
    rating: 4.8,
    reviews: 89,
    badge: '推荐',
    isNew: false,
    features: ['专业向导', '安全装备', '蘑菇料理'],
    isFavorite: false
  },
  {
    id: 3,
    name: '庄园瑜伽冥想',
    description: '在茶园中进行晨间瑜伽，感受自然的宁静与和谐，净化身心。专业瑜伽导师指导，配合冥想练习，在大自然中找到内心的平静。',
    image: '/src/assets/images/实地调研/茶叶产品调研/茶叶产品调研8.jpg',
    categoryId: 'wellness',
    price: 98,
    originalPrice: null,
    duration: '2小时',
    groupSize: '8-15人',
    location: '茶园',
    rating: 4.7,
    reviews: 234,
    badge: '新品',
    isNew: true,
    features: ['专业指导', '瑜伽垫', '冥想音乐'],
    isFavorite: false
  },
  {
    id: 4,
    name: '传统手工艺制作',
    description: '学习云南传统手工艺品制作，体验非物质文化遗产的魅力。在老师傅的指导下，亲手制作具有民族特色的工艺品，感受传统文化的深厚底蕴。',
    image: '/src/assets/images/实地调研/茶叶产品调研/茶叶产品调研15.jpg',
    categoryId: 'culture',
    price: 158,
    originalPrice: 188,
    duration: '3小时',
    groupSize: '6-10人',
    location: '手工艺坊',
    rating: 4.6,
    reviews: 67,
    badge: '文化',
    isNew: false,
    features: ['传统工艺', '作品带走', '文化讲解'],
    isFavorite: false
  }
])

// 所有活动
const allActivities = ref([
  {
    id: 5,
    name: '普洱茶园漫步',
    summary: '漫步千年茶园，了解茶叶生长过程，感受茶文化的深厚底蕴',
    category: '茶艺体验',
    categoryId: 'tea',
    image: '/src/assets/images/实地调研/茶叶产品调研/茶叶产品调研10.jpg',
    price: 68,
    duration: '2小时',
    groupSize: '不限',
    location: '茶园',
    rating: 4.6,
    reviews: 89,
    features: ['专业讲解', '茶叶品尝', '拍照留念'],
    isFavorite: false
  },
  {
    id: 6,
    name: '蘑菇料理课程',
    summary: '学习制作特色蘑菇料理，体验从采摘到烹饪的完整过程',
    category: '文化体验',
    categoryId: 'culture',
    image: '/src/assets/images/产品/蘑菇/蘑菇2.jpg',
    price: 158,
    duration: '3小时',
    groupSize: '6-10人',
    location: '料理教室',
    rating: 4.8,
    reviews: 156,
    features: ['专业厨师', '食材提供', '成品带走'],
    isFavorite: false
  },
  {
    id: 7,
    name: '森林徒步探险',
    summary: '探索原始森林的神秘魅力，发现隐藏的自然宝藏',
    category: '户外探索',
    categoryId: 'outdoor',
    image: '/src/assets/images/实地调研/茶叶产品调研/茶叶产品调研8.jpg',
    price: 88,
    duration: '4小时',
    groupSize: '8-15人',
    location: '原始森林',
    rating: 4.5,
    reviews: 67,
    features: ['专业向导', '安全装备', '自然讲解'],
    isFavorite: false
  },
  {
    id: 8,
    name: '温泉养生体验',
    summary: '享受天然温泉的舒缓放松，在自然环境中恢复身心活力',
    category: '养生休闲',
    categoryId: 'wellness',
    image: '/src/assets/images/实地调研/茶叶产品调研/茶叶产品调研15.jpg',
    price: 198,
    duration: '2小时',
    groupSize: '不限',
    location: '温泉区',
    rating: 4.9,
    reviews: 123,
    features: ['天然温泉', '私人空间', '养生茶饮'],
    isFavorite: false
  },
  {
    id: 9,
    name: '夜观星空',
    summary: '在无光污染环境下观赏璀璨星空，聆听宇宙的奥秘',
    category: '户外探索',
    categoryId: 'outdoor',
    image: '/src/assets/images/实地调研/茶叶产品调研/茶叶产品调研10.jpg',
    price: 78,
    duration: '2小时',
    groupSize: '10-20人',
    location: '观星台',
    rating: 4.6,
    reviews: 89,
    features: ['专业设备', '天文讲解', '热饮提供'],
    isFavorite: false
  },
  {
    id: 10,
    name: '民族音乐体验',
    summary: '学习云南民族乐器演奏，感受多元文化的音乐魅力',
    category: '文化体验',
    categoryId: 'culture',
    image: '/src/assets/images/实地调研/茶叶产品调研/茶叶产品调研15.jpg',
    price: 118,
    duration: '2.5小时',
    groupSize: '8-12人',
    location: '音乐厅',
    rating: 4.7,
    reviews: 45,
    features: ['乐器体验', '民族服装', '表演机会'],
    isFavorite: false
  },
  {
    id: 11,
    name: '庄园摄影之旅',
    summary: '专业摄影师带领，捕捉庄园最美的瞬间',
    category: '户外探索',
    categoryId: 'outdoor',
    image: '/src/assets/images/实地调研/茶叶产品调研/茶叶产品调研8.jpg',
    price: 138,
    duration: '3小时',
    groupSize: '6-10人',
    location: '庄园各景点',
    rating: 4.8,
    reviews: 78,
    features: ['专业指导', '设备租借', '照片精修'],
    isFavorite: false
  },
  {
    id: 12,
    name: '冥想禅修课程',
    summary: '在宁静的环境中进行冥想练习，找到内心的平静',
    category: '养生休闲',
    categoryId: 'wellness',
    image: '/src/assets/images/实地调研/茶叶产品调研/茶叶产品调研10.jpg',
    price: 88,
    duration: '1.5小时',
    groupSize: '12-20人',
    location: '禅修室',
    rating: 4.5,
    reviews: 92,
    features: ['专业指导', '冥想音乐', '茶水服务'],
    isFavorite: false
  }
])

// 过滤活动
const filteredActivities = computed(() => {
  let filtered = allActivities.value

  // 按分类过滤
  if (activeCategory.value !== 'all') {
    filtered = filtered.filter(activity => activity.categoryId === activeCategory.value)
  }

  // 按价格过滤
  if (activePriceRange.value !== 'all') {
    const range = priceRanges.value.find(r => r.id === activePriceRange.value)
    if (range && range.min !== undefined && range.max !== undefined) {
      filtered = filtered.filter(activity =>
        activity.price >= range.min && activity.price <= range.max
      )
    }
  }

  return filtered
})

// 获取分类活动数量
const getCategoryCount = (categoryId: string) => {
  if (categoryId === 'all') {
    return allActivities.value.length
  }
  return allActivities.value.filter(activity => activity.categoryId === categoryId).length
}

// 转换Font Awesome图标类名到SVG图标名称
const getCategoryIconName = (iconClass: string) => {
  const iconMap: { [key: string]: string } = {
    'fas fa-th-large': 'th-large',
    'fas fa-leaf': 'leaf',
    'fas fa-seedling': 'seedling',
    'fas fa-mountain': 'mountain',
    'fas fa-palette': 'palette',
    'fas fa-spa': 'spa'
  }
  return iconMap[iconClass] || 'th-large'
}

// 获取分类名称
const getCategoryName = (categoryId: string) => {
  const category = categories.value.find(c => c.id === categoryId)
  return category ? category.name : '未知分类'
}

// 获取徽章样式类
const getBadgeClass = (badge: string) => {
  const badgeMap: { [key: string]: string } = {
    '热门': 'badge-hot',
    '推荐': 'badge-recommend',
    '新品': 'badge-new',
    '文化': 'badge-culture'
  }
  return badgeMap[badge] || 'badge-default'
}

// 日历数据
const calendarDays = ref([
  // 示例数据，实际应该根据当前月份生成
  { date: '2025-01-01', day: 1, hasActivity: true, isToday: false, isOtherMonth: false },
  { date: '2025-01-02', day: 2, hasActivity: false, isToday: false, isOtherMonth: false },
  { date: '2025-01-03', day: 3, hasActivity: true, isToday: false, isOtherMonth: false },
  { date: '2025-01-04', day: 4, hasActivity: false, isToday: false, isOtherMonth: false },
  { date: '2025-01-05', day: 5, hasActivity: true, isToday: false, isOtherMonth: false },
  { date: '2025-01-06', day: 6, hasActivity: false, isToday: false, isOtherMonth: false },
  { date: '2025-01-07', day: 7, hasActivity: false, isToday: false, isOtherMonth: false },
  { date: '2025-01-08', day: 8, hasActivity: true, isToday: false, isOtherMonth: false },
  { date: '2025-01-09', day: 9, hasActivity: false, isToday: false, isOtherMonth: false },
  { date: '2025-01-10', day: 10, hasActivity: false, isToday: false, isOtherMonth: false },
  { date: '2025-01-11', day: 11, hasActivity: true, isToday: true, isOtherMonth: false },
  { date: '2025-01-12', day: 12, hasActivity: false, isToday: false, isOtherMonth: false },
  { date: '2025-01-13', day: 13, hasActivity: true, isToday: false, isOtherMonth: false },
  { date: '2025-01-14', day: 14, hasActivity: false, isToday: false, isOtherMonth: false },
  { date: '2025-01-15', day: 15, hasActivity: true, isToday: false, isOtherMonth: false },
  { date: '2025-01-16', day: 16, hasActivity: false, isToday: false, isOtherMonth: false },
  { date: '2025-01-17', day: 17, hasActivity: false, isToday: false, isOtherMonth: false },
  { date: '2025-01-18', day: 18, hasActivity: true, isToday: false, isOtherMonth: false },
  { date: '2025-01-19', day: 19, hasActivity: false, isToday: false, isOtherMonth: false },
  { date: '2025-01-20', day: 20, hasActivity: true, isToday: false, isOtherMonth: false },
  { date: '2025-01-21', day: 21, hasActivity: false, isToday: false, isOtherMonth: false },
  { date: '2025-01-22', day: 22, hasActivity: false, isToday: false, isOtherMonth: false },
  { date: '2025-01-23', day: 23, hasActivity: true, isToday: false, isOtherMonth: false },
  { date: '2025-01-24', day: 24, hasActivity: false, isToday: false, isOtherMonth: false },
  { date: '2025-01-25', day: 25, hasActivity: true, isToday: false, isOtherMonth: false },
  { date: '2025-01-26', day: 26, hasActivity: false, isToday: false, isOtherMonth: false },
  { date: '2025-01-27', day: 27, hasActivity: false, isToday: false, isOtherMonth: false },
  { date: '2025-01-28', day: 28, hasActivity: true, isToday: false, isOtherMonth: false },
  { date: '2025-01-29', day: 29, hasActivity: false, isToday: false, isOtherMonth: false },
  { date: '2025-01-30', day: 30, hasActivity: true, isToday: false, isOtherMonth: false },
  { date: '2025-01-31', day: 31, hasActivity: false, isToday: false, isOtherMonth: false }
])

// 滚动相关函数
const scrollToActivities = () => {
  const element = document.getElementById('featured-activities')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const scrollToCalendar = () => {
  const element = document.getElementById('calendar-section')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// 监听滚动事件
const handleScroll = () => {
  showScrollTop.value = window.scrollY > 500
}

// 登录检查函数
const requireLogin = () => {
  if (!auth.isAuthenticated) {
    router.push('/login')
    return false
  }
  return true
}

// 活动预订相关函数
const createActivityOrder = async (activity: any, bookingData: any) => {
  try {
    // 创建活动订单
    const order = {
      id: Date.now().toString(),
      type: 'activity',
      activityId: activity.id,
      activityName: activity.name,
      price: activity.price,
      quantity: bookingData.participants || 1,
      totalAmount: activity.price * (bookingData.participants || 1),
      bookingDate: bookingData.date,
      bookingTime: bookingData.time,
      customerInfo: {
        name: bookingData.customerName,
        phone: bookingData.customerPhone,
        email: bookingData.customerEmail
      },
      status: 'pending',
      createdAt: new Date().toISOString(),
      notes: bookingData.notes || ''
    }

    // 保存到本地存储（实际项目中应该发送到后端）
    const existingOrders = JSON.parse(localStorage.getItem('activityOrders') || '[]')
    existingOrders.push(order)
    localStorage.setItem('activityOrders', JSON.stringify(existingOrders))

    return order
  } catch (error) {
    console.error('创建活动订单失败:', error)
    throw error
  }
}

// 处理活动预订
const handleActivityBooking = async (activity: any) => {
  if (!requireLogin()) return

  try {
    // 简化的预订流程，实际项目中应该有完整的预订表单
    const bookingData = {
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      participants: 1,
      customerName: auth.user?.name || '用户',
      customerPhone: auth.user?.phone || '',
      customerEmail: auth.user?.email || '',
      notes: ''
    }

    const order = await createActivityOrder(activity, bookingData)

    // 显示成功消息
    alert(`活动预订成功！\n活动：${activity.name}\n订单号：${order.id}\n请前往"我的订单"查看详情。`)

    // 跳转到订单页面
    router.push('/orders')
  } catch (error) {
    alert('预订失败，请稍后重试')
  }
}

// 快速预订
const handleQuickBooking = (activity: any) => {
  handleActivityBooking(activity)
}

// 处理预订点击（英雄区域）
const handleBookingClick = () => {
  scrollToActivities()
}

// 跳转到AI选房页面
const goToAIRooms = () => {
  router.push('/ai-rooms')
}

// 显示活动详情
const showActivityDetail = (activity: any) => {
  // 简化的详情显示，实际项目中应该有专门的详情页面
  const details = `
活动名称：${activity.name}
活动分类：${activity.category}
活动时长：${activity.duration}
参与人数：${activity.groupSize}
活动地点：${activity.location || '庄园内'}
活动价格：¥${activity.price}/人
用户评分：${activity.rating}分 (${activity.reviews}条评价)

活动介绍：
${activity.summary || activity.description}

活动特色：
${activity.features ? activity.features.join('、') : '暂无'}
  `

  if (confirm(details + '\n\n是否立即预订此活动？')) {
    handleActivityBooking(activity)
  }
}

// 切换收藏状态
const toggleFavorite = (activity: any) => {
  if (!requireLogin()) return

  activity.isFavorite = !activity.isFavorite

  // 保存收藏状态到本地存储
  const favorites = JSON.parse(localStorage.getItem('activityFavorites') || '[]')
  if (activity.isFavorite) {
    if (!favorites.includes(activity.id)) {
      favorites.push(activity.id)
    }
  } else {
    const index = favorites.indexOf(activity.id)
    if (index > -1) {
      favorites.splice(index, 1)
    }
  }
  localStorage.setItem('activityFavorites', JSON.stringify(favorites))
}

// 加载更多活动
const loadMoreActivities = () => {
  isLoading.value = true

  // 模拟加载延迟
  setTimeout(() => {
    // 这里可以添加更多活动数据
    isLoading.value = false
    alert('暂无更多活动')
  }, 1000)
}

// 页面初始化
const initializePage = () => {
  // 加载收藏状态
  const favorites = JSON.parse(localStorage.getItem('activityFavorites') || '[]')

  // 更新热门活动收藏状态
  featuredActivities.value.forEach(activity => {
    activity.isFavorite = favorites.includes(activity.id)
  })

  // 更新所有活动收藏状态
  allActivities.value.forEach(activity => {
    activity.isFavorite = favorites.includes(activity.id)
  })
}

// 页面滚动动画
const observeElements = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in')
      }
    })
  }, { threshold: 0.1 })

  // 观察所有需要动画的元素
  const animateElements = document.querySelectorAll('.featured-card, .activity-card, .category-card')
  animateElements.forEach(el => observer.observe(el))
}

// 英雄区域轮播
const startHeroCarousel = () => {
  const slides = document.querySelectorAll('.hero-slide')
  if (slides.length <= 1) return

  let currentSlide = 0
  setInterval(() => {
    slides[currentSlide].classList.remove('active')
    currentSlide = (currentSlide + 1) % slides.length
    slides[currentSlide].classList.add('active')
  }, 5000)
}

// 页面加载完成
onMounted(() => {
  console.log('庄园活动页面加载完成')

  // 初始化页面数据
  initializePage()

  // 启动各种效果
  setTimeout(() => {
    observeElements()
    startHeroCarousel()
  }, 100)

  // 添加滚动监听
  window.addEventListener('scroll', handleScroll)
})

// 清理事件监听
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* 现代化庄园活动页面样式 */
.page-container {
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  overflow-x: hidden;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* 全局动画 */
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

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(84, 150, 136, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(84, 150, 136, 0.6);
  }
}

.fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

.slide-in-left {
  animation: slideInLeft 0.6s ease-out;
}

.slide-in-right {
  animation: slideInRight 0.6s ease-out;
}

.floating {
  animation: float 3s ease-in-out infinite;
}

.glowing {
  animation: glow 2s ease-in-out infinite;
}

/* 渐变文字效果 */
.gradient-text {
  background: linear-gradient(to bottom, #b3c7a5 0%, #d9e1c7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 滚动触发动画 */
.featured-card,
.activity-card,
.category-card {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease-out;
}

.featured-card.animate-in,
.activity-card.animate-in,
.category-card.animate-in {
  opacity: 1;
  transform: translateY(0);
}

/* 现代化庄园活动英雄区域 */
.activities-hero {
  position: relative;
  height: 100vh;
  min-height: 700px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #b3c7a5 0%, #cedaba 100%);
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.hero-carousel {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.hero-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0;
  transition: opacity 2s ease-in-out;
}

.hero-slide.active {
  opacity: 1;
}

.slide-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.6) 0%,
    rgba(0, 0, 0, 0.3) 50%,
    rgba(0, 0, 0, 0.7) 100%
  );
  z-index: 2;
}

.hero-content {
  position: relative;
  z-index: 10;
  text-align: center;
  color: white;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 2rem;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  padding: 0.75rem 1.5rem;
  margin-bottom: 2rem;
  font-size: 0.9rem;
  font-weight: 500;
}

.badge-icon {
  font-size: 1.2rem;
}

.badge-text {
  color: white;
}

.hero-title {
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.1;
}

.title-main {
  display: block;
  color: white;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.title-sub {
  display: block;
  font-size: 0.6em;
  color: #7e9e68;
  margin-top: 0.5rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  font-size: clamp(1.1rem, 2.5vw, 1.4rem);
  color: #549688;
  margin-bottom: 2.5rem;
  line-height: 1.6;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin: 2.5rem 0;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(to bottom, #bdceab 0%, #cedaba 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}



/* 玻璃态模糊效果 */
.glass-effect {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.glass-effect:hover {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
}

.hero-buttons {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 3rem;
}

.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: white;
  z-index: 15;
  animation: pulse 2s ease-in-out infinite;
}

.scroll-text {
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.scroll-arrow {
  font-size: 1.2rem;
  animation: float 1s ease-in-out infinite;
}

/* 通用按钮样式 */
.btn {
  position: relative;
  padding: 1rem 2rem;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, rgba(84, 150, 136, 0.9) 0%, rgba(126, 158, 104, 0.9) 100%);
  color: white;
  box-shadow: 0 8px 25px rgba(84, 150, 136, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(84, 150, 136, 0.4);
  background: linear-gradient(135deg, rgba(84, 150, 136, 1) 0%, rgba(126, 158, 104, 1) 100%);
}

.btn-outline-white {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.btn-outline-white:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(255, 255, 255, 0.1);
}

/* 立即预订按钮特殊样式 */
.btn-booking {
  background: #efebdc;
  color: #333;
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.btn-booking:hover {
  background: #e8e3d4;
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(239, 235, 220, 0.3);
}

.btn-outline {
  background: transparent;
  color: #549688;
  border: 2px solid #549688;
}

.btn-outline:hover {
  background: #549688;
  color: white;
  transform: translateY(-3px);
}

.btn-large {
  padding: 1.2rem 2.5rem;
  font-size: 1.1rem;
}

.btn-book {
  background: linear-gradient(135deg, #549688 0%, #7e9e68 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.btn-book:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(84, 150, 136, 0.3);
}

.btn-detail {
  background: transparent;
  color: #6b7280;
  border: 1px solid #d1d5db;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.btn-detail:hover {
  background: #f9fafb;
  border-color: #9ca3af;
  transform: translateY(-2px);
}

/* 通用区域样式 */
.section-header {
  text-align: center;
  margin-bottom: 4rem;
  position: relative;
  z-index: 2;
}

.section-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(84, 150, 136, 0.1);
  border: 1px solid rgba(84, 150, 136, 0.2);
  border-radius: 50px;
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: #549688;
}

.badge-dot {
  width: 8px;
  height: 8px;
  background: #549688;
  border-radius: 50%;
}

.badge-dot.pulse {
  animation: pulse 2s infinite;
}

.section-title {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 1rem;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(135deg, #549688 0%, #7e9e68 100%);
  border-radius: 2px;
}

.title-highlight {
  display: block;
  color: #549688;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.title-main {
  display: block;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
}

.section-subtitle {
  font-size: 1.2rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* 现代化分类导航区域 */
.category-section {
  padding: 100px 0;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  position: relative;
  overflow: hidden;
}

.category-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.category-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat;
}

.category-showcase {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
  position: relative;
  z-index: 2;
}

.category-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
}

.category-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(84, 150, 136, 0.1), transparent);
  transition: left 0.5s;
}

.category-card:hover::before {
  left: 100%;
}

.category-card:hover,
.category-card.active {
  transform: translateY(-5px);
  border-color: #549688;
  box-shadow: 0 20px 60px rgba(84, 150, 136, 0.15);
}

.category-card.active {
  background: linear-gradient(135deg, rgba(84, 150, 136, 0.1) 0%, rgba(84, 150, 136, 0.05) 100%);
}

.category-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #549688 0%, #7e9e68 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
}

.category-card:hover .category-icon {
  transform: scale(1.1);
  box-shadow: 0 10px 30px rgba(84, 150, 136, 0.3);
}

.category-content {
  flex: 1;
}

.category-name {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.category-desc {
  color: #6b7280;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.category-count {
  color: #549688;
  font-weight: 600;
  font-size: 0.9rem;
}

.category-arrow {
  color: #549688;
  font-size: 1.2rem;
  transition: transform 0.3s ease;
  margin-top: 1rem;
}

.category-card:hover .category-arrow {
  transform: translateX(5px);
}

/* 热门活动区域 */
.featured-section {
  padding: 100px 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  position: relative;
  overflow: hidden;
}

.featured-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.featured-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d4af37' fill-opacity='0.03'%3E%3Cpath d='M20 20c0 11.046-8.954 20-20 20v20h40V20H20z'/%3E%3C/g%3E%3C/svg%3E") repeat;
}

/* 活动列表区域 */
.activities-section {
  padding: 100px 0;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  position: relative;
  overflow: hidden;
}

.activities-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.activities-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23549688' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat;
}

/* 热门活动展示网格 */
.featured-showcase {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
  position: relative;
  z-index: 2;
}

.featured-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;
}

.featured-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.15);
  border-color: #549688;
}

.activity-image {
  position: relative;
  height: 240px;
  overflow: hidden;
}

.activity-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.featured-card:hover .activity-image img {
  transform: scale(1.05);
}

.activity-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
}

.activity-badge.hot {
  background-color: #549688;
}

.activity-badge.new {
  background-color: #7e9e68;
}

.activity-badge.recommend {
  background-color: #549688;
}

/* 徽章样式类 */
.badge-hot {
  background-color: #549688;
}

.badge-new {
  background-color: #7e9e68;
}

.badge-recommend {
  background-color: #549688;
}

.badge-culture {
  background-color: #6b8e5a;
}

.badge-default {
  background-color: #549688;
}

.activity-duration {
  position: absolute;
  bottom: 16px;
  left: 16px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.875rem;
}

.activity-content {
  padding: 24px;
}

.activity-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 12px;
}

.activity-desc {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 20px;
}

.activity-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.activity-info {
  display: flex;
  gap: 16px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #6b7280;
  font-size: 0.875rem;
}

.info-item i {
  color: #549688;
}

.activity-price {
  text-align: right;
}

.price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #549688;
}

.price-unit {
  color: #6b7280;
  font-size: 0.875rem;
}

.activity-btn {
  width: 100%;
  background: #549688;
  color: white;
  border: none;
  padding: 12px 16px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.activity-btn:hover {
  background: #7e9e68;
  transform: translateY(-1px);
}

/* 活动列表网格 */
.activities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.activity-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.3s ease;
}

.activity-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.activity-card .activity-image {
  height: 200px;
}

.activity-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.activity-card:hover .activity-overlay {
  opacity: 1;
}

.quick-book-btn {
  background: white;
  color: #1f2937;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
}

.quick-book-btn:hover {
  background: #549688;
  color: white;
}

.activity-tag {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(84, 150, 136, 0.9);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.activity-info {
  padding: 16px;
}

.activity-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.activity-summary {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 12px;
  line-height: 1.5;
}

.activity-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #6b7280;
  font-size: 0.75rem;
}

.meta-item i {
  color: #549688;
}

.activity-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-info {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.price-info .price {
  font-size: 1.25rem;
  font-weight: bold;
  color: #549688;
}

.price-info .price-unit {
  font-size: 0.875rem;
  color: #6b7280;
}

.activity-actions {
  display: flex;
  gap: 8px;
}

.section-footer {
  text-align: center;
}

/* 日历样式 */
.calendar-section {
  background-color: #f9fafb;
}

.calendar-container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.calendar-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
}

.calendar-nav-btn {
  background: none;
  border: none;
  color: #6b7280;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.calendar-nav-btn:hover {
  background: #f3f4f6;
  color: #549688;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.calendar-day-header {
  background: #f9fafb;
  padding: 12px;
  text-align: center;
  font-weight: 600;
  color: #6b7280;
  font-size: 0.875rem;
}

.calendar-day {
  background: white;
  padding: 12px;
  min-height: 60px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.calendar-day:hover {
  background: #f9fafb;
}

.calendar-day.today {
  background: #549688;
  color: white;
}

.calendar-day.today:hover {
  background: #7e9e68;
}

.calendar-day.has-activity {
  background: rgba(84, 150, 136, 0.1);
}

.calendar-day.has-activity:hover {
  background: rgba(84, 150, 136, 0.2);
}

.calendar-day.other-month {
  color: #d1d5db;
  background: #f9fafb;
}

.day-number {
  font-weight: 500;
  margin-bottom: 4px;
}

.activity-indicator {
  width: 6px;
  height: 6px;
  background: #549688;
  border-radius: 50%;
  margin-top: auto;
}

.calendar-day.today .activity-indicator {
  background: white;
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
  color: #549688;
  margin-bottom: 16px;
  font-family: 'Pacifico', cursive;
}

.footer-desc {
  color: #d1d5db;
  line-height: 1.6;
  margin-bottom: 24px;
}

.social-links {
  display: flex;
  gap: 16px;
}

.social-link {
  color: #d1d5db;
  font-size: 1.25rem;
  transition: color 0.3s ease;
}

.social-link:hover {
  color: #549688;
}

.footer-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 20px;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 12px;
}

.footer-link {
  color: #d1d5db;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #549688;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #d1d5db;
}

.contact-item i {
  color: #549688;
  width: 20px;
}

.footer-bottom {
  border-top: 1px solid #374151;
  padding-top: 24px;
  text-align: center;
  color: #9ca3af;
}

/* 动画效果 */
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

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.8s ease-out;
}

.slide-in-up {
  animation: slideInUp 0.8s ease-out;
  animation-fill-mode: both;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .container {
    padding: 0 16px;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .featured-grid,
  .activities-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .category-nav {
    gap: 12px;
  }

  .category-btn {
    padding: 10px 16px;
    font-size: 14px;
  }

  .activity-details {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .activity-info {
    flex-wrap: wrap;
    gap: 12px;
  }

  .activity-meta {
    gap: 12px;
  }

  .activity-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .calendar-container {
    padding: 16px;
  }

  .calendar-day {
    min-height: 50px;
    padding: 8px;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-buttons {
    flex-direction: column;
    align-items: center;
  }

  .section-title {
    font-size: 1.75rem;
  }

  .featured-grid,
  .activities-grid {
    gap: 16px;
  }

  .calendar-grid {
    gap: 0;
  }

  .calendar-day {
    min-height: 40px;
    padding: 6px;
  }

  .calendar-day-header {
    padding: 8px;
    font-size: 0.75rem;
  }
}

/* 活动筛选器 */
.activity-filters {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 3rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  position: relative;
  z-index: 2;
}

.filter-group {
  margin-bottom: 1.5rem;
}

.filter-group:last-child {
  margin-bottom: 0;
}

.filter-label {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.75rem;
  display: block;
}

.filter-options {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border: 2px solid #e5e7eb;
  background: white;
  color: #6b7280;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-btn:hover {
  border-color: #549688;
  color: #549688;
  transform: translateY(-2px);
}

.filter-btn.active {
  background: #549688;
  border-color: #549688;
  color: white;
  box-shadow: 0 4px 12px rgba(84, 150, 136, 0.3);
}

/* 活动卡片样式 */
.activities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  position: relative;
  z-index: 2;
}

.activity-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;
}

.activity-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.12);
  border-color: #549688;
}

.activity-image-wrapper {
  position: relative;
  overflow: hidden;
}

.activity-image {
  height: 200px;
  overflow: hidden;
}

.activity-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.activity-card:hover .activity-image img {
  transform: scale(1.05);
}

.image-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.3), transparent);
}

.activity-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.activity-card:hover .activity-overlay {
  opacity: 1;
}

.overlay-actions {
  display: flex;
  gap: 0.5rem;
}

.quick-action-btn {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.9);
  color: #1f2937;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quick-action-btn:hover {
  background: #549688;
  color: white;
  transform: scale(1.1);
}

.activity-category-tag {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(84, 150, 136, 0.9);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.75rem;
  font-weight: 600;
}

.activity-rating-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 15px;
  display: flex;
  align-items: center;
  gap: 0.2rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.activity-info {
  padding: 1.5rem;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.activity-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.3;
  flex: 1;
}

.activity-price-badge {
  background: rgba(84, 150, 136, 0.1);
  color: #549688;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-weight: 600;
  font-size: 0.9rem;
}

.activity-summary {
  color: #6b7280;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.activity-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: #6b7280;
  font-size: 0.8rem;
}

.meta-item i {
  color: #549688;
}

.activity-features {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.feature-tag {
  background: rgba(84, 150, 136, 0.1);
  color: #549688;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 500;
}

.activity-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.reviews-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stars-small {
  display: flex;
  gap: 0.1rem;
}

.stars-small i {
  font-size: 0.7rem;
  color: #d1d5db;
}

.stars-small i.active {
  color: #549688;
}

/* 大星级样式 */
.stars {
  display: flex;
  gap: 0.2rem;
}

.stars i {
  font-size: 1rem;
  color: #d1d5db;
}

.stars i.active {
  color: #549688;
}

.reviews-count {
  color: #6b7280;
  font-size: 0.8rem;
}

.activity-actions {
  display: flex;
  gap: 0.5rem;
}

/* 加载更多 */
.section-footer {
  text-align: center;
  margin-top: 3rem;
  position: relative;
  z-index: 2;
}

.load-more-container {
  display: flex;
  justify-content: center;
}

/* 滚动到顶部按钮 */
.scroll-top-btn {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #549688 0%, #7e9e68 100%);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(84, 150, 136, 0.3);
  transition: all 0.3s ease;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.scroll-top-btn:hover {
  transform: translateY(-3px) scale(1.1);
  box-shadow: 0 12px 35px rgba(84, 150, 136, 0.4);
}
</style>
