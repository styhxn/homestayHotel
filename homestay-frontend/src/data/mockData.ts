// 普洱蘑菇庄园民宿 - 模拟数据

// 茶文化相关数据
export const teaCultureData = {
  // 茶叶品种
  teaVarieties: [
    {
      id: 1,
      name: '古树普洱茶',
      type: '生茶',
      origin: '勐海古茶山',
      age: '300年古树',
      price: 680,
      description: '来自300年古茶树的珍贵茶叶，口感醇厚，回甘悠长，具有独特的山野气韵。',
      image: '/src/assets/images/实地调研/茶叶产品调研/茶叶产品调研15.jpg',
      features: ['古树茶', '山野气韵', '回甘持久', '收藏价值高']
    },
    {
      id: 2,
      name: '宫廷普洱熟茶',
      type: '熟茶',
      origin: '普洱茶厂',
      age: '10年陈化',
      price: 380,
      description: '经过10年自然陈化的宫廷级熟茶，汤色红浓，口感顺滑，具有独特的陈香。',
      image: '/src/assets/images/实地调研/茶叶产品调研/茶叶产品调研8.jpg',
      features: ['宫廷级', '陈香浓郁', '汤色红浓', '口感顺滑']
    },
    {
      id: 3,
      name: '野生白茶',
      type: '白茶',
      origin: '景迈山',
      age: '当年新茶',
      price: 280,
      description: '景迈山野生白茶，清香淡雅，具有天然的花香和果香，是养生的佳品。',
      image: 'https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?w=400&h=300&fit=crop',
      features: ['野生茶', '清香淡雅', '花果香', '养生佳品']
    },
    {
      id: 4,
      name: '金芽滇红',
      type: '红茶',
      origin: '凤庆县',
      age: '当年春茶',
      price: 180,
      description: '云南凤庆金芽滇红，茶芽金黄，汤色红艳，口感甜润，是红茶中的精品。',
      image: 'https://images.unsplash.com/photo-1597318181409-cf64e4940c4b?w=400&h=300&fit=crop',
      features: ['金芽茶', '汤色红艳', '口感甜润', '红茶精品']
    }
  ],

  // 茶艺体验活动
  teaExperiences: [
    {
      id: 1,
      name: '古法制茶体验',
      duration: '3小时',
      price: 180,
      maxParticipants: 8,
      description: '亲手体验传统普洱茶制作工艺，从采摘到杀青、揉捻、晒干的完整过程。',
      includes: ['茶叶采摘', '杀青体验', '手工揉捻', '晒茶过程', '品茶环节'],
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      name: '茶艺表演与学习',
      duration: '2小时',
      price: 120,
      maxParticipants: 12,
      description: '专业茶艺师现场表演传统茶艺，教授基本的泡茶技巧和茶文化知识。',
      includes: ['茶艺表演', '泡茶技巧', '茶具介绍', '茶文化讲解', '互动体验'],
      image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      name: '茶园漫步品茗',
      duration: '1.5小时',
      price: 80,
      maxParticipants: 15,
      description: '漫步在美丽的茶园中，了解茶树生长环境，在茶园中品尝新鲜茶叶。',
      includes: ['茶园导览', '茶树介绍', '现场品茶', '摄影指导', '茶叶知识'],
      image: 'https://images.unsplash.com/photo-1597318181409-cf64e4940c4b?w=400&h=300&fit=crop'
    }
  ],

  // 茶文化知识
  teaKnowledge: [
    {
      id: 1,
      title: '普洱茶的历史渊源',
      category: '历史文化',
      content: '普洱茶历史悠久，可追溯到东汉时期。明清时期，普洱茶成为贡茶，享誉海内外。普洱茶以其独特的后发酵工艺和越陈越香的特点，被誉为"可以喝的古董"。',
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      title: '茶马古道的传奇',
      category: '历史文化',
      content: '茶马古道是古代连接云南与西藏、四川等地的重要商贸通道。马帮驮着普洱茶，翻山越岭，将茶叶运往各地，形成了独特的茶马文化。',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      title: '普洱茶的冲泡技巧',
      category: '茶艺技巧',
      content: '冲泡普洱茶需要掌握水温、投茶量、冲泡时间等要素。生茶适宜95-100℃水温，熟茶可用100℃沸水。第一泡为洗茶，从第二泡开始品饮。',
      image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=300&fit=crop'
    }
  ]
}

// 特色活动数据
export const activitiesData = [
  {
    id: 1,
    name: '蘑菇采摘体验',
    category: '生态体验',
    duration: '2小时',
    price: 88,
    difficulty: '简单',
    maxParticipants: 10,
    description: '在专业向导带领下，深入蘑菇森林，学习识别各种食用菌，体验采摘乐趣。',
    highlights: ['专业向导', '安全采摘', '菌类知识', '新鲜体验'],
    includes: ['采摘工具', '安全指导', '菌类识别', '采摘成果'],
    image: '/src/assets/images/实地调研/室外调研/室外5.jpg',
    schedule: [
      { time: '09:00', activity: '集合出发，安全讲解' },
      { time: '09:30', activity: '进入蘑菇森林，学习识别' },
      { time: '10:30', activity: '自由采摘体验' },
      { time: '11:00', activity: '返回整理，分享收获' }
    ]
  },
  {
    id: 2,
    name: '夜观星空',
    category: '天文观测',
    duration: '3小时',
    price: 128,
    difficulty: '简单',
    maxParticipants: 15,
    description: '远离城市光污染，在庄园的观星台上观赏璀璨星空，学习天文知识。',
    highlights: ['专业望远镜', '天文讲解', '星座识别', '浪漫体验'],
    includes: ['天文望远镜', '星图指导', '热饮提供', '观星毯'],
    image: '/src/assets/images/环境展示/酒店门口3（夜视）.jpg',
    schedule: [
      { time: '19:30', activity: '观星台集合，设备介绍' },
      { time: '20:00', activity: '天文知识讲解' },
      { time: '20:30', activity: '望远镜观测体验' },
      { time: '22:00', activity: '自由观星，分享感受' }
    ]
  },
  {
    id: 3,
    name: '傣族文化体验',
    category: '民族文化',
    duration: '4小时',
    price: 168,
    difficulty: '简单',
    maxParticipants: 12,
    description: '体验傣族传统文化，学习傣族舞蹈，品尝傣味美食，感受云南民族风情。',
    highlights: ['民族服饰', '传统舞蹈', '傣味美食', '文化交流'],
    includes: ['服饰租借', '舞蹈教学', '美食制作', '文化讲解'],
    image: '/src/assets/images/实地调研/茶叶产品调研/茶叶产品调研3.jpg',
    schedule: [
      { time: '14:00', activity: '换装体验，文化介绍' },
      { time: '14:30', activity: '傣族舞蹈学习' },
      { time: '15:30', activity: '傣味美食制作' },
      { time: '17:00', activity: '品尝美食，文化交流' }
    ]
  },
  {
    id: 4,
    name: '生态徒步探险',
    category: '户外运动',
    duration: '5小时',
    price: 198,
    difficulty: '中等',
    maxParticipants: 8,
    description: '穿越原始森林，探索生态奥秘，观察野生动植物，享受大自然的馈赠。',
    highlights: ['原始森林', '野生动物', '生态讲解', '摄影指导'],
    includes: ['专业向导', '安全装备', '能量补给', '摄影服务'],
    image: '/src/assets/images/实地调研/室外调研/室外7.jpg',
    schedule: [
      { time: '08:00', activity: '装备检查，安全讲解' },
      { time: '08:30', activity: '进入森林，生态观察' },
      { time: '10:30', activity: '中途休息，能量补给' },
      { time: '11:00', activity: '继续探索，摄影创作' },
      { time: '12:30', activity: '返回庄园，分享体验' }
    ]
  },
  {
    id: 5,
    name: '云南美食烹饪',
    category: '美食体验',
    duration: '3小时',
    price: 158,
    difficulty: '简单',
    maxParticipants: 10,
    description: '学习制作地道云南菜，包括过桥米线、汽锅鸡等特色美食。',
    highlights: ['地道云南菜', '专业指导', '食材新鲜', '美食品尝'],
    includes: ['食材提供', '厨具使用', '烹饪指导', '成品品尝'],
    image: '/src/assets/images/产品/普洱茶/普洱茶摆放环境展示.jpg',
    schedule: [
      { time: '15:00', activity: '食材介绍，烹饪准备' },
      { time: '15:30', activity: '学习制作过桥米线' },
      { time: '16:30', activity: '学习制作汽锅鸡' },
      { time: '17:30', activity: '品尝美食，交流心得' }
    ]
  }
]

// 周边景点数据
export const attractionsData = [
  {
    id: 1,
    name: '景迈山古茶园',
    distance: '15公里',
    driveTime: '25分钟',
    category: '自然景观',
    rating: 4.8,
    description: '世界文化遗产，拥有千年古茶树群落，是普洱茶的重要产地。',
    highlights: ['世界遗产', '千年古茶树', '茶文化', '生态景观'],
    ticketPrice: 60,
    openTime: '08:00-18:00',
    image: '/src/assets/images/实地调研/茶叶产品调研/茶叶产品调研15.jpg'
  },
  {
    id: 2,
    name: '澜沧江风光',
    distance: '8公里',
    driveTime: '15分钟',
    category: '自然景观',
    rating: 4.6,
    description: '澜沧江畔风光秀丽，可乘船游览，欣赏两岸热带雨林风光。',
    highlights: ['江景风光', '游船体验', '热带雨林', '摄影胜地'],
    ticketPrice: 80,
    openTime: '09:00-17:00',
    image: '/src/assets/images/环境展示/庄园内部1.jpg'
  },
  {
    id: 3,
    name: '勐海茶厂',
    distance: '20公里',
    driveTime: '35分钟',
    category: '文化体验',
    rating: 4.5,
    description: '著名的普洱茶生产基地，可参观茶叶制作工艺，品尝正宗普洱茶。',
    highlights: ['茶厂参观', '制作工艺', '茶叶品尝', '文化学习'],
    ticketPrice: 40,
    openTime: '09:00-16:30',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop'
  },
  {
    id: 4,
    name: '野象谷',
    distance: '45公里',
    driveTime: '1小时',
    category: '野生动物',
    rating: 4.7,
    description: '中国唯一可以观赏到野生亚洲象的地方，生态环境优美。',
    highlights: ['野生大象', '生态保护', '空中走廊', '科普教育'],
    ticketPrice: 120,
    openTime: '08:00-17:30',
    image: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=400&h=300&fit=crop'
  }
]

// 美食数据
export const foodData = [
  {
    id: 1,
    name: '野生菌火锅',
    category: '特色菜品',
    price: 188,
    description: '精选云南野生菌类，包括松茸、牛肝菌、鸡枞菌等，营养丰富，味道鲜美。',
    ingredients: ['松茸', '牛肝菌', '鸡枞菌', '竹荪', '土鸡汤'],
    image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&h=300&fit=crop',
    spicyLevel: 1,
    cookingTime: '30分钟',
    serves: '2-3人'
  },
  {
    id: 2,
    name: '普洱茶香鸡',
    category: '特色菜品',
    price: 128,
    description: '选用当地土鸡，配以普洱茶叶烹制，肉质鲜嫩，茶香浓郁。',
    ingredients: ['土鸡', '普洱茶叶', '云南小米辣', '香菜', '特制调料'],
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    spicyLevel: 2,
    cookingTime: '45分钟',
    serves: '3-4人'
  },
  {
    id: 3,
    name: '傣味包烧鱼',
    category: '民族特色',
    price: 98,
    description: '傣族传统烹饪方法，用香茅草包裹鲜鱼烧制，香味独特。',
    ingredients: ['鲜鱼', '香茅草', '傣族香料', '柠檬叶', '小米辣'],
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    spicyLevel: 3,
    cookingTime: '25分钟',
    serves: '2人'
  },
  {
    id: 4,
    name: '过桥米线',
    category: '传统小吃',
    price: 38,
    description: '云南著名小吃，汤汁鲜美，配菜丰富，营养均衡。',
    ingredients: ['米线', '鸡汤', '火腿片', '鹌鹑蛋', '豆腐皮', '韭菜'],
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop',
    spicyLevel: 1,
    cookingTime: '15分钟',
    serves: '1人'
  }
]

// 庄园设施数据
export const facilitiesData = [
  {
    id: 1,
    name: '茶艺体验馆',
    category: '文化体验',
    description: '专业的茶艺体验空间，提供茶艺表演、茶叶品鉴、制茶体验等服务。',
    openTime: '09:00-21:00',
    capacity: 30,
    features: ['专业茶艺师', '多种茶具', '茶叶展示', '互动体验'],
    image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=300&fit=crop'
  },
  {
    id: 2,
    name: '蘑菇博物馆',
    category: '科普教育',
    description: '展示云南各种野生菌类标本，介绍菌类知识和生态价值。',
    openTime: '08:30-17:30',
    capacity: 50,
    features: ['菌类标本', '科普展示', '互动游戏', '专业讲解'],
    image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&h=300&fit=crop'
  }
]
