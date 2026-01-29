#!/usr/bin/env python3
"""
定时任务：检查即将开启的胶囊并发送邮件提醒
建议使用 cron 或 systemd timer 定期运行此脚本
"""

import sys
import os
from datetime import datetime, timedelta
import sqlite3
import email_sender

# 添加当前目录到路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# 数据库路径
DATABASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'time_capsules.db')

def get_db():
    """获取数据库连接"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def check_and_send_reminders():
    """
    检查即将开启的胶囊并发送邮件提醒
    """
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] 开始检查即将开启的胶囊...")
    
    try:
        conn = get_db()
        
        # 获取所有未开启且未发送提醒邮件的胶囊
        # 条件：is_opened = 0, email_sent = 0, open_date 在未来7天内或今天
        today = datetime.now()
        future_7days = today + timedelta(days=7)
        
        query = '''
            SELECT c.id, c.title, c.open_date, c.email_sent, u.username, u.email
            FROM capsules c
            JOIN users u ON c.user_id = u.id
            WHERE c.is_opened = 0 
              AND c.email_sent = 0
              AND c.open_date BETWEEN ? AND ?
            ORDER BY c.open_date ASC
        '''
        
        capsules = conn.execute(query, (today.strftime('%Y-%m-%d'), future_7days.strftime('%Y-%m-%d'))).fetchall()
        
        print(f"找到 {len(capsules)} 个即将开启的胶囊")
        
        sent_count = 0
        failed_count = 0
        
        for capsule in capsules:
            capsule_id = capsule['id']
            title = capsule['title']
            open_date = capsule['open_date']
            username = capsule['username']
            email = capsule['email']
            
            print(f"\n处理胶囊 {capsule_id}: {title}")
            print(f"  用户: {username} ({email})")
            print(f"  开启日期: {open_date}")
            
            # 发送邮件
            success, error = email_sender.send_reminder_email(email, username, title, open_date)
            
            if success:
                # 更新邮件发送状态
                conn.execute('UPDATE capsules SET email_sent = 1 WHERE id = ?', (capsule_id,))
                conn.commit()
                sent_count += 1
                print(f"  ✓ 邮件发送成功")
            else:
                failed_count += 1
                print(f"  ✗ 邮件发送失败: {error}")
        
        conn.close()
        
        print(f"\n[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] 检查完成")
        print(f"成功发送: {sent_count} 封")
        print(f"发送失败: {failed_count} 封")
        
        return sent_count, failed_count
        
    except Exception as e:
        print(f"错误: {str(e)}")
        import traceback
        traceback.print_exc()
        return 0, 0


if __name__ == "__main__":
    # 运行检查
    sent, failed = check_and_send_reminders()
    
    # 返回状态码
    sys.exit(0 if failed == 0 else 1)