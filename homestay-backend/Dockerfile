# 多阶段构建：构建阶段
FROM maven:3.8.4-openjdk-17-slim AS builder

# 设置工作目录
WORKDIR /app

# 复制pom.xml文件
COPY pom.xml .

# 下载依赖（利用Docker缓存层）
RUN mvn dependency:go-offline -B

# 复制源代码
COPY src src

# 构建应用
RUN mvn clean package -DskipTests

# 运行阶段：使用更小的镜像
FROM openjdk:17-jre-slim

# 安装必要的工具
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# 创建应用用户
RUN groupadd -r appuser && useradd -r -g appuser appuser

# 设置工作目录
WORKDIR /app

# 从构建阶段复制jar文件
COPY --from=builder /app/target/homestay-0.0.1-SNAPSHOT.jar app.jar

# 更改文件所有者
RUN chown -R appuser:appuser /app

# 切换到应用用户
USER appuser

# 设置JVM参数
ENV JAVA_OPTS="-Xms512m -Xmx1024m -Dspring.profiles.active=prod"

# 暴露端口
EXPOSE 8091

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8091/actuator/health || exit 1

# 运行应用
CMD ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
