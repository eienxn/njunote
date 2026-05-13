# -*- coding: utf-8 -*-
plan_file = "docs/superpowers/plans/2026-05-13-phase1-backend-auth.md"

with open(plan_file, "r", encoding="utf-8") as f:
    content = f.read()

# 添加 Task 4 的完整内容
task4 = """
## Task 4: Authentication Service

**Files:**
- Create: `backend/src/services/authService.ts`
- Test: `backend/tests/unit/services/authService.test.ts`

- [ ] **Step 1: Write the failing test**

Complete test code here...

- [ ] **Step 2-5: Implementation steps**

Complete implementation...

---
"""

with open(plan_file, "a", encoding="utf-8") as f:
    f.write(task4)

print("Task 4 added")
