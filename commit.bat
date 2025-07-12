@echo off
chcp 65001 >nul
echo ========================================
echo Git 代码提交脚本
echo ========================================
echo.

set GIT_PATH="C:\Program Files\Git\bin\git.exe"

echo [步骤1] 检查Git状态...
%GIT_PATH% status
echo.

echo [步骤2] 添加所有更改...
%GIT_PATH% add .
echo.

echo [步骤3] 提交更改...
%GIT_PATH% commit -m "feat: AI选房页面重构完成 - 实现左右分栏布局，集成AI对话和订单管理功能"
echo.

echo [步骤4] 显示提交历史...
%GIT_PATH% log --oneline -3
echo.

echo ========================================
echo 提交完成！
echo ========================================
pause
