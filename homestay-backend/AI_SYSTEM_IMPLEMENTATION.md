# AI决策支持系统技术实现文档

## 一、数字人"普普"交互系统实现

### 1.1 前端交互组件

```typescript
// 普普AI助手组件 - ChatAssistant.vue
<template>
  <div class="chat-assistant-container">
    <!-- 悬浮按钮 -->
    <div class="floating-button" @click="toggleChat" v-show="!showChat">
      <img src="/src/assets/images/IP形象/普普正面.png" alt="普普助手" />
      <div class="pulse-ring"></div>
    </div>
    
    <!-- 对话界面 -->
    <div class="chat-panel" v-show="showChat">
      <div class="chat-header">
        <img src="/src/assets/images/IP形象/普普正面.png" alt="普普" />
        <span>普普小助手</span>
        <button @click="toggleChat" class="close-btn">×</button>
      </div>
      
      <div class="chat-messages" ref="messagesContainer">
        <div v-for="message in messages" :key="message.id" 
             :class="['message', message.type]">
          <div class="message-content">{{ message.content }}</div>
          <!-- 房间推荐卡片 -->
          <div v-if="message.roomData" class="room-card">
            <img :src="message.roomData.image" alt="房间图片" />
            <div class="room-info">
              <h4>{{ message.roomData.name }}</h4>
              <p>¥{{ message.roomData.price }}/晚</p>
              <button @click="viewRoom(message.roomData.id)">查看详情</button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="chat-input">
        <input v-model="inputMessage" @keyup.enter="sendMessage" 
               placeholder="请输入您的需求..." />
        <button @click="sendMessage">发送</button>
        <button @click="startVoiceInput" class="voice-btn">🎤</button>
      </div>
    </div>
  </div>
</template>
```

### 1.2 AI对话处理逻辑

```typescript
// AI服务类 - aiService.ts
export class AIService {
  private difyConfig = {
    apiKey: 'app-oaUwvb7k2zbC8Bi03EO977nN',
    baseUrl: 'http://4295a4ce.r28.cpolar.top/v1'
  }

  async sendMessage(message: string, context?: any): Promise<AIResponse> {
    const requestData = {
      inputs: {
        room_info: this.getRoomInfo(),
        user_context: context || {},
        current_time: new Date().toISOString()
      },
      query: message,
      response_mode: 'blocking',
      user: 'homestay-user'
    }

    const response = await fetch(`${this.difyConfig.baseUrl}/chat-messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.difyConfig.apiKey}`
      },
      body: JSON.stringify(requestData)
    })

    return await response.json()
  }

  private getRoomInfo(): string {
    return `普洱蘑菇庄园民宿房间信息：
    - 201号蘑菇森林小屋：大床房，¥350/晚，含早餐，茶园景观
    - 202号云雾山景房：大床房，¥380/晚，含早餐，山景阳台  
    - 203号普洱茶香阁：标准间，¥280/晚，不含早，茶具套装
    - 204号单人间带窗：单人房，¥999/晚，景观优美
    - 205号单人间无窗：单人房，¥256/晚，经济实惠
    - 206号湖畔小筑：豪华间，¥428/晚，湖景阳台，垂钓设备`
  }
}
```

## 二、实时数据匹配系统

### 2.1 后端房态管理API

```java
// 房间状态实时查询控制器
@RestController
@RequestMapping("/api/room-status")
public class RoomStatusController {
    
    @Autowired
    private HRoomService roomService;
    
    @GetMapping("/available")
    public Res<List<RoomAvailability>> getAvailableRooms(
            @RequestParam String startDate,
            @RequestParam String endDate,
            @RequestParam(defaultValue = "2") Integer guests) {
        
        List<RoomAvailability> availableRooms = roomService.getAvailableRooms(
            LocalDate.parse(startDate),
            LocalDate.parse(endDate),
            guests
        );
        
        return Res.success(availableRooms);
    }
    
    @GetMapping("/real-time-price")
    public Res<RoomPricing> getRealTimePrice(@RequestParam Long roomId) {
        RoomPricing pricing = roomService.calculateRealTimePrice(roomId);
        return Res.success(pricing);
    }
}
```

### 2.2 智能推荐算法

```java
// 智能推荐服务
@Service
public class RecommendationService {
    
    public List<RecommendationResult> generateRecommendations(
            UserProfile userProfile, 
            String userMessage) {
        
        List<RecommendationResult> recommendations = new ArrayList<>();
        
        // 分析用户画像
        UserType userType = analyzeUserType(userProfile, userMessage);
        
        switch (userType) {
            case FAMILY_WITH_CHILDREN:
                recommendations.add(createFamilyPackage());
                break;
            case CULTURE_ENTHUSIAST:
                recommendations.add(createCulturePackage());
                break;
            case LEISURE_TRAVELER:
                recommendations.add(createLeisurePackage());
                break;
        }
        
        return recommendations;
    }
    
    private RecommendationResult createFamilyPackage() {
        return RecommendationResult.builder()
            .packageName("亲子茶文化体验套餐")
            .rooms(Arrays.asList("201号蘑菇森林小屋"))
            .activities(Arrays.asList("儿童茶艺启蒙课", "蘑菇森林探索"))
            .totalPrice(new BigDecimal("580"))
            .discount(new BigDecimal("0.15"))
            .description("适合家庭出游，孩子可以在安全的环境中体验茶文化")
            .build();
    }
}
```

## 三、预订流程闭环实现

### 3.1 智能表单填充

```typescript
// 智能预订表单组件
export class SmartBookingForm {
  extractBookingInfo(chatHistory: ChatMessage[]): BookingInfo {
    const bookingInfo: BookingInfo = {}
    
    // 从对话历史中提取关键信息
    chatHistory.forEach(message => {
      if (message.type === 'user') {
        // 提取日期信息
        const dateMatch = message.content.match(/(\d{1,2}月\d{1,2}日|\d{4}-\d{2}-\d{2})/g)
        if (dateMatch) {
          bookingInfo.checkInDate = this.parseDate(dateMatch[0])
        }
        
        // 提取人数信息
        const guestMatch = message.content.match(/(\d+)人/)
        if (guestMatch) {
          bookingInfo.guestCount = parseInt(guestMatch[1])
        }
        
        // 提取房型偏好
        if (message.content.includes('阳台')) {
          bookingInfo.preferences.push('阳台')
        }
        if (message.content.includes('景观')) {
          bookingInfo.preferences.push('景观')
        }
      }
    })
    
    return bookingInfo
  }
}
```

### 3.2 订单确认与反馈

```java
// 订单处理服务
@Service
public class OrderProcessingService {
    
    @Transactional
    public OrderResult processAIBooking(AIBookingRequest request) {
        // 1. 创建订单
        HOrder order = new HOrder();
        order.setUserId(request.getUserId());
        order.setRoomId(request.getRoomId());
        order.setStartDate(request.getCheckInDate());
        order.setEndDate(request.getCheckOutDate());
        order.setTotal(request.getTotalAmount());
        order.setState("预订");
        
        orderService.save(order);
        
        // 2. 生成优惠码
        String discountCode = generateDiscountCode(request.getRoomId());
        
        // 3. 发送确认消息给AI
        String confirmationMessage = String.format(
            "已为您预留%s，订单号：%s。这是为您生成的茶艺体验优惠码→%s，可享受8折优惠！",
            request.getRoomName(),
            order.getId(),
            discountCode
        );
        
        return OrderResult.builder()
            .orderId(order.getId())
            .confirmationMessage(confirmationMessage)
            .discountCode(discountCode)
            .build();
    }
}
```

## 四、数字孪生场景集成

### 4.1 3D场景与AI交互联动

```typescript
// 3D场景控制器
export class DigitalTwinController {
  private scene: THREE.Scene
  private camera: THREE.Camera
  private renderer: THREE.WebGLRenderer
  
  highlightArea(areaType: string) {
    switch (areaType) {
      case 'tea_garden':
        this.highlightTeaGarden()
        break
      case 'lake_area':
        this.highlightLakeArea()
        break
      case 'mushroom_forest':
        this.highlightMushroomForest()
        break
    }
  }
  
  private highlightTeaGarden() {
    const teaGardenMesh = this.scene.getObjectByName('TeaGarden')
    if (teaGardenMesh) {
      // 添加发光效果
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x90EE90,
        transparent: true,
        opacity: 0.3
      })
      
      const glowMesh = teaGardenMesh.clone()
      glowMesh.material = glowMaterial
      glowMesh.scale.multiplyScalar(1.05)
      
      this.scene.add(glowMesh)
      
      // 3秒后移除高亮
      setTimeout(() => {
        this.scene.remove(glowMesh)
      }, 3000)
    }
  }
}
```

## 五、系统配置与部署

### 5.1 环境配置

```yaml
# application.yml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/homestay
    username: root
    password: root
  
ai:
  dify:
    api-key: app-oaUwvb7k2zbC8Bi03EO977nN
    base-url: http://4295a4ce.r28.cpolar.top/v1
    timeout: 30000
  
digital-twin:
  scene-path: /assets/3d-models/
  texture-quality: high
  
recommendation:
  algorithm: collaborative-filtering
  update-interval: 300000 # 5分钟更新一次
```

### 5.2 性能优化配置

```typescript
// 性能优化配置
export const performanceConfig = {
  // 3D场景优化
  scene: {
    maxPolygons: 100000,
    textureSize: 1024,
    shadowQuality: 'medium'
  },
  
  // AI响应优化
  ai: {
    responseTimeout: 10000,
    maxRetries: 3,
    cacheEnabled: true,
    cacheDuration: 300000 // 5分钟缓存
  },
  
  // 实时数据更新
  realtime: {
    updateInterval: 30000, // 30秒更新一次房态
    batchSize: 50,
    compressionEnabled: true
  }
}
```

这个技术实现文档展示了AI决策支持系统的核心代码结构和关键功能实现，与您的项目需求完全匹配。
