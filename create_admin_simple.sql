-- 简单的管理员账号创建脚本
-- 确保字段名完全匹配SysUser实体类

-- 首先删除可能存在的root用户
DELETE FROM sys_user WHERE username = 'root';

-- 创建管理员账号，只设置必要字段
INSERT INTO sys_user (
    username,
    password,
    real_name,
    role,
    status,
    gender,
    email,
    phonenumber,
    create_time,
    login_date,
    remark
) VALUES (
    'root',                     -- username
    'root123',                  -- password (明文)
    '系统管理员',                -- real_name
    1,                          -- role (1=管理员)
    0,                          -- status (0=正常)
    '男',                       -- gender
    'admin@mushroom.com',       -- email
    '13800000000',              -- phonenumber
    NOW(),                      -- create_time
    NOW(),                      -- login_date
    '默认管理员'                 -- remark
);

-- 验证创建结果
SELECT 
    id,
    username,
    password,
    real_name,
    role,
    status,
    email,
    create_time
FROM sys_user 
WHERE username = 'root';

-- 显示所有管理员账号
SELECT 
    id,
    username,
    real_name,
    role,
    status
FROM sys_user 
WHERE role = 1;
