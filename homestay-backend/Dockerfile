# 使用官方的OpenJDK 17镜像作为基础镜像
FROM openjdk:17-jdk-slim

# 设置工作目录
WORKDIR /app

# 复制Maven包装器文件
COPY mvnw .
COPY .mvn .mvn

# 复制pom.xml文件
COPY pom.xml .

# 下载依赖（利用Docker缓存层）
RUN ./mvnw dependency:go-offline -B

# 复制源代码
COPY src src

# 构建应用
RUN ./mvnw clean package -DskipTests

# 暴露端口
EXPOSE 8091

# 运行应用
CMD ["java", "-jar", "target/homestay-0.0.1-SNAPSHOT.jar"]
