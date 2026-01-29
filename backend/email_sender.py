import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.utils import formataddr
from datetime import datetime
import email_config

def send_reminder_email(to_email, username, capsule_title, open_date):
    """
    发送胶囊开启提醒邮件
    
    Args:
        to_email: 收件人邮箱
        username: 用户名
        capsule_title: 胶囊标题
        open_date: 开启日期
        
    Returns:
        bool: 发送是否成功
        str: 错误信息（如果失败）
    """
    try:
        # 创建邮件
        msg = MIMEMultipart()
        msg['From'] = formataddr((email_config.SENDER_NAME, email_config.SENDER_EMAIL))
        msg['To'] = formataddr((username, to_email))
        msg['Subject'] = f'📬 您的时间胶囊"{capsule_title}"即将开启！'
        
        # 邮件正文
        html_body = f"""
        <html>
        <head>
            <style>
                body {{
                    font-family: 'Microsoft YaHei', Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                }}
                .container {{
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }}
                .header {{
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                    border-radius: 10px 10px 0 0;
                }}
                .content {{
                    background: #f8f9fa;
                    padding: 30px;
                    border-radius: 0 0 10px 10px;
                }}
                .capsule-info {{
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }}
                .footer {{
                    text-align: center;
                    color: #666;
                    margin-top: 20px;
                    font-size: 12px;
                }}
                .btn {{
                    display: inline-block;
                    padding: 12px 30px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    text-decoration: none;
                    border-radius: 25px;
                    margin: 20px 0;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🕐 时间胶囊提醒</h1>
                </div>
                <div class="content">
                    <p>亲爱的 <strong>{username}</strong>：</p>
                    <p>您好！您创建的时间胶囊即将到开启日期了！</p>
                    
                    <div class="capsule-info">
                        <h3>📦 胶囊信息</h3>
                        <p><strong>标题：</strong>{capsule_title}</p>
                        <p><strong>开启日期：</strong>{open_date}</p>
                        <p><strong>状态：</strong>🔓 等待开启</p>
                    </div>
                    
                    <p>时光流逝，当初封存的记忆即将重现。请在开启日期后登录系统查看您的胶囊内容。</p>
                    
                    <div style="text-align: center;">
                        <p>祝您回忆愉快！✨</p>
                    </div>
                </div>
                <div class="footer">
                    <p>此邮件由时间胶囊系统自动发送，请勿回复</p>
                    <p>开启时间：{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        msg.attach(MIMEText(html_body, 'html', 'utf-8'))
        
        # 创建SSL上下文
        context = ssl.create_default_context()
        
        # 发送邮件
        with smtplib.SMTP_SSL(email_config.SMTP_SERVER, email_config.SMTP_PORT, context=context) as server:
            server.login(email_config.SENDER_EMAIL, email_config.SENDER_PASSWORD)
            server.sendmail(email_config.SENDER_EMAIL, to_email, msg.as_string())
            
        print(f"邮件发送成功：{to_email}")
        return True, None
        
    except Exception as e:
        error_msg = f"邮件发送失败：{str(e)}"
        print(error_msg)
        return False, error_msg


def send_welcome_email(to_email, username):
    """
    发送欢迎邮件
    
    Args:
        to_email: 收件人邮箱
        username: 用户名
        
    Returns:
        bool: 发送是否成功
        str: 错误信息（如果失败）
    """
    try:
        msg = MIMEMultipart()
        msg['From'] = formataddr((email_config.SENDER_NAME, email_config.SENDER_EMAIL))
        msg['To'] = formataddr((username, to_email))
        msg['Subject'] = f'🎉 欢迎加入时间胶囊！'
        
        html_body = f"""
        <html>
        <head>
            <style>
                body {{
                    font-family: 'Microsoft YaHei', Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                }}
                .container {{
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }}
                .header {{
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                    border-radius: 10px 10px 0 0;
                }}
                .content {{
                    background: #f8f9fa;
                    padding: 30px;
                    border-radius: 0 0 10px 10px;
                }}
                .footer {{
                    text-align: center;
                    color: #666;
                    margin-top: 20px;
                    font-size: 12px;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 欢迎加入时间胶囊！</h1>
                </div>
                <div class="content">
                    <p>亲爱的 <strong>{username}</strong>：</p>
                    <p>感谢您注册时间胶囊系统！</p>
                    <p>时间胶囊是一个情感化的记忆回溯系统，让您可以：</p>
                    <ul>
                        <li>🕐 创建时间胶囊，设定未来开启日期</li>
                        <li>📝 添加文字、心情、标签和图片</li>
                        <li>🔓 到达开启日期后解封胶囊</li>
                        <li>📊 查看心情统计变化趋势</li>
                        <li>🎲 随机回顾过去开启的胶囊</li>
                    </ul>
                    <p>开始记录您的人生故事吧！✨</p>
                </div>
                <div class="footer">
                    <p>此邮件由时间胶囊系统自动发送，请勿回复</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        msg.attach(MIMEText(html_body, 'html', 'utf-8'))
        
        context = ssl.create_default_context()
        
        with smtplib.SMTP_SSL(email_config.SMTP_SERVER, email_config.SMTP_PORT, context=context) as server:
            server.login(email_config.SENDER_EMAIL, email_config.SENDER_PASSWORD)
            server.sendmail(email_config.SENDER_EMAIL, to_email, msg.as_string())
            
        print(f"欢迎邮件发送成功：{to_email}")
        return True, None
        
    except Exception as e:
        error_msg = f"欢迎邮件发送失败：{str(e)}"
        print(error_msg)
        return False, error_msg


if __name__ == "__main__":
    # 测试邮件发送
    test_email = "test@qq.com"  # 替换为你的测试邮箱
    success, error = send_reminder_email(test_email, "测试用户", "测试胶囊", "2026-01-30")
    if success:
        print("测试邮件发送成功！")
    else:
        print(f"测试邮件发送失败：{error}")