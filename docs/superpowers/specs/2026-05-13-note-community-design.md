# 图文笔记社区 Web App - 设计规约

**项目名称：** 图文笔记社区（Note Community）  
**设计日期：** 2026-05-13  
**设计者：** AI Assistant + User  
**版本：** 1.0

---

## 1. 问题陈述

### 1.1 要解决什么问题？

当前市场上缺少一个轻量级、易用的图文笔记分享平台，让用户能够：
- 快速发布"文字 + 多图"的笔记内容
- 通过标签和关注发现感兴趣的内容
- 与其他用户进行简单的社交互动（点赞、收藏、评论）

### 1.2 目标用户

- **学生**：分享读书笔记、学习心得、摘抄
- **摄影爱好者**：展示照片作品并配简短说明
- **兴趣社群**：通过话题标签聚集同好（如 #手账、#旅行、#美食）

### 1.3 为什么值得做？

- **学习价值**：作为 AI4SE 课程期末项目，综合运用 Superpowers 框架进行规约驱动开发
- **实用价值**：提供一个真实可用的社区平台原型
- **技术价值**：实践前后端分离、TDD、容器化部署等现代工程实践

### 1.4 典型使用场景（30秒流程）

```
用户打开首页 
→ 看到瀑布流中一张吸引人的图片 
→ 点击进入详情页，左右滑动查看 6 张图 
→ 点赞并收藏 
→ 关注作者 
→ 在评论区 @ 朋友 
→ 点击 #手账 标签查看更多相关内容
```

---

## 2. 用户故事

### US-1: 用户注册与登录
**作为** 新用户  
**我想要** 使用邮箱和密码注册账号  
**以便** 开始使用平台功能

**验收标准：**
- 邮箱格式验证
- 昵称长度 1-20 字符
- 可选择 emoji 作为头像
- 可填写个人简介（≤80字）

### US-2: 发布图文笔记
**作为** 登录用户  
**我想要** 发布包含 1-9 张图片和文字说明的笔记  
**以便** 分享我的内容给其他用户

**验收标准：**
- 文字内容 ≤500 字
- 支持上传 1-9 张图片（JPG/PNG/WebP，单张 ≤2MB）
- 自动识别 #标签 和 @提及
- 发布成功后显示在首页流中

### US-3: 浏览内容流
**作为** 用户  
**我想要** 在首页看到所有用户的笔记，按时间倒序排列  
**以便** 发现新内容

**验收标准：**
- 双列瀑布流布局
- 图片按真实纵横比显示
- 懒加载（滚动到底部自动加载更多）
- Cursor-based 分页

### US-4: 社交互动
**作为** 用户  
**我想要** 对喜欢的笔记进行点赞、收藏、评论  
**以便** 与作者和其他用户互动

**验收标准：**
- 点赞：每人每条笔记最多点一次，再点取消
- 收藏：独立于点赞，可在个人主页查看收藏列表
- 评论：单层评论，≤200字，按时间倒序

### US-5: 关注与关注流
**作为** 用户  
**我想要** 关注感兴趣的用户  
**以便** 在关注流中只看到他们的内容

**验收标准：**
- 可关注/取关任意其他用户
- 不能关注自己
- 关注流只显示已关注用户的笔记

### US-6: 话题标签
**作为** 用户  
**我想要** 通过点击 #标签 查看相关主题的所有笔记  
**以便** 发现更多同类内容

**验收标准：**
- 笔记中的 #标签 自动识别并可点击
- 话题页展示该标签下的所有笔记（瀑布流）
- 首页侧栏显示近7天热门话题 Top 10

### US-7: 搜索功能
**作为** 用户  
**我想要** 搜索笔记内容和用户昵称  
**以便** 快速找到感兴趣的内容或人

**验收标准：**
- 顶部搜索框
- 两个 tab：笔记（全文搜索）/ 用户（昵称搜索）
- 搜索结果中关键词高亮

### US-8: 通知中心
**作为** 用户  
**我想要** 收到点赞、评论、关注、@提及的通知  
**以便** 及时了解互动情况

**验收标准：**
- 顶部铃铛图标显示未读数红点
- 通知列表显示所有通知
- 可一键全部标记已读
- 前端每30秒轮询未读数

---

## 3. 系统架构

### 3.1 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        用户浏览器                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         React SPA (Vite + TypeScript)                │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │   │
│  │  │   Pages    │  │ Components │  │  Zustand   │    │   │
│  │  │  (路由页面) │  │ (UI组件)   │  │ (状态管理)  │    │   │
│  │  └────────────┘  └────────────┘  └────────────┘    │   │
│  │         ↓ Tailwind + Open Design (Linear)           │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/REST API
┌─────────────────────────────────────────────────────────────┐
│                    后端服务器 (Node.js)                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Express + TypeScript                    │   │
│  │                                                       │   │
│  │  ┌────────────────────────────────────────────────┐ │   │
│  │  │  Controller 层 (路由 + 请求处理)                │ │   │
│  │  │  /api/auth, /api/posts, /api/users, etc.      │ │   │
│  │  └────────────────────────────────────────────────┘ │   │
│  │                      ↓                               │   │
│  │  ┌────────────────────────────────────────────────┐ │   │
│  │  │  Service 层 (业务逻辑)                          │ │   │
│  │  │  AuthService, PostService, UserService, etc.   │ │   │
│  │  └────────────────────────────────────────────────┘ │   │
│  │                      ↓                               │   │
│  │  ┌────────────────────────────────────────────────┐ │   │
│  │  │  DAO 层 (数据访问)                              │ │   │
│  │  │  UserDAO, PostDAO, LikeDAO, etc.               │ │   │
│  │  └────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    持久化层                                   │
│  ┌──────────────┐              ┌──────────────┐            │
│  │   SQLite DB  │              │  文件系统     │            │
│  │  (数据存储)   │              │ (图片存储)    │            │
│  └──────────────┘              └──────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 架构设计决策

**前后端分离**
- 前端：React SPA，通过 REST API 与后端通信
- 后端：Express API 服务器，无状态设计
- 优势：职责清晰，前后端可并行开发，易于测试

**三层架构（后端）**
- Controller 层：处理 HTTP 请求/响应，参数验证
- Service 层：业务逻辑，事务管理
- DAO 层：数据库操作，SQL 查询封装
- 优势：职责单一，易于单元测试，符合 TDD 要求

**无状态 API**
- 使用 JWT token 进行身份验证
- Token 存储在前端 localStorage
- 每次请求在 Header 中携带 token

**本地存储**
- SQLite 数据库（单文件，零配置）
- 本地文件系统存储图片
- Docker volume 持久化数据

---

## 4. 数据模型

### 4.1 实体关系图（ER Diagram）

```
users ──┬─< posts ──┬─< post_images
        │           ├─< likes
        │           ├─< bookmarks
        │           ├─< comments
        │           └─< post_tags >── tags
        │
        ├─< follows (follower/followee)
        ├─< notifications
        └─< mentions
```

### 4.2 数据库表结构

#### 4.2.1 users（用户表）
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,        -- 明文存储（快速原型）
  nickname TEXT NOT NULL,        -- 1-20字符
  avatar TEXT NOT NULL,          -- emoji字符
  bio TEXT DEFAULT '',           -- ≤80字
  created_at INTEGER NOT NULL,   -- Unix timestamp
  updated_at INTEGER NOT NULL
);
```

#### 4.2.2 posts（笔记表）
```sql
CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  content TEXT NOT NULL,         -- ≤500字
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  deleted_at INTEGER,            -- 软删除
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### 4.2.3 post_images（笔记图片表）
```sql
CREATE TABLE post_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL,
  image_path TEXT NOT NULL,      -- 文件路径
  position INTEGER NOT NULL,      -- 图片顺序 1-9
  created_at INTEGER NOT NULL,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);
```

#### 4.2.4 likes（点赞表）
```sql
CREATE TABLE likes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  post_id INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  UNIQUE(user_id, post_id),      -- 每人每条笔记只能点赞一次
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);
```

#### 4.2.5 bookmarks（收藏表）
```sql
CREATE TABLE bookmarks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  post_id INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  UNIQUE(user_id, post_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);
```

#### 4.2.6 comments（评论表）
```sql
CREATE TABLE comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  content TEXT NOT NULL,         -- ≤200字
  created_at INTEGER NOT NULL,
  deleted_at INTEGER,            -- 软删除
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### 4.2.7 follows（关注关系表）
```sql
CREATE TABLE follows (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  follower_id INTEGER NOT NULL,  -- 关注者
  followee_id INTEGER NOT NULL,  -- 被关注者
  created_at INTEGER NOT NULL,
  UNIQUE(follower_id, followee_id),
  CHECK(follower_id != followee_id),  -- 不能关注自己
  FOREIGN KEY (follower_id) REFERENCES users(id),
  FOREIGN KEY (followee_id) REFERENCES users(id)
);
```

#### 4.2.8 tags（标签表）
```sql
CREATE TABLE tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,     -- 标签名（不含#）
  created_at INTEGER NOT NULL
);
```

#### 4.2.9 post_tags（笔记-标签关联表）
```sql
CREATE TABLE post_tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  UNIQUE(post_id, tag_id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id)
);
```

#### 4.2.10 notifications（通知表）
```sql
CREATE TABLE notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,      -- 接收通知的用户
  type TEXT NOT NULL,             -- 'like', 'comment', 'follow', 'mention'
  actor_id INTEGER NOT NULL,      -- 触发通知的用户
  post_id INTEGER,                -- 相关笔记（可选）
  comment_id INTEGER,             -- 相关评论（可选）
  is_read INTEGER DEFAULT 0,      -- 0=未读, 1=已读
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (actor_id) REFERENCES users(id)
);
```

#### 4.2.11 mentions（@提及表）
```sql
CREATE TABLE mentions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER,                -- 笔记中的提及
  comment_id INTEGER,             -- 评论中的提及
  mentioned_user_id INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
  FOREIGN KEY (mentioned_user_id) REFERENCES users(id)
);
```

#### 4.2.12 posts_fts（全文搜索虚拟表）
```sql
CREATE VIRTUAL TABLE posts_fts USING fts5(
  content,
  content=posts,
  content_rowid=id
);
```

### 4.3 索引设计
```sql
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_likes_post_id ON likes(post_id);
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_follows_follower ON follows(follower_id);
CREATE INDEX idx_follows_followee ON follows(followee_id);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX idx_post_tags_tag_id ON post_tags(tag_id);
```

---

## 5. API 设计

### 5.1 RESTful API 端点

#### 认证相关 `/api/auth`
```
POST   /api/auth/register          # 注册
POST   /api/auth/login             # 登录
GET    /api/auth/me                # 获取当前用户信息
```

#### 用户相关 `/api/users`
```
GET    /api/users/:id              # 获取用户信息
PUT    /api/users/:id              # 更新用户信息（昵称/头像/bio）
GET    /api/users/:id/posts        # 获取用户的笔记列表
GET    /api/users/:id/bookmarks    # 获取用户的收藏列表（仅本人可见）
GET    /api/users/search?q=        # 搜索用户（按昵称）
```

#### 笔记相关 `/api/posts`
```
POST   /api/posts                  # 创建笔记（含图片上传）
GET    /api/posts/:id              # 获取笔记详情
DELETE /api/posts/:id              # 删除笔记（软删除）
GET    /api/posts                  # 获取首页流（所有笔记，瀑布流分页）
GET    /api/posts/following        # 获取关注流（仅关注的人）
GET    /api/posts/search?q=        # 搜索笔记（全文搜索）
```

#### 点赞相关 `/api/likes`
```
POST   /api/posts/:id/like         # 点赞
DELETE /api/posts/:id/like         # 取消点赞
```

#### 收藏相关 `/api/bookmarks`
```
POST   /api/posts/:id/bookmark     # 收藏
DELETE /api/posts/:id/bookmark     # 取消收藏
```

#### 评论相关 `/api/comments`
```
POST   /api/posts/:id/comments     # 发表评论
GET    /api/posts/:id/comments     # 获取笔记的评论列表
DELETE /api/comments/:id           # 删除评论（仅作者）
```

#### 关注相关 `/api/follows`
```
POST   /api/users/:id/follow       # 关注用户
DELETE /api/users/:id/follow       # 取关用户
GET    /api/users/:id/followers    # 获取粉丝列表
GET    /api/users/:id/following    # 获取关注列表
```

#### 标签相关 `/api/tags`
```
GET    /api/tags/:name/posts       # 获取某标签下的所有笔记
GET    /api/tags/trending          # 获取热门标签（近7天 Top 10）
```

#### 通知相关 `/api/notifications`
```
GET    /api/notifications          # 获取通知列表
GET    /api/notifications/unread   # 获取未读通知数
PUT    /api/notifications/read-all # 全部标记已读
```

### 5.2 统一响应格式

#### 成功响应
```json
{
  "success": true,
  "data": { ... }
}
```

#### 错误响应
```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "昵称长度必须在1-20字符之间"
  }
}
```

### 5.3 分页格式（Cursor-based）

#### 请求参数
```
GET /api/posts?cursor=123&limit=20
```

#### 响应
```json
{
  "success": true,
  "data": {
    "items": [...],
    "nextCursor": 145,
    "hasMore": true
  }
}
```

### 5.4 认证机制

- 登录成功后返回 JWT token
- 前端存储在 localStorage
- 需要认证的请求在 Header 中携带：`Authorization: Bearer <token>`
- Token 包含：`{ userId, email, exp }`
- Token 有效期：7 天

### 5.5 图片上传

- 使用 `multipart/form-data`
- 单张图片 ≤ 2MB
- 支持格式：JPG, PNG, WebP
- 后端验证 MIME type
- 文件重命名为 UUID，存储在 `uploads/images/` 目录
- 返回图片访问路径：`/uploads/images/{uuid}.jpg`

### 5.6 错误码定义

| 错误码 | HTTP 状态码 | 说明 |
|--------|------------|------|
| INVALID_INPUT | 400 | 请求参数验证失败 |
| UNAUTHORIZED | 401 | 未登录或 token 无效 |
| FORBIDDEN | 403 | 无权限执行此操作 |
| NOT_FOUND | 404 | 资源不存在 |
| CONFLICT | 409 | 资源冲突（如重复点赞） |
| INTERNAL_ERROR | 500 | 服务器内部错误 |

---

## 6. 前端架构

### 6.1 目录结构
```
frontend/
├── src/
│   ├── main.tsx                 # 入口文件
│   ├── App.tsx                  # 根组件
│   ├── pages/                   # 页面组件
│   │   ├── HomePage.tsx         # 首页（瀑布流）
│   │   ├── FollowingPage.tsx    # 关注流
│   │   ├── PostDetailPage.tsx   # 笔记详情
│   │   ├── UserProfilePage.tsx  # 个人主页
│   │   ├── TagPage.tsx          # 话题页
│   │   ├── SearchPage.tsx       # 搜索结果页
│   │   ├── NotificationsPage.tsx # 通知中心
│   │   ├── LoginPage.tsx        # 登录
│   │   └── RegisterPage.tsx     # 注册
│   ├── components/              # 可复用组件
│   │   ├── layout/
│   │   │   ├── Header.tsx       # 顶部导航栏
│   │   │   ├── Sidebar.tsx      # 侧边栏（热门标签）
│   │   │   └── Layout.tsx       # 布局容器
│   │   ├── post/
│   │   │   ├── PostCard.tsx     # 笔记卡片（瀑布流项）
│   │   │   ├── PostGrid.tsx     # 瀑布流容器
│   │   │   ├── ImageCarousel.tsx # 图片轮播
│   │   │   └── CreatePostModal.tsx # 发笔记弹窗
│   │   ├── comment/
│   │   │   ├── CommentList.tsx  # 评论列表
│   │   │   └── CommentInput.tsx # 评论输入框
│   │   ├── user/
│   │   │   ├── UserAvatar.tsx   # 用户头像
│   │   │   ├── UserCard.tsx     # 用户卡片
│   │   │   └── FollowButton.tsx # 关注按钮
│   │   └── common/
│   │       ├── Button.tsx       # 按钮
│   │       ├── Input.tsx        # 输入框
│   │       ├── Modal.tsx        # 模态框
│   │       ├── Loading.tsx      # 加载状态
│   │       └── EmojiPicker.tsx  # Emoji 选择器
│   ├── store/                   # Zustand 状态管理
│   │   ├── authStore.ts         # 认证状态
│   │   ├── postStore.ts         # 笔记状态
│   │   ├── notificationStore.ts # 通知状态
│   │   └── uiStore.ts           # UI 状态（模态框等）
│   ├── api/                     # API 调用封装
│   │   ├── client.ts            # Axios 实例配置
│   │   ├── auth.ts              # 认证相关 API
│   │   ├── posts.ts             # 笔记相关 API
│   │   ├── users.ts             # 用户相关 API
│   │   ├── comments.ts          # 评论相关 API
│   │   └── notifications.ts     # 通知相关 API
│   ├── hooks/                   # 自定义 Hooks
│   │   ├── useAuth.ts           # 认证逻辑
│   │   ├── useInfiniteScroll.ts # 无限滚动
│   │   ├── useMasonry.ts        # 瀑布流布局
│   │   └── useNotifications.ts  # 通知轮询
│   ├── utils/                   # 工具函数
│   │   ├── formatDate.ts        # 日期格式化
│   │   ├── parseContent.ts      # 解析 #标签 和 @提及
│   │   └── imageUpload.ts       # 图片上传处理
│   └── types/                   # TypeScript 类型定义
│       ├── user.ts
│       ├── post.ts
│       ├── comment.ts
│       └── api.ts
├── public/
│   └── uploads/                 # 开发环境图片存储
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

### 6.2 核心技术实现

#### 6.2.1 瀑布流布局（Masonry）
- 使用 `react-masonry-css` 或自定义实现
- 双列布局，响应式（移动端单列）
- 图片按真实纵横比显示
- 懒加载：使用 Intersection Observer API

#### 6.2.2 图片轮播
- 左右按钮切换
- 键盘 ← → 支持
- 底部小圆点指示器
- 触摸滑动支持（移动端）

#### 6.2.3 无限滚动
- 使用 Intersection Observer 监听底部元素
- Cursor-based 分页
- 加载状态提示

#### 6.2.4 内容解析
- 正则匹配 `#标签` 和 `@昵称`
- 渲染为可点击链接
- 搜索结果高亮关键词

#### 6.2.5 通知轮询
- 每 30 秒请求 `/api/notifications/unread`
- 更新顶部铃铛红点
- 使用 `setInterval` + cleanup

#### 6.2.6 Open Design (Linear) 集成
- 使用 Linear 设计系统的组件和样式
- 黑白灰配色方案
- 简洁现代的 UI 风格

### 6.3 路由设计
```typescript
/                    → HomePage（首页流）
/following           → FollowingPage（关注流）
/posts/:id           → PostDetailPage（笔记详情）
/users/:id           → UserProfilePage（个人主页）
/tags/:name          → TagPage（话题页）
/search              → SearchPage（搜索结果）
/notifications       → NotificationsPage（通知中心）
/login               → LoginPage
/register            → RegisterPage
```

### 6.4 状态管理示例（Zustand）

```typescript
// authStore.ts
interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  login: async (email, password) => {
    const response = await authAPI.login(email, password);
    localStorage.setItem('token', response.token);
    set({ user: response.user, token: response.token });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
  updateProfile: async (data) => {
    const user = await userAPI.updateProfile(data);
    set({ user });
  }
}));
```

### 6.5 开发环境配置

**vite.config.ts 代理配置**
```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/uploads': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})
```

---

## 7. 后端架构

### 7.1 目录结构
```
backend/
├── src/
│   ├── index.ts                 # 入口文件
│   ├── app.ts                   # Express 应用配置
│   ├── config/
│   │   ├── database.ts          # SQLite 数据库连接
│   │   └── jwt.ts               # JWT 配置
│   ├── controllers/             # Controller 层（路由处理）
│   │   ├── authController.ts    # 认证相关
│   │   ├── userController.ts    # 用户相关
│   │   ├── postController.ts    # 笔记相关
│   │   ├── commentController.ts # 评论相关
│   │   ├── likeController.ts    # 点赞相关
│   │   ├── bookmarkController.ts # 收藏相关
│   │   ├── followController.ts  # 关注相关
│   │   ├── tagController.ts     # 标签相关
│   │   ├── searchController.ts  # 搜索相关
│   │   └── notificationController.ts # 通知相关
│   ├── services/                # Service 层（业务逻辑）
│   │   ├── authService.ts
│   │   ├── userService.ts
│   │   ├── postService.ts
│   │   ├── commentService.ts
│   │   ├── likeService.ts
│   │   ├── bookmarkService.ts
│   │   ├── followService.ts
│   │   ├── tagService.ts
│   │   ├── searchService.ts
│   │   ├── notificationService.ts
│   │   └── mentionService.ts    # @ 提及解析
│   ├── dao/                     # DAO 层（数据访问）
│   │   ├── userDAO.ts
│   │   ├── postDAO.ts
│   │   ├── commentDAO.ts
│   │   ├── likeDAO.ts
│   │   ├── bookmarkDAO.ts
│   │   ├── followDAO.ts
│   │   ├── tagDAO.ts
│   │   ├── notificationDAO.ts
│   │   └── mentionDAO.ts
│   ├── middleware/              # 中间件
│   │   ├── auth.ts              # JWT 认证中间件
│   │   ├── errorHandler.ts      # 错误处理
│   │   ├── validator.ts         # 请求参数验证
│   │   └── upload.ts            # 图片上传处理
│   ├── routes/                  # 路由定义
│   │   ├── index.ts             # 路由汇总
│   │   ├── authRoutes.ts
│   │   ├── userRoutes.ts
│   │   ├── postRoutes.ts
│   │   ├── commentRoutes.ts
│   │   ├── likeRoutes.ts
│   │   ├── bookmarkRoutes.ts
│   │   ├── followRoutes.ts
│   │   ├── tagRoutes.ts
│   │   ├── searchRoutes.ts
│   │   └── notificationRoutes.ts
│   ├── utils/                   # 工具函数
│   │   ├── jwt.ts               # JWT 生成/验证
│   │   ├── response.ts          # 统一响应格式
│   │   ├── parseContent.ts      # 解析 #标签 和 @昵称
│   │   └── imageProcessor.ts    # 图片处理（验证/重命名）
│   ├── types/                   # TypeScript 类型定义
│   │   ├── user.ts
│   │   ├── post.ts
│   │   ├── comment.ts
│   │   └── express.d.ts         # Express 扩展类型
│   └── db/                      # 数据库相关
│       ├── schema.sql           # 数据库表结构
│       ├── migrations/          # 数据库迁移脚本
│       └── seeds/               # 测试数据
├── tests/                       # 测试文件
│   ├── unit/                    # 单元测试
│   │   ├── services/
│   │   └── dao/
│   ├── integration/             # 集成测试
│   │   └── api/
│   └── setup.ts                 # 测试环境配置
├── uploads/                     # 图片存储目录
│   └── images/
├── tsconfig.json
├── package.json
└── vitest.config.ts
```

### 7.2 三层架构职责划分

#### Controller 层
- 接收 HTTP 请求
- 参数验证（使用 validator 中间件）
- 调用 Service 层
- 返回统一格式的响应
- **不包含业务逻辑**

#### Service 层
- 业务逻辑处理
- 事务管理
- 调用多个 DAO 完成复杂操作
- 例如：创建笔记时同时处理图片、提取标签、创建提及通知

#### DAO 层
- 纯数据库操作
- SQL 查询封装
- **不包含业务逻辑**
- 返回原始数据

### 7.3 关键实现逻辑

#### 7.3.1 创建笔记流程（Service 层）
```typescript
async createPost(userId: number, content: string, images: File[]) {
  // 1. 创建笔记记录
  const post = await postDAO.create(userId, content);
  
  // 2. 保存图片
  for (let i = 0; i < images.length; i++) {
    const imagePath = await imageProcessor.save(images[i]);
    await postDAO.addImage(post.id, imagePath, i + 1);
  }
  
  // 3. 提取并创建标签
  const tags = parseContent.extractTags(content);
  for (const tag of tags) {
    const tagId = await tagDAO.findOrCreate(tag);
    await tagDAO.linkToPost(post.id, tagId);
  }
  
  // 4. 提取 @ 提及并创建通知
  const mentions = parseContent.extractMentions(content);
  for (const nickname of mentions) {
    const user = await userDAO.findByNickname(nickname);
    if (user) {
      await mentionDAO.create(post.id, null, user.id);
      await notificationService.createMention(user.id, userId, post.id);
    }
  }
  
  return post;
}
```

#### 7.3.2 通知触发逻辑
- **点赞**：创建 'like' 类型通知
- **评论**：创建 'comment' 类型通知
- **关注**：创建 'follow' 类型通知
- **@ 提及**：创建 'mention' 类型通知
- **不给自己发通知**（点赞自己的笔记不通知）

#### 7.3.3 软删除实现
- posts 和 comments 表有 `deleted_at` 字段
- 删除时设置 `deleted_at = 当前时间`
- 查询时过滤 `WHERE deleted_at IS NULL`
- 保留点赞/评论历史数据

#### 7.3.4 全文搜索（FTS5）
```sql
-- 搜索笔记
SELECT posts.* FROM posts
JOIN posts_fts ON posts.id = posts_fts.rowid
WHERE posts_fts MATCH '关键词'
AND posts.deleted_at IS NULL
ORDER BY posts.created_at DESC;
```

#### 7.3.5 热门标签统计
```sql
SELECT tags.name, COUNT(*) as count
FROM tags
JOIN post_tags ON tags.id = post_tags.tag_id
JOIN posts ON post_tags.post_id = posts.id
WHERE posts.created_at >= (当前时间 - 7天)
AND posts.deleted_at IS NULL
GROUP BY tags.id
ORDER BY count DESC
LIMIT 10;
```

### 7.4 中间件设计

#### 7.4.1 认证中间件（auth.ts）
```typescript
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED' } });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED' } });
  }
};
```

#### 7.4.2 错误处理中间件（errorHandler.ts）
```typescript
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: err.message
    }
  });
};
```

#### 7.4.3 图片上传中间件（upload.ts）
```typescript
import multer from 'multer';

const storage = multer.diskStorage({
  destination: './uploads/images',
  filename: (req, file, cb) => {
    const uuid = crypto.randomUUID();
    const ext = path.extname(file.originalname);
    cb(null, `${uuid}${ext}`);
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});
```

### 7.5 数据库连接配置

```typescript
// config/database.ts
import Database from 'better-sqlite3';

const db = new Database(process.env.DATABASE_PATH || './data/database.sqlite');

// 启用外键约束
db.pragma('foreign_keys = ON');

// 性能优化
db.pragma('journal_mode = WAL');

export default db;
```

---

## 8. 部署方案

### 8.1 Docker 部署架构

**目录结构**
```
project-root/
├── frontend/
├── backend/
├── docker-compose.yml
├── Dockerfile.frontend
├── Dockerfile.backend
├── nginx.conf
├── .dockerignore
├── .env.example
└── README.md
```

### 8.2 Docker Compose 配置

**docker-compose.yml**
```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: ../Dockerfile.backend
    ports:
      - "3000:3000"
    volumes:
      - ./data:/app/data              # SQLite 数据库持久化
      - ./uploads:/app/uploads        # 图片文件持久化
    environment:
      - NODE_ENV=production
      - JWT_SECRET=${JWT_SECRET}
      - PORT=3000
      - DATABASE_PATH=/app/data/database.sqlite
      - UPLOAD_DIR=/app/uploads/images
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: ../Dockerfile.frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  data:
  uploads:
```

### 8.3 Dockerfile 配置

**Dockerfile.backend**
```dockerfile
FROM node:18-alpine

# 使用阿里云镜像加速
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

WORKDIR /app

# 复制依赖文件
COPY package*.json ./

# 使用淘宝镜像安装依赖
RUN npm config set registry https://registry.npmmirror.com && \
    npm ci --only=production

# 复制源代码
COPY . .

# 构建 TypeScript
RUN npm run build

# 创建数据目录
RUN mkdir -p /app/data /app/uploads/images

EXPOSE 3000

CMD ["node", "dist/index.js"]
```

**Dockerfile.frontend**
```dockerfile
# 构建阶段
FROM node:18-alpine AS builder

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

WORKDIR /app

COPY package*.json ./

RUN npm config set registry https://registry.npmmirror.com && \
    npm ci

COPY . .

RUN npm run build

# 生产阶段
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf**
```nginx
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    # 前端路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 代理
    location /api {
        proxy_pass http://backend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # 图片代理
    location /uploads {
        proxy_pass http://backend:3000;
    }
}
```

### 8.4 本地开发模式

**启动命令**
```bash
# 后端
cd backend
npm install
npm run dev        # 使用 tsx watch 热重载

# 前端
cd frontend
npm install
npm run dev        # Vite 开发服务器（http://localhost:5173）
```

**开发环境配置**
- 后端：`http://localhost:3000`
- 前端：`http://localhost:5173`
- 前端通过 Vite proxy 转发 API 请求到后端

### 8.5 环境变量配置

**.env.example**
```bash
# Backend
NODE_ENV=development
PORT=3000
JWT_SECRET=your-secret-key-change-in-production
DATABASE_PATH=./data/database.sqlite
UPLOAD_DIR=./uploads/images

# Frontend
VITE_API_BASE_URL=http://localhost:3000
```

### 8.6 依赖安装优化

**使用国内镜像源**
```bash
# npm 配置
npm config set registry https://registry.npmmirror.com

# 或使用 .npmrc 文件
echo "registry=https://registry.npmmirror.com" > .npmrc
```

**Docker 镜像优化**
```json
// /etc/docker/daemon.json
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com"
  ]
}
```

### 8.7 项目初始化步骤

```bash
# 1. 克隆代码（或初始化项目）
git clone <repo-url>
cd project

# 2. 安装依赖
cd backend && npm install
cd ../frontend && npm install

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env 设置配置

# 4. 初始化数据库
cd backend
npm run db:migrate

# 5. 启动开发服务器
npm run dev  # 后端
cd ../frontend && npm run dev  # 前端
```

### 8.8 部署到云服务器

```bash
# 1. 克隆代码
git clone <repo-url>
cd project

# 2. 配置环境变量
cp .env.example .env
vim .env  # 设置生产环境配置（JWT_SECRET 等）

# 3. 启动 Docker Compose
docker-compose up -d

# 4. 查看日志
docker-compose logs -f

# 5. 停止服务
docker-compose down

# 6. 重启服务
docker-compose restart
```

### 8.9 数据持久化

Docker volume 配置确保以下数据持久化：
- **SQLite 数据库**：挂载到 `./data` 目录
- **上传图片**：挂载到 `./uploads` 目录

即使容器重启或删除，数据也不会丢失。

### 8.10 CI/CD 配置（可选）

**.github/workflows/ci.yml**
```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      # 配置 npm 镜像
      - name: Configure npm registry
        run: npm config set registry https://registry.npmmirror.com
      
      # 后端测试
      - name: Backend Tests
        run: |
          cd backend
          npm ci
          npm run lint
          npm run typecheck
          npm run test
      
      # 前端测试
      - name: Frontend Build
        run: |
          cd frontend
          npm ci
          npm run lint
          npm run typecheck
          npm run build
```

---

## 9. 非功能性需求

### 9.1 性能要求
- 首页加载时间 < 2秒
- API 响应时间 < 500ms（P95）
- 图片懒加载，减少初始加载量
- 瀑布流分页，每页 20 条

### 9.2 安全要求
- 密码明文存储（快速原型，生产环境需加密）
- JWT token 有效期 7 天
- 图片上传 MIME type 验证
- SQL 注入防护（使用参数化查询）
- XSS 防护（前端转义用户输入）

### 9.3 可用性要求
- 响应式设计（支持桌面和移动端）
- 错误提示友好清晰
- 加载状态提示
- 操作反馈及时（点赞、收藏等）

### 9.4 可观测性
- 后端日志记录（请求、错误）
- 前端错误捕获
- API 响应时间监控

### 9.5 可维护性
- 代码遵循 ESLint 规范
- TypeScript 类型覆盖
- 单元测试覆盖率 ≥ 60%
- 清晰的目录结构和命名

---

## 10. 技术选型与理由

### 10.1 前端技术栈

| 技术 | 理由 |
|------|------|
| React 18 | 成熟稳定，生态丰富，适合构建复杂 UI |
| Vite | 开发体验好，构建速度快，配置简单 |
| TypeScript | 类型安全，减少运行时错误，提升代码质量 |
| Tailwind CSS | 快速开发，样式一致性好，与 Open Design 配合 |
| Zustand | 轻量级状态管理，API 简单，学习曲线平缓 |
| Open Design (Linear) | 提供专业设计系统，简洁现代风格 |
| React Router | 标准路由方案，功能完善 |

### 10.2 后端技术栈

| 技术 | 理由 |
|------|------|
| Node.js 18 | JavaScript 全栈，前后端技术统一 |
| Express | 轻量灵活，中间件生态丰富 |
| TypeScript | 类型安全，与前端共享类型定义 |
| SQLite + better-sqlite3 | 零配置，单文件数据库，内置 FTS5 全文搜索 |
| Vitest | 与 Vite 生态一致，速度快，配置简单 |
| supertest | API 集成测试标准方案 |

### 10.3 部署技术栈

| 技术 | 理由 |
|------|------|
| Docker | 容器化部署，环境一致性 |
| Docker Compose | 多服务编排，简化部署流程 |
| Nginx | 前端静态文件服务，反向代理 |

### 10.4 依赖安装优化

**使用国内镜像源：**
- npm 镜像：`https://registry.npmmirror.com`
- Docker 镜像：阿里云、网易云镜像

**备选方案（如遇网络问题）：**
- better-sqlite3 → sqlite3（纯 JS 实现）
- bcrypt → bcryptjs（纯 JS 实现）
- 复杂原生模块 → 纯 JS 替代方案

---

## 11. 测试策略

### 11.1 测试目标
- 后端单元测试覆盖率 ≥ 60%
- 关键 API 端点集成测试覆盖
- 遵循 TDD（测试驱动开发）流程

### 11.2 测试类型

**后端单元测试（Service + DAO 层）**
- 使用内存 SQLite 数据库（`:memory:`）
- 每个测试前重置数据库
- 测试业务逻辑和数据访问

**后端集成测试（API 端点）**
- 使用 supertest
- 测试完整的请求-响应流程
- 测试认证、权限、错误处理

### 11.3 TDD 工作流

```
1. 红：先写失败的测试
2. 绿：写最少的代码让测试通过
3. 重构：优化代码，保持测试通过
```

---

## 12. 开发计划概要

### 12.1 开发阶段

**Phase 1: 基础设施（Week 1）**
- 项目初始化
- 数据库设计与迁移
- 认证系统（注册/登录）

**Phase 2: 核心功能（Week 2-3）**
- 笔记发布与展示
- 图片上传与存储
- 瀑布流布局

**Phase 3: 社交功能（Week 4）**
- 点赞、收藏、评论
- 关注系统
- 通知中心

**Phase 4: 发现功能（Week 5）**
- 标签系统
- 搜索功能
- 热门话题

**Phase 5: 优化与部署（Week 6）**
- 性能优化
- Docker 配置
- 文档完善

### 12.2 里程碑

- M1: 用户可以注册登录并发布笔记
- M2: 用户可以浏览瀑布流并进行社交互动
- M3: 用户可以通过标签和搜索发现内容
- M4: 项目可以通过 Docker 部署

---

## 13. 风险与应对

### 13.1 技术风险

**风险：依赖安装失败（网络问题）**
- 应对：使用国内镜像源，准备备选技术方案

**风险：SQLite 性能不足**
- 应对：优化索引，使用连接池，必要时迁移到 PostgreSQL

**风险：图片存储占用空间过大**
- 应对：限制图片大小和数量，实现图片压缩

### 13.2 进度风险

**风险：功能范围过大，无法按时完成**
- 应对：按优先级开发，核心功能优先，次要功能可延后

**风险：测试覆盖率不达标**
- 应对：严格遵循 TDD，每个功能先写测试

---

## 14. 成功标准

### 14.1 功能完整性
- ✅ 所有 13 个功能模块实现
- ✅ 通过验收标准中的所有场景测试

### 14.2 代码质量
- ✅ 后端单元测试覆盖率 ≥ 60%
- ✅ 无 TypeScript 类型错误
- ✅ 通过 ESLint 检查

### 14.3 可部署性
- ✅ 可通过 `npm run dev` 本地运行
- ✅ 可通过 `docker-compose up` 部署
- ✅ 包含完整的 README 和部署文档

### 14.4 文档完整性
- ✅ SPEC.md（本文档）
- ✅ PLAN.md（任务拆分）
- ✅ README.md（安装运行说明）
- ✅ AGENT_LOG.md（AI 协作日志）
- ✅ REFLECTION.md（反思报告）

---

## 附录 A：术语表

- **瀑布流（Masonry）**：一种网格布局，列宽固定，行高根据内容自适应
- **Cursor-based 分页**：使用游标（如最后一条记录的 ID）进行分页，而非页码
- **软删除**：不真正删除数据，而是标记 deleted_at 字段
- **FTS5**：SQLite 的全文搜索扩展
- **TDD**：测试驱动开发，先写测试再写实现

---

**设计文档版本历史：**
- v1.0 (2026-05-13): 初始版本，完成完整设计规约
