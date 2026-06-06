# 物品收纳管家

全栈物品收纳管家应用，支持空间管理、物品记录、搜索、标签、过期提醒和家庭共享。

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 18 + TypeScript + Vite + TailwindCSS |
| 后端 | Node.js + Express + TypeScript |
| 数据库 | SQLite (better-sqlite3) |
| 认证 | JWT (jsonwebtoken) |
| 密码加密 | bcryptjs |

## 项目结构

```
pdd-167/
├── frontend/              # 前端应用
│   ├── src/
│   │   ├── components/    # 可复用组件
│   │   ├── hooks/         # 自定义 Hooks
│   │   ├── pages/         # 页面组件
│   │   ├── types/         # TypeScript 类型定义
│   │   └── utils/         # 工具函数
│   ├── package.json
│   └── package-lock.json
├── backend/               # 后端服务
│   ├── middleware/        # 共享中间件 (认证)
│   ├── routes/            # API 路由
│   ├── database.ts        # 数据库连接
│   ├── init-db.ts         # 数据库初始化
│   ├── server.ts          # 服务入口
│   ├── package.json
│   └── package-lock.json
├── package.json           # 根目录统一脚本
├── package-lock.json
├── .env.example           # 环境变量样例
├── .gitignore
└── README.md
```

## 环境要求

- **Node.js**: >= 18.x (推荐 20.x 或 24.x)
- **npm**: >= 9.x
- **Python 3**: (用于编译 better-sqlite3 原生模块)

> 验证环境：
> ```bash
> node --version   # 应输出 v24.15.0 或更高
> npm --version    # 应输出 11.12.1 或更高
> ```

## 快速开始（新机器一键部署）

### 1. 克隆代码

```bash
git clone <repository-url>
cd <project-directory>
```

### 2. 配置环境变量

```bash
# 复制环境变量样例
cp .env.example .env

# （可选）编辑 .env 修改 JWT_SECRET 等配置
```

### 3. 一键安装所有依赖

```bash
npm run install:all
```

> 此命令会依次安装根目录、后端、前端的所有依赖。

### 4. 初始化数据库（首次运行）

```bash
npm run init-db
```

### 5. 启动开发服务

```bash
npm run dev
```

启动后访问：
- 前端: http://localhost:5173
- 后端: http://localhost:3000
- 健康检查: http://localhost:3000/api/health

---

## 可用脚本（根目录）

所有脚本都可以在项目根目录执行，无需进入子目录。

| 命令 | 说明 |
|------|------|
| `npm run install:all` | 安装所有依赖（根目录 + 后端 + 前端） |
| `npm run install:backend` | 仅安装后端依赖 |
| `npm run install:frontend` | 仅安装前端依赖 |
| `npm run dev` | 同时启动后端和前端开发服务（带颜色区分日志） |
| `npm run dev:backend` | 仅启动后端开发服务 |
| `npm run dev:frontend` | 仅启动前端开发服务 |
| `npm run build` | 构建后端和前端生产版本 |
| `npm run build:backend` | 仅构建后端 |
| `npm run build:frontend` | 仅构建前端 |
| `npm run start` | 启动后端生产服务 |
| `npm run init-db` | 初始化数据库 |
| `npm run check` | 完整检查：类型检查 + 构建验证 |
| `npm run check:types` | 仅运行 TypeScript 类型检查 |
| `npm run check:build` | 仅运行构建验证 |

---

## 功能验证步骤

按以下步骤可在新机器上验证所有功能是否正常工作。

### ✅ 验证 1：环境检查

```bash
node --version  # >= 18.x
npm --version   # >= 9.x
```

### ✅ 验证 2：依赖安装

```bash
npm run install:all
```

预期输出：
- 根目录: `added 29 packages`
- 后端: `added 184 packages`
- 前端: `added 169 packages`
- 无 error 输出

### ✅ 验证 3：类型检查

```bash
npm run check:types
```

预期输出：无任何错误输出（静默成功）。

### ✅ 验证 4：构建验证

```bash
npm run check:build
```

预期输出：
- 后端: `tsc` 静默成功
- 前端: 显示 `✓ built in XXXms`，生成 `frontend/dist` 目录

### ✅ 验证 5：数据库初始化

```bash
npm run init-db
```

预期输出：`Database initialized successfully`

验证数据库文件已创建：
```bash
ls -la backend/*.db  # 应存在数据库文件
```

### ✅ 验证 6：后端服务启动

```bash
npm run dev:backend
```

预期输出：`Server running on http://localhost:3000`

另开终端验证健康检查：
```bash
curl http://localhost:3000/api/health
# 应返回: {"status":"ok"}
```

按 `Ctrl+C` 停止服务。

### ✅ 验证 7：前端服务启动

```bash
npm run dev:frontend
```

预期输出：显示 `Local: http://localhost:5173/`

浏览器访问 http://localhost:5173，应能看到登录页面。

按 `Ctrl+C` 停止服务。

### ✅ 验证 8：同时启动前后端

```bash
npm run dev
```

预期输出：
- 绿色前缀 `[backend]` 的后端日志
- 蓝色前缀 `[frontend]` 的前端日志
- 两个服务都正常运行

### ✅ 验证 9：过期提醒功能端到端测试

1. 打开 http://localhost:5173，注册一个新用户
2. 创建一个空间（如"厨房"）
3. 添加一个物品，设置过期日期为**未来 7 天内**
4. 返回首页，应该能在顶部看到"近期过期物品"区域
5. 进入设置页面，关闭"过期物品提醒"开关
6. 返回首页，过期提醒区域应该消失
7. 重新开启开关，提醒区域应该再次显示

---

## API 接口文档

### 认证相关

| 方法 | 路径 | 说明 | 鉴权 |
|------|------|------|------|
| POST | `/api/auth/register` | 用户注册 | 否 |
| POST | `/api/auth/login` | 用户登录 | 否 |
| GET | `/api/auth/settings` | 获取用户设置 | 是 |
| PUT | `/api/auth/settings` | 更新用户设置 | 是 |

### 空间管理

| 方法 | 路径 | 说明 | 鉴权 |
|------|------|------|------|
| GET | `/api/spaces` | 获取空间列表 | 是 |
| GET | `/api/spaces/:id` | 获取空间详情 | 是 |
| POST | `/api/spaces` | 创建空间 | 是 |
| PUT | `/api/spaces/:id` | 更新空间 | 是 |
| DELETE | `/api/spaces/:id` | 删除空间 | 是 |
| GET | `/api/spaces/:id/items` | 获取空间下的物品 | 是 |
| POST | `/api/spaces/:id/items` | 空间下新增物品 | 是 |

### 物品管理

| 方法 | 路径 | 说明 | 鉴权 |
|------|------|------|------|
| GET | `/api/items/expiring-soon` | 获取近期过期物品 | 是 |
| GET | `/api/items/search` | 搜索物品 | 是 |
| GET | `/api/items/:id` | 获取物品详情 | 是 |
| PUT | `/api/items/:id` | 更新物品 | 是 |
| DELETE | `/api/items/:id` | 删除物品 | 是 |

### 家庭共享

| 方法 | 路径 | 说明 | 鉴权 |
|------|------|------|------|
| GET | `/api/family` | 获取家人列表 | 是 |
| POST | `/api/family` | 添加家人 | 是 |
| DELETE | `/api/family/:id` | 删除家人 | 是 |

---

## 核心功能

- ✅ **用户注册/登录** - JWT 认证，密码 bcrypt 加密
- ✅ **空间管理** - 柜子、抽屉、箱子等收纳空间
- ✅ **物品管理** - 添加、编辑、删除物品，支持照片
- ✅ **物品搜索** - 按名称或描述全文搜索
- ✅ **物品标签** - 季节性、常用、易碎、贵重、食品、药品
- ✅ **过期提醒** - 设置过期日期，首页展示近期过期物品
- ✅ **提醒开关** - 设置页可开关过期提醒功能
- ✅ **家庭共享** - 邀请家人共享管理

---

## 部署建议

### 生产环境部署

1. 构建生产版本：
   ```bash
   npm run build
   ```

2. 启动后端服务（推荐使用 pm2）：
   ```bash
   npm install -g pm2
   pm2 start backend/dist/server.js --name item-manager
   ```

3. 前端静态文件：
   - `frontend/dist` 目录可部署到 Nginx 或 CDN
   - 配置反向代理 `/api` 到后端服务

### 安全建议

- 生产环境务必修改 `.env` 中的 `JWT_SECRET` 为强随机字符串
- 配置 HTTPS
- 定期备份数据库文件 `backend/*.db`

---

## 故障排查

### 问题：better-sqlite3 安装失败

**原因**: Node.js 版本与 better-sqlite3 版本不兼容。

**解决**:
- 确保 Node.js >= 18.x
- 本项目使用 better-sqlite3@11.8.1，兼容 Node.js 18-24
- 如果编译失败，确认已安装 Python 3 和 C++ 编译工具

### 问题：前端无法连接后端

**原因**: 后端服务未启动或端口被占用。

**解决**:
- 确认后端服务运行在 http://localhost:3000
- 检查 `frontend/vite.config.ts` 中的代理配置
- 验证 `curl http://localhost:3000/api/health` 返回正常

### 问题：TypeScript 类型错误

**原因**: 类型定义不匹配。

**解决**:
```bash
npm run check:types
```
根据错误信息修复类型问题。

---

## 开发规范

- 代码提交前请运行 `npm run check` 确保通过所有检查
- 遵循现有代码风格和命名约定
- 新增 API 请在本文档更新接口列表
