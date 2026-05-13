# 🚀 GitHub 推送指南（无需 GitHub CLI）

## 方案：使用传统 Git 命令

### 步骤 1：在 GitHub 网页创建仓库

1. 打开浏览器访问：https://github.com/new
2. 填写信息：
   - Repository name: `njunote`
   - Description: `图文笔记社区 - AI4SE Final Project`
   - 选择 **Public**（公开）或 **Private**（私有）
   - ❌ **不要**勾选 "Initialize this repository with a README"
3. 点击 **Create repository**

### 步骤 2：添加 Remote 并推送

复制粘贴以下命令（替换 YOUR_USERNAME）：

```bash
cd c:/Users/fengs/Desktop/njunote/quiz

# 添加 remote（替换 YOUR_USERNAME 为你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/njunote.git

# 推送 master 分支
git push -u origin master

# 推送 feature 分支
git push origin feature/phase1-backend-auth
```

**如果推送时要求输入密码：**
- GitHub 已不支持密码登录
- 需要使用 **Personal Access Token (PAT)**

### 步骤 3：创建 Personal Access Token（如果需要）

1. 访问：https://github.com/settings/tokens
2. 点击 **Generate new token** → **Generate new token (classic)**
3. 设置：
   - Note: `njunote-project`
   - Expiration: `90 days`
   - 勾选权限：`repo`（全部）
4. 点击 **Generate token**
5. **复制 token**（只显示一次！）

**使用 token 推送：**
```bash
# 当提示输入密码时，粘贴 token（不是你的 GitHub 密码）
git push -u origin master
```

### 步骤 4：在网页创建 Pull Request

1. 推送成功后，访问：https://github.com/YOUR_USERNAME/njunote
2. 会看到黄色提示条：`feature/phase1-backend-auth had recent pushes`
3. 点击 **Compare & pull request**
4. 填写 PR 信息：

**Title:**
```
Phase 1: Backend Authentication System
```

**Description:**
```markdown
## ✅ 完成内容

- 用户注册/登录（JWT 认证）
- 三层架构（Controller → Service → DAO）
- 密码 SHA-256 哈希
- 数据库 schema 和迁移
- 14 个单元测试（100% 通过）
- 完整文档（SPEC, PLAN, AGENT_LOG, REFLECTION）

## 📊 提交统计

- **19 commits** in feature branch
- **18 files** changed, **635 insertions(+)**
- **TDD**: 严格遵循 RED-GREEN-REFACTOR

## 🧪 测试结果

\`\`\`
✅ Test Files  4 passed (4)
✅ Tests      14 passed (14)
⏱️ Duration   519ms
\`\`\`

## 🔌 API 端点

所有端点已验证：
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户（需认证）

## 🔑 关键 Commits

- `a10f6ac`: TypeScript interfaces
- `68ac89a`, `4c4b913`, `db2e1ef`: JWT utilities (RED-GREEN-REFACTOR)
- `bfbd9ec`, `0a4e23b`, `e2950e6`: User DAO (RED-GREEN-REFACTOR)
- `4292eaf`, `e1e54f3`, `8b4e6ca`: Auth Service (RED-GREEN-REFACTOR)
- `25edc2a`, `5f29c79`: Auth Middleware (RED-GREEN)

## 📁 文档

- [SPEC.md](docs/superpowers/specs/2026-05-13-note-community-design.md) - 1,480 行设计文档
- [PLAN.md](docs/superpowers/plans/2026-05-13-phase1-backend-auth.md) - 1,262 行实现计划
- [AGENT_LOG.md](AGENT_LOG.md) - 开发过程日志
- [REFLECTION.md](REFLECTION.md) - 2,100 字反思文档
```

5. 点击 **Create pull request**

### 步骤 5：配置 GitHub Actions Secrets（可选）

如果要启用 Docker 构建：

1. 进入仓库 → **Settings** → **Secrets and variables** → **Actions**
2. 点击 **New repository secret**
3. 添加：
   - Name: `DOCKER_USERNAME`，Value: 你的 Docker Hub 用户名
   - Name: `DOCKER_PASSWORD`，Value: 你的 Docker Hub 密码

---

## 🎯 完整命令（复制粘贴）

```bash
# 1. 添加 remote（替换 YOUR_USERNAME）
cd c:/Users/fengs/Desktop/njunote/quiz
git remote add origin https://github.com/YOUR_USERNAME/njunote.git

# 2. 推送代码
git push -u origin master
git push origin feature/phase1-backend-auth

# 3. 然后在网页上创建 PR
```

---

## ❓ 常见问题

**Q: 推送时提示 "remote: Support for password authentication was removed"**

A: 需要使用 Personal Access Token，参考步骤 3

**Q: 推送失败 "failed to push some refs"**

A: 可能是仓库已有内容，使用：
```bash
git pull origin master --allow-unrelated-histories
git push -u origin master
```

**Q: 如何查看我的 GitHub 用户名？**

A: 访问 https://github.com/settings/profile，查看 "Public profile" 中的 Username

---

## ✅ 完成后验证

1. 访问：`https://github.com/YOUR_USERNAME/njunote`
2. 应该能看到：
   - ✅ master 分支有 26 个 commits
   - ✅ feature/phase1-backend-auth 分支
   - ✅ Pull Request #1
   - ✅ GitHub Actions 正在运行（黄色圆点）

3. 点击 **Actions** 标签查看 CI 运行状态

---

## 🎉 大功告成！

所有代码、文档、CI/CD 配置都已准备好，只需要：
1. 在 GitHub 网页创建仓库
2. 运行 3 条 git 命令
3. 在网页上点击创建 PR

**预计时间**: 5-10 分钟
