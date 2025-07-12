package com.homestay.homestay.config;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.homestay.homestay.entity.SysUser;
import com.homestay.homestay.entity.SysRole;
import com.homestay.homestay.service.SysUserService;
import com.homestay.homestay.service.SysRoleService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.Date;

/**
 * 管理员账号初始化器
 * 系统启动时自动创建默认管理员账号
 */
@Slf4j
@Component
public class AdminInitializer implements CommandLineRunner {

    @Resource
    private SysUserService sysUserService;

    @Resource
    private SysRoleService sysRoleService;

    @Override
    public void run(String... args) throws Exception {
        initializeAdminRole();
        initializeAdminAccount();
    }

    /**
     * 初始化管理员角色
     */
    private void initializeAdminRole() {
        try {
            log.info("🎭 开始初始化管理员角色...");

            // 检查SysRoleService是否正确注入
            if (sysRoleService == null) {
                log.error("❌ SysRoleService未正确注入！");
                return;
            }

            // 检查是否已存在管理员角色
            LambdaQueryWrapper<SysRole> queryWrapper = new LambdaQueryWrapper<>();
            queryWrapper.eq(SysRole::getId, 1);
            SysRole existingRole = sysRoleService.getOne(queryWrapper);

            if (existingRole != null) {
                log.info("✅ 管理员角色已存在，跳过初始化");
                log.info("📋 现有角色信息：");
                log.info("   ID: {}", existingRole.getId());
                log.info("   名称: {}", existingRole.getName());
                log.info("   代码: {}", existingRole.getCode());
                log.info("   状态: {}", existingRole.getStatus());
                return;
            }

            log.info("📝 未找到管理员角色，开始创建...");

            // 创建管理员角色
            SysRole adminRole = new SysRole();
            adminRole.setId(1L);
            adminRole.setName("超级管理员");
            adminRole.setCode("admin");
            adminRole.setStatus(0L); // 0表示正常状态
            adminRole.setCreateTime(new Date());
            adminRole.setUpdateTime(new Date());
            adminRole.setRemark("系统默认管理员角色");

            log.info("💾 准备保存管理员角色到数据库...");

            // 保存到数据库
            boolean saved = sysRoleService.save(adminRole);

            if (saved) {
                log.info("✅ 默认管理员角色创建成功！");
                log.info("📋 管理员角色信息：");
                log.info("   ID: 1");
                log.info("   名称: 超级管理员");
                log.info("   代码: admin");
                log.info("   状态: 正常");

                // 验证创建结果
                SysRole createdRole = sysRoleService.getOne(queryWrapper);
                if (createdRole != null) {
                    log.info("✅ 验证成功，管理员角色已存在于数据库中");
                    log.info("   数据库ID: {}", createdRole.getId());
                } else {
                    log.error("❌ 验证失败，数据库中未找到刚创建的管理员角色");
                }
            } else {
                log.error("❌ 默认管理员角色创建失败！");
                log.error("   可能原因：数据库连接问题、表结构问题或权限问题");
            }

        } catch (Exception e) {
            log.error("❌ 初始化管理员角色时发生错误: {}", e.getMessage(), e);
            log.error("💡 建议手动执行SQL脚本创建管理员角色：");
            log.error("   INSERT INTO sys_role (id, name, code, status, create_time, update_time, remark)");
            log.error("   VALUES (1, '超级管理员', 'admin', 0, NOW(), NOW(), '系统默认管理员角色');");
        }
    }

    /**
     * 初始化管理员账号
     */
    private void initializeAdminAccount() {
        try {
            log.info("🚀 开始初始化管理员账号...");

            // 检查SysUserService是否正确注入
            if (sysUserService == null) {
                log.error("❌ SysUserService未正确注入！");
                return;
            }

            // 检查是否已存在root管理员账号
            LambdaQueryWrapper<SysUser> queryWrapper = new LambdaQueryWrapper<>();
            queryWrapper.eq(SysUser::getUsername, "root");
            SysUser existingAdmin = sysUserService.getOne(queryWrapper);

            if (existingAdmin != null) {
                log.info("✅ 管理员账号已存在，跳过初始化");
                log.info("📋 现有管理员信息：");
                log.info("   ID: {}", existingAdmin.getId());
                log.info("   用户名: {}", existingAdmin.getUsername());
                log.info("   角色: {}", existingAdmin.getRole());
                log.info("   状态: {}", existingAdmin.getStatus());
                return;
            }

            log.info("📝 未找到管理员账号，开始创建...");

            // 创建默认管理员账号
            SysUser adminUser = new SysUser();
            adminUser.setUsername("root");
            adminUser.setPassword("root123");
            adminUser.setRealName("系统管理员");
            adminUser.setRole(1); // 1表示管理员角色
            adminUser.setStatus(0); // 0表示正常状态
            adminUser.setGender("男");
            adminUser.setEmail("admin@mushroom-garden.com");
            adminUser.setPhonenumber("13800000000");
            adminUser.setCreateTime(new Date());
            adminUser.setLoginDate(new Date());
            adminUser.setRemark("系统默认管理员账号");

            log.info("💾 准备保存管理员账号到数据库...");

            // 保存到数据库
            boolean saved = sysUserService.save(adminUser);

            if (saved) {
                log.info("✅ 默认管理员账号创建成功！");
                log.info("📋 管理员登录信息：");
                log.info("   用户名: root");
                log.info("   密码: root123");
                log.info("   访问地址: /admin/login");
                log.info("🔒 请及时修改默认密码以确保安全！");

                // 验证创建结果
                SysUser createdAdmin = sysUserService.getOne(queryWrapper);
                if (createdAdmin != null) {
                    log.info("✅ 验证成功，管理员账号已存在于数据库中");
                    log.info("   数据库ID: {}", createdAdmin.getId());
                } else {
                    log.error("❌ 验证失败，数据库中未找到刚创建的管理员账号");
                }
            } else {
                log.error("❌ 默认管理员账号创建失败！");
                log.error("   可能原因：数据库连接问题、表结构问题或权限问题");
            }

        } catch (Exception e) {
            log.error("❌ 初始化管理员账号时发生错误: {}", e.getMessage(), e);
            log.error("💡 建议手动执行SQL脚本创建管理员账号：");
            log.error("   INSERT INTO sys_user (username, password, real_name, role, status, gender, email, phonenumber, create_time, login_date, remark)");
            log.error("   VALUES ('root', 'root123', '系统管理员', 1, 0, '男', 'admin@mushroom-garden.com', '13800000000', NOW(), NOW(), '系统默认管理员账号');");
        }
    }
}
