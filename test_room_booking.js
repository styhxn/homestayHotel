// 测试房间预订功能的脚本
// 验证房间名称是否正确传递到订单中

const API_BASE = 'http://localhost:8091';

// 测试用户登录
async function login() {
    const response = await fetch(`${API_BASE}/h/user/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: '2759749679@qq.com',
            password: 'lhw200541'
        })
    });
    
    const result = await response.json();
    console.log('登录结果:', result);
    return result;
}

// 获取房间详情
async function getRoomDetail(roomId) {
    const response = await fetch(`${API_BASE}/h/room/detail?id=${roomId}`);
    const result = await response.json();
    console.log(`房间${roomId}详情:`, result);
    return result;
}

// 创建订单
async function createOrder(orderData) {
    const response = await fetch(`${API_BASE}/h/order/addOne`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
    });
    
    const result = await response.json();
    console.log('订单创建结果:', result);
    return result;
}

// 主测试函数
async function testRoomBooking() {
    try {
        console.log('🧪 开始测试房间预订功能...\n');
        
        // 1. 登录
        console.log('1. 用户登录...');
        const loginResult = await login();
        if (loginResult.code !== 200 && loginResult.code !== '200') {
            throw new Error('登录失败');
        }
        console.log('✅ 登录成功\n');
        
        // 2. 获取房间1详情
        console.log('2. 获取房间1详情...');
        const room1Detail = await getRoomDetail(1);
        if (room1Detail.code !== 200 && room1Detail.code !== '200') {
            throw new Error('获取房间详情失败');
        }
        
        const room1 = room1Detail.data.room;
        console.log('✅ 房间1信息:');
        console.log(`   - ID: ${room1.id}`);
        console.log(`   - 名称: ${room1.name}`);
        console.log(`   - 编码: ${room1.code}`);
        console.log(`   - 价格: ${room1.price}`);
        console.log('');
        
        // 3. 创建测试订单
        console.log('3. 创建测试订单...');
        const orderData = {
            username: '2759749679@qq.com',
            phone: '15262541251',
            startDate: '2025-07-15',
            endDate: '2025-07-17',
            amount: 2,
            roomId: room1.id,
            roomCode: room1.name, // 使用房间名称作为roomCode
            userRemark: '测试订单 - 验证房间名称',
            state: '预订',
            total: (room1.price * 2).toString(),
            payState: 0,
            status: 0,
            days: 2
        };
        
        console.log('📝 订单数据:');
        console.log(`   - 房间ID: ${orderData.roomId}`);
        console.log(`   - 房间名称: ${orderData.roomCode}`);
        console.log(`   - 入住日期: ${orderData.startDate}`);
        console.log(`   - 退房日期: ${orderData.endDate}`);
        console.log(`   - 总价: ${orderData.total}`);
        console.log('');
        
        const orderResult = await createOrder(orderData);
        if (orderResult.code === 200 || orderResult.code === '200') {
            console.log('✅ 订单创建成功!');
            console.log(`   - 订单ID: ${orderResult.data}`);
            console.log(`   - 房间名称应该是: ${room1.name}`);
        } else {
            console.log('❌ 订单创建失败:', orderResult.msg);
        }
        
        console.log('\n🎉 测试完成!');
        
    } catch (error) {
        console.error('❌ 测试失败:', error.message);
    }
}

// 运行测试
testRoomBooking();
