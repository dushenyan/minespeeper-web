<p align='center'>
  <h1>Minespeeper Web</h1>
  <b>基于 Vue 3 的扫雷游戏</b>
  <a href="https://minespeeper-web.netlify.app/">在线演示</a>
</p>

## 简介

这是一个使用 Vue 3 和 TypeScript 开发的经典扫雷游戏。游戏具有多种难度级别、自定义游戏设置、响应式设计和现代化的用户界面。

## 功能特性

- 🎮 经典扫雷游戏玩法
- 🎯 四种预设难度级别（简单、中等、困难、专家）
- ⚙️ 自定义游戏设置（可调整行数、列数和地雷数量）
- 🌗 深色/浅色主题自动切换
- 📱 响应式设计，支持移动端和桌面端
- 🎨 现代化 UI 设计，使用渐变色彩和动画效果
- 🚀 基于 Vite 构建，快速开发和构建
- 📦 轻量级，无多余依赖

## 技术栈

- [Vue 3](https://v3.vuejs.org/) - 渐进式 JavaScript 框架
- [TypeScript](https://www.typescriptlang.org/) - JavaScript 的超集
- [Vite](https://vitejs.dev/) - 快速的构建工具
- [UnoCSS](https://uno.antfu.me/) - 即时按需原子 CSS 引擎
- [VueUse](https://vueuse.org/) - Vue Composition API 实用工具集合
- [Iconify](https://iconify.design/) - 图标库
- [Vue 3 官方图标库](https://vue3.antfu.me/icons/) - 用于 Vue 3 的图标组件

## 快速开始

### 本地运行

```bash
# 克隆项目
git clone https://github.com/dushenyan/minesweeper-web.git

# 进入项目目录
cd minesweeper-web

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

### 构建部署

```bash
# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview
```

## 游戏玩法

1. **左键点击** - 翻开方块
2. **右键点击** - 标记/取消标记地雷
3. **目标** - 在不触发地雷的情况下翻开所有非地雷方块

### 游戏规则

- 数字表示相邻 8 个方块中的地雷数量
- 点击数字为 0 的方块会自动展开相邻区域
- 标记所有地雷并翻开所有安全方块即可获胜

![alt text](public/image.png)

## 项目结构

```bash
src/ 
├── components/ # 公共组件 
├── composables/ # 组合式函数 
├── pages/ # 页面组件 
├── styles/ # 样式文件 
└── App.vue # 根组件
```

## 自定义配置

### 难度设置

游戏提供四种预设难度：
- 简单：8×8 网格，10% 地雷密度
- 中等：10×10 网格，15% 地雷密度
- 困难：12×12 网格，20% 地雷密度
- 专家：16×16 网格，25% 地雷密度

### 自定义游戏

可以通过自定义菜单设置任意尺寸的游戏面板和地雷数量。

## 开发指南

### 解决方案

- [前端开发的基础生产力素养（解决ni安装包时报错）](https://juejin.cn/post/7061152158132994061)

### 代码规范

项目使用 [@antfu/eslint-config](https://github.com/antfu/eslint-config) 进行代码规范检查。

## 贡献

欢迎提交 Issue 和 Pull Request 来改进项目。

