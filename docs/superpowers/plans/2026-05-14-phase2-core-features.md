# 实施计划：Phase 2 - 核心功能

**项目:** 图文笔记社区 (Note Community)  
**阶段:** Phase 2  
**日期:** 2026-05-14  
**目标:** 实现核心的笔记 CRUD 功能和对应的前端 UI，让用户可以发布和查看图文笔记。

---

## 1. 概述

本阶段是项目的核心。我们将构建后端 API 用于创建、读取、删除笔记（包含图片），并开发前端 UI 以支持这些操作。我们将遵循 TDD (测试驱动开发) 流程，确保后端逻辑的健壮性。前端将完成项目初始化并搭建关键页面，包括首页瀑布流、笔记详情页和发布弹窗。

---

## 2. 文件结构

在 Phase 2 结束时，项目将包含以下新增或修改的文件：

```
.
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── postController.ts       # 新增
│   │   ├── services/
│   │   │   └── postService.ts          # 新增
│   │   ├── dao/
│   │   │   └── postDAO.ts              # 新增
│   │   ├── middleware/
│   │   │   └── upload.ts               # 新增 (或修改)
│   │   ├── routes/
│   │   │   ├── index.ts                # 修改
│   │   │   └── postRoutes.ts           # 新增
│   │   └── types/
│   │       └── post.ts                 # 新增
│   └── tests/
│       ├── unit/
│       │   ├── dao/
│       │   │   └── postDAO.test.ts     # 新增
│       │   └── services/
│       │       └── postService.test.ts # 新增
│       └── integration/
│           └── api/
│               └── post.test.ts        # 新增
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.tsx            # 新增
│   │   │   ├── PostDetailPage.tsx      # 新增
│   │   │   ├── LoginPage.tsx           # 新增 (占位)
│   │   │   └── RegisterPage.tsx        # 新增 (占位)
│   │   ├── components/
│   │   │   ├── post/
│   │   │   │   ├── PostCard.tsx        # 新增
│   │   │   │   ├── PostGrid.tsx        # 新增
│   │   │   │   ├── ImageCarousel.tsx   # 新增
│   │   │   │   ├── CreatePostModal.tsx # 新增
│   │   │   │   └── ImageUpload.tsx     # 新增
│   │   │   └── layout/
│   │   │       ├── Header.tsx          # 新增
│   │   │       └── Layout.tsx          # 新增
│   │   ├── store/
│   │   │   └── postStore.ts            # 新增
│   │   ├── api/
│   │   │   └── posts.ts                # 新增
│   │   ├── hooks/
│   │   │   └── useMasonry.ts           # 新增
│   │   └── types/
│   │       └── post.ts                 # 新增
│   ├── tailwind.config.js              # 新增
│   ├── postcss.config.js               # 新增
│   └── vite.config.ts                  # 修改
└── docs/
    └── superpowers/
        └── plans/
            └── 2026-05-14-phase2-core-features.md # 本文件
```

---

## 3. 任务拆解

### 3.1 后端 (Backend)

#### 数据库层 (DAO)
- [ ] **Task 1: 创建 `postDAO.test.ts` 单元测试文件**
  - **TDD (RED):** 编写测试用例，用于测试 `createPost`, `findPostById`, `deletePostById`, `addImageToPost`。初始状态下，所有测试都应失败。
  - **验证:** 运行 `npm test`，确认看到相关测试失败。

- [ ] **Task 2: 实现 `postDAO.ts` - 笔记数据访问**
  - **TDD (GREEN):**
    - 实现 `createPost` 方法，向 `posts` 表插入数据并返回新 post。
    - 实现 `findPostById` 方法，根据 ID 查询 post 及其关联的图片。
    - 实现 `deletePostById` 方法，对 post 进行软删除（更新 `deleted_at` 字段）。
    - 实现 `addImageToPost` 方法，向 `post_images` 表插入图片记录。
  - **TDD (REFACTOR):** 检查 SQL 查询是否有优化空间，确保代码清晰。
  - **验证:** 再次运行 `npm test`，确认 `postDAO.test.ts` 中的所有测试都已通过。

#### 业务逻辑层 (Service)
- [ ] **Task 3: 创建 `postService.test.ts` 单元测试文件**
  - **TDD (RED):** 编写测试用例，模拟 `postDAO`。测试 `createPost` 业务逻辑（例如，参数验证、调用 DAO）、`deletePost` 权限检查。
  - **验证:** 运行 `npm test`，确认 `postService` 相关测试失败。

- [ ] **Task 4: 实现 `postService.ts` - 笔记业务逻辑**
  - **TDD (GREEN):**
    - `createPost`: 接收用户 ID、内容和图片文件，调用 `postDAO` 创建笔记和图片记录。
    - `getPostById`: 调用 `postDAO` 获取笔记详情。
    - `deletePost`: 检查操作用户是否为笔记作者，如果是，则调用 `postDAO` 进行软删除。
  - **TDD (REFACTOR):** 优化业务逻辑，确保代码可读性。
  - **验证:** 运行 `npm test`，确认 `postService.test.ts` 中的测试用例通过。

#### 接口层 (Controller & Routes)
- [ ] **Task 5: 实现 `upload.ts` 图片上传中间件**
  - 使用 `multer` 配置图片上传，包括目标目录、文件大小限制、文件类型过滤。
  - **验证:** 手动测试上传接口或在集成测试中验证。

- [ ] **Task 6: 实现 `postController.ts`**
  - `createPost`: 处理 `POST /api/posts` 请求，从 `req.user` 获取用户ID，从 `req.body` 获取内容，从 `req.files` 获取图片，调用 `postService`。
  - `getPostById`: 处理 `GET /api/posts/:id` 请求。
  - `deletePost`: 处理 `DELETE /api/posts/:id` 请求。
  - **验证:** 通过集成测试验证 Controller 的行为。

- [ ] **Task 7: 创建 `postRoutes.ts` 并集成到主路由**
  - 定义 `/api/posts` 的路由规则。
  - `POST /`: 使用 `authenticate` 和 `upload` 中间件。
  - `GET /:id`: 无需额外中间件。
  - `DELETE /:id`: 使用 `authenticate` 中间件。
  - 在 `src/routes/index.ts` 中挂载 `postRoutes`。
  - **验证:** 启动服务器，使用 API 工具（如 Postman）测试各个端点。

- [ ] **Task 8: 编写 `post.test.ts` API 集成测试**
  - 使用 `supertest` 测试 API 端点。
  - **Case 1:** 测试无 token 创建笔记，预期 401。
  - **Case 2:** 测试携带 token 成功创建图文笔记，预期 201。
  - **Case 3:** 测试获取存在的笔记，预期 200 和笔记数据。
  - **Case 4:** 测试删除他人笔记，预期 403。
  - **Case 5:** 测试删除自己笔记，预期 200 或 204。
  - **验证:** 运行 `npm test`，所有集成测试通过。

### 3.2 前端 (Frontend)

- [ ] **Task 9: 初始化前端项目**
  - 运行 `npm create vite@latest frontend -- --template react-ts`。
  - 安装依赖: `npm install axios zustand react-router-dom tailwindcss postcss autoprefixer`。
  - 初始化 Tailwind CSS: `npx tailwindcss init -p`。
  - **验证:** 运行 `npm run dev`，确认 Vite 开发服务器能正常启动。

- [ ] **Task 10: 基础布局和路由设置**
  - 创建 `Layout.tsx` 和 `Header.tsx` 作为基本页面框架。
  - 在 `App.tsx` 中配置路由，包含 `/` (HomePage), `/posts/:id` (PostDetailPage), `/login`, `/register`。
  - **验证:** 访问不同路径，确认对应的页面组件被渲染。

- [ ] **Task 11: 登录/注册占位页面**
  - 创建 `LoginPage.tsx` 和 `RegisterPage.tsx` 的基本 UI。
  - **注意:** 功能实现将放在 Phase 1，这里仅做 UI 占位。
  - **验证:** 访问 `/login` 和 `/register` 路径，能看到页面。

- [ ] **Task 12: 创建 `ImageUpload` 组件**
  - 实现图片选择、预览、删除已选图片的功能。
  - **验证:** 在页面上单独渲染该组件，测试其功能。

- [ ] **Task 13: 创建 `CreatePostModal` 发布弹窗组件**
  - 集成 `ImageUpload` 组件和文本输入框。
  - 实现“发布”按钮的逻辑，调用 API。
  - **验证:** 在首页 Header 中添加一个“发布”按钮，点击后能弹出此模态框。

- [ ] **Task 14: 创建 `PostCard` 和 `PostGrid` 组件**
  - `PostCard`: 显示笔记的封面图、标题/部分内容、作者头像和昵称。
  - `PostGrid`: 使用 `react-masonry-css` 或自定义 hook 实现瀑布流布局，接收笔记列表并渲染多个 `PostCard`。
  - **验证:** 使用假数据渲染 `PostGrid`，检查瀑布流布局是否正确。

- [ ] **Task 15: 实现 `HomePage` 首页**
  - 调用 `/api/posts` 获取笔记列表。
  - 使用 `PostGrid` 组件展示笔记瀑布流。
  - 集成 `CreatePostModal` 的触发按钮。
  - **验证:** 访问首页，应能看到后端返回的笔记数据以瀑布流形式展示。

- [ ] **Task 16: 实现 `PostDetailPage` 笔记详情页**
  - 根据 URL 中的 `:id` 参数，调用 `/api/posts/:id` 获取笔记详情。
  - 使用 `ImageCarousel` 组件展示所有图片。
  - 显示完整的笔记内容和作者信息。
  - **验证:** 在首页点击一个 `PostCard`，应能跳转到详情页并看到完整内容。

- [ ] **Task 17: (可选) 前端组件测试**
  - 使用 `vitest` 和 `react-testing-library` 为 `ImageUpload` 或 `PostCard` 等纯组件编写基础的渲染测试。
  - **验证:** 运行 `npm test`，确认前端测试通过。

---

## 4. 验证与验收

在 Phase 2 结束时，应满足以下条件：
1.  所有后端的单元测试和集成测试必须通过 (`npm run test`)。
2.  用户可以在前端通过 UI 完成以下流程：
    - 在首页看到所有已发布的笔记，呈现为瀑布流。
    - 点击任意笔记卡片，可以进入笔记详情页查看所有图片和全文。
    - 点击“发布”按钮，可以打开弹窗，上传 1-9 张图片并填写文字，成功发布笔记。
    - 新发布的笔记会出现在首页瀑布流的顶部。
3.  前后端代码均通过 Lint 检查，无类型错误。
