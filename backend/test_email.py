#!/usr/bin/env python3
"""
邮件提醒功能测试脚本
"""

import sys
import os

# 添加当前目录到路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from email_sender import send_reminder_email

def test_email():
    """测试邮件发送功能"""
    print("=" * 50)
    print("邮件提醒功能测试")
    print("=" * 50)
    
    # 请替换为你的测试邮箱
    test_email = input("请输入测试邮箱地址（QQ邮箱）: ").strip()
    test_username = input("请输入用户名: ").strip()
    test_title = input("请输入胶囊标题: ").strip()
    test_date = input("请输入开启日期（YYYY-MM-DD）: ").strip()
    
    if not test_email or not test_username or not test_title or not test_date:
        print("错误：所有字段都必须填写")
        return False
    
    print(f"\n正在发送测试邮件到: {test_email}")
    print(f"用户: {test_username}")
    print(f"胶囊标题: {test_title}")
    print(f"开启日期: {test_date}")
    
    success, error = send_reminder_email(test_email, test_username, test_title, test_date)
    
    if success:
        print("\n✓ 邮件发送成功！")
        print("请检查您的邮箱（包括垃圾邮件文件夹）")
        return True
    else:
        print(f"\n✗ 邮件发送失败: {error}")
        print("\n请检查：")
        print("1. email_config.py 中的配置是否正确")
        print("2. 授权码是否正确")
        print("3. 网络连接是否正常")
        print("4. QQ邮箱是否开启了SMTP服务")
        return False


if __name__ == "__main__":
    test_email()