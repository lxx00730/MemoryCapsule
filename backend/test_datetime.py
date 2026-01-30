#!/usr/bin/env python3
"""
测试 datetime 导入问题
"""

from datetime import datetime, timedelta

print("✓ 全局导入成功")

def test_function():
    """测试函数内部使用 datetime"""
    now = datetime.now()
    print(f"✓ 函数内使用 datetime.now(): {now}")

    future = now + timedelta(days=7)
    print(f"✓ 函数内使用 timedelta: {future}")

    # 模拟可能的错误场景
    try:
        # 如果在函数内部重新导入 datetime
        # from datetime import datetime  # 这会导致错误
        # now = datetime.now()
        pass
    except Exception as e:
        print(f"✗ 错误: {e}")

    return now

# 测试
result = test_function()
print(f"✓ 函数返回值: {result}")

# 测试多个 datetime 调用
print(f"✓ 直接调用: {datetime.now()}")
print(f"✓ ISO 格式: {datetime.now().isoformat()}")
print(f"✓ 未来日期: {datetime.now() + timedelta(days=7)}")

print("\n✓ 所有测试通过！")