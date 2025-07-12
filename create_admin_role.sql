-- 创建管理员角色SQL脚本
-- 普洱蘑菇庄园民宿管理系统

-- 删除可能存在的管理员角色
DELETE FROM sys_role WHERE id = 1;

-- 创建管理员角色
INSERT INTO sys_role (
    id,
    status,
    name,
    code,
    create_time,
    update_time,
    remark
) VALUES (
    1,                          -- id: 角色ID
    0,                          -- status: 0表示正常状态
    '超级管理员',                -- name: 角色名称
    'admin',                    -- code: 角色代码
    NOW(),                      -- create_time: 创建时间
    NOW(),                      -- update_time: 更新时间
    '系统超级管理员角色'          -- remark: 备注
);

-- 验证角色创建结果
SELECT 
    id,
    name,
    code,
    status,
    create_time,
    remark
FROM sys_role 
WHERE id = 1;

-- 验证管理员账号
SELECT 
    id,
    username,
    real_name,
    role,
    status,
    create_time
FROM sys_user 
WHERE username = 'root';

-- 角色信息
-- ID: 1
-- 名称: 超级管理员
-- 代码: admin
-- 状态: 正常(status=0)
