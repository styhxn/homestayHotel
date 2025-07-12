-- 创建管理员账号SQL脚本
-- 普洱蘑菇庄园民宿管理系统

-- 删除已存在的root管理员（如果有的话）
DELETE FROM sys_user WHERE username = 'root';

-- 插入新的管理员账号
INSERT INTO sys_user (
    role,
    status,
    username,
    password,
    real_name,
    gender,
    email,
    phonenumber,
    create_time,
    login_date,
    remark
) VALUES (
    1,                          -- role: 1表示管理员角色
    0,                          -- status: 0表示正常状态
    'root',                     -- username: 管理员用户名
    'root123',                  -- password: 管理员密码（明文）
    '系统管理员',                -- real_name: 真实姓名
    '男',                       -- gender: 性别
    'admin@mushroom-garden.com', -- email: 管理员邮箱
    '13800000000',              -- phonenumber: 管理员手机号
    NOW(),                      -- create_time: 创建时间
    NOW(),                      -- login_date: 最后登录时间
    '系统默认管理员账号'          -- remark: 备注
);

-- 验证插入结果
SELECT 
    id,
    username,
    password,
    real_name,
    role,
    status,
    email,
    phonenumber,
    create_time
FROM sys_user 
WHERE username = 'root';

-- 管理员登录信息
-- 用户名: root
-- 密码: root123
-- 角色: 管理员(role=1)
-- 状态: 正常(status=0)

-- 如果需要修改密码，可以执行：
-- UPDATE sys_user SET password = '新密码' WHERE username = 'root';
