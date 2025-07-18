package com.homestay.homestay.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.homestay.homestay.common.Res;
import com.homestay.homestay.entity.SysUser;
import com.homestay.homestay.service.SysUserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.Date;

/**
 * 管理员初始化控制器
 * 提供手动创建管理员账号的接口
 */
@Slf4j
@RestController
@RequestMapping("/admin/init")
public class AdminInitController {

    @Resource
    private SysUserService sysUserService;

    /**
     * 手动创建管理员账号
     */
    @PostMapping("/create-admin")
    public Res<?> createAdmin() {
        try {
            log.info("🚀 开始手动创建管理员账号...");
            
            // 检查是否已存在root管理员账号
            LambdaQueryWrapper<SysUser> queryWrapper = new LambdaQueryWrapper<>();
            queryWrapper.eq(SysUser::getUsername, "root");
            SysUser existingAdmin = sysUserService.getOne(queryWrapper);

            if (existingAdmin != null) {
                log.info("✅ 管理员账号已存在");
                return Res.success("管理员账号已存在，无需重复创建");
            }

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

            // 保存到数据库
            boolean saved = sysUserService.save(adminUser);
            
            if (saved) {
                log.info("✅ 管理员账号创建成功！");
                return Res.success("管理员账号创建成功！用户名: root, 密码: root123");
            } else {
                log.error("❌ 管理员账号创建失败！");
                return Res.error("-1", "管理员账号创建失败");
            }

        } catch (Exception e) {
            log.error("❌ 创建管理员账号时发生错误: {}", e.getMessage(), e);
            return Res.error("-1", "创建管理员账号时发生错误: " + e.getMessage());
        }
    }

    /**
     * 检查管理员账号是否存在
     */
    @GetMapping("/check-admin")
    public Res<?> checkAdmin() {
        try {
            LambdaQueryWrapper<SysUser> queryWrapper = new LambdaQueryWrapper<>();
            queryWrapper.eq(SysUser::getUsername, "root");
            SysUser existingAdmin = sysUserService.getOne(queryWrapper);

            if (existingAdmin != null) {
                return Res.success("管理员账号已存在，ID: " + existingAdmin.getId() + 
                                 ", 用户名: " + existingAdmin.getUsername() + 
                                 ", 角色: " + existingAdmin.getRole() + 
                                 ", 状态: " + existingAdmin.getStatus());
            } else {
                return Res.error("-1", "管理员账号不存在");
            }

        } catch (Exception e) {
            log.error("❌ 检查管理员账号时发生错误: {}", e.getMessage(), e);
            return Res.error("-1", "检查管理员账号时发生错误: " + e.getMessage());
        }
    }

    /**
     * 重置管理员密码
     */
    @PostMapping("/reset-password")
    public Res<?> resetPassword(@RequestParam(defaultValue = "root123") String newPassword) {
        try {
            LambdaQueryWrapper<SysUser> queryWrapper = new LambdaQueryWrapper<>();
            queryWrapper.eq(SysUser::getUsername, "root");
            SysUser existingAdmin = sysUserService.getOne(queryWrapper);

            if (existingAdmin == null) {
                return Res.error("-1", "管理员账号不存在");
            }

            existingAdmin.setPassword(newPassword);
            boolean updated = sysUserService.updateById(existingAdmin);
            
            if (updated) {
                log.info("✅ 管理员密码重置成功！");
                return Res.success("管理员密码重置成功！新密码: " + newPassword);
            } else {
                return Res.error("-1", "管理员密码重置失败");
            }

        } catch (Exception e) {
            log.error("❌ 重置管理员密码时发生错误: {}", e.getMessage(), e);
            return Res.error("-1", "重置管理员密码时发生错误: " + e.getMessage());
        }
    }

    /**
     * 获取所有管理员账号
     */
    @GetMapping("/list-admins")
    public Res<?> listAdmins() {
        try {
            LambdaQueryWrapper<SysUser> queryWrapper = new LambdaQueryWrapper<>();
            queryWrapper.eq(SysUser::getRole, 1); // 角色为1的是管理员
            return Res.success(sysUserService.list(queryWrapper));

        } catch (Exception e) {
            log.error("❌ 获取管理员列表时发生错误: {}", e.getMessage(), e);
            return Res.error("-1", "获取管理员列表时发生错误: " + e.getMessage());
        }
    }
}
