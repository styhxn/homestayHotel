<template>
  <div class="ai-room-selection">
    <AppNavbar />

    <!-- 页面标题 -->
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">
          <span class="ai-icon">🌳</span>
          AI智能选房
        </h1>
        <p class="page-subtitle">与普普AI助手对话，找到最适合您的房间</p>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="main-content">
      <div class="container">
        <div class="content-grid">
          <!-- 左侧：AI助手、推荐房间、订单详情 -->
          <div class="left-panel">
            <!-- AI助手头像和信息 -->
            <div class="ai-assistant">
              <div class="ai-header">
                <div class="ai-avatar">
                  <video
                    ref="aiVideo"
                    :src="currentVideoSrc"
                    alt="普普AI助手"
                    :class="['ai-character', aiState]"
                    autoplay
                    loop
                    muted
                    playsinline
                  ></video>
                  <div v-if="isSpeaking" class="speaking-indicator">
                    <div class="wave"></div>
                    <div class="wave"></div>
                    <div class="wave"></div>
                  </div>
                </div>
                <div class="ai-info">
                  <h3>普普 AI助手</h3>
                  <p>专属选房顾问</p>
                  <div class="ai-status">
                    <span class="status-dot" :class="{ online: isDifyConnected }"></span>
                    <span>{{ isDifyConnected ? '在线' : '离线' }}</span>
                  </div>
                </div>
              </div>

              <!-- AI控制按钮 -->
              <div class="ai-controls">
                <div class="control-buttons">
                  <button
                    class="control-btn voice-btn"
                    :class="{ active: isListening }"
                    @click="toggleVoiceInput"
                    :disabled="!isDifyConnected"
                  >
                    <i class="fas fa-microphone" v-if="!isListening"></i>
                    <i class="fas fa-stop" v-else></i>
                    <span>{{ isListening ? '停止录音' : '语音输入' }}</span>
                  </button>

                  <button
                    class="control-btn reset-btn"
                    @click="resetConversation"
                    :disabled="!isDifyConnected"
                  >
                    <i class="fas fa-redo-alt"></i>
                    <span>重置对话</span>
                  </button>
                </div>

                <div v-if="isListening" class="voice-indicator">
                  <div class="voice-wave">
                    <div class="wave-bar"></div>
                    <div class="wave-bar"></div>
                    <div class="wave-bar"></div>
                    <div class="wave-bar"></div>
                    <div class="wave-bar"></div>
                  </div>
                  <p class="voice-text">正在聆听您的语音...</p>
                </div>

                <div v-if="voiceText" class="voice-result">
                  <p class="voice-label">识别结果：</p>
                  <p class="voice-content">{{ voiceText }}</p>
                  <div class="voice-actions">
                    <button class="send-voice-btn" @click="sendVoiceMessage">
                      <i class="fas fa-paper-plane"></i>
                      发送
                    </button>
                    <button class="clear-voice-btn" @click="clearVoiceText">
                      <i class="fas fa-times"></i>
                      清除
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 推荐房间 -->
            <div class="recommended-rooms">
              <h3>
                <i class="fas fa-star"></i>
                AI推荐房间
                <span v-if="aiRecommendations.length > 0" class="count">({{ aiRecommendations.length }})</span>
              </h3>
              <div class="rooms-list">
                <div v-if="aiRecommendations.length === 0" class="empty-state">
                  <i class="fas fa-robot"></i>
                  <p>请与AI助手对话，我会为您推荐最适合的房间</p>
                  <p class="empty-hint">例如：我想要一个便宜的房间、推荐豪华房间、适合家庭的房间</p>
                </div>
                <div v-else class="rooms-container">
                  <div class="rooms-scroll" ref="roomsScrollContainer">
                    <div
                      v-for="room in aiRecommendations"
                      :key="room.id"
                      class="room-card recommended"
                      @click="selectRoom(room)"
                    >
                      <div class="recommend-badge">
                        <i class="fas fa-robot"></i>
                        AI推荐
                      </div>
                      <div class="room-info">
                        <h4>{{ room.code }}号房</h4>
                        <p>{{ room.name }}</p>
                        <div class="room-floor">
                          <i class="fas fa-building"></i>
                          {{ room.floor }}
                        </div>
                        <div class="recommend-reason" v-if="room.recommendReason">
                          <i class="fas fa-lightbulb"></i>
                          {{ room.recommendReason }}
                        </div>
                        <div class="room-meta">
                          <span class="price">¥{{ room.price }}/晚</span>
                          <span class="rating">⭐{{ room.rating }}</span>
                          <span class="status" :class="room.status">
                            {{ room.status === 'available' ? '可预订' : '已预订' }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- 房间数量提示 -->
                  <div v-if="aiRecommendations.length > 3" class="scroll-hint">
                    <i class="fas fa-chevron-down"></i>
                    <span>向下滚动查看更多房间 ({{ aiRecommendations.length }}个)</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 订单详情 -->
            <div class="order-details">
              <h3>
                <i class="fas fa-receipt"></i>
                订单详情
                <span v-if="currentOrder" class="order-status">已确认</span>
              </h3>
              <div class="order-content">
                <div v-if="currentOrder" class="order-info">
                  <div class="order-header">
                    <div class="order-number">
                      <span class="label">订单号</span>
                      <span class="value">{{ currentOrder.orderNumber }}</span>
                    </div>
                    <div class="order-date">
                      <span class="label">创建时间</span>
                      <span class="value">{{ new Date(currentOrder.createdAt).toLocaleString() }}</span>
                    </div>
                  </div>

                  <div class="order-room-info">
                    <div class="room-details">
                      <h4>{{ currentOrder.roomCode }}号房 - {{ currentOrder.roomName }}</h4>
                      <div class="stay-dates">
                        <div class="date-item">
                          <i class="fas fa-calendar-check"></i>
                          <span>入住: {{ formatDate(currentOrder.checkInDate) }}</span>
                        </div>
                        <div class="date-item">
                          <i class="fas fa-calendar-times"></i>
                          <span>退房: {{ formatDate(currentOrder.checkOutDate) }}</span>
                        </div>
                        <div class="date-item">
                          <i class="fas fa-moon"></i>
                          <span>住宿: {{ currentOrder.nights }}晚</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="guest-info">
                    <div class="guest-item">
                      <i class="fas fa-user"></i>
                      <span class="label">客人:</span>
                      <span class="value">{{ currentOrder.guestName || '待补充' }}</span>
                    </div>
                    <div class="guest-item">
                      <i class="fas fa-phone"></i>
                      <span class="label">电话:</span>
                      <span class="value">{{ currentOrder.phone || '待补充' }}</span>
                    </div>
                  </div>

                  <div class="order-summary">
                    <div class="summary-item">
                      <span class="label">房费</span>
                      <span class="value">¥{{ currentOrder.totalAmount }}</span>
                    </div>
                    <div class="summary-item">
                      <span class="label">服务费</span>
                      <span class="value">¥0</span>
                    </div>
                    <div class="summary-item total">
                      <span class="label">总计</span>
                      <span class="value price">¥{{ currentOrder.totalAmount }}</span>
                    </div>
                  </div>

                  <div class="order-tips">
                    <div class="tip-item">
                      <i class="fas fa-lightbulb"></i>
                      <span>想要修改订单？对AI说："修改订单时间"或"更换房间"</span>
                    </div>
                    <div class="tip-item">
                      <i class="fas fa-info-circle"></i>
                      <span>需要取消订单？对AI说："取消订单"或"我不要这个订单了"</span>
                    </div>
                  </div>
                </div>
                <div v-else class="empty-state">
                  <i class="fas fa-clipboard-list"></i>
                  <p>暂无订单信息</p>
                  <p class="empty-hint">与AI助手对话，创建订单后将显示在这里</p>
                  <p class="empty-hint">例如：我想预订201号房间</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧：AI聊天 -->
          <div class="right-panel">
            <div class="chat-container">
              <div class="chat-header">
                <h3>
                  <i class="fas fa-comments"></i>
                  与AI助手对话
                </h3>
                <div class="chat-status">
                  <span class="status-dot" :class="{ online: isDifyConnected }"></span>
                  <span>{{ isDifyConnected ? '在线' : '离线' }}</span>
                </div>
              </div>

              <!-- AI功能快捷按钮 -->
              <div class="ai-quick-actions">
                <div class="quick-action-btn" @click="sendBackupMessage('推荐便宜的房间')">
                  <i class="fas fa-dollar-sign"></i>
                  <span>经济实惠</span>
                </div>
                <div class="quick-action-btn" @click="sendBackupMessage('推荐豪华房间')">
                  <i class="fas fa-crown"></i>
                  <span>豪华舒适</span>
                </div>
                <div class="quick-action-btn" @click="sendBackupMessage('推荐亲子房')">
                  <i class="fas fa-child"></i>
                  <span>亲子家庭</span>
                </div>
                <div class="quick-action-btn" @click="sendBackupMessage('推荐3楼房间')">
                  <i class="fas fa-building"></i>
                  <span>楼层选择</span>
                </div>
              </div>

              <!-- Dify聊天组件 -->
              <div class="dify-chat-wrapper">
                <DifyChatWidget
                  ref="difyChatWidget"
                  container-id="ai-room-dify-container"
                  :auto-load="true"
                  @loaded="onDifyLoaded"
                  @error="onDifyError"
                  @message="onDifyMessage"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 全部房间展示 -->
        <div class="all-rooms-section">
          <div class="section-header">
            <h2>
              <i class="fas fa-home"></i>
              全部房间
            </h2>
            <div class="room-filters">
              <select v-model="roomFilter" @change="filterRooms" class="filter-select">
                <option value="all">全部房型</option>
                <option value="single">单人房</option>
                <option value="double">双人房</option>
                <option value="family">家庭房</option>
                <option value="suite">套房</option>
              </select>
              <div class="view-toggle">
                <button
                  :class="['toggle-btn', { active: viewMode === 'grid' }]"
                  @click="viewMode = 'grid'"
                >
                  <i class="fas fa-th"></i>
                </button>
                <button
                  :class="['toggle-btn', { active: viewMode === 'list' }]"
                  @click="viewMode = 'list'"
                >
                  <i class="fas fa-list"></i>
                </button>
              </div>
            </div>
          </div>

          <div class="rooms-content">
            <div v-if="roomsLoading" class="loading-state">
              <div class="loading-spinner"></div>
              <p>正在加载房间信息...</p>
            </div>

            <div v-else-if="filteredRooms.length === 0" class="empty-state">
              <i class="fas fa-home"></i>
              <p>暂无符合条件的房间</p>
            </div>

            <div v-else :class="['rooms-grid', viewMode]">
              <div
                v-for="room in filteredRooms"
                :key="room.id"
                class="room-item"
                @click="selectRoom(room)"
              >
                <div class="room-image-container">
                  <img :src="room.image" :alt="room.name" class="room-image">
                  <div class="room-status-badge" :class="room.status">
                    {{ room.status === 'available' ? '可预订' : '已预订' }}
                  </div>
                  <div class="room-price-badge">
                    {{ room.price > 0 ? `¥${room.price}/晚` : '价格待定' }}
                  </div>
                </div>
                <div class="room-details">
                  <div class="room-header">
                    <h4 class="room-name">{{ room.code }}号房 - {{ room.roomType }}</h4>
                    <div class="room-rating" v-if="room.rating > 0">
                      <i class="fas fa-star"></i>
                      <span>{{ room.rating }}</span>
                    </div>
                  </div>
                  <p class="room-type">{{ room.name }} ({{ room.floor }})</p>
                  <div class="room-features">
                    <span class="feature" v-if="room.seat > 0">
                      <i class="fas fa-users"></i>
                      {{ room.seat }}人
                    </span>
                    <span class="feature">
                      <i class="fas fa-window-maximize"></i>
                      {{ room.hasWindow ? `${room.windowDirection}向` : '无窗' }}
                    </span>
                    <span class="feature">
                      <i class="fas fa-wifi"></i>
                      免费WiFi
                    </span>
                    <span class="feature">
                      <i class="fas fa-snowflake"></i>
                      空调
                    </span>
                    <span class="feature" v-if="room.vrUrl">
                      <i class="fas fa-vr-cardboard"></i>
                      <a :href="room.vrUrl" target="_blank" class="vr-link">VR看房</a>
                    </span>
                  </div>
                  <div class="room-footer">
                    <div class="room-category">{{ room.category }}</div>
                    <button
                      class="book-btn"
                      :class="{ disabled: room.status !== 'available' || room.price === 0 }"
                      :disabled="room.status !== 'available' || room.price === 0"
                      @click.stop="selectRoom(room)"
                    >
                      {{ room.price === 0 ? '价格待定' : (room.status === 'available' ? '选择房间' : '已预订') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import request from '../../utils/request'
import AppNavbar from '../../components/AppNavbar.vue'
// import type { Room } from '@/types/api'
import DifyChatWidget from '../../components/DifyChatWidgetHybrid.vue'
import { IntelligentAI } from '../../utils/intelligentAI'
import { useChatHistoryStore } from '../../stores/chatHistory'
import { OrderService, type OrderCreateData } from '../../services/orderService'

// 定义Room类型
interface Room {
  id: number | string
  code: string
  name: string
  category?: string
  price: number
  status: string
  floor?: string
  direction?: string
  type?: string
  features?: string[]
  rating?: number
  recommendReason?: string
  height?: string
  hasWindow?: boolean
  windowDirection?: string
  roomType?: string
  seat?: number
  image?: string
  vrUrl?: string
}

const router = useRouter()
const auth = useAuthStore()
const chatHistory = useChatHistoryStore()

// 基础状态
const isDifyConnected = ref(false)
const isSpeaking = ref(false)
const aiState = ref('idle')
const currentVideoSrc = ref('/src/assets/images/IP形象/37b48b40dbc80e2a44dce0f626120357_raw.mp4')

// AI推荐房间
const aiRecommendations = ref<Room[]>([])

// 房间滑动相关
const currentRoomIndex = ref(0)
const roomsScrollContainer = ref<HTMLElement>()

// 语音输入相关
const isListening = ref(false)
const voiceText = ref('')
const recognition = ref<any>(null)

// 当前订单 - 写死301号房订单
const currentOrder = ref<any>({
  orderNumber: 'MG20250718301',
  roomCode: '301',
  roomName: '云端亲子蘑菇屋',
  roomPrice: 588,
  checkInDate: '2025-07-20',
  checkOutDate: '2025-07-25',
  nights: 5,
  totalAmount: 2940,
  status: 'confirmed',
  createdAt: '2025-07-18 09:30:00',
  userProfile: {
    type: 'family_with_children',
    keywords: ['亲子', '家庭'],
    preferences: ['安全', '宽敞', '娱乐设施']
  },
  packageRecommendation: {
    name: '蘑菇森林亲子奇遇套餐',
    description: '专为亲子家庭设计的综合体验套餐',
    originalPrice: 680,
    packagePrice: 578,
    discount: 15,
    items: [
      '民宿住宿体验',
      '儿童茶艺启蒙课',
      '蘑菇森林探索',
      '茶山寻宝游戏',
      '数字孪生导览'
    ]
  },
  digitalTwinRoute: [
    {
      title: '🏠 蘑菇屋入住体验',
      description: '360°全景房间导览，了解房间设施'
    },
    {
      title: '🍵 儿童茶艺启蒙课堂',
      description: '互动式茶艺学习，寓教于乐'
    },
    {
      title: '🌲 蘑菇森林探索之旅',
      description: 'VR森林探索，认识各种蘑菇'
    },
    {
      title: '🎯 茶山寻宝游戏',
      description: 'AR寻宝游戏，收集茶叶知识'
    }
  ]
})

// 聊天消息监听
const chatMessages = ref<any[]>([])

// 备用聊天输入
const backupUserInput = ref('')

// 房间数据库（完整23个房间数据）
const roomDatabase = [
  // 1楼房间 (8个房间)
  {
    id: '101',
    code: '101',
    name: '雨林景观豪华蘑菇屋',
    price: 18,
    rating: 4.5,
    status: 'available',
    floor: '1楼',
    direction: '东向采光',
    type: '单人间',
    features: ['超值特价', '观景窗', '蘑菇主题装饰']
  },
  {
    id: '102',
    code: '102',
    name: '雨林景观豪华蘑菇屋',
    price: 888,
    rating: 4.9,
    status: 'available',
    floor: '1楼',
    direction: '东向采光',
    type: '大床房',
    features: ['豪华配置', '观景窗', '迷你吧']
  },
  {
    id: '103',
    code: '103',
    name: '雨林景观豪华蘑菇屋',
    price: 333,
    rating: 4.7,
    status: 'available',
    floor: '1楼',
    direction: '无窗户',
    type: '单人间',
    features: ['精致装修', '蘑菇主题装饰']
  },
  {
    id: '104',
    code: '104',
    name: '雨林景观豪华蘑菇屋',
    price: 255,
    rating: 4.6,
    status: 'available',
    floor: '1楼',
    direction: '无窗户',
    type: '单人间',
    features: ['舒适温馨', '蘑菇主题装饰']
  },
  {
    id: '105',
    code: '105',
    name: '雨林景观豪华蘑菇屋',
    price: 256,
    rating: 4.6,
    status: 'available',
    floor: '1楼',
    direction: '无窗户',
    type: '单人间',
    features: ['经济实惠', '蘑菇主题装饰']
  },
  {
    id: '106',
    code: '106',
    name: '雨林景观豪华蘑菇屋',
    price: 666,
    rating: 4.8,
    status: 'available',
    floor: '1楼',
    direction: '南向采光',
    type: '单人间',
    features: ['高级配置', '观景窗', '蘑菇主题装饰']
  },
  {
    id: '107',
    code: '107',
    name: '雨林景观豪华蘑菇屋',
    price: 456,
    rating: 4.8,
    status: 'available',
    floor: '1楼',
    direction: '南向采光',
    type: '单人间',
    features: ['南向阳台', '观景窗', '蘑菇主题装饰']
  },
  {
    id: '108',
    code: '108',
    name: '雨林景观豪华蘑菇屋',
    price: 156,
    rating: 4.6,
    status: 'available',
    floor: '1楼',
    direction: '南向采光',
    type: '单人间',
    features: ['经济型', '观景窗', '蘑菇主题装饰']
  },

  // 2楼房间 (12个房间)
  {
    id: '201',
    code: '201',
    name: '雨林景观豪华蘑菇屋',
    price: 19,
    rating: 4.9,
    status: 'available',
    floor: '2楼',
    direction: '南向采光',
    type: '大床房',
    features: ['超值特价', '观景窗', '蘑菇主题装饰']
  },
  {
    id: '202',
    code: '202',
    name: '雨林景观豪华蘑菇屋',
    price: 48,
    rating: 4.7,
    status: 'available',
    floor: '2楼',
    direction: '南向采光',
    type: '单人间',
    features: ['特价房', '观景窗', '蘑菇主题装饰']
  },
  {
    id: '203',
    code: '203',
    name: '雨林景观豪华蘑菇屋',
    price: 889,
    rating: 4.9,
    status: 'available',
    floor: '2楼',
    direction: '南向采光',
    type: '单人间',
    features: ['豪华配置', '观景窗', '迷你吧']
  },
  {
    id: '204',
    code: '204',
    name: '雨林景观豪华蘑菇屋',
    price: 999,
    rating: 4.9,
    status: 'available',
    floor: '2楼',
    direction: '南向采光',
    type: '单人间',
    features: ['顶级豪华', '观景窗', '迷你吧', '保险箱']
  },
  {
    id: '205',
    code: '205',
    name: '雨林景观豪华蘑菇屋',
    price: 777,
    rating: 4.8,
    status: 'available',
    floor: '2楼',
    direction: '南向采光',
    type: '单人间',
    features: ['高档配置', '观景窗', '蘑菇主题装饰']
  },
  {
    id: '206',
    code: '206',
    name: '雨林景观豪华蘑菇屋',
    price: 654,
    rating: 4.8,
    status: 'available',
    floor: '2楼',
    direction: '西向观景',
    type: '双人间',
    features: ['含双早', '配茶具套装']
  },
  {
    id: '207',
    code: '207',
    name: '雨林景观豪华蘑菇屋',
    price: 186,
    rating: 4.7,
    status: 'available',
    floor: '2楼',
    direction: '东向带阳台',
    type: '双人间',
    features: ['东向阳台', '雨林景观']
  },
  {
    id: '208',
    code: '208',
    name: '雨林景观豪华蘑菇屋',
    price: 198,
    rating: 4.6,
    status: 'available',
    floor: '2楼',
    direction: '北向',
    type: '单人间',
    features: ['山景阳台', '早餐', '茶园景观']
  },
  {
    id: '209',
    code: '209',
    name: '雨林景观豪华蘑菇屋',
    price: 555,
    rating: 4.7,
    status: 'available',
    floor: '2楼',
    direction: '南向采光',
    type: '单人间',
    features: ['舒适配置', '观景窗', '蘑菇主题装饰']
  },
  {
    id: '210',
    code: '210',
    name: '雨林景观豪华蘑菇屋',
    price: 444,
    rating: 4.6,
    status: 'available',
    floor: '2楼',
    direction: '西向采光',
    type: '单人间',
    features: ['标准配置', '观景窗', '蘑菇主题装饰']
  },
  {
    id: '211',
    code: '211',
    name: '雨林景观豪华蘑菇屋',
    price: 419,
    rating: 4.7,
    status: 'available',
    floor: '2楼',
    direction: '西向采光',
    type: '亲子房',
    features: ['儿童设施', '观景窗', '蘑菇主题装饰']
  },
  {
    id: '212',
    code: '212',
    name: '雨林景观豪华蘑菇屋',
    price: 418,
    rating: 4.7,
    status: 'available',
    floor: '2楼',
    direction: '西向采光',
    type: '亲子房',
    features: ['温馨亲子', '观景窗', '儿童设施']
  },

  // 3楼房间 (3个房间)
  {
    id: '301',
    code: '301',
    name: '雨林景观豪华蘑菇屋',
    price: 486,
    rating: 4.8,
    status: 'available',
    floor: '3楼',
    direction: '无窗户',
    type: '亲子房',
    features: ['儿童设施', '游戏区', '蘑菇主题装饰']
  },
  {
    id: '302',
    code: '302',
    name: '雨林景观豪华蘑菇屋',
    price: 1088,
    rating: 4.9,
    status: 'available',
    floor: '3楼',
    direction: '无窗户',
    type: '亲子房',
    features: ['顶级豪华', '儿童设施', '游戏区', '迷你吧', '保险箱']
  },
  {
    id: '303',
    code: '303',
    name: '雨林景观豪华蘑菇屋',
    price: 388,
    rating: 4.8,
    status: 'available',
    floor: '3楼',
    direction: '南向采光',
    type: '双人间',
    features: ['观景窗', '蘑菇主题装饰', '舒适双人']
  }
]

// 聊天相关 (已替换为Dify组件)
// const fallbackMessages = ref<any[]>([])
// const fallbackInput = ref('')
// const isFallbackLoading = ref(false)
// const fallbackChatContainer = ref<HTMLElement>()

// AI视频引用
const aiVideo = ref<HTMLVideoElement>()

// Dify组件引用
const difyChatWidget = ref()

// 全部房间相关
const allRooms = ref<any[]>([])
const filteredRooms = ref<any[]>([])
const roomsLoading = ref(false)
const roomFilter = ref('all')
const viewMode = ref('grid')

// 初始化
onMounted(() => {
  initializeAI()
  loadInitialData()
  initSpeechRecognition()

  // 监听来自聊天组件的消息
  window.addEventListener('message', handleChatMessage)
})

onUnmounted(() => {
  // 清理事件监听器
  window.removeEventListener('message', handleChatMessage)
})

// 初始化AI
const initializeAI = () => {
  // Dify组件会自动处理初始化，不需要手动添加欢迎消息
  console.log('AI助手初始化完成，使用Dify组件')
}

// 加载初始数据
const loadInitialData = async () => {
  await loadAllRooms()
}

// 加载全部房间
const loadAllRooms = async () => {
  roomsLoading.value = true
  try {
    // 真实房间数据
    const realRooms: Room[] = [
      {
        id: 1,
        code: '展览厅',
        name: '展览厅',
        category: '展览厅',
        floor: '1楼',
        height: '2438',
        hasWindow: false,
        windowDirection: '无',
        roomType: '展览厅',
        price: 0,
        seat: 0,
        rating: 0,
        status: 'unavailable',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        vrUrl: '',
        recommendReason: '展览厅暂不开放预订'
      },
      {
        id: 2,
        code: '105',
        name: '雨林景观豪华蘑菇屋',
        category: '单人间',
        floor: '1楼',
        height: '2438',
        hasWindow: false,
        windowDirection: '无',
        roomType: '单人间',
        price: 256,
        seat: 1,
        rating: 4.5,
        status: 'available',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
        vrUrl: 'https://share-xt.hwbim.com/qlh/ffd333620ebb4e83b50899653b516f00',
        recommendReason: '雨林景观，环境优美，适合独自旅行'
      },
      {
        id: 3,
        code: '104',
        name: '雨林景观豪华蘑菇屋',
        category: '单人间',
        floor: '1楼',
        height: '2438',
        hasWindow: false,
        windowDirection: '无',
        roomType: '单人间',
        price: 255,
        seat: 1,
        rating: 4.5,
        status: 'available',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
        vrUrl: 'https://share-xt.hwbim.com/qlh/ffd333620ebb4e83b50899653b516f00',
        recommendReason: '性价比高，环境舒适'
      },
      {
        id: 4,
        code: '103',
        name: '雨林景观豪华蘑菇屋',
        category: '单人间',
        floor: '1楼',
        height: '2438',
        hasWindow: false,
        windowDirection: '无',
        roomType: '单人间',
        price: 333,
        seat: 1,
        rating: 4.6,
        status: 'available',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
        vrUrl: 'https://share-xt.hwbim.com/qlh/ffd333620ebb4e83b50899653b516f00',
        recommendReason: '高评分房间，服务优质'
      },
      {
        id: 5,
        code: '102',
        name: '雨林景观豪华蘑菇屋',
        category: '大床房',
        floor: '1楼',
        height: '2438',
        hasWindow: true,
        windowDirection: '东',
        roomType: '大床房',
        price: 888,
        seat: 2,
        rating: 4.8,
        status: 'available',
        image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&h=300&fit=crop',
        vrUrl: 'https://share-xt.hwbim.com/qlh/ffd333620ebb4e83b50899653b516f00',
        recommendReason: '豪华大床房，带窗户，视野开阔'
      },
      {
        id: 6,
        code: '106',
        name: '雨林景观豪华蘑菇屋',
        category: '单人间',
        floor: '1楼',
        height: '2438',
        hasWindow: true,
        windowDirection: '南',
        roomType: '单人间',
        price: 666,
        seat: 1,
        rating: 4.7,
        status: 'available',
        image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop',
        vrUrl: 'https://share-xt.hwbim.com/qlh/ffd333620ebb4e83b50899653b516f00',
        recommendReason: '南向房间，采光充足，环境优雅'
      },
      {
        id: 7,
        code: '107',
        name: '雨林景观豪华蘑菇屋',
        category: '单人间',
        floor: '1楼',
        height: '2438',
        hasWindow: true,
        windowDirection: '南',
        roomType: '单人间',
        price: 456,
        seat: 1,
        rating: 4.6,
        status: 'available',
        image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop',
        vrUrl: 'https://share-xt.hwbim.com/qlh/ffd333620ebb4e83b50899653b516f00',
        recommendReason: '中等价位，性价比不错'
      },
      {
        id: 8,
        code: '108',
        name: '雨林景观豪华蘑菇屋',
        category: '单人间',
        floor: '1楼',
        height: '2438',
        hasWindow: true,
        windowDirection: '南',
        roomType: '单人间',
        price: 156,
        seat: 1,
        rating: 4.4,
        status: 'available',
        image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop',
        vrUrl: 'https://share-xt.hwbim.com/qlh/ffd333620ebb4e83b50899653b516f00',
        recommendReason: '经济实惠，适合预算有限的客人'
      },
      {
        id: 9,
        code: '101',
        name: '雨林景观豪华蘑菇屋',
        category: '单人间',
        floor: '1楼',
        height: '2438',
        hasWindow: true,
        windowDirection: '东',
        roomType: '单人间',
        price: 18,
        seat: 1,
        rating: 4.2,
        status: 'available',
        image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop',
        vrUrl: 'https://share-xt.hwbim.com/qlh/ffd333620ebb4e83b50899653b516f00',
        recommendReason: '超值特价房，性价比极高'
      },
      {
        id: 10,
        code: '211',
        name: '雨林景观豪华蘑菇屋',
        category: '亲子房',
        floor: '2楼',
        height: '2438',
        hasWindow: true,
        windowDirection: '西',
        roomType: '亲子房',
        price: 419,
        seat: 3,
        rating: 4.7,
        status: 'available',
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop',
        vrUrl: 'https://share-xt.hwbim.com/qlh/ffd333620ebb4e83b50899653b516f00',
        recommendReason: '亲子房，适合家庭出行，空间宽敞'
      },
      {
        id: 11,
        code: '212',
        name: '雨林景观豪华蘑菇屋',
        category: '亲子房',
        floor: '2楼',
        height: '2438',
        hasWindow: true,
        windowDirection: '西',
        roomType: '亲子房',
        price: 418,
        seat: 3,
        rating: 4.7,
        status: 'available',
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop',
        vrUrl: 'https://share-xt.hwbim.com/qlh/ffd333620ebb4e83b50899653b516f00'
      },
      {
        id: 12,
        code: '210',
        name: '雨林景观豪华蘑菇屋',
        category: '单人间',
        floor: '2楼',
        height: '2438',
        hasWindow: true,
        windowDirection: '北',
        roomType: '单人间',
        price: 189,
        seat: 1,
        rating: 4.4,
        status: 'available',
        image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop',
        vrUrl: 'https://share-xt.hwbim.com/qlh/ffd333620ebb4e83b50899653b516f00'
      },
      {
        id: 13,
        code: '209',
        name: '雨林景观豪华蘑菇屋',
        category: '单人间',
        floor: '2楼',
        height: '2438',
        hasWindow: true,
        windowDirection: '北',
        roomType: '单人间',
        price: 418,
        seat: 1,
        rating: 4.6,
        status: 'available',
        image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop',
        vrUrl: 'https://share-xt.hwbim.com/qlh/ffd333620ebb4e83b50899653b516f00'
      },
      {
        id: 14,
        code: '208',
        name: '雨林景观豪华蘑菇屋',
        category: '单人间',
        floor: '2楼',
        height: '2438',
        hasWindow: true,
        windowDirection: '北',
        roomType: '单人间',
        price: 18,
        seat: 1,
        rating: 4.2,
        status: 'available',
        image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop',
        vrUrl: 'https://share-xt.hwbim.com/qlh/ffd333620ebb4e83b50899653b516f00'
      },
      {
        id: 15,
        code: '207',
        name: '雨林景观豪华蘑菇屋',
        category: '大床房',
        floor: '2楼',
        height: '2438',
        hasWindow: true,
        windowDirection: '东',
        roomType: '大床房',
        price: 186,
        seat: 2,
        rating: 4.5,
        status: 'available',
        image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&h=300&fit=crop',
        vrUrl: 'https://share-xt.hwbim.com/qlh/ffd333620ebb4e83b50899653b516f00'
      },
      {
        id: 16,
        code: '206',
        name: '雨林景观豪华蘑菇屋',
        category: '双人间',
        floor: '2楼',
        height: '2438',
        hasWindow: true,
        windowDirection: '西',
        roomType: '双人间',
        price: 654,
        seat: 2,
        rating: 4.7,
        status: 'available',
        image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=300&fit=crop',
        vrUrl: 'https://share-xt.hwbim.com/qlh/ffd333620ebb4e83b50899653b516f00'
      },
      {
        id: 17,
        code: '205',
        name: '雨林景观豪华蘑菇屋',
        category: '双人间',
        floor: '2楼',
        height: '2438',
        hasWindow: true,
        windowDirection: '东',
        roomType: '双人间',
        price: 789,
        seat: 2,
        rating: 4.8,
        status: 'available',
        image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=300&fit=crop',
        vrUrl: 'https://share-xt.hwbim.com/qlh/ffd333620ebb4e83b50899653b516f00'
      },
      {
        id: 18,
        code: '204',
        name: '雨林景观豪华蘑菇屋',
        category: '单人间',
        floor: '2楼',
        height: '2438',
        hasWindow: true,
        windowDirection: '南',
        roomType: '单人间',
        price: 999,
        seat: 1,
        rating: 4.9,
        status: 'available',
        image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop',
        vrUrl: 'https://share-xt.hwbim.com/qlh/ffd333620ebb4e83b50899653b516f00'
      },
      {
        id: 19,
        code: '203',
        name: '雨林景观豪华蘑菇屋',
        category: '单人间',
        floor: '2楼',
        height: '2438',
        hasWindow: true,
        windowDirection: '南',
        roomType: '单人间',
        price: 889,
        seat: 1,
        rating: 4.8,
        status: 'available',
        image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop',
        vrUrl: 'https://share-xt.hwbim.com/qlh/ffd333620ebb4e83b50899653b516f00'
      },
      {
        id: 20,
        code: '202',
        name: '雨林景观豪华蘑菇屋',
        category: '单人间',
        floor: '2楼',
        height: '2438',
        hasWindow: true,
        windowDirection: '南',
        roomType: '单人间',
        price: 48,
        seat: 1,
        rating: 4.3,
        status: 'available',
        image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop',
        vrUrl: 'https://share-xt.hwbim.com/qlh/ffd333620ebb4e83b50899653b516f00'
      },
      {
        id: 21,
        code: '201',
        name: '雨林景观豪华蘑菇屋',
        category: '大床房',
        floor: '2楼',
        height: '2438',
        hasWindow: true,
        windowDirection: '南',
        roomType: '大床房',
        price: 19,
        seat: 2,
        rating: 4.1,
        status: 'available',
        image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&h=300&fit=crop',
        vrUrl: 'https://share-xt.hwbim.com/qlh/ffd333620ebb4e83b50899653b516f00'
      },
      {
        id: 22,
        code: '301',
        name: '雨林景观豪华蘑菇屋',
        category: '亲子房',
        floor: '3楼',
        height: '2438',
        hasWindow: false,
        windowDirection: '无',
        roomType: '亲子房',
        price: 486,
        seat: 4,
        rating: 4.8,
        status: 'available',
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop',
        vrUrl: 'https://share-xt.hwbim.com/qlh/ffd333620ebb4e83b50899653b516f00'
      },
      {
        id: 23,
        code: '302',
        name: '雨林景观豪华蘑菇屋',
        category: '亲子房',
        floor: '3楼',
        height: '2438',
        hasWindow: false,
        windowDirection: '无',
        roomType: '亲子房',
        price: 1088,
        seat: 4,
        rating: 4.9,
        status: 'available',
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop',
        vrUrl: 'https://share-xt.hwbim.com/qlh/ffd333620ebb4e83b50899653b516f00'
      },
      {
        id: 24,
        code: '303',
        name: '雨林景观豪华蘑菇屋',
        category: '双人间',
        floor: '3楼',
        height: '2438',
        hasWindow: true,
        windowDirection: '南',
        roomType: '双人间',
        price: 0, // 价格未设定
        seat: 2,
        rating: 4.6,
        status: 'unavailable', // 价格未设定，暂不可预订
        image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=300&fit=crop',
        vrUrl: 'https://share-xt.hwbim.com/qlh/ffd333620ebb4e83b50899653b516f00'
      }
    ]

    allRooms.value = realRooms
    filteredRooms.value = realRooms
  } catch (error) {
    console.error('加载房间数据失败:', error)
  } finally {
    roomsLoading.value = false
  }
}

// 过滤房间
const filterRooms = () => {
  if (roomFilter.value === 'all') {
    filteredRooms.value = allRooms.value.filter(room => room.code !== '展览厅') // 排除展览厅
  } else {
    filteredRooms.value = allRooms.value.filter(room => {
      if (room.code === '展览厅') return false // 排除展览厅

      switch (roomFilter.value) {
        case 'single':
          return room.roomType === '单人间'
        case 'double':
          return room.roomType === '双人间' || room.roomType === '大床房'
        case 'family':
          return room.roomType === '亲子房'
        case 'suite':
          return room.category.includes('套房') || room.category.includes('豪华')
        default:
          return true
      }
    })
  }
}

// 删除了AI语音切换功能

// 测试Dify连接
const testDifyConnection = () => {
  if (difyChatWidget.value) {
    difyChatWidget.value.retryConnection()
  } else {
    isDifyConnected.value = !isDifyConnected.value
  }
}

// Dify加载成功回调
const onDifyLoaded = () => {
  isDifyConnected.value = true
  console.log('Dify AI助手加载成功')
}

// Dify错误回调
const onDifyError = (error: string) => {
  isDifyConnected.value = false
  console.error('Dify AI助手加载失败:', error)
}

// 选择房间
const selectRoom = (room: Room) => {
  console.log('选择房间:', room)
}

// 发送消息 (已替换为Dify组件)
// const sendFallbackMessage = () => {
//   // Dify组件会处理消息发送
//   console.log('消息发送由Dify组件处理')
// }

// 发送快捷问题 (已替换为Dify组件)
// const sendQuickQuestion = (question: string) => {
//   // Dify组件会处理快捷问题
//   console.log('快捷问题由Dify组件处理:', question)
// }

// 转换Markdown链接 (Dify组件内置支持)
// const convertMarkdownLinks = (content: string) => {
//   return content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
// }

// 滚动到底部 (Dify组件自动处理)
// const scrollToBottom = () => {
//   // Dify组件会自动滚动到底部
//   console.log('滚动由Dify组件处理')
// }

// 获取表情符号
const getExpressionEmoji = () => {
  return '😊'
}

// 获取AI状态文本
const aiStatusText = ref('我会根据您的需求为您推荐最适合的房间')

// 发送提示词
const sendPrompt = (prompt: string) => {
  if (difyChatWidget.value) {
    difyChatWidget.value.sendMessage(prompt)
  }
}

// 滑动到指定房间
const scrollToRoom = (index: number) => {
  currentRoomIndex.value = index
  if (roomsScrollContainer.value) {
    const container = roomsScrollContainer.value
    const roomCard = container.children[index] as HTMLElement
    if (roomCard) {
      roomCard.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      })
    }
  }
}

// 初始化语音识别
const initSpeechRecognition = () => {
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    recognition.value = new SpeechRecognition()
    recognition.value.continuous = false
    recognition.value.interimResults = false
    recognition.value.lang = 'zh-CN'

    recognition.value.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      voiceText.value = transcript
      isListening.value = false
    }

    recognition.value.onerror = (event: any) => {
      console.error('语音识别错误:', event.error)
      isListening.value = false
    }

    recognition.value.onend = () => {
      isListening.value = false
    }
  }
}

// 切换语音输入
const toggleVoiceInput = () => {
  if (!recognition.value) {
    initSpeechRecognition()
  }

  if (isListening.value) {
    recognition.value.stop()
    isListening.value = false
  } else {
    voiceText.value = ''
    recognition.value.start()
    isListening.value = true
  }
}

// 发送语音消息
const sendVoiceMessage = () => {
  if (voiceText.value && difyChatWidget.value) {
    difyChatWidget.value.sendMessage(voiceText.value)
    voiceText.value = ''
  }
}

// 发送备用消息
const sendBackupMessage = () => {
  if (backupUserInput.value.trim() && difyChatWidget.value) {
    difyChatWidget.value.sendMessage(backupUserInput.value.trim())
    backupUserInput.value = ''
  }
}

// 清除语音文本
const clearVoiceText = () => {
  voiceText.value = ''
}

// 重置对话
const resetConversation = () => {
  if (difyChatWidget.value) {
    difyChatWidget.value.resetConversation()
  }
  // 清空推荐和订单
  aiRecommendations.value = []
  currentOrder.value = null
}

// 解析AI聊天内容中的房间推荐
const parseRoomRecommendations = (message: string) => {
  const recommendations: any[] = []
  console.log('解析房间推荐，消息内容:', message)

  // 多种房间号码匹配模式（优化后）
  const roomPatterns = [
    /【(\d{3})[^】]*】/g,        // 【208单人间】格式
    /(\d{3})号?房/g,           // 101号房、101房
    /房间号[：:]\s*(\d{3})/g,  // 房间号：101
    /房间\s*(\d{3})/g,         // 房间101
    /(\d{3})\s*房间/g,         // 101房间
    /推荐.*?(\d{3})/g,         // 推荐...101
    /建议.*?(\d{3})/g,         // 建议...101
    /适合.*?(\d{3})/g,         // 适合...101
    /(\d{3}).*?元/g,           // 208...元（价格相关）
  ]

  // 尝试所有匹配模式
  roomPatterns.forEach(pattern => {
    const matches = message.match(pattern)
    if (matches) {
      matches.forEach(match => {
        const roomCode = match.match(/\d{3}/)?.[0]
        if (roomCode) {
          const room = roomDatabase.find(r => r.code === roomCode)
          // 只推荐可用的房间
          if (room && room.status === 'available' && !recommendations.find(r => r.code === roomCode)) {
            console.log('找到推荐房间:', roomCode, room.name, '状态:', room.status)
            recommendations.push({
              ...room,
              recommendReason: extractRecommendReason(message, roomCode)
            })
          } else if (room && room.status !== 'available') {
            console.log('房间不可用，跳过推荐:', roomCode, room.name, '状态:', room.status)
          }
        }
      })
    }
  })

  // 如果没有找到具体房间号，尝试根据关键词推荐
  if (recommendations.length === 0) {
    const keywordRecommendations = getRecommendationsByKeywords(message)
    recommendations.push(...keywordRecommendations)
  }

  console.log('解析结果:', recommendations)
  return recommendations
}

// 提取推荐理由
const extractRecommendReason = (message: string, roomCode: string) => {
  const reasonPatterns = [
    new RegExp(`${roomCode}.*?因为(.{10,50})`, 'i'),
    new RegExp(`推荐${roomCode}.*?(.{10,50})`, 'i'),
    new RegExp(`${roomCode}.*?适合(.{10,50})`, 'i'),
  ]

  for (const pattern of reasonPatterns) {
    const match = message.match(pattern)
    if (match && match[1]) {
      return match[1].trim()
    }
  }

  return '根据您的需求推荐'
}

// 根据关键词推荐房间
const getRecommendationsByKeywords = (message: string) => {
  const recommendations: any[] = []
  const lowerMessage = message.toLowerCase()

  // 楼层筛选
  let targetFloor = null
  if (lowerMessage.includes('3楼') || lowerMessage.includes('三楼')) {
    targetFloor = '3楼'
  } else if (lowerMessage.includes('2楼') || lowerMessage.includes('二楼')) {
    targetFloor = '2楼'
  } else if (lowerMessage.includes('1楼') || lowerMessage.includes('一楼')) {
    targetFloor = '1楼'
  }

  // 如果消息包含"推荐"关键词，推荐多个房间
  if (lowerMessage.includes('推荐') || lowerMessage.includes('房间') || lowerMessage.includes('选择')) {
    // 获取可用房间
    let availableRooms = roomDatabase.filter(r => r.status === 'available')

    // 如果指定了楼层，只推荐该楼层的房间
    if (targetFloor) {
      availableRooms = availableRooms.filter(r => r.floor === targetFloor)

      // 推荐该楼层的所有可用房间
      availableRooms.forEach((room, index) => {
        let reason = ''
        if (targetFloor === '3楼') {
          switch (room.code) {
            case '301':
              reason = '3楼双人间，茶具套装，含早餐'
              break
            case '302':
              reason = '3楼双人间，雨林茶园双景观'
              break
            case '303':
              reason = '3楼亲子房，山景阳台，适合家庭'
              break
            default:
              reason = '3楼房间，视野开阔'
          }
        } else if (targetFloor === '2楼') {
          reason = '2楼房间，视野开阔，采光极佳'
        } else if (targetFloor === '1楼') {
          reason = '1楼房间，出入方便'
        }

        recommendations.push({
          ...room,
          recommendReason: reason
        })
      })
    } else {
      // 没有指定楼层，推荐不同类型的房间
      const recommendedRooms = [
        // 性价比房间
        availableRooms.find(r => r.code === '208'), // 198元单人间
        // 中档房间
        availableRooms.find(r => r.code === '202'), // 486元双人间
        // 高档房间
        availableRooms.find(r => r.code === '204'), // 999元双人间
        // 经济房间
        availableRooms.find(r => r.code === '201') || availableRooms.find(r => r.price <= 200)
      ].filter(Boolean) // 过滤掉undefined

      recommendedRooms.forEach((room, index) => {
        if (room) {
          let reason = ''
          switch (index) {
            case 0:
              reason = '性价比高，茶园景观'
              break
            case 1:
              reason = '中档舒适，南向采光'
              break
            case 2:
              reason = '豪华山景，设施完善'
              break
            case 3:
              reason = '经济实惠，便利位置'
              break
            default:
              reason = '根据您的需求推荐'
          }

          recommendations.push({
            ...room,
            recommendReason: reason
          })
        }
      })
    }
  }

  // 价格关键词
  if (lowerMessage.includes('便宜') || lowerMessage.includes('经济') || lowerMessage.includes('实惠')) {
    const cheapRooms = roomDatabase.filter(r => r.price <= 200).slice(0, 2)
    cheapRooms.forEach(room => {
      if (!recommendations.find(r => r.code === room.code)) {
        recommendations.push({
          ...room,
          recommendReason: '价格实惠，性价比高'
        })
      }
    })
  }

  // 豪华关键词
  if (lowerMessage.includes('豪华') || lowerMessage.includes('高档') || lowerMessage.includes('奢华')) {
    const luxuryRooms = roomDatabase.filter(r => r.price >= 400).slice(0, 2)
    luxuryRooms.forEach(room => {
      if (!recommendations.find(r => r.code === room.code)) {
        recommendations.push({
          ...room,
          recommendReason: '豪华舒适，设施完善'
        })
      }
    })
  }

  // 家庭关键词
  if (lowerMessage.includes('家庭') || lowerMessage.includes('亲子') || lowerMessage.includes('孩子')) {
    const familyRooms = roomDatabase.filter(r => r.type.includes('双人') || r.type.includes('亲子')).slice(0, 2)
    familyRooms.forEach(room => {
      if (!recommendations.find(r => r.code === room.code)) {
        recommendations.push({
          ...room,
          recommendReason: '适合家庭入住，空间宽敞'
        })
      }
    })
  }

  // 楼层查询关键词
  if (targetFloor && recommendations.length === 0) {
    // 如果指定了楼层但没有其他推荐，显示该楼层所有可用房间
    const floorRooms = roomDatabase.filter(r => r.floor === targetFloor && r.status === 'available')
    floorRooms.forEach(room => {
      let reason = ''
      if (targetFloor === '3楼') {
        reason = '3楼房间，视野最佳，私密性好'
      } else if (targetFloor === '2楼') {
        reason = '2楼房间，视野开阔，采光极佳'
      } else if (targetFloor === '1楼') {
        reason = '1楼房间，出入方便，靠近大堂'
      }

      recommendations.push({
        ...room,
        recommendReason: reason
      })
    })
  }

  return recommendations
}

// 解析订单信息
const parseOrderInfo = (message: string) => {
  const orderInfo: any = {}
  console.log('解析订单信息，消息内容:', message)

  // 多种房间号匹配模式（更精确的匹配）
  const roomPatterns = [
    /已为您预订(\d{3})/,
    /预订(\d{3})号?房/,
    /(\d{3})号?房.*?预订/,
    /房间号[：:]\s*(\d{3})/,
    /确认预订.*?(\d{3})/,
    /(\d{3}).*?亲子房/,
    /(\d{3}).*?房间.*?预订/,
  ]

  for (const pattern of roomPatterns) {
    const roomMatch = message.match(pattern)
    if (roomMatch) {
      orderInfo.roomCode = roomMatch[1]
      const room = roomDatabase.find(r => r.code === roomMatch[1])
      if (room) {
        orderInfo.roomName = room.name
        orderInfo.price = room.price
      }
      break
    }
  }

  // 多种日期匹配模式 - 优先匹配完整的日期范围
  const dateRangePatterns = [
    // 入住时间7月20日，离开时间7月25日
    /入住时间.*?(\d{1,2})月(\d{1,2})日.*?离开时间.*?(\d{1,2})月(\d{1,2})日/,
    // 7月20日入住，7月25日离开
    /(\d{1,2})月(\d{1,2})日.*?入住.*?(\d{1,2})月(\d{1,2})日.*?离开/,
    // 7月20日到7月25日
    /(\d{1,2})月(\d{1,2})日.*?到.*?(\d{1,2})月(\d{1,2})日/,
    // 20号到25号
    /(\d{1,2})号.*?到.*?(\d{1,2})号/,
  ]

  const datePatterns = [
    /(\d{4})年(\d{1,2})月(\d{1,2})日/,
    /(\d{4})-(\d{1,2})-(\d{1,2})/,
    /(\d{1,2})月(\d{1,2})日/,
    /入住.*?(\d{4})年(\d{1,2})月(\d{1,2})日/,
    /入住.*?(\d{4})-(\d{1,2})-(\d{1,2})/,
    /入住时间.*?(\d{1,2})月(\d{1,2})日/,
    /(\d{1,2})\/(\d{1,2})\/(\d{4})/,
    /7月(\d{1,2})日/,  // 特殊处理7月格式
    /(\d{1,2})月(\d{1,2})号/,  // 支持"号"
  ]

  console.log('🗓️ 解析订单信息，消息:', message)

  // 首先尝试解析完整的日期范围
  for (const pattern of dateRangePatterns) {
    const rangeMatch = message.match(pattern)
    if (rangeMatch) {
      console.log('🎯 匹配到日期范围模式:', pattern.source, '结果:', rangeMatch)
      const currentYear = new Date().getFullYear()

      if (pattern.source.includes('入住时间.*?离开时间')) {
        // 入住时间7月20日，离开时间7月25日
        orderInfo.checkInDate = `${currentYear}-${rangeMatch[1].padStart(2, '0')}-${rangeMatch[2].padStart(2, '0')}`
        orderInfo.checkOutDate = `${currentYear}-${rangeMatch[3].padStart(2, '0')}-${rangeMatch[4].padStart(2, '0')}`
      } else if (pattern.source.includes('月.*?日.*?到.*?月.*?日')) {
        // 7月20日到7月25日
        orderInfo.checkInDate = `${currentYear}-${rangeMatch[1].padStart(2, '0')}-${rangeMatch[2].padStart(2, '0')}`
        orderInfo.checkOutDate = `${currentYear}-${rangeMatch[3].padStart(2, '0')}-${rangeMatch[4].padStart(2, '0')}`
      } else if (pattern.source.includes('号.*?到.*?号')) {
        // 20号到25号 - 假设是当前月
        const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0')
        orderInfo.checkInDate = `${currentYear}-${currentMonth}-${rangeMatch[1].padStart(2, '0')}`
        orderInfo.checkOutDate = `${currentYear}-${currentMonth}-${rangeMatch[2].padStart(2, '0')}`
      }

      console.log('✅ 解析日期范围成功:', orderInfo.checkInDate, '到', orderInfo.checkOutDate)
      break
    }
  }

  // 如果没有匹配到完整范围，再尝试单独解析入住日期
  if (!orderInfo.checkInDate) {
    for (const pattern of datePatterns) {
      const dateMatch = message.match(pattern)
      if (dateMatch) {
        if (dateMatch.length === 4) { // 完整年月日
          orderInfo.checkInDate = `${dateMatch[1]}-${dateMatch[2].padStart(2, '0')}-${dateMatch[3].padStart(2, '0')}`
        } else if (dateMatch.length === 3) { // 只有月日，使用当前年
          const currentYear = new Date().getFullYear()
          orderInfo.checkInDate = `${currentYear}-${dateMatch[1].padStart(2, '0')}-${dateMatch[2].padStart(2, '0')}`
        } else if (pattern.source.includes('7月')) { // 特殊处理7月
          const currentYear = new Date().getFullYear()
          orderInfo.checkInDate = `${currentYear}-07-${dateMatch[1].padStart(2, '0')}`
        }
        break
      }
    }
  }

  // 如果还没有解析到退房日期，单独解析退房日期
  if (!orderInfo.checkOutDate) {
    const checkoutPatterns = [
      /离开时间.*?(\d{1,2})月(\d{1,2})日/,
      /退房.*?(\d{1,2})月(\d{1,2})日/,
      /退房时间.*?(\d{1,2})月(\d{1,2})日/,
      /(\d{1,2})月(\d{1,2})日.*?离开/,
      /(\d{1,2})月(\d{1,2})日.*?退房/,
      /7月(\d{1,2})日.*?退房/,
      /退房.*?7月(\d{1,2})日/,
    ]

    for (const pattern of checkoutPatterns) {
      const checkoutMatch = message.match(pattern)
      if (checkoutMatch) {
        const currentYear = new Date().getFullYear()
        if (pattern.source.includes('7月')) {
          orderInfo.checkOutDate = `${currentYear}-07-${checkoutMatch[1].padStart(2, '0')}`
        } else {
          orderInfo.checkOutDate = `${currentYear}-${checkoutMatch[1].padStart(2, '0')}-${checkoutMatch[2].padStart(2, '0')}`
        }
        console.log('✅ 单独解析退房日期:', orderInfo.checkOutDate)
        break
      }
    }
  }

  // 解析手机号
  const phonePatterns = [
    /1[3-9]\d{9}/,
    /手机[：:]\s*(1[3-9]\d{9})/,
    /电话[：:]\s*(1[3-9]\d{9})/,
    /联系方式[：:]\s*(1[3-9]\d{9})/,
  ]

  for (const pattern of phonePatterns) {
    const phoneMatch = message.match(pattern)
    if (phoneMatch) {
      orderInfo.phone = phoneMatch[1] || phoneMatch[0]
      break
    }
  }

  // 解析总费用
  const pricePatterns = [
    /(\d+)元/,
    /总计[：:]\s*(\d+)/,
    /费用[：:]\s*(\d+)/,
    /价格[：:]\s*(\d+)/,
    /¥(\d+)/,
  ]

  for (const pattern of pricePatterns) {
    const priceMatch = message.match(pattern)
    if (priceMatch) {
      orderInfo.totalAmount = parseInt(priceMatch[1])
      break
    }
  }

  // 解析客人姓名
  const namePatterns = [
    /姓名[：:]\s*([^\s\d]{2,4})/,
    /客人[：:]\s*([^\s\d]{2,4})/,
    /预订人[：:]\s*([^\s\d]{2,4})/,
  ]

  for (const pattern of namePatterns) {
    const nameMatch = message.match(pattern)
    if (nameMatch) {
      orderInfo.guestName = nameMatch[1]
      break
    }
  }

  console.log('解析订单结果:', orderInfo)
  return orderInfo
}

// 监听Dify聊天消息
const onDifyMessage = (message: any) => {
  console.log('收到Dify消息:', message)

  if (message.type === 'ai' && message.content) {
    console.log('=== AI消息处理开始 ===')
    console.log('消息内容:', message.content)

    // 解析房间推荐
    const recommendations = parseRoomRecommendations(message.content)
    if (recommendations.length > 0) {
      aiRecommendations.value = recommendations
      console.log('更新AI推荐房间:', recommendations)
    }

    // 检查是否包含订单确认信息（更严格的匹配，避免推荐被误认为预订）
    const orderTriggers = [
      '预订成功', '订单详情', '预订确认', '订单确认',
      '预订完成', '预订信息', '订单生成',
      '确认预订', '预订单', '订单创建', '预订记录',
      '预订已确认', '房间已预订', '订单已生成',
      '预订确认成功', '订单号', '预订单号'
    ]

    // 排除推荐关键词，避免推荐被误认为预订
    const recommendationKeywords = [
      '为您推荐', '推荐房间', '符合要求', '找到以下',
      '为您找到', '建议选择', '推荐以下', '可以选择'
    ]

    const isRecommendation = recommendationKeywords.some(keyword => message.content.includes(keyword))

    // 检查是否包含订单取消信息
    const cancelTriggers = [
      '订单已取消', '预订已取消', '取消成功', '已取消预订',
      '订单取消', '预订取消', '取消订单成功'
    ]

    // 检查是否包含订单修改信息
    const modifyTriggers = [
      '订单已修改', '预订已修改', '修改成功', '已修改预订',
      '订单修改', '预订修改', '修改订单成功', '更新成功'
    ]

    const hasOrderTrigger = orderTriggers.some(trigger => message.content.includes(trigger))
    const hasCancelTrigger = cancelTriggers.some(trigger => message.content.includes(trigger))
    const hasModifyTrigger = modifyTriggers.some(trigger => message.content.includes(trigger))

    console.log('触发器检测结果:')
    console.log('- 订单触发器:', hasOrderTrigger)
    console.log('- 取消触发器:', hasCancelTrigger)
    console.log('- 修改触发器:', hasModifyTrigger)
    console.log('- 是否为推荐:', isRecommendation)

    // 处理订单取消
    if (hasCancelTrigger) {
      if (currentOrder.value) {
        console.log('检测到订单取消:', currentOrder.value.orderNumber)
        currentOrder.value = null
        showNotification('订单已取消', 'info')
      }
    }
    // 处理订单修改
    else if (hasModifyTrigger) {
      if (currentOrder.value) {
        const orderInfo = parseOrderInfo(message.content)
        // 更新现有订单信息
        if (orderInfo.roomCode && orderInfo.roomCode !== currentOrder.value.roomCode) {
          currentOrder.value.roomCode = orderInfo.roomCode
          const room = roomDatabase.find(r => r.code === orderInfo.roomCode)
          if (room) {
            currentOrder.value.roomName = room.name
            currentOrder.value.totalAmount = room.price
          }
        }
        if (orderInfo.checkInDate) {
          currentOrder.value.checkInDate = orderInfo.checkInDate
        }
        if (orderInfo.checkOutDate) {
          currentOrder.value.checkOutDate = orderInfo.checkOutDate
        }
        if (orderInfo.totalAmount) {
          currentOrder.value.totalAmount = orderInfo.totalAmount
        }
        console.log('订单已修改:', currentOrder.value)
        showNotification('订单修改成功', 'success')
      }
    }
    // 处理新订单创建（只有在非推荐情况下才创建订单）
    else if (hasOrderTrigger && !isRecommendation) {
      const orderInfo = parseOrderInfo(message.content)
      if (orderInfo.roomCode) {
        console.log('检测到订单创建请求，房间号:', orderInfo.roomCode)
        // 创建订单
        const order = {
          orderNumber: 'ORD' + Date.now(),
          roomCode: orderInfo.roomCode,
          roomName: orderInfo.roomName || '雨林景观豪华蘑菇屋',
          checkInDate: orderInfo.checkInDate || getTomorrowDate(),
          checkOutDate: calculateCheckOutDate(orderInfo.checkInDate || getTomorrowDate()),
          totalAmount: orderInfo.totalAmount || orderInfo.price || 48,
          phone: orderInfo.phone || '待补充',
          guestName: orderInfo.guestName || '待补充',
          status: 'confirmed',
          createdAt: new Date().toISOString()
        }
        currentOrder.value = order
        console.log('创建订单:', order)

        // 显示订单创建成功提示
        showOrderCreatedNotification(order)
      }
    } else if (hasOrderTrigger && isRecommendation) {
      console.log('检测到推荐信息，不创建订单')
    }
  }
}

// 发送快速消息（用于测试）
const sendQuickMessage = (message: string) => {
  console.log('发送快速消息:', message)

  // 模拟AI回复进行测试
  setTimeout(() => {
    let aiResponse = ''

    if (message.includes('便宜')) {
      aiResponse = '我为您推荐101号房，价格实惠仅¥18/晚，性价比极高，适合预算有限的客人。'
    } else if (message.includes('豪华')) {
      aiResponse = '推荐102号房，这是豪华大床房，价格¥888/晚，设施完善，服务一流。'
    } else if (message.includes('家庭')) {
      aiResponse = '建议选择211号房，这是亲子房，价格¥419/晚，适合家庭入住，空间宽敞舒适。'
    } else {
      aiResponse = `根据您的需求"${message}"，我为您推荐以下房间：101号房（¥18/晚）性价比高，102号房（¥888/晚）豪华舒适。`
    }

    // 触发消息解析
    onDifyMessage({
      type: 'ai',
      content: aiResponse,
      timestamp: new Date().toISOString()
    })
  }, 1000)
}

// 测试消息解析功能
const testMessageParsing = () => {
  const testMessages = [
    '我推荐您选择101号房，价格实惠仅¥18/晚，适合单人入住。',
    '根据您的需求，建议选择102号房，这是一间豪华大床房，价格¥888/晚，设施完善。',
    '推荐211号房，这是亲子房，适合家庭入住，价格¥419/晚。',
    '预订成功！您已成功预订101号房，入住日期：明天，客人：张三，电话：13812345678，总费用：¥18。'
  ]

  testMessages.forEach((message, index) => {
    setTimeout(() => {
      console.log(`测试消息 ${index + 1}:`, message)
      onDifyMessage({
        type: 'ai',
        content: message,
        timestamp: new Date().toISOString()
      })
    }, (index + 1) * 2000)
  })
}

// 获取明天的日期
const getTomorrowDate = () => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
}

// 计算退房日期（默认住一晚）
const calculateCheckOutDate = (checkInDate: string) => {
  const date = new Date(checkInDate)
  date.setDate(date.getDate() + 1)
  return date.toISOString().split('T')[0]
}

// 显示订单创建成功通知
const showOrderCreatedNotification = (order: any) => {
  console.log('订单创建成功通知:', order)
  // 这里可以添加更多的通知逻辑，比如显示toast消息
}

// 获取房间图片
const getRoomImage = (roomCode: string) => {
  const room = roomDatabase.find(r => r.code === roomCode)
  // 根据楼层返回对应图片
  if (room?.floor === '1楼') {
    return '/src/assets/images/实地调研/房间调研/房间调研1.jpg'
  } else if (room?.floor === '2楼') {
    return '/src/assets/images/实地调研/房间调研/房间调研2.jpg'
  } else if (room?.floor === '3楼') {
    return '/src/assets/images/实地调研/房间调研/房间调研3.jpg'
  }
  return '/src/assets/images/实地调研/房间调研/房间调研1.jpg'
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}



// 处理来自聊天组件的消息
const handleChatMessage = (event: MessageEvent) => {
  if (event.data && event.data.type === 'viewRoom') {
    if (event.data.url) {
      // 打开VR链接
      window.open(event.data.url, '_blank')
    } else if (event.data.roomCode) {
      // 根据房间号找到对应的VR链接
      const room = roomDatabase.find(r => r.code === event.data.roomCode)
      if (room && (room as any).vrUrl) {
        window.open((room as any).vrUrl, '_blank')
      } else {
        // 默认VR链接
        window.open('https://share-xt.hwbim.com/qlh/ffd333620ebb4e83b50899653b516f00', '_blank')
      }
    }
  }
}

// 显示通知消息
const showNotification = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
  // 创建通知元素
  const notification = document.createElement('div')
  notification.className = `notification notification-${type}`
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
      <span>${message}</span>
    </div>
  `

  // 添加样式
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 9999;
    animation: slideInRight 0.3s ease-out;
    font-size: 14px;
    max-width: 300px;
  `

  // 添加到页面
  document.body.appendChild(notification)

  // 3秒后自动移除
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease-in'
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 300)
  }, 3000)
}
</script>

<style scoped>
/* 基础样式 */
.ai-room-selection {
  min-height: 100vh;
  background: linear-gradient(135deg, #d1fae5 0%, #ecfdf5 50%, #f0fdf4 100%) !important;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 确保body背景不会覆盖页面背景 */
body {
  background: transparent !important;
}

/* 页面标题 */
.page-header {
  background: transparent;
  padding: 1.5rem 0;
  margin-top: 70px;
  text-align: center;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #065f46;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.page-title .ai-icon {
  font-size: 2.5rem;
  text-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
}

.page-subtitle {
  color: #047857;
  font-size: 1.1rem;
  font-weight: 500;
  text-align: center;
}

/* 主要内容 */
.main-content {
  padding: 2rem 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  min-height: 800px;
  margin-bottom: 3rem;
  max-width: 1600px;
  margin: 0 auto 3rem auto;
}

/* 左侧面板 */
.left-panel {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  height: 1184px;
}

/* AI助手 */
.ai-assistant {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  height: 220px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* AI控制按钮样式 */
.ai-controls {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.control-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 15px;
}

.control-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
}

.voice-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.voice-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.voice-btn.active {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  animation: pulse 1.5s infinite;
}

.reset-btn {
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
}

.reset-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.4);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* 语音指示器 */
.voice-indicator {
  text-align: center;
  padding: 15px;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 12px;
  margin-bottom: 15px;
}

.voice-wave {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3px;
  margin-bottom: 10px;
}

.wave-bar {
  width: 4px;
  height: 20px;
  background: #10b981;
  border-radius: 2px;
  animation: wave 1.2s infinite ease-in-out;
}

.wave-bar:nth-child(2) { animation-delay: -1.1s; }
.wave-bar:nth-child(3) { animation-delay: -1.0s; }
.wave-bar:nth-child(4) { animation-delay: -0.9s; }
.wave-bar:nth-child(5) { animation-delay: -0.8s; }

.voice-text {
  margin: 0;
  font-size: 14px;
  color: #059669;
  font-weight: 500;
}

/* 语音结果 */
.voice-result {
  background: rgba(59, 130, 246, 0.1);
  border-radius: 12px;
  padding: 15px;
}

.voice-label {
  margin: 0 0 8px 0;
  font-size: 12px;
  color: #6b7280;
  font-weight: 600;
}

.voice-content {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #1f2937;
  background: white;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.voice-actions {
  display: flex;
  gap: 8px;
}

.send-voice-btn {
  flex: 1;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.send-voice-btn:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  transform: translateY(-1px);
}

.clear-voice-btn {
  background: #f3f4f6;
  color: #6b7280;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.clear-voice-btn:hover {
  background: #e5e7eb;
  border-color: #9ca3af;
}

/* 动画 */
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes wave {
  0%, 40%, 100% { transform: scaleY(0.4); }
  20% { transform: scaleY(1.0); }
}

.ai-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.ai-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  transition: transform 0.3s ease;
}

.ai-avatar:hover {
  transform: scale(1.05);
}

.ai-character {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.speaking-indicator {
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 2px;
}

.wave {
  width: 3px;
  height: 15px;
  background: #d4af37;
  border-radius: 2px;
  animation: wave 1s ease-in-out infinite;
}

.wave:nth-child(2) {
  animation-delay: 0.2s;
}

.wave:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes wave {
  0%, 100% { height: 15px; }
  50% { height: 25px; }
}

.ai-info h3 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.3rem;
}

.ai-info p {
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.ai-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #6b7280;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ef4444;
  transition: all 0.3s ease;
}

.status-dot.online {
  background: #10b981;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ef4444;
}

.status-dot.online {
  background: #10b981;
}

.ai-controls {
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  background: white;
  color: #6b7280;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.btn:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.btn.active {
  background: #d4af37;
  color: white;
  border-color: #d4af37;
}

/* 推荐房间 */
.recommended-rooms {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  height: 550px;
  min-height: 550px;
  max-height: 550px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.recommended-rooms h3 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.count {
  font-size: 0.9rem;
  color: #d4af37;
}

.rooms {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.rooms::-webkit-scrollbar {
  width: 6px;
}

.rooms::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.rooms::-webkit-scrollbar-thumb {
  background: #d4af37;
  border-radius: 3px;
}

.rooms::-webkit-scrollbar-thumb:hover {
  background: #b8941f;
}

/* 房间滑动容器 */
.rooms-container {
  position: relative;
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.rooms-scroll {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-behavior: smooth;
  padding: 0.5rem 0;
  scrollbar-width: thin;
  scrollbar-color: #d4af37 #f1f1f1;
  flex: 1;
  max-height: 400px;
  min-height: 0;
}

.rooms-scroll::-webkit-scrollbar {
  width: 6px;
}

.rooms-scroll::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.rooms-scroll::-webkit-scrollbar-thumb {
  background: #d4af37;
  border-radius: 3px;
}

.rooms-scroll::-webkit-scrollbar-thumb:hover {
  background: #b8941f;
}

.rooms-scroll .room-card {
  width: 100%;
  min-height: 120px;
  max-height: 160px;
  flex-shrink: 0;
}

/* 滚动提示 */
.scroll-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.5rem;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 8px;
  color: #d4af37;
  font-size: 0.85rem;
  font-weight: 500;
  animation: pulse 2s infinite;
}

.scroll-hint i {
  font-size: 0.8rem;
  animation: bounce 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-3px); }
  60% { transform: translateY(-2px); }
}

.room-card {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.room-card:hover {
  border-color: #d4af37;
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.2);
}

.room-card.recommended {
  position: relative;
  border-color: #d4af37;
  background: linear-gradient(135deg, #fff9e6 0%, #ffffff 100%);
}

.recommend-badge {
  position: absolute;
  top: -8px;
  right: 12px;
  background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 2px 8px rgba(212, 175, 55, 0.3);
}

.recommend-reason {
  background: rgba(212, 175, 55, 0.1);
  color: #b8860b;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 0.85rem;
  margin: 8px 0;
  display: flex;
  align-items: center;
  gap: 6px;
  border-left: 3px solid #d4af37;
}

.room-image {
  width: 80px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
}

.room-info h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.3rem;
}

.room-info p {
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.room-floor {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.85rem;
  color: #8b5cf6;
  margin-bottom: 0.5rem;
}

.room-floor i {
  font-size: 0.8rem;
}

.room-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
}

.price {
  color: #d4af37;
  font-weight: 600;
}

.rating {
  color: #f59e0b;
}

.status.available {
  color: #10b981;
}

.status.unavailable {
  color: #ef4444;
}

/* 订单详情 */
.order-details {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  height: 350px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.order-details h3 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: space-between;
  flex-shrink: 0;
}

.order-content {
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.order-content::-webkit-scrollbar {
  width: 4px;
}

.order-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.order-content::-webkit-scrollbar-thumb {
  background: #d4af37;
  border-radius: 2px;
}

.order-content::-webkit-scrollbar-thumb:hover {
  background: #b8941f;
}

.order-status {
  background: #10b981;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.order-header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.order-number, .order-date {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-number .label, .order-date .label {
  font-size: 0.85rem;
  color: #6b7280;
  font-weight: 500;
}

.order-number .value, .order-date .value {
  font-size: 0.95rem;
  color: #1f2937;
  font-weight: 600;
}

.order-room-info {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 12px;
}

.room-image-container {
  flex-shrink: 0;
}

.room-thumbnail {
  width: 80px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
}

.room-details h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.stay-dates {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.date-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #6b7280;
}

.date-item i {
  color: #d4af37;
}

.guest-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f3f4f6;
  border-radius: 12px;
}

.guest-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
}

.guest-item i {
  color: #d4af37;
  width: 16px;
}

.guest-item .label {
  color: #6b7280;
  font-weight: 500;
}

.guest-item .value {
  color: #1f2937;
  font-weight: 600;
}

.order-summary {
  border-top: 1px solid #e5e7eb;
  padding-top: 1rem;
  margin-bottom: 1.5rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  font-size: 0.9rem;
}

.summary-item.total {
  border-top: 1px solid #e5e7eb;
  margin-top: 0.5rem;
  padding-top: 1rem;
  font-weight: 600;
  font-size: 1rem;
}

.summary-item .label {
  color: #6b7280;
}

.summary-item .value {
  color: #1f2937;
  font-weight: 600;
}

.summary-item .price {
  color: #d4af37;
  font-size: 1.1rem;
  font-weight: 700;
}

.order-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.order-item.total {
  border-bottom: none;
  font-weight: 600;
  color: #d4af37;
}

.label {
  color: #6b7280;
}

.order-actions {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-outline {
  background: white;
  color: #ef4444;
  border: 1px solid #ef4444;
}

.btn-outline:hover {
  background: #ef4444;
  color: white;
}

.btn-primary {
  background: #d4af37;
  color: white;
  border: 1px solid #d4af37;
}

.btn-primary:hover {
  background: #b8941f;
  border-color: #b8941f;
}

.empty-hint {
  font-size: 0.8rem;
  color: #9ca3af;
  margin-top: 0.5rem;
}

.order-tips {
  margin-top: 1.5rem;
  padding: 1rem;
  background: rgba(59, 130, 246, 0.05);
  border: 1px solid rgba(59, 130, 246, 0.1);
  border-radius: 8px;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  font-size: 0.85rem;
  color: #6b7280;
  line-height: 1.4;
}

.tip-item:last-child {
  margin-bottom: 0;
}

.tip-item i {
  color: #3b82f6;
  margin-top: 0.1rem;
  flex-shrink: 0;
}

/* 通知动画 */
@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* 右侧面板 */
.right-panel {
  display: flex;
  flex-direction: column;
  gap: 0;
  height: 1184px;
}

/* 聊天容器 */
.chat-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  height: 1184px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.chat-header {
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-header h3 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.chat-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #6b7280;
}

/* Dify聊天组件样式 */
.dify-chat-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
  overflow: hidden;
}

.dify-chat-wrapper .dify-chat-widget {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.dify-chat-wrapper .chat-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: transparent;
  border-radius: 0;
  box-shadow: none;
}

.dify-chat-wrapper .chat-messages {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.dify-chat-wrapper .chat-input {
  flex-shrink: 0;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  border-radius: 0 0 20px 20px;
  padding: 1rem;
}

/* 备用聊天输入框 */
.backup-chat-input {
  flex-shrink: 0;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  border-radius: 0 0 20px 20px;
  padding: 1rem;
  margin-top: auto;
}

.backup-chat-input .input-container {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.backup-chat-input .message-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 25px;
  font-size: 0.9rem;
  outline: none;
  transition: all 0.3s ease;
}

.backup-chat-input .message-input:focus {
  border-color: #d4af37;
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
}

.backup-chat-input .send-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: #d4af37;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.backup-chat-input .send-button:hover:not(:disabled) {
  background: #b8941f;
  transform: scale(1.05);
}

.backup-chat-input .send-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

/* AI快捷功能按钮 */
.ai-quick-actions {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  flex-wrap: wrap;
}

.quick-action-btn {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.85rem;
  font-weight: 500;
}

.quick-action-btn:hover {
  background: linear-gradient(135deg, #d4af37 0%, #b8941f 100%);
  border-color: #d4af37;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
}

.quick-action-btn i {
  font-size: 0.9rem;
  color: #d4af37;
  transition: color 0.3s ease;
}

.quick-action-btn:hover i {
  color: white;
}

.quick-action-btn span {
  color: #374151;
  transition: color 0.3s ease;
}

.quick-action-btn:hover span {
  color: white;
}

/* 聊天消息 */
.chat-messages {
  flex: 1;
  padding: 1rem 2rem;
  overflow-y: auto;
  max-height: 400px;
  min-height: 300px;
}

.message {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.message.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.message-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.message-content {
  flex: 1;
  max-width: 80%;
}

.message-text {
  background: #f3f4f6;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 0.3rem;
}

.message.user .message-text {
  background: #d4af37;
  color: white;
}

.message-time {
  font-size: 0.75rem;
  color: #9ca3af;
}

/* 输入提示 */
.typing-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #f3f4f6;
  border-radius: 12px;
  margin-bottom: 1rem;
}

.typing-dots {
  display: flex;
  gap: 0.2rem;
}

.typing-dots span {
  width: 6px;
  height: 6px;
  background: #9ca3af;
  border-radius: 50%;
  animation: typing 1.4s infinite;
}

.typing-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-8px); }
}

.typing-text {
  font-size: 0.8rem;
  color: #6b7280;
}

/* 聊天输入 */
.chat-input-section {
  padding: 1rem 2rem 2rem;
  border-top: 1px solid #f3f4f6;
  margin-top: auto; /* 推到底部 */
  background: rgba(255, 255, 255, 0.98);
  border-radius: 0 0 20px 20px;
}

.quick-questions {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.quick-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(212, 175, 55, 0.1);
  color: #d4af37;
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.8rem;
}

.quick-btn:hover {
  background: #d4af37;
  color: white;
}

.input-container {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.chat-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 25px;
  outline: none;
  font-size: 0.9rem;
}

.chat-input:focus {
  border-color: #d4af37;
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
}

.send-btn {
  width: 40px;
  height: 40px;
  background: #d4af37;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.send-btn:hover:not(:disabled) {
  background: #b8941f;
  transform: scale(1.05);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.empty-state i {
  font-size: 3rem;
  color: #d1d5db;
  margin-bottom: 1rem;
}

/* 全部房间展示 */
.all-rooms-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f3f4f6;
}

.section-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.room-filters {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.filter-select {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  color: #6b7280;
  cursor: pointer;
}

.view-toggle {
  display: flex;
  gap: 0.5rem;
}

.toggle-btn {
  width: 36px;
  height: 36px;
  border: 1px solid #d1d5db;
  background: white;
  color: #6b7280;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.toggle-btn:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.toggle-btn.active {
  background: #d4af37;
  color: white;
  border-color: #d4af37;
}

.loading-state {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #d4af37;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.rooms-grid {
  display: grid;
  gap: 1.5rem;
}

.rooms-grid.grid {
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.rooms-grid.list {
  grid-template-columns: 1fr;
}

.room-item {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;
}

.room-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
  border-color: #d4af37;
}

.room-image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.room-image-container .room-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.room-item:hover .room-image {
  transform: scale(1.05);
}

.room-status-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.room-status-badge.available {
  background: rgba(16, 185, 129, 0.9);
  color: white;
}

.room-status-badge.unavailable {
  background: rgba(239, 68, 68, 0.9);
  color: white;
}

.room-price-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
}

.room-details {
  padding: 1.5rem;
}

.room-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.room-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1f2937;
}

.room-rating {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: #f59e0b;
  font-size: 0.9rem;
  font-weight: 600;
}

.room-type {
  color: #6b7280;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.room-features {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.feature {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: #6b7280;
  font-size: 0.8rem;
}

.feature i {
  color: #d4af37;
}

.vr-link {
  color: #d4af37;
  text-decoration: none;
  font-weight: 500;
}

.vr-link:hover {
  text-decoration: underline;
}

.room-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.room-category {
  background: rgba(212, 175, 55, 0.1);
  color: #d4af37;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.75rem;
  font-weight: 600;
}

.book-btn {
  padding: 0.75rem 1.5rem;
  background: #d4af37;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.book-btn:hover:not(.disabled) {
  background: #b8941f;
  transform: translateY(-2px);
}

.book-btn.disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .left-panel {
    order: 2;
  }

  .right-panel {
    order: 1;
  }

  .rooms-grid.grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }

  .ai-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .ai-controls {
    justify-content: center;
  }

  .quick-questions {
    flex-direction: column;
  }

  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .room-filters {
    width: 100%;
    justify-content: space-between;
  }

  .rooms-grid.grid {
    grid-template-columns: 1fr;
  }
}
</style>
