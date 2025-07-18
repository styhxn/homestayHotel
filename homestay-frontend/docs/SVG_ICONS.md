# SVG图标使用说明

## 概述

为了解决Font Awesome图标渲染问题，我们创建了一个自定义的SVG图标组件 `SvgIcon.vue`，包含了所有需要的图标的手动绘制版本。

## 可用图标

以下是所有可用的图标及其用途：

| 图标名称 | 用途 | 原Font Awesome类名 |
|---------|------|-------------------|
| `eye` | 快速查看按钮 | `fas fa-eye` |
| `star` | 评分星星 | `fas fa-star` |
| `shopping-cart` | 购物车按钮 | `fas fa-shopping-cart` |
| `heart` | 收藏按钮 | `fas fa-heart` |
| `spinner` | 加载动画 | `fas fa-spinner` |
| `times` | 关闭按钮 | `fas fa-times` |
| `chevron-up` | 返回顶部 | `fas fa-chevron-up` |
| `th-large` | 网格视图 | `fas fa-th-large` |
| `leaf` | 茶叶产品 | `fas fa-leaf` |
| `gift` | 礼品/纪念品 | `fas fa-gift` |
| `palette` | 手工艺品 | `fas fa-palette` |
| `coffee` | 咖啡/茶文化 | `fas fa-coffee` |
| `spa` | SPA/养生 | `fas fa-spa` |
| `history` | 历史/传承 | `fas fa-history` |
| `users` | 用户组/团队 | `fas fa-users` |
| `arrow-right` | 右箭头 | `fas fa-arrow-right` |
| `chevron-down` | 下箭头 | `fas fa-chevron-down` |
| `chevron-left` | 左箭头 | `fas fa-chevron-left` |
| `chevron-right` | 右箭头 | `fas fa-chevron-right` |
| `university` | 大学/教育 | `fas fa-university` |
| `utensils` | 餐具/用餐 | `fas fa-utensils` |
| `hiking` | 徒步/户外 | `fas fa-hiking` |
| `quote-left` | 引用 | `fas fa-quote-left` |
| `map-marker-alt` | 地图标记 | `fas fa-map-marker-alt` |
| `phone` | 电话 | `fas fa-phone` |
| `envelope` | 邮件 | `fas fa-envelope` |
| `clock` | 时钟 | `fas fa-clock` |
| `calendar-plus` | 日历加号 | `fas fa-calendar-plus` |
| `seedling` | 种子/植物 | `fas fa-seedling` |
| `mountain` | 山/户外 | `fas fa-mountain` |
| `facebook-f` | Facebook | `fab fa-facebook-f` |
| `weibo` | 微博 | `fab fa-weibo` |
| `wechat` | 微信 | `fab fa-wechat` |
| `home` | 首页/家 | `fas fa-home` |

## 使用方法

### 基本用法

```vue
<template>
  <!-- 基本图标 -->
  <SvgIcon name="eye" :size="24" />
  
  <!-- 带颜色的图标 -->
  <SvgIcon name="heart" :size="20" color="#ef4444" />
  
  <!-- 带CSS类的图标 -->
  <SvgIcon name="spinner" :size="16" class="loading-spinner" />
</template>

<script setup>
import SvgIcon from '@/components/SvgIcon.vue'
</script>
```

### 星星评分

```vue
<template>
  <div class="stars">
    <SvgIcon
      v-for="n in 5"
      :key="n"
      name="star"
      :size="16"
      :class="{ active: n <= rating }"
    />
  </div>
</template>

<style scoped>
.stars .svg-icon {
  color: #d1d5db;
  transition: all 0.3s ease;
  filter: grayscale(100%);
}

.stars .svg-icon.active {
  color: #FFD700;
  filter: grayscale(0%);
}
</style>
```

### 加载动画

```vue
<template>
  <SvgIcon name="spinner" :size="20" class="loading-spinner" />
</template>

<style scoped>
@keyframes loading {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-spinner {
  animation: loading 1s linear infinite;
}
</style>
```

## 组件属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `name` | `string` | - | 图标名称（必需） |
| `size` | `string \| number` | `24` | 图标大小 |
| `color` | `string` | `'currentColor'` | 图标颜色 |
| `className` | `string` | `''` | 额外的CSS类名 |

## 已替换的位置

### `SurroundingProductsView.vue`
1. 快速查看按钮 (`fas fa-eye` → `SvgIcon name="eye"`)
2. 产品评分星星 (`fas fa-star` → `SvgIcon name="star"`)
3. 购物车按钮 (`fas fa-shopping-cart` → `SvgIcon name="shopping-cart"`)
4. 收藏按钮 (`fas fa-heart` → `SvgIcon name="heart"`)
5. 加载动画 (`fas fa-spinner` → `SvgIcon name="spinner"`)
6. 关闭按钮 (`fas fa-times` → `SvgIcon name="times"`)
7. 返回顶部按钮 (`fas fa-chevron-up` → `SvgIcon name="chevron-up"`)
8. 分类图标 (各种 `fas fa-*` → 对应的SVG图标)

### `HomeView.vue`
1. 设施图标 (`fas fa-coffee`, `fas fa-spa`, `fas fa-university`, `fas fa-utensils`, `fas fa-hiking`)
2. 评分星星 (`fas fa-star` → `SvgIcon name="star"`)
3. 历史图标 (`fas fa-history` → `SvgIcon name="history"`)
4. 用户组图标 (`fas fa-users` → `SvgIcon name="users"`)
5. 箭头图标 (`fas fa-arrow-right` → `SvgIcon name="arrow-right"`)
6. 引用图标 (`fas fa-quote-left` → `SvgIcon name="quote-left"`)
7. 社交媒体图标 (`fab fa-facebook-f`, `fab fa-weibo`, `fab fa-wechat`)
8. 联系信息图标 (`fas fa-map-marker-alt`, `fas fa-phone`, `fas fa-envelope`)

### `HomestayActivitiesView.vue`
1. 滚动指示器 (`fas fa-chevron-down` → `SvgIcon name="chevron-down"`)
2. 分类图标和箭头 (`fas fa-*` → 对应的SVG图标)
3. 活动相关图标 (`fas fa-calendar-plus`, `fas fa-eye`, `fas fa-heart`)
4. 评分星星 (`fas fa-star` → `SvgIcon name="star"`)
5. 活动信息图标 (`fas fa-users`, `fas fa-clock`, `fas fa-map-marker-alt`)
6. 加载动画 (`fas fa-spinner` → `SvgIcon name="spinner"`)
7. 日历导航 (`fas fa-chevron-left`, `fas fa-chevron-right`)
8. 页脚社交媒体和联系信息图标
9. 返回顶部按钮 (`fas fa-chevron-up` → `SvgIcon name="chevron-up"`)

## 优势

1. **无依赖**: 不需要加载Font Awesome字体文件
2. **可定制**: 可以轻松修改图标的颜色、大小等属性
3. **性能**: SVG图标渲染性能更好
4. **兼容性**: 在所有现代浏览器中都能正常显示
5. **可扩展**: 可以轻松添加新的图标

## 测试

可以使用 `IconTest.vue` 组件来测试所有图标是否正常显示：

```vue
<template>
  <IconTest />
</template>

<script setup>
import IconTest from '@/components/IconTest.vue'
</script>
```

## 注意事项

1. 确保在使用SvgIcon组件的地方正确导入
2. 星星评分需要配合CSS样式使用
3. 加载动画需要配合CSS动画使用
4. 图标颜色默认继承父元素的文字颜色
