from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import sqlite3
from datetime import datetime, timedelta
import os
import urllib.parse
import uuid
import hashlib
import secrets
import re
import io
import email
from email import message_from_bytes

# 获取当前脚本所在目录的绝对路径
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE = os.path.join(BASE_DIR, 'time_capsules.db')
UPLOAD_FOLDER = os.path.join(os.path.dirname(BASE_DIR), 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def migrate_database():
    """数据库迁移：添加新字段"""
    conn = get_db()
    
    # 检查并添加 email_sent 字段到 capsules 表
    cursor = conn.cursor()
    cursor.execute("PRAGMA table_info(capsules)")
    columns = [col[1] for col in cursor.fetchall()]
    
    if 'email_sent' not in columns:
        print("正在添加 email_sent 字段到 capsules 表...")
        conn.execute('ALTER TABLE capsules ADD COLUMN email_sent INTEGER DEFAULT 0')
        conn.commit()
        print("✓ email_sent 字段添加成功")
    else:
        print("email_sent 字段已存在")
    
    conn.close()

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    # 创建用户表
    conn.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            created_at TEXT NOT NULL
        )
    ''')
    
    # 创建胶囊表
    conn.execute('''
        CREATE TABLE IF NOT EXISTS capsules (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            mood TEXT,
            tags TEXT,
            create_date TEXT NOT NULL,
            open_date TEXT NOT NULL,
            is_opened INTEGER DEFAULT 0,
            open_time TEXT,
            image_path TEXT,
            category_id INTEGER,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (category_id) REFERENCES categories(id)
        )
    ''')
    
    # 创建模板表
    conn.execute('''
        CREATE TABLE IF NOT EXISTS templates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            mood TEXT,
            tags TEXT,
            is_default INTEGER DEFAULT 0
        )
    ''')

    # 创建会话表
    conn.execute('''
        CREATE TABLE IF NOT EXISTS sessions (
            token TEXT PRIMARY KEY NOT NULL,
            user_id INTEGER NOT NULL,
            username TEXT NOT NULL,
            created_at TEXT NOT NULL,
            expires_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ''')

    # 创建分类表
    conn.execute('''
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            color TEXT NOT NULL,
            icon TEXT NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ''')

    conn.commit()
    conn.close()
    
    # 初始化默认模板
    init_default_templates()

def init_default_templates():
    conn = get_db()
    existing = conn.execute('SELECT COUNT(*) as count FROM templates WHERE is_default = 1').fetchone()
    if existing['count'] == 0:
        default_templates = [
            {
                'name': '新年的我',
                'title': '致一年后的自己',
                'content': '亲爱的未来自己：\n\n当你在一年后读到这封信时，希望你已经实现了现在的梦想。现在的我正在为...而努力。\n\n记住今天的感受，保持初心，继续前行！',
                'mood': 'hopeful',
                'tags': ['新年', '目标', '成长']
            },
            {
                'name': '毕业纪念',
                'title': '毕业那天的心情',
                'content': '今天我毕业了！回顾这几年的时光，我学到了很多，也结识了很多好朋友...\n\n未来的我，你还记得这些面孔吗？还记得这些日子吗？',
                'mood': 'nostalgic',
                'tags': ['毕业', '回忆', '友谊']
            },
            {
                'name': '生日愿望',
                'title': '我的生日愿望',
                'content': '今天是我的生日！我许下了这些愿望：\n1. ...\n2. ...\n3. ...\n\n希望明年的这个时候，这些愿望都能实现！',
                'mood': 'excited',
                'tags': ['生日', '愿望', '庆祝']
            },
            {
                'name': '旅行日记',
                'title': '这次旅行的美好回忆',
                'content': '这次旅行真的太棒了！我去了很多地方，看到了很多美景...\n\n最难忘的是...\n\n希望以后还能再来！',
                'mood': 'happy',
                'tags': ['旅行', '回忆', '风景']
            },
            {
                'name': '新年目标',
                'title': '2024年新年目标',
                'content': '新的一年开始了！我为这一年设定了以下目标：\n\n工作目标：\n- ...\n- ...\n\n学习目标：\n- ...\n- ...\n\n生活目标：\n- ...\n- ...\n\n一年后回顾，看看自己完成了多少！',
                'mood': 'hopeful',
                'tags': ['新年', '目标', '规划']
            },
            {
                'name': '工作里程碑',
                'title': '项目完成纪念',
                'content': '今天我完成了一个重要的项目！\n\n这个项目历时...个月，遇到了很多挑战...\n\n最大的收获是...\n\n感谢团队中每一位伙伴的支持！',
                'mood': 'excited',
                'tags': ['工作', '成就', '团队']
            },
            {
                'name': '学习笔记',
                'title': '学习新技能的感悟',
                'content': '今天我开始学习...这门新技能！\n\n我的学习计划：\n- 第一阶段：...\n- 第二阶段：...\n- 第三阶段：...\n\n希望能坚持下去，三个月后回顾自己的进步！',
                'mood': 'hopeful',
                'tags': ['学习', '技能', '成长']
            },
            {
                'name': '家庭时光',
                'title': '与家人共度的美好时光',
                'content': '今天和家人一起度过了非常愉快的时光...\n\n我们做了...\n\n最让我感动的是...\n\n希望这样的美好时光能够一直延续下去。',
                'mood': 'happy',
                'tags': ['家庭', '亲情', '幸福']
            },
            {
                'name': '运动记录',
                'title': '第一次跑完5公里',
                'content': '今天我终于跑完了人生的第一个5公里！\n\n用时：...\n\n感受：...\n\n接下来的目标是：跑完10公里！\n\n加油，未来的自己！',
                'mood': 'excited',
                'tags': ['运动', '健康', '突破']
            },
            {
                'name': '读书感悟',
                'title': '读完《书名》的感想',
                'content': '今天终于读完了《书名》这本书！\n\n最触动我的一句话是：...\n\n这本书让我思考了...\n\n希望能把这些感悟应用到生活中去。',
                'mood': 'peaceful',
                'tags': ['读书', '感悟', '成长']
            },
            {
                'name': '美食记录',
                'title': '第一次成功做出的菜',
                'content': '今天我学会了做...这道菜！\n\n过程：\n1. ...\n2. ...\n3. ...\n\n味道还不错，下次要做给家人吃！',
                'mood': 'happy',
                'tags': ['美食', '烹饪', '生活']
            },
            {
                'name': '心情日记',
                'title': '今天的心情记录',
                'content': '今天的心情...\n\n发生了...\n\n感受...\n\n希望未来的我，回想起今天时，会微笑着对自己说：原来你曾经这样努力过。',
                'mood': 'peaceful',
                'tags': ['心情', '日记', '生活']
            }
        ]
        
        for template in default_templates:
            conn.execute('''
                INSERT INTO templates (name, title, content, mood, tags, is_default)
                VALUES (?, ?, ?, ?, ?, 1)
            ''', (
                template['name'],
                template['title'],
                template['content'],
                template['mood'],
                json.dumps(template['tags'])
            ))
        conn.commit()
    conn.close()

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def generate_token():
    return secrets.token_hex(32)

def get_user_from_token(token):
    conn = get_db()
    session = conn.execute('SELECT user_id, expires_at FROM sessions WHERE token = ?', (token,)).fetchone()
    conn.close()

    if not session:
        return None

    # 检查会话是否过期
    try:
        expires_at = datetime.fromisoformat(session['expires_at'])
        if datetime.now() > expires_at:
            # 会话已过期，删除它
            conn = get_db()
            conn.execute('DELETE FROM sessions WHERE token = ?', (token,))
            conn.commit()
            conn.close()
            return None
    except ValueError:
        return None

    return session['user_id']

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def validate_capsule_data(data):
    errors = []
    
    if not data.get('title') or len(data['title'].strip()) == 0:
        errors.append('标题不能为空')
    elif len(data['title']) > 100:
        errors.append('标题不能超过100个字符')
    
    if not data.get('content') or len(data['content'].strip()) == 0:
        errors.append('内容不能为空')
    elif len(data['content']) > 5000:
        errors.append('内容不能超过5000个字符')
    
    if not data.get('open_date'):
        errors.append('开启日期不能为空')
    else:
        try:
            open_date = datetime.fromisoformat(data['open_date'])
            if open_date <= datetime.now():
                errors.append('开启日期必须在未来')
        except ValueError:
            errors.append('开启日期格式无效')
    
    valid_moods = ['happy', 'excited', 'peaceful', 'nostalgic', 'hopeful', 'anxious', 'sad', 'grateful', 'proud', 'relaxed', 'surprised', 'confident', 'thoughtful', 'tired', 'loved']
    if data.get('mood') and data['mood'] not in valid_moods:
        errors.append('无效的心情选项')
    
    return errors

def send_json_response(handler, data, status=200):
    handler.send_response(status)
    handler.send_header('Content-type', 'application/json')
    handler.send_header('Access-Control-Allow-Origin', '*')
    handler.end_headers()
    handler.wfile.write(json.dumps(data).encode())

def send_cors_response(handler):
    handler.send_response(200)
    handler.send_header('Access-Control-Allow-Origin', '*')
    handler.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    handler.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    handler.end_headers()

def send_file_response(handler, filepath):
    try:
        with open(filepath, 'rb') as f:
            content = f.read()

        content_type = 'image/jpeg'
        if filepath.endswith('.png'):
            content_type = 'image/png'
        elif filepath.endswith('.gif'):
            content_type = 'image/gif'
        elif filepath.endswith('.webp'):
            content_type = 'image/webp'

        handler.send_response(200)
        handler.send_header('Content-type', content_type)
        handler.send_header('Access-Control-Allow-Origin', '*')
        handler.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        handler.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Range')
        handler.send_header('Cache-Control', 'public, max-age=31536000')  # 缓存一年
        handler.send_header('Content-Length', str(len(content)))
        handler.send_header('Accept-Ranges', 'bytes')
        handler.end_headers()
        handler.wfile.write(content)
        print(f'[FILE] Served {filepath} ({len(content)} bytes)')
    except FileNotFoundError:
        print(f'[FILE] File not found: {filepath}')
        send_json_response(handler, {'error': 'File not found'}, 404)
    except (ConnectionAbortedError, ConnectionResetError, BrokenPipeError):
        # 客户端断开连接，静默处理
        print(f'[FILE] Client disconnected while serving {filepath}')
    except Exception as e:
        print(f'[FILE] Error serving file {filepath}: {e}')
        send_json_response(handler, {'error': 'Internal server error'}, 500)

class RequestHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

    def get_auth_token(self):
        auth_header = self.headers.get('Authorization', '')
        if auth_header.startswith('Bearer '):
            return auth_header[7:]
        return None

    def do_OPTIONS(self):
        send_cors_response(self)

    def do_GET(self):
        try:
            # Serve static files from uploads directory
            if self.path.startswith('/uploads/'):
                filename = self.path[9:]
                filepath = os.path.join(UPLOAD_FOLDER, filename)
                if os.path.exists(filepath):
                    send_file_response(self, filepath)
                else:
                    send_json_response(self, {'error': 'File not found'}, 404)
            
            # Get current user
            elif self.path == '/api/auth/me':
                token = self.get_auth_token()
                if not token:
                    send_json_response(self, {'error': 'Not authenticated'}, 401)
                    return
                
                user_id = get_user_from_token(token)
                if not user_id:
                    send_json_response(self, {'error': 'Invalid token'}, 401)
                    return
                
                conn = get_db()
                user = conn.execute('SELECT id, username, email, created_at FROM users WHERE id = ?', (user_id,)).fetchone()
                conn.close()
                
                if user:
                    send_json_response(self, dict(user))
                else:
                    send_json_response(self, {'error': 'User not found'}, 404)
            
            # Get user's capsules
            elif self.path == '/api/capsules':
                print('GET /api/capsules - Request received')
                token = self.get_auth_token()
                user_id = get_user_from_token(token)
                print(f'GET /api/capsules - Token: {token}, User ID: {user_id}')
                print(f'GET /api/capsules - Authorization header: {self.headers.get("Authorization", "None")}')

                if not user_id:
                    print('GET /api/capsules - Not authenticated')
                    send_json_response(self, {'error': 'Not authenticated'}, 401)
                    return

                try:
                    conn = get_db()
                    print('GET /api/capsules - Executing query...')
                    capsules = conn.execute('SELECT * FROM capsules WHERE user_id = ? ORDER BY create_date DESC', (user_id,)).fetchall()
                    conn.close()
                    result = [dict(c) for c in capsules]
                    print(f'GET /api/capsules - Found {len(result)} capsules')
                    print(f'GET /api/capsules - Result: {result}')
                    send_json_response(self, result)
                except Exception as e:
                    print(f'GET /api/capsules - Error: {str(e)}')
                    import traceback
                    traceback.print_exc()
                    send_json_response(self, {'error': 'Internal server error'}, 500)
            
            # Get random opened capsule
            elif self.path.startswith('/api/capsules/') and '/random' in self.path:
                token = self.get_auth_token()
                user_id = get_user_from_token(token)
                
                if not user_id:
                    send_json_response(self, {'error': 'Not authenticated'}, 401)
                    return
                
                conn = get_db()
                capsule = conn.execute('''
                    SELECT * FROM capsules WHERE user_id = ? AND is_opened = 1 
                    ORDER BY RANDOM() LIMIT 1
                ''', (user_id,)).fetchone()
                conn.close()
                
                if capsule:
                    send_json_response(self, dict(capsule))
                else:
                    send_json_response(self, {'error': 'No opened capsules found'}, 404)
            
            # Get single capsule
            elif self.path.startswith('/api/capsules/') and '/random' not in self.path and '/batch' not in self.path:
                try:
                    capsule_id = int(self.path.split('/')[-1])
                    token = self.get_auth_token()
                    user_id = get_user_from_token(token)
                    
                    if not user_id:
                        send_json_response(self, {'error': 'Not authenticated'}, 401)
                        return
                    
                    conn = get_db()
                    capsule = conn.execute('SELECT * FROM capsules WHERE id = ? AND user_id = ?', (capsule_id, user_id)).fetchone()
                    conn.close()
                    
                    if capsule:
                        send_json_response(self, dict(capsule))
                    else:
                        send_json_response(self, {'error': 'Capsule not found'}, 404)
                except ValueError:
                    send_json_response(self, {'error': 'Invalid capsule ID'}, 400)
            
            # Get mood statistics
            elif self.path == '/api/stats/mood':
                token = self.get_auth_token()
                user_id = get_user_from_token(token)
                
                if not user_id:
                    send_json_response(self, {'error': 'Not authenticated'}, 401)
                    return
                
                conn = get_db()
                capsules = conn.execute('SELECT mood FROM capsules WHERE user_id = ? AND mood != ""', (user_id,)).fetchall()
                conn.close()
                mood_counts = {}
                for c in capsules:
                    mood = c['mood']
                    mood_counts[mood] = mood_counts.get(mood, 0) + 1
                send_json_response(self, mood_counts)
            
            # Get templates
            elif self.path == '/api/templates':
                conn = get_db()
                templates = conn.execute('SELECT * FROM templates ORDER BY is_default DESC, name').fetchall()
                conn.close()
                result = [dict(t) for t in templates]
                send_json_response(self, result)

            # Get user's categories
            elif self.path == '/api/categories':
                token = self.get_auth_token()
                user_id = get_user_from_token(token)

                if not user_id:
                    send_json_response(self, {'error': 'Not authenticated'}, 401)
                    return

                conn = get_db()
                categories = conn.execute('SELECT * FROM categories WHERE user_id = ? ORDER BY name', (user_id,)).fetchall()
                conn.close()
                result = [dict(c) for c in categories]
                send_json_response(self, result)

            else:
                send_json_response(self, {'error': 'Not found'}, 404)
        except Exception as e:
            print(f"Error in GET: {str(e)}")
            send_json_response(self, {'error': 'Internal server error'}, 500)

    def do_POST(self):
        try:
            # Register user
            if self.path == '/api/auth/register':
                content_length = int(self.headers.get('Content-Length', 0))
                if content_length == 0:
                    send_json_response(self, {'error': 'No data provided'}, 400)
                    return
                
                post_data = self.rfile.read(content_length)
                
                try:
                    data = json.loads(post_data.decode('utf-8'))
                except json.JSONDecodeError:
                    send_json_response(self, {'error': 'Invalid JSON'}, 400)
                    return
                
                username = data.get('username', '').strip()
                password = data.get('password', '')
                email = data.get('email', '').strip()
                
                if not username or len(username) < 3:
                    send_json_response(self, {'error': 'Username must be at least 3 characters'}, 400)
                    return
                
                if not password or len(password) < 6:
                    send_json_response(self, {'error': 'Password must be at least 6 characters'}, 400)
                    return
                
                if not email or '@' not in email:
                    send_json_response(self, {'error': 'Invalid email'}, 400)
                    return
                
                conn = get_db()
                try:
                    cursor = conn.cursor()
                    cursor.execute('''
                        INSERT INTO users (username, password_hash, email, created_at)
                        VALUES (?, ?, ?, ?)
                    ''', (username, hash_password(password), email, datetime.now().isoformat()))
                    conn.commit()
                    user_id = cursor.lastrowid
                    conn.close()
                    send_json_response(self, {'message': 'User registered successfully', 'user_id': user_id}, 201)
                except sqlite3.IntegrityError:
                    conn.close()
                    send_json_response(self, {'error': 'Username or email already exists'}, 409)
            
            # Login user
            elif self.path == '/api/auth/login':
                content_length = int(self.headers.get('Content-Length', 0))
                if content_length == 0:
                    send_json_response(self, {'error': 'No data provided'}, 400)
                    return
                
                post_data = self.rfile.read(content_length)
                
                try:
                    data = json.loads(post_data.decode('utf-8'))
                except json.JSONDecodeError:
                    send_json_response(self, {'error': 'Invalid JSON'}, 400)
                    return
                
                username = data.get('username', '').strip()
                password = data.get('password', '')
                
                conn = get_db()
                user = conn.execute('SELECT * FROM users WHERE username = ?', (username,)).fetchone()
                conn.close()
                
                if not user or user['password_hash'] != hash_password(password):
                    send_json_response(self, {'error': 'Invalid username or password'}, 401)
                    return
                
                token = generate_token()
                now = datetime.now()
                expires_at = now.replace(year=now.year + 1)  # 1 年后过期

                conn = get_db()
                conn.execute('''
                    INSERT INTO sessions (token, user_id, username, created_at, expires_at)
                    VALUES (?, ?, ?, ?, ?)
                ''', (token, user['id'], user['username'], now.isoformat(), expires_at.isoformat()))
                conn.commit()
                conn.close()

                send_json_response(self, {
                    'message': 'Login successful',
                    'token': token,
                    'user': {
                        'id': user['id'],
                        'username': user['username'],
                        'email': user['email']
                    }
                })
            
            # Logout user
            elif self.path == '/api/auth/logout':
                token = self.get_auth_token()
                if token:
                    conn = get_db()
                    conn.execute('DELETE FROM sessions WHERE token = ?', (token,))
                    conn.commit()
                    conn.close()
                send_json_response(self, {'message': 'Logout successful'})
            
            # Upload image
            elif self.path == '/api/upload':
                token = self.get_auth_token()
                print(f'[UPLOAD] Token received: {token}')

                if not get_user_from_token(token):
                    print('[UPLOAD] Authentication failed')
                    send_json_response(self, {'error': 'Not authenticated'}, 401)
                    return

                content_type = self.headers.get('Content-Type', '')
                content_length = int(self.headers.get('Content-Length', 0))

                print(f'[UPLOAD] Content-Type: {content_type}')
                print(f'[UPLOAD] Content-Length: {content_length}')

                if not content_type.startswith('multipart/form-data'):
                    print('[UPLOAD] Invalid content type, expected multipart/form-data')
                    send_json_response(self, {'error': 'Invalid content type, expected multipart/form-data'}, 400)
                    return

                if content_length == 0:
                    print('[UPLOAD] No content length')
                    send_json_response(self, {'error': 'No file uploaded'}, 400)
                    return

                # 读取请求体
                body_bytes = self.rfile.read(content_length)
                print(f'[UPLOAD] Read {len(body_bytes)} bytes')

# 使用 email 模块解析 multipart 数据（替代已弃用的 cgi）
                try:
                    # 解析 multipart/form-data
                    msg = message_from_bytes(
                        b'Content-Type: ' + content_type.encode() + b'\n\n' + body_bytes
                    )

                    file_data = None
                    filename = None

                    # 查找文件字段
                    for part in msg.walk():
                        content_disposition = part.get('Content-Disposition', '')
                        if 'name="file"' in content_disposition:
                            filename = part.get_filename()
                            if filename:
                                filename = os.path.basename(filename)
                                file_data = part.get_payload(decode=True)
                                break

                    if not filename or not file_data:
                        print('[UPLOAD] No file found in request')
                        send_json_response(self, {'error': 'No file uploaded'}, 400)
                        return

                    print(f'[UPLOAD] Original filename: {filename}')

                    if not allowed_file(filename):
                        print(f'[UPLOAD] Invalid file type: {filename}')
                        send_json_response(self, {'error': 'Invalid file type. Allowed: png, jpg, jpeg, gif, webp'}, 400)
                        return

                    if len(file_data) > MAX_FILE_SIZE:
                        print(f'[UPLOAD] File too large: {len(file_data)} bytes')
                        send_json_response(self, {'error': f'File too large. Maximum size is {MAX_FILE_SIZE // (1024*1024)}MB'}, 400)
                        return

                    ext = filename.rsplit('.', 1)[1].lower()
                    new_filename = f"{uuid.uuid4().hex}.{ext}"
                    filepath = os.path.join(UPLOAD_FOLDER, new_filename)

                    with open(filepath, 'wb') as f:
                        f.write(file_data)

                    print(f'[UPLOAD] Success: {filename} ({len(file_data)} bytes) -> {new_filename}')
                    send_json_response(self, {'path': f'/uploads/{new_filename}'})

                except Exception as e:
                    print(f'[UPLOAD] Error: {str(e)}')
                    import traceback
                    traceback.print_exc()
                    send_json_response(self, {'error': f'Upload failed: {str(e)}'}, 500)
            
            # Create capsule
            elif self.path == '/api/capsules':
                token = self.get_auth_token()
                user_id = get_user_from_token(token)
                
                if not user_id:
                    send_json_response(self, {'error': 'Not authenticated'}, 401)
                    return
                
                content_length = int(self.headers.get('Content-Length', 0))
                if content_length == 0:
                    send_json_response(self, {'error': 'No data provided'}, 400)
                    return
                
                post_data = self.rfile.read(content_length)
                
                try:
                    data = json.loads(post_data.decode('utf-8'))
                except json.JSONDecodeError:
                    send_json_response(self, {'error': 'Invalid JSON'}, 400)
                    return
                
                errors = validate_capsule_data(data)
                if errors:
                    send_json_response(self, {'error': 'Validation failed', 'details': errors}, 400)
                    return
                
                conn = get_db()
                cursor = conn.cursor()
                cursor.execute('''
                    INSERT INTO capsules (user_id, title, content, mood, tags, create_date, open_date, image_path, category_id)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    user_id,
                    data['title'].strip(),
                    data['content'].strip(),
                    data.get('mood', ''),
                    json.dumps(data.get('tags', [])),
                    datetime.now().isoformat(),
                    data['open_date'],
                    data.get('image_path', ''),
                    data.get('category_id')
                ))
                conn.commit()
                capsule_id = cursor.lastrowid
                conn.close()
                send_json_response(self, {'id': capsule_id, 'message': 'Capsule created successfully'}, 201)
            
            # Open capsule
            elif self.path.endswith('/open'):
                token = self.get_auth_token()
                user_id = get_user_from_token(token)
                
                if not user_id:
                    send_json_response(self, {'error': 'Not authenticated'}, 401)
                    return
                
                try:
                    capsule_id = int(self.path.split('/')[-2])
                    conn = get_db()
                    now = datetime.now().isoformat()
                    conn.execute('''
                        UPDATE capsules SET is_opened = 1, open_time = ? WHERE id = ? AND user_id = ?
                    ''', (now, capsule_id, user_id))
                    conn.commit()
                    conn.close()
                    send_json_response(self, {'message': 'Capsule opened successfully'})
                except ValueError:
                    send_json_response(self, {'error': 'Invalid capsule ID'}, 400)
            
            # Batch delete capsules
            elif self.path == '/api/capsules/batch':
                token = self.get_auth_token()
                user_id = get_user_from_token(token)
                
                if not user_id:
                    send_json_response(self, {'error': 'Not authenticated'}, 401)
                    return
                
                content_length = int(self.headers.get('Content-Length', 0))
                if content_length == 0:
                    send_json_response(self, {'error': 'No data provided'}, 400)
                    return
                
                post_data = self.rfile.read(content_length)
                
                try:
                    data = json.loads(post_data.decode('utf-8'))
                except json.JSONDecodeError:
                    send_json_response(self, {'error': 'Invalid JSON'}, 400)
                    return
                
                capsule_ids = data.get('ids', [])
                if not isinstance(capsule_ids, list) or len(capsule_ids) == 0:
                    send_json_response(self, {'error': 'Invalid capsule IDs'}, 400)
                    return
                
                conn = get_db()
                placeholders = ','.join(['?'] * len(capsule_ids))
                cursor = conn.cursor()
                cursor.execute(f'DELETE FROM capsules WHERE id IN ({placeholders}) AND user_id = ?', capsule_ids + [user_id])
                deleted_count = cursor.rowcount
                conn.commit()
                conn.close()
                
                send_json_response(self, {'message': f'Deleted {deleted_count} capsules'})
            
            # Batch export capsules
            elif self.path == '/api/capsules/export':
                token = self.get_auth_token()
                user_id = get_user_from_token(token)

                if not user_id:
                    send_json_response(self, {'error': 'Not authenticated'}, 401)
                    return

                conn = get_db()
                capsules = conn.execute('SELECT * FROM capsules WHERE user_id = ? ORDER BY create_date DESC', (user_id,)).fetchall()
                conn.close()

                result = [dict(c) for c in capsules]
                send_json_response(self, {'capsules': result, 'export_date': datetime.now().isoformat()})

            # Create category
            elif self.path == '/api/categories':
                token = self.get_auth_token()
                user_id = get_user_from_token(token)

                if not user_id:
                    send_json_response(self, {'error': 'Not authenticated'}, 401)
                    return

                content_length = int(self.headers.get('Content-Length', 0))
                if content_length == 0:
                    send_json_response(self, {'error': 'No data provided'}, 400)
                    return

                post_data = self.rfile.read(content_length)

                try:
                    data = json.loads(post_data.decode('utf-8'))
                except json.JSONDecodeError:
                    send_json_response(self, {'error': 'Invalid JSON'}, 400)
                    return

                name = data.get('name', '').strip()
                color = data.get('color', '#667eea')
                icon = data.get('icon', 'bi-folder')

                if not name:
                    send_json_response(self, {'error': 'Category name is required'}, 400)
                    return

                conn = get_db()
                cursor = conn.cursor()
                cursor.execute('''
                    INSERT INTO categories (user_id, name, color, icon, created_at)
                    VALUES (?, ?, ?, ?, ?)
                ''', (user_id, name, color, icon, datetime.now().isoformat()))
                conn.commit()
                category_id = cursor.lastrowid
                conn.close()

                send_json_response(self, {'id': category_id, 'message': 'Category created successfully'}, 201)

            # 手动触发邮件提醒检查
            elif self.path == '/api/reminders/check':
                token = self.get_auth_token()
                user_id = get_user_from_token(token)
                
                if not user_id:
                    send_json_response(self, {'error': 'Not authenticated'}, 401)
                    return
                
                try:
                    import email_sender
                    
                    conn = get_db()
                    
                    # 获取当前用户所有未开启且未发送提醒的胶囊
                    today = datetime.now()
                    future_7days = today + timedelta(days=7)
                    
                    query = '''
                        SELECT c.id, c.title, c.open_date, c.email_sent, u.username, u.email
                        FROM capsules c
                        JOIN users u ON c.user_id = u.id
                        WHERE c.user_id = ?
                          AND c.is_opened = 0 
                          AND c.email_sent = 0
                          AND c.open_date BETWEEN ? AND ?
                        ORDER BY c.open_date ASC
                    '''
                    
                    capsules = conn.execute(query, (user_id, today.strftime('%Y-%m-%d'), future_7days.strftime('%Y-%m-%d'))).fetchall()
                    
                    sent_count = 0
                    failed_count = 0
                    results = []
                    
                    for capsule in capsules:
                        capsule_id = capsule['id']
                        title = capsule['title']
                        open_date = capsule['open_date']
                        username = capsule['username']
                        email = capsule['email']
                        
                        # 发送邮件
                        success, error = email_sender.send_reminder_email(email, username, title, open_date)
                        
                        if success:
                            # 更新邮件发送状态
                            conn.execute('UPDATE capsules SET email_sent = 1 WHERE id = ?', (capsule_id,))
                            conn.commit()
                            sent_count += 1
                            results.append({
                                'capsule_id': capsule_id,
                                'title': title,
                                'status': 'sent',
                                'email': email
                            })
                        else:
                            failed_count += 1
                            results.append({
                                'capsule_id': capsule_id,
                                'title': title,
                                'status': 'failed',
                                'error': error
                            })
                    
                    conn.close()
                    
                    send_json_response({
                        'total': len(capsules),
                        'sent': sent_count,
                        'failed': failed_count,
                        'results': results
                    })
                    
                except Exception as e:
                    print(f"Error in reminders check: {str(e)}")
                    send_json_response(self, {'error': str(e)}, 500)

            else:
                send_json_response(self, {'error': 'Not found'}, 404)
        except Exception as e:
            print(f"Error in POST: {str(e)}")
            send_json_response(self, {'error': 'Internal server error'}, 500)

    def do_PUT(self):
        print('do_PUT called for path:', self.path)
        try:
            if self.path.startswith('/api/capsules/'):
                print('PUT /api/capsules - Request received')
                token = self.get_auth_token()
                user_id = get_user_from_token(token)
                print(f'PUT /api/capsules - Token: {token}, User ID: {user_id}')
                
                if not user_id:
                    print('PUT /api/capsules - Not authenticated')
                    send_json_response(self, {'error': 'Not authenticated'}, 401)
                    return
                
                try:
                    capsule_id = int(self.path.split('/')[-1])
                except ValueError:
                    send_json_response(self, {'error': 'Invalid capsule ID'}, 400)
                    return
                
                print(f'PUT /api/capsules - Updating capsule {capsule_id}')
                content_length = int(self.headers.get('Content-Length', 0))
                if content_length == 0:
                    send_json_response(self, {'error': 'No data provided'}, 400)
                    return
                
                post_data = self.rfile.read(content_length)
                print(f'PUT /api/capsules - Received {content_length} bytes')
                
                try:
                    data = json.loads(post_data.decode('utf-8'))
                    print(f'PUT /api/capsules - Parsed data: {data}')
                except json.JSONDecodeError:
                    send_json_response(self, {'error': 'Invalid JSON'}, 400)
                    return
                
                errors = validate_capsule_data(data)
                if errors:
                    print(f'PUT /api/capsules - Validation errors: {errors}')
                    send_json_response(self, {'error': 'Validation failed', 'details': errors}, 400)
                    return

                # 检查胶囊是否已开启
                conn = get_db()
                capsule = conn.execute('SELECT is_opened FROM capsules WHERE id = ? AND user_id = ?', (capsule_id, user_id)).fetchone()
                if not capsule:
                    conn.close()
                    send_json_response(self, {'error': 'Capsule not found'}, 404)
                    return

                if capsule['is_opened']:
                    conn.close()
                    send_json_response(self, {'error': 'Cannot edit an opened capsule. Once opened, a time capsule cannot be modified.'}, 400)
                    return

                cursor = conn.cursor()
                print('PUT /api/capsules - Executing UPDATE query...')
                cursor.execute('''
                    UPDATE capsules SET title = ?, content = ?, mood = ?, tags = ?, open_date = ?, image_path = ?, category_id = ?
                    WHERE id = ? AND user_id = ?
                ''', (
                    data['title'].strip(),
                    data['content'].strip(),
                    data.get('mood', ''),
                    json.dumps(data.get('tags', [])),
                    data['open_date'],
                    data.get('image_path', ''),
                    data.get('category_id'),
                    capsule_id,
                    user_id
                ))
                conn.commit()
                updated_count = cursor.rowcount
                print(f'PUT /api/capsules - Updated {updated_count} rows')
                conn.close()
                
                if updated_count > 0:
                    send_json_response(self, {'message': 'Capsule updated successfully'})
                else:
                    send_json_response(self, {'error': 'Capsule not found'}, 404)
            else:
                send_json_response(self, {'error': 'Not found'}, 404)
        except Exception as e:
            print(f"Error in PUT: {str(e)}")
            send_json_response(self, {'error': 'Internal server error'}, 500)

    def do_DELETE(self):
        try:
            if self.path.startswith('/api/capsules/'):
                token = self.get_auth_token()
                user_id = get_user_from_token(token)

                if not user_id:
                    send_json_response(self, {'error': 'Not authenticated'}, 401)
                    return

                try:
                    capsule_id = int(self.path.split('/')[-1])
                except ValueError:
                    send_json_response(self, {'error': 'Invalid capsule ID'}, 400)
                    return

                conn = get_db()
                cursor = conn.cursor()
                cursor.execute('DELETE FROM capsules WHERE id = ? AND user_id = ?', (capsule_id, user_id))
                deleted_count = cursor.rowcount
                conn.commit()
                conn.close()

                if deleted_count > 0:
                    send_json_response(self, {'message': 'Capsule deleted successfully'})
                else:
                    send_json_response(self, {'error': 'Capsule not found'}, 404)

            elif self.path.startswith('/api/categories/'):
                token = self.get_auth_token()
                user_id = get_user_from_token(token)

                if not user_id:
                    send_json_response(self, {'error': 'Not authenticated'}, 401)
                    return

                try:
                    category_id = int(self.path.split('/')[-1])
                except ValueError:
                    send_json_response(self, {'error': 'Invalid category ID'}, 400)
                    return

                conn = get_db()
                cursor = conn.cursor()

                # 将该分类下的胶囊的 category_id 设为 NULL
                cursor.execute('UPDATE capsules SET category_id = NULL WHERE category_id = ? AND user_id = ?', (category_id, user_id))

                # 删除分类
                cursor.execute('DELETE FROM categories WHERE id = ? AND user_id = ?', (category_id, user_id))
                deleted_count = cursor.rowcount
                conn.commit()
                conn.close()

                if deleted_count > 0:
                    send_json_response(self, {'message': 'Category deleted successfully'})
                else:
                    send_json_response(self, {'error': 'Category not found'}, 404)

            else:
                send_json_response(self, {'error': 'Not found'}, 404)
        except Exception as e:
            print(f"Error in DELETE: {str(e)}")
            send_json_response(self, {'error': 'Internal server error'}, 500)

def run_server():
    init_db()
    server_address = ('', 5000)
    httpd = HTTPServer(server_address, RequestHandler)
    print('Server running on http://localhost:5000')
    httpd.serve_forever()

if __name__ == '__main__':
    # 运行数据库迁移
    migrate_database()
    
    # 初始化数据库
    init_db()
    
    # 运行服务器
    run_server()
