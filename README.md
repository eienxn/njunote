# 图文笔记社区 Web App （课程作业测试）

> AI4SE Final Project - Phase 1: Backend Authentication System

[![Status](https://img.shields.io/badge/Phase%201-Completed-success)]()
[![TDD](https://img.shields.io/badge/TDD-100%25-brightgreen)]()
[![Commits](https://img.shields.io/badge/Commits-19-blue)]()

## 📋 项目概述

一个类似 Pinterest/小红书的图文笔记社区平台，支持用户发布图文笔记、点赞、评论、关注等社交功能。

**当前状态**: Phase 1 完成 - 后端认证系统已实现

## 🎯 Phase 1 完成情况

### ✅ 已实现功能

- 用户注册（带密码 SHA-256 哈希）
- 用户登录（JWT token 生成）
- 受保护路由（JWT 认证中间件）
- 数据库 schema 和迁移脚本
- 三层架构（Controller → Service → DAO）
- 完整的单元测试（14 个测试用例）

### 📊 项目统计

- **代码文件**: 18 个文件
- **代码行数**: 635 行
- **提交数量**: 19 个提交
- **TDD 覆盖**: 100%（所有可测试任务遵循 RED-GREEN-REFACTOR）
- **文档**: 4 份完整文档（SPEC、PLAN、AGENT_LOG、REFLECTION）

## 🏗️ 技术架构

### 后端技术栈

- **运行时**: Node.js 18+
- **框架**: Express 5 + TypeScript
- **数据库**: SQLite (better-sqlite3)
- **认证**: JWT (jsonwebtoken)
- **测试**: Vitest
- **开发方法**: TDD (Test-Driven Development)

### 项目结构

```
backend/
├── src/
│   ├── types/index.ts              # TypeScript 接口定义
│   ├── utils/jwt.ts                # JWT 工具函数
│   ├── dao/userDAO.ts              # 用户数据访问层
│   ├── services/authService.ts     # 认证业务逻辑
│   ├── middleware/auth.ts          # JWT 认证中间件
│   ├── controllers/authController.ts # HTTP 请求处理
│   ├── routes/authRoutes.ts        # 路由定义
│   ├── config/database.ts          # 数据库连接
│   ├── db/
│   │   ├── schema.sql              # 数据库 schema
│   │   └── migrations/             # 迁移脚本
│   ├── app.ts                      # Express 应用配置
│   └── index.ts                    # 服务器入口
└── tests/
    └── unit/                       # 单元测试
```

## 🚀 快速开始

### 1. 环境要求

- Node.js >= 18
- npm >= 9

### 2. 安装依赖

```bash
cd backend
npm install
```

### 3. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
JWT_SECRET=your-secure-secret-key-here
PORT=3000
DATABASE_PATH=./data/database.sqlite
NODE_ENV=development
```

### 4. 初始化数据库

```bash
npm run migrate
```

### 5. 启动开发服务器

```bash
npm run dev
```

服务器将在 `http://localhost:3000` 启动。

### 6. 运行测试

```bash
npm test
```

## 📡 API 端点

### 认证相关

| 方法 | 端点 | 描述 | 认证 |
|------|------|------|------|
| POST | `/api/auth/register` | 用户注册 | ❌ |
| POST | `/api/auth/login` | 用户登录 | ❌ |
| GET | `/api/auth/me` | 获取当前用户信息 | ✅ |

### 请求示例

**注册**:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "nickname": "TestUser"
  }'
```

**登录**:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**获取当前用户**:
```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📚 文档

- **[SPEC.md](docs/superpowers/specs/2026-05-13-note-community-design.md)** - 完整的系统设计文档（1480 行）
- **[PLAN.md](docs/superpowers/plans/2026-05-13-phase1-backend-auth.md)** - Phase 1 实现计划（1262 行）
- **[AGENT_LOG.md](AGENT_LOG.md)** - 开发过程日志
- **[REFLECTION.md](REFLECTION.md)** - Phase 1 反思文档（2100 字）
- **[PHASE1_SUMMARY.md](PHASE1_SUMMARY.md)** - Phase 1 完成总结

## 🔒 安全特性

- ✅ 密码 SHA-256 哈希存储
- ✅ JWT_SECRET 环境变量强制要求
- ✅ Token 7 天过期时间
- ✅ 受保护路由的中间件验证
- ✅ 输入验证和错误处理
- ✅ 防止重复邮箱注册

## 🧪 测试

### 单元测试覆盖

- JWT 工具: 3 个测试
- User DAO: 4 个测试
- Auth Service: 4 个测试
- Auth Middleware: 3 个测试

**总计**: 14 个单元测试

### 运行测试

```bash
# 运行所有测试
npm test

# 运行特定测试文件
npm test tests/unit/utils/jwt.test.ts

# 查看测试覆盖率
npm run test:coverage
```

## 📈 开发流程

本项目严格遵循 **Superpowers** 工作流和 **TDD** 方法论：

### 1. Superpowers 工作流

1. ✅ **Brainstorming** - 生成详细的 SPEC.md
2. ✅ **Writing Plans** - 拆解为 14 个小任务
3. ✅ **Using Git Worktrees** - 独立 feature 分支开发
4. ✅ **Subagent-Driven Development** - 任务派发与执行
5. ✅ **Test-Driven Development** - RED-GREEN-REFACTOR 循环
6. ✅ **Requesting Code Review** - 两阶段代码评审
7. ✅ **Finishing Development Branch** - 合并到 master

### 2. TDD 提交规范

每个任务遵循三阶段提交：

- **RED**: 编写失败测试 `test: add failing tests for XXX (RED)`
- **GREEN**: 最小实现通过测试 `feat: implement XXX (GREEN)`
- **REFACTOR**: 改进代码质量 `refactor: improve XXX (REFACTOR)`

### 3. Git 提交历史

```
* d60e84e docs: add Phase 1 reflection document
*   33c49e6 Merge feature/phase1-backend-auth
|\  
| * 8dcd75a docs: add Phase 1 completion summary
| * 6f91a4f feat: add auth routes, express app, and server entry point
| * 6ff18a0 feat: add auth controller
| * c7bd6cc feat: add database migration script
| * 7e09899 feat: add database schema
| * a8fbf17 feat: add database configuration
| * 5f29c79 feat: implement authentication middleware (GREEN)
| * 25edc2a test: add failing tests for auth middleware (RED)
| * 8b4e6ca refactor: add password hashing (REFACTOR)
| * e1e54f3 feat: implement auth service (GREEN)
| * 4292eaf test: add failing tests for auth service (RED)
| * e2950e6 refactor: add error handling (REFACTOR)
| * 0a4e23b feat: implement user DAO (GREEN)
| * bfbd9ec test: add failing tests for user DAO (RED)
| * db2e1ef refactor: enforce JWT_SECRET (REFACTOR)
| * 4c4b913 feat: implement JWT utilities (GREEN)
| * 68ac89a test: add failing tests for JWT utilities (RED)
| * a10f6ac feat: add TypeScript type definitions
```

## 🎯 下一步计划

### Phase 2: 核心功能

- [ ] 笔记 CRUD（创建、读取、删除）
- [ ] 图片上传和存储
- [ ] 点赞和收藏功能
- [ ] 评论系统
- [ ] 用户关注功能

### Phase 3: 前端开发

- [ ] React + TypeScript 前端
- [ ] 瀑布流布局
- [ ] 图片轮播
- [ ] 实时通知

### Phase 4: 部署

- [ ] Docker 容器化
- [ ] GitHub Actions CI/CD
- [ ] 云平台部署（Vercel/Railway）

## 🤝 贡献

本项目是 AI4SE Final Project，使用 Claude Code + Superpowers 开发。

## 📄 许可证

MIT License

## 👤 作者

- **开发框架**: Claude Code (Anthropic)
- **工作流**: Superpowers
- **开发方法**: TDD (Test-Driven Development)

---

**最后更新**: 2026-05-14  
**当前版本**: Phase 1 (Backend Authentication)
