package com.homestay.homestay.service.impl;

import cn.dev33.satoken.stp.StpUtil;
import cn.hutool.core.convert.Convert;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.homestay.homestay.config.DifyConfig;
import com.homestay.homestay.dto.ChatMessageDto;
import com.homestay.homestay.entity.HOrder;
import com.homestay.homestay.entity.HRoom;
import com.homestay.homestay.entity.HUser;
import com.homestay.homestay.service.ChatAssistService;
import com.homestay.homestay.service.HOrderService;
import com.homestay.homestay.service.HRoomService;
import com.homestay.homestay.service.HUserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import javax.annotation.Resource;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 聊天助手服务实现类
 */
@Service
@Slf4j
public class ChatAssistServiceImpl implements ChatAssistService {

    @Autowired
    private DifyConfig difyConfig;

    @Resource
    private HRoomService hRoomService;

    @Resource
    private HOrderService hOrderService;

    @Resource
    private HUserService hUserService;

    @Autowired
    private RestTemplate restTemplate;

    /**
     * 聊天对话
     *
     * @param chatMessageDto 聊天消息
     * @return SSE流式响应
     */
    @Override
    public SseEmitter sendChatMessage(ChatMessageDto chatMessageDto) {
        // 创建 SSE Emitter，设置超时时间（例如 5 分钟）
        SseEmitter emitter = new SseEmitter(300_000L);

        // 使用线程池处理异步任务
        ExecutorService executor = Executors.newSingleThreadExecutor();
        executor.execute(() -> {
            try {
                // 首先尝试调用Dify服务
                try {
                    // 使用最新的Dify API URL
                    String messageUrl = "http://4295a4ce.r28.cpolar.top/v1/chat-messages";

                    // 创建请求头
                    HttpHeaders headers = new HttpHeaders();
                    headers.set("Authorization", "Bearer app-oaUwvb7k2zbC8Bi03EO977nN");
                    headers.setContentType(MediaType.APPLICATION_JSON);

                    // 设置response_mode为streaming
                    if (chatMessageDto.getResponseMode() == null) {
                        chatMessageDto.setResponseMode("streaming");
                    }

                    // 创建请求实体
                    HttpEntity<ChatMessageDto> requestEntity = new HttpEntity<>(chatMessageDto, headers);

                    // 发送请求并处理流式响应
                    restTemplate.execute(
                            messageUrl,
                            HttpMethod.POST,
                            request -> {
                                // 设置请求头和请求体
                                request.getHeaders().setContentType(MediaType.APPLICATION_JSON);
                                request.getHeaders().addAll(requestEntity.getHeaders());

                                // 写入请求体
                                if (requestEntity.getBody() != null) {
                                    new ObjectMapper().writeValue(request.getBody(), requestEntity.getBody());
                                }
                            },
                            response -> {
                                try (BufferedReader reader = new BufferedReader(new InputStreamReader(response.getBody()))) {
                                    String line;
                                    while ((line = reader.readLine()) != null) {
                                        log.info("line: {}", line);
                                        // 将每一行数据推送到前端
                                        emitter.send(SseEmitter.event().data(line));
                                    }
                                    // 完成推送
                                    emitter.complete();
                                }
                                return null;
                            }
                    );
                } catch (Exception difyException) {
                    log.warn("Dify服务不可用，使用本地模拟响应: {}", difyException.getMessage());

                    // 降级到本地模拟响应
                    String mockResponse = generateMockResponse(chatMessageDto.getQuery());

                    // 发送完整的本地响应（避免分割导致的混乱）
                    emitter.send(SseEmitter.event().data(mockResponse));
                    emitter.complete();
                }
            } catch (Exception e) {
                log.error("聊天对话异常", e);
                // 发生错误时推送错误信息
                emitter.completeWithError(e);
            } finally {
                executor.shutdown();
                log.info("对话结束...");
            }
        });
        
        log.info("对话开始...");
        return emitter;
    }

    /**
     * 生成模拟响应（当Dify服务不可用时使用）
     */
    private String generateMockResponse(String query) {
        String lowerQuery = query.toLowerCase();

        // 检查是否是预订请求
        if (isBookingRequest(query)) {
            return processBookingRequest(query);
        }

        // 检查是否是推荐房间请求
        if (lowerQuery.contains("推荐") || lowerQuery.contains("房间") || lowerQuery.contains("住宿")) {
            return recommendRooms(query);
        } else if (lowerQuery.contains("价格") || lowerQuery.contains("费用") || lowerQuery.contains("多少钱")) {
            return "🍄 我们的房间价格根据房型和季节有所不同：" +
                   "\n• 普洱茶香阁(203)：280元/晚" +
                   "\n• 竹林静舍(204)：320元/晚" +
                   "\n• 蘑菇森林小屋(201)：350元/晚" +
                   "\n• 云雾山景房(202)：380元/晚" +
                   "\n• 湖畔小筑(206)：428元/晚" +
                   "\n• 山景别墅(205)：888元/晚" +
                   "\n\n所有房间都包含免费早餐和茶艺体验。如需预订请说'我要预订201'等。";
        } else if (lowerQuery.contains("茶") || lowerQuery.contains("普洱")) {
            return "🍄 普洱蘑菇庄园民宿以茶文化为特色！" +
                   "我们提供正宗的普洱茶品鉴体验，包括古树茶、熟茶、生茶等多个品种。" +
                   "庄园内还有茶艺师现场表演，您可以学习传统的普洱茶冲泡技艺。" +
                   "每位客人都可以免费参加我们的茶文化体验活动！";
        } else if (lowerQuery.contains("位置") || lowerQuery.contains("地址") || lowerQuery.contains("交通")) {
            return "🍄 普洱蘑菇庄园位于风景秀丽的普洱茶山脚下，" +
                   "距离市中心约30分钟车程，环境清幽，空气清新。" +
                   "我们提供免费接送服务，也可以自驾前往，庄园内有充足的停车位。" +
                   "具体地址和路线信息我可以为您详细介绍！";
        } else {
            return "🍄 您好！我是普洱蘑菇庄园的AI助手普普1.0。" +
                   "我可以为您推荐房间、处理预订、介绍茶文化体验等。" +
                   "请告诉我您想了解什么，我会竭诚为您服务！" +
                   "您也可以说'推荐房间'或'我要预订201'等指令。";
        }
    }

    /**
     * 检查是否是预订请求
     */
    private boolean isBookingRequest(String query) {
        String lowerQuery = query.toLowerCase();
        // 匹配预订模式：我要预订201、预订201房间、订201等
        Pattern bookingPattern = Pattern.compile("(我要|想要|要|预订|订|预定|定).*?(\\d{3})");
        return bookingPattern.matcher(lowerQuery).find() ||
               lowerQuery.contains("预订") || lowerQuery.contains("预定");
    }

    /**
     * 处理预订请求
     */
    private String processBookingRequest(String query) {
        try {
            // 提取房间号
            String roomCode = extractRoomCode(query);
            if (roomCode == null) {
                return "🍄 请告诉我您要预订哪个房间号，比如：'我要预订201'";
            }

            // 查找房间
            LambdaQueryWrapper<HRoom> roomWrapper = Wrappers.<HRoom>lambdaQuery();
            roomWrapper.eq(HRoom::getCode, roomCode);
            roomWrapper.eq(HRoom::getStatus, 0); // 上架状态
            HRoom room = hRoomService.getOne(roomWrapper);

            if (room == null) {
                return "🍄 抱歉，房间号" + roomCode + "不存在或已下架。请检查房间号是否正确。";
            }

            // 检查房间是否可预订
            if (!"空闲".equals(room.getState())) {
                return "🍄 抱歉，房间" + roomCode + "(" + room.getName() + ")目前不可预订，状态为：" + room.getState() +
                       "。请选择其他房间或稍后再试。";
            }

            // 创建订单
            String orderResult = createOrder(room);
            return orderResult;

        } catch (Exception e) {
            log.error("处理预订请求异常", e);
            return "🍄 预订处理过程中出现异常，请稍后重试或联系客服。";
        }
    }

    /**
     * 提取房间号
     */
    private String extractRoomCode(String query) {
        Pattern pattern = Pattern.compile("(\\d{3})");
        Matcher matcher = pattern.matcher(query);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return null;
    }

    /**
     * 创建订单
     */
    private String createOrder(HRoom room) {
        try {
            // 检查用户是否登录
            if (!StpUtil.isLogin()) {
                return "🍄 请先登录后再进行预订。您可以点击页面右上角的登录按钮。";
            }

            // 获取当前用户
            Long userId = Long.valueOf(StpUtil.getLoginIdAsString());
            HUser user = hUserService.getById(userId);
            if (user == null) {
                return "🍄 用户信息异常，请重新登录后再试。";
            }

            // 创建订单
            HOrder order = new HOrder();
            order.setUserId(userId);
            order.setRoomId(room.getId());
            order.setPhone(user.getPhone());
            order.setUsername(user.getRealName() != null ? user.getRealName() : user.getUsername());
            order.setRoomCode(room.getCode());

            // 设置默认入住时间（明天）和退房时间（后天）
            Calendar calendar = Calendar.getInstance();
            calendar.add(Calendar.DAY_OF_MONTH, 1);
            Date startDate = calendar.getTime();
            calendar.add(Calendar.DAY_OF_MONTH, 1);
            Date endDate = calendar.getTime();

            order.setStartDate(startDate);
            order.setEndDate(endDate);
            order.setDays(1);
            order.setTotal(room.getPrice());
            order.setState("预订");
            order.setStatus(0);
            order.setPayState(0);
            order.setCreateTime(new Date());

            // 保存订单
            boolean saveResult = hOrderService.save(order);
            if (saveResult) {
                // 更新房间状态
                room.setState("预订");
                room.setEndTime(endDate);
                hRoomService.updateById(room);

                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                return "🎉 预订成功！" +
                       "\n📋 订单信息：" +
                       "\n🏠 房间：" + room.getName() + "(" + room.getCode() + ")" +
                       "\n📅 入住日期：" + sdf.format(startDate) +
                       "\n📅 退房日期：" + sdf.format(endDate) +
                       "\n💰 总价：¥" + room.getPrice() +
                       "\n📞 联系电话：" + user.getPhone() +
                       "\n\n✅ 订单已生成，请及时支付。您可以在'我的订单'中查看详情。";
            } else {
                return "🍄 订单创建失败，请稍后重试。";
            }

        } catch (Exception e) {
            log.error("创建订单异常", e);
            return "🍄 订单创建过程中出现异常：" + e.getMessage();
        }
    }

    /**
     * 推荐房间
     */
    private String recommendRooms(String query) {
        try {
            // 获取可用房间
            LambdaQueryWrapper<HRoom> wrapper = Wrappers.<HRoom>lambdaQuery();
            wrapper.eq(HRoom::getStatus, 0); // 上架状态
            wrapper.eq(HRoom::getState, "空闲"); // 空闲状态
            wrapper.orderByAsc(HRoom::getPrice); // 按价格排序
            wrapper.last("LIMIT 3"); // 限制3个

            List<HRoom> availableRooms = hRoomService.list(wrapper);

            if (availableRooms.isEmpty()) {
                return "🍄 抱歉，目前没有可用房间。请稍后再试或联系客服。";
            }

            StringBuilder response = new StringBuilder("🍄 为您推荐以下可预订房间：\n\n");
            for (int i = 0; i < availableRooms.size(); i++) {
                HRoom room = availableRooms.get(i);
                response.append(String.format("%d. %s (%s)\n", i + 1, room.getName(), room.getCode()));
                response.append(String.format("   💰 价格：¥%s/晚\n", room.getPrice()));
                response.append(String.format("   🏷️ 类型：%s\n", room.getCategory()));
                response.append(String.format("   ⭐ 评分：4.%d\n", (int)(Math.random() * 3) + 5));
                if (i < availableRooms.size() - 1) {
                    response.append("\n");
                }
            }

            response.append("\n\n💡 您可以说'我要预订201'来预订指定房间。");
            return response.toString();

        } catch (Exception e) {
            log.error("推荐房间异常", e);
            return "🍄 获取房间信息时出现异常，请稍后重试。";
        }
    }
}
