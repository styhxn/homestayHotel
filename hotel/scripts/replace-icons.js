#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 图标映射表
const iconMappings = [
  // 基础图标
  { from: '<i class="fas fa-eye"></i>', to: '<SvgIcon name="eye" :size="16" />' },
  { from: '<i class="fas fa-star"></i>', to: '<SvgIcon name="star" :size="16" />' },
  { from: '<i class="fas fa-shopping-cart"></i>', to: '<SvgIcon name="shopping-cart" :size="16" />' },
  { from: '<i class="fas fa-heart"></i>', to: '<SvgIcon name="heart" :size="16" />' },
  { from: '<i class="fas fa-spinner"></i>', to: '<SvgIcon name="spinner" :size="16" />' },
  { from: '<i class="fas fa-times"></i>', to: '<SvgIcon name="times" :size="20" />' },
  { from: '<i class="fas fa-chevron-up"></i>', to: '<SvgIcon name="chevron-up" :size="20" />' },
  { from: '<i class="fas fa-chevron-down"></i>', to: '<SvgIcon name="chevron-down" :size="20" />' },
  { from: '<i class="fas fa-chevron-left"></i>', to: '<SvgIcon name="chevron-left" :size="20" />' },
  { from: '<i class="fas fa-chevron-right"></i>', to: '<SvgIcon name="chevron-right" :size="20" />' },
  { from: '<i class="fas fa-arrow-right"></i>', to: '<SvgIcon name="arrow-right" :size="16" />' },
  
  // 社交图标
  { from: '<i class="fab fa-facebook-f"></i>', to: '<SvgIcon name="facebook-f" :size="20" />' },
  { from: '<i class="fab fa-weibo"></i>', to: '<SvgIcon name="weibo" :size="20" />' },
  { from: '<i class="fab fa-wechat"></i>', to: '<SvgIcon name="wechat" :size="20" />' },
  
  // 联系信息图标
  { from: '<i class="fas fa-map-marker-alt"></i>', to: '<SvgIcon name="map-marker-alt" :size="16" />' },
  { from: '<i class="fas fa-phone"></i>', to: '<SvgIcon name="phone" :size="16" />' },
  { from: '<i class="fas fa-envelope"></i>', to: '<SvgIcon name="envelope" :size="16" />' },
  
  // 活动相关图标
  { from: '<i class="fas fa-calendar-plus"></i>', to: '<SvgIcon name="calendar-plus" :size="16" />' },
  { from: '<i class="fas fa-users"></i>', to: '<SvgIcon name="users" :size="14" />' },
  { from: '<i class="fas fa-clock"></i>', to: '<SvgIcon name="clock" :size="14" />' },
  
  // 设施图标
  { from: '<i class="fas fa-coffee"></i>', to: '<SvgIcon name="coffee" :size="20" />' },
  { from: '<i class="fas fa-spa"></i>', to: '<SvgIcon name="spa" :size="24" />' },
  { from: '<i class="fas fa-university"></i>', to: '<SvgIcon name="university" :size="24" />' },
  { from: '<i class="fas fa-utensils"></i>', to: '<SvgIcon name="utensils" :size="24" />' },
  { from: '<i class="fas fa-hiking"></i>', to: '<SvgIcon name="hiking" :size="24" />' },
  { from: '<i class="fas fa-history"></i>', to: '<SvgIcon name="history" :size="14" />' },
  { from: '<i class="fas fa-quote-left"></i>', to: '<SvgIcon name="quote-left" :size="32" />' },
  
  // 带动画的图标
  { from: '<i class="fas fa-spinner fa-spin"></i>', to: '<SvgIcon name="spinner" :size="16" class="loading-spinner" />' },
  
  // 带条件类的图标
  { from: '<i class="fas fa-heart" :class="{ active: activity.isFavorite }"></i>', to: '<SvgIcon name="heart" :size="18" :class="{ active: activity.isFavorite }" />' },
];

// 需要处理的文件列表
const filesToProcess = [
  'src/views/HomestayActivitiesView.vue',
  'src/views/TeaCultureView.vue',
  'src/views/AboutView.vue',
  'src/components/AppNavbar.vue',
  'src/views/admin/AdminDashboard.vue',
  'src/views/admin/AdminDashboardView.vue',
  'src/views/user/BookingView.vue',
  'src/views/user/OrdersView.vue',
  'src/views/user/ProductsView.vue',
];

function replaceIconsInFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`文件不存在: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;

  // 检查是否已经导入了SvgIcon
  if (!content.includes("import SvgIcon from")) {
    // 查找其他import语句，在最后一个import后添加SvgIcon导入
    const importRegex = /import .+ from .+['"];?\s*$/gm;
    const imports = content.match(importRegex);
    if (imports && imports.length > 0) {
      const lastImport = imports[imports.length - 1];
      const lastImportIndex = content.lastIndexOf(lastImport);
      const insertIndex = lastImportIndex + lastImport.length;
      
      // 确定正确的导入路径
      let importPath = '../components/SvgIcon.vue';
      if (filePath.includes('admin/')) {
        importPath = '../../components/SvgIcon.vue';
      } else if (filePath.includes('user/')) {
        importPath = '../../components/SvgIcon.vue';
      }
      
      content = content.slice(0, insertIndex) + 
                `\nimport SvgIcon from '${importPath}'` + 
                content.slice(insertIndex);
      hasChanges = true;
    }
  }

  // 应用图标替换
  iconMappings.forEach(mapping => {
    if (content.includes(mapping.from)) {
      content = content.replaceAll(mapping.from, mapping.to);
      hasChanges = true;
    }
  });

  // 处理星星评分的特殊情况
  const starPatterns = [
    {
      from: /<i v-for="n in 5" :key="n" class="fas fa-star" :class="{ active: n <= \([^}]+\) }"><\/i>/g,
      to: '<SvgIcon v-for="n in 5" :key="n" name="star" :size="14" :class="{ active: n <= $1 }" />'
    },
    {
      from: /<i v-for="n in 5" :key="n" class="fas fa-star" :class="{ active: n <= activity\.rating }"><\/i>/g,
      to: '<SvgIcon v-for="n in 5" :key="n" name="star" :size="14" :class="{ active: n <= activity.rating }" />'
    }
  ];

  starPatterns.forEach(pattern => {
    if (pattern.from.test(content)) {
      content = content.replace(pattern.from, pattern.to);
      hasChanges = true;
    }
  });

  if (hasChanges) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`已更新: ${filePath}`);
  } else {
    console.log(`无需更新: ${filePath}`);
  }
}

// 处理所有文件
console.log('开始批量替换Font Awesome图标...');
filesToProcess.forEach(replaceIconsInFile);
console.log('批量替换完成！');
