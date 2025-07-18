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
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop',
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
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&h=300&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=300&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1597318181409-cf64e4940c4b?w=400&h=300&fit=crop'
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
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
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

// 订单数据（用户相关）
export const generateMockOrders = (userId) => [
  {
    id: 1,
    userId: userId,
    roomId: 2,
    roomName: '普洱茶香木屋',
    checkInDate: '2024-01-15',
    checkOutDate: '2024-01-17',
    nights: 2,
    totalPrice: 576,
    status: '已完成',
    orderDate: '2024-01-10',
    guestCount: 2,
    specialRequests: '希望提供茶艺体验服务'
  },
  {
    id: 2,
    userId: userId,
    roomId: 5,
    roomName: '山景别墅',
    checkInDate: '2024-02-20',
    checkOutDate: '2024-02-23',
    nights: 3,
    totalPrice: 2664,
    status: '已确认',
    orderDate: '2024-02-15',
    guestCount: 4,
    specialRequests: '需要婴儿床和儿童餐具'
  },
  {
    id: 3,
    userId: userId,
    roomId: 1,
    roomName: '蘑菇森林小屋',
    checkInDate: '2024-03-10',
    checkOutDate: '2024-03-12',
    nights: 2,
    totalPrice: 776,
    status: '预订',
    orderDate: '2024-03-05',
    guestCount: 2,
    specialRequests: '希望参加蘑菇采摘活动'
  }
]

// 用户评价数据
export const reviewsData = [
  {
    id: 1,
    userId: 1,
    userName: '张小明',
    roomId: 1,
    roomName: '蘑菇森林小屋',
    rating: 5,
    comment: '环境非常棒！蘑菇森林真的很有特色，房间干净舒适，服务也很贴心。蘑菇采摘体验特别有趣，孩子们玩得很开心。',
    date: '2024-01-20',
    images: ['review1.jpg', 'review2.jpg'],
    helpful: 15
  },
  {
    id: 2,
    userId: 2,
    userName: '李美丽',
    roomId: 2,
    roomName: '普洱茶香木屋',
    rating: 4,
    comment: '茶香木屋真的很香！房间里的茶具很精美，茶艺体验很专业。就是房间稍微小了一点，但整体体验很好。',
    date: '2024-01-18',
    images: ['review3.jpg'],
    helpful: 12
  },
  {
    id: 3,
    userId: 3,
    userName: '王大伟',
    roomId: 5,
    roomName: '山景别墅',
    rating: 5,
    comment: '山景别墅太棒了！视野开阔，设施齐全，特别适合家庭度假。孩子们在花园里玩得很开心，大人可以在露台上品茶赏景。',
    date: '2024-01-15',
    images: ['review4.jpg', 'review5.jpg', 'review6.jpg'],
    helpful: 20
  },
  {
    id: 4,
    userId: 4,
    userName: '陈小雨',
    roomId: 12,
    roomName: '星空帐篷屋',
    rating: 5,
    comment: '星空帐篷屋太浪漫了！晚上躺在床上就能看到满天繁星，简直是情侣度假的完美选择。工作人员还提供了天文望远镜，可以观察星座。',
    date: '2024-01-12',
    images: ['review7.jpg'],
    helpful: 18
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
  },
  {
    id: 3,
    name: '观星台',
    category: '天文观测',
    description: '远离光污染的观星平台，配备专业天文望远镜，是观星爱好者的天堂。',
    openTime: '19:00-24:00',
    capacity: 20,
    features: ['专业望远镜', '星图指导', '天文讲解', '观星毯'],
    image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=300&fit=crop'
  },
  {
    id: 4,
    name: '生态餐厅',
    category: '餐饮服务',
    description: '提供云南特色美食，食材均来自庄园自产或当地采购，绿色健康。',
    openTime: '07:00-22:00',
    capacity: 80,
    features: ['云南特色菜', '有机食材', '景观用餐', '私人定制'],
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'
  },
  {
    id: 5,
    name: '温泉SPA',
    category: '休闲养生',
    description: '天然温泉水疗中心，提供各种SPA服务，是放松身心的理想场所。',
    openTime: '10:00-23:00',
    capacity: 15,
    features: ['天然温泉', '专业按摩', '芳香疗法', '私密空间'],
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
  }
]

// 交通信息数据
export const transportData = {
  // 机场交通
  airport: {
    name: '普洱思茅机场',
    distance: '35公里',
    driveTime: '45分钟',
    transportOptions: [
      {
        type: '庄园接送',
        price: 150,
        duration: '45分钟',
        description: '豪华商务车接送，提前预约'
      },
      {
        type: '出租车',
        price: 120,
        duration: '45分钟',
        description: '机场出租车，按表计费'
      },
      {
        type: '机场大巴',
        price: 25,
        duration: '1小时',
        description: '机场大巴到市区，再转乘公交'
      }
    ]
  },

  // 火车站交通
  railway: {
    name: '普洱站',
    distance: '12公里',
    driveTime: '20分钟',
    transportOptions: [
      {
        type: '庄园接送',
        price: 80,
        duration: '20分钟',
        description: '商务车接送，提前预约'
      },
      {
        type: '出租车',
        price: 60,
        duration: '20分钟',
        description: '火车站出租车'
      },
      {
        type: '公交车',
        price: 5,
        duration: '35分钟',
        description: '公交转乘，经济实惠'
      }
    ]
  },

  // 自驾路线
  driving: {
    fromKunming: {
      distance: '380公里',
      driveTime: '4.5小时',
      route: '昆明 → 昆磨高速 → 思小高速 → 普洱 → 庄园',
      tolls: 180,
      fuelCost: 240
    },
    fromDali: {
      distance: '320公里',
      driveTime: '4小时',
      route: '大理 → 大保高速 → 保泸高速 → 普洱 → 庄园',
      tolls: 150,
      fuelCost: 200
    }
  }
}

// 季节活动数据
export const seasonalActivities = {
  spring: {
    season: '春季 (3-5月)',
    weather: '温暖湿润，平均气温18-25℃',
    highlights: ['茶叶采摘', '春花观赏', '踏青徒步'],
    activities: [
      {
        name: '春茶采摘节',
        date: '3月中旬',
        description: '参与春茶采摘，体验茶农生活'
      },
      {
        name: '樱花观赏',
        date: '3月下旬',
        description: '庄园樱花盛开，拍照赏花'
      },
      {
        name: '生态徒步',
        date: '4-5月',
        description: '春季徒步，观察动植物复苏'
      }
    ]
  },
  summer: {
    season: '夏季 (6-8月)',
    weather: '温热多雨，平均气温22-28℃',
    highlights: ['避暑度假', '雨林探险', '夜观星空'],
    activities: [
      {
        name: '雨林探险',
        date: '6-8月',
        description: '雨季雨林最美，探索生态奥秘'
      },
      {
        name: '夜观萤火虫',
        date: '7-8月',
        description: '夏夜萤火虫飞舞，浪漫体验'
      },
      {
        name: '避暑养生',
        date: '6-8月',
        description: '山区凉爽，温泉SPA放松'
      }
    ]
  },
  autumn: {
    season: '秋季 (9-11月)',
    weather: '凉爽干燥，平均气温16-24℃',
    highlights: ['秋茶品鉴', '丰收体验', '红叶观赏'],
    activities: [
      {
        name: '秋茶品鉴会',
        date: '9月中旬',
        description: '品尝秋茶，学习茶文化'
      },
      {
        name: '蘑菇丰收节',
        date: '10月',
        description: '野生菌丰收季，采摘体验'
      },
      {
        name: '红叶摄影',
        date: '11月',
        description: '秋叶正红，摄影创作'
      }
    ]
  },
  winter: {
    season: '冬季 (12-2月)',
    weather: '温和干燥，平均气温10-20℃',
    highlights: ['温泉养生', '民族节庆', '观鸟活动'],
    activities: [
      {
        name: '温泉养生',
        date: '12-2月',
        description: '冬季温泉，养生保健'
      },
      {
        name: '傣族新年',
        date: '1月',
        description: '体验傣族传统新年庆典'
      },
      {
        name: '候鸟观赏',
        date: '12-1月',
        description: '候鸟迁徙季，观鸟摄影'
      }
    ]
  }
}
