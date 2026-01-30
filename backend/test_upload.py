#!/usr/bin/env python3
"""
测试文件上传功能
"""

import requests
import io

# 测试数据
API_URL = "http://localhost:5000/api/upload"

# 创建一个测试图片（简单的 PNG）
test_image_data = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\x0d\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82'

# 准备 multipart/form-data
files = {
    'file': ('test.png', io.BytesIO(test_image_data), 'image/png')
}

try:
    # 发送上传请求
    response = requests.post(API_URL, files=files)

    print(f"状态码: {response.status_code}")
    print(f"响应: {response.json()}")

    if response.status_code == 200:
        print("\n✓ 文件上传功能正常工作")
    else:
        print(f"\n✗ 文件上传失败: {response.json()}")

except Exception as e:
    print(f"✗ 错误: {e}")
    print("请确保后端服务器正在运行 (python3 app.py)")