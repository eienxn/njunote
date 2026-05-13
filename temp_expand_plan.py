# 读取现有计划
plan_file = 'docs/superpowers/plans/2026-05-13-phase1-backend-auth.md'

with open(plan_file, 'r', encoding='utf-8') as f:
    existing_content = f.read()

# 移除最后的简化版 Task 3 和 Execution Handoff
if '## Task 3: User DAO' in existing_content:
    existing_content = existing_content.split('## Task 3: User DAO')[0]

# 准备要添加的完整任务（Task 3-13）
# 由于内容太长，我会分段添加
print("Starting to expand plan...")
print(f"Current length: {len(existing_content)} chars")

# 保存当前进度
with open(plan_file, 'w', encoding='utf-8') as f:
    f.write(existing_content)

print("Plan file prepared for expansion")
