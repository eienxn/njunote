# 🚀 GitHub 推送和 PR 创建指南

## 前置准备

### 1. 安装 GitHub CLI（推荐）

**Windows:**
```bash
winget install --id GitHub.cli
```

或下载：https://cli.github.com/

**验证安装:**
```bash
gh --version
```

### 2. 登录 GitHub

```bash
gh auth login
```

按提示选择：
- GitHub.com
- HTTPS
- Login with a web browser（会打开浏览器登录）

---

## 步骤 1：创建 GitHub 仓库

```bash
cd c:/Users/fengs/Desktop/njunote/quiz

# 创建远程仓库（公开）
gh repo create njunote --public --source=. --remote=origin

# 或者创建私有仓库
gh repo create njunote --private --source=. --remote=origin
```

---

## 步骤 2：推送代码

```bash
# 推送 master 分支
git push -u origin master

# 推送 feature 分支
git push origin feature/phase1-backend-auth
```

---

## 步骤 3：创建 Pull Request

```bash
# 切换到 feature 分支
git checkout feature/phase1-backend-auth

# 创建 PR
gh pr create \
  --title "Phase 1: Backend Authentication System" \
  --body "## 完成内容

- ✅ 用户注册/登录（JWT 认证）
- ✅ 三层架构（Controller → Service → DAO）
- ✅ 密码 SHA-256 哈希
- ✅ 数据库 schema 和迁移
- ✅ 14 个单元测试（100% 通过）
- ✅ 完整文档（SPEC, PLAN, AGENT_LOG, REFLECTION）

## 提交统计

- 19 commits in feature branch
- 18 files changed, 635 insertions(+)
- TDD: 严格遵循 RED-GREEN-REFACTOR

## 测试结果

\`\`\`
✅ Test Files  4 passed (4)
✅ Tests      14 passed (14)
⏱️ Duration   519ms
\`\`\`

## API 验证

所有端点已验证：
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

## 关键 Commits

- a10f6ac: TypeScript interfaces
- 68ac89a, 4c4b913, db2e1ef: JWT utilities (RED-GREEN-REFACTOR)
- bfbd9ec, 0a4e23b, e2950e6: User DAO (RED-GREEN-REFACTOR)
- 4292eaf, e1e54f3, 8b4e6ca: Auth Service (RED-GREEN-REFACTOR)
- 25edc2a, 5f29c79: Auth Middleware (RED-GREEN)

Closes #1" \
  --base master
```

---

## 步骤 4：配置 CI/CD Secrets

在 GitHub 网页上设置（如果需要 Docker）：

1. 进入仓库 → Settings → Secrets and variables → Actions
2. 添加以下 secrets：
   - `DOCKER_USERNAME`: 你的 Docker Hub 用户名
   - `DOCKER_PASSWORD`: 你的 Docker Hub 密码或 token

---

## 步骤 5：合并 PR（可选）

```bash
# 查看 PR 状态
gh pr status

# 合并 PR（在 CI 通过后）
gh pr merge --merge --delete-branch
```

---

## 验证 CI/CD

推送后，GitHub Actions 会自动运行：

1. 访问：https://github.com/YOUR_USERNAME/njunote/actions
2. 查看测试结果
3. 如果失败，点击查看日志

---

## 常见问题

**Q: 没有安装 GitHub CLI 怎么办？**

A: 使用传统 git 命令：

```bash
# 1. 在 GitHub 网页上手动创建仓库
# 2. 添加 remote
git remote add origin https://github.com/YOUR_USERNAME/njunote.git

# 3. 推送
git push -u origin master
git push origin feature/phase1-backend-auth

# 4. 在网页上手动创建 PR
```

**Q: 推送失败怎么办？**

A: 检查：
- 是否登录：`gh auth status`
- 仓库是否存在：`gh repo view`
- 网络连接是否正常

**Q: CI 失败怎么办？**

A: 常见原因：
- JWT_SECRET 未设置（已在 workflow 中配置）
- 依赖安装失败（检查 package.json）
- 测试失败（本地先运行 `npm test`）

---

## 完整命令序列（复制粘贴）

```bash
# 1. 登录
gh auth login

# 2. 创建仓库并推送
cd c:/Users/fengs/Desktop/njunote/quiz
gh repo create njunote --public --source=. --remote=origin
git push -u origin master
git push origin feature/phase1-backend-auth

# 3. 创建 PR
git checkout feature/phase1-backend-auth
gh pr create --title "Phase 1: Backend Authentication System" --body-file PR_BODY.md --base master

# 4. 查看状态
gh pr status
gh run list
```

---

## 🎉 完成后

- ✅ 代码已推送到 GitHub
- ✅ PR 已创建
- ✅ CI/CD 自动运行测试
- ✅ 可以在网页上查看所有内容

**仓库地址**: https://github.com/YOUR_USERNAME/njunote
