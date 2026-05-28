# 项目上下文与 AI 指南 (Claude 系统提示词)

## 1. 项目概述

- **项目名称：** Aki's Agile Classroom & Tech Blog (鍾涛的敏捷课堂与技术博客)
- **项目类型：** 静态网站 / 技术博客
- **作者身份：** 鍾涛 (Aki) - 产品工程师 (Product Engineer)、Java 顾问、MBA。
- **核心领域：** 敏捷/Scrum 方法论、Java 设计模式 (策略模式、观察者模式、工厂模式等) 以及软件工程探讨。
- **部署方式：** GitHub Pages (自定义域名：`zhongtaoaki.com`)。

## 2. 技术栈 (严格约束)

- **核心框架：** Astro (静态站点生成)。
- **样式方案：** Tailwind CSS。
- **内容格式：** 混合使用 Markdown (`.md`) 和原生 HTML (`.html`)。
- **代码高亮：** Prism.js 或 Shiki (必须支持 Java 和 HTML 代码片段的高亮显示)。

## 3. 编码规范与最佳实践 (Apple / 高级质感风格)

在为本项目生成或修改代码时，你必须遵守以下规则，特别是**必须严格贯彻 Apple 的网页设计美学**：

### 3.1 核心视觉语言 (Apple Style UX/UI)

- **极简主义与大留白 (Macro Whitespace)：** 摒弃拥挤的布局。在 Section 之间使用极其宽裕的 Padding/Margin (如 `py-24`, `py-32`)，让内容充分呼吸。
- **排版 (Typography)：** 模仿 Apple 的字体层级。使用大号、粗细对比强烈的无衬线字体 (Sans-serif)。大标题应具有视觉冲击力 (如 `text-5xl font-bold tracking-tight`)，副标题和正文使用高可读性的灰色调 (如 `text-gray-500`)。
- **毛玻璃效果 (Glassmorphism)：** 导航栏 (Navbar) 必须具有吸顶且带有毛玻璃模糊效果 (`sticky top-0 backdrop-blur-md bg-white/70 dark:bg-black/70`)。
- **便当盒布局 (Bento Box)：** 在展示“关于我 (About)”或“功能特性”等模块时，优先使用圆角大、带有一丝微妙阴影的 Bento Box 网格卡片布局。卡片背景使用极其微妙的浅灰 (如 `#f5f5f7`) 或深色模式下的深灰。
- **滚动动画 (Scroll Animations)：** 页面向下滚动时，元素应当具有平滑的淡入并轻微上滑的出现效果 (Fade-in & Slide-up)。可以使用纯 CSS 或轻量级的 Intersection Observer 实现。

### 3.2 Astro 与 HTML 内容策略

- **HTML 优先：** 作者经常使用原生 `.html` 编写博客内容。Astro 的路由或内容集合必须能原生解析纯 HTML 文件，且不破坏外部包裹的 Apple 风格布局。
- **博客正文排版：** 使用 `@tailwindcss/typography` (prose 类)，但需要通过 Tailwind 配置覆盖其默认样式，使其符合 Apple 的现代感排版（更大的行高、更优雅的代码块展示）。
- **组件化：** 保持 Astro 组件 (`.astro`) 模块化，逻辑与内容分离。

### 3.3 样式约束与主题

- **仅限 Tailwind：** 除非遇到极其复杂的滚动特效，否则禁止手写 CSS。严格依赖 Tailwind 工具类。如果需要，可扩展 `tailwind.config.mjs`。
- **Dark Mode：** 必须完美支持深色模式。Apple 风格的 Dark Mode 不是纯黑，而是具有极高质感的深空灰与 OLED 黑的结合。
- **无障碍访问 (A11y)：** 必须为图片添加 `alt` 标签，交互元素添加 `aria-labels`。

### 3.4 作者人设与内容基调

- 展现作者跨界的专业背景：底层技术架构 (Java/OOP) 结合商业产品价值 (MBA/产品工程师)。
- 在任何时间轴或简历 UI 组件中，请始终明确区分“实习 (Internship)”与“全职 (Full-time)”经历。

## 4. GitHub Pages 部署规则

- 托管在自定义域名 (`zhongtaoaki.com`)，`astro.config.mjs` 中的 `base` 路径必须保持为根路径 `/`。
- 构建输出和部署脚本 (如 GitHub Actions) 需符合 GitHub Pages 要求。

## 5. 对 AI 助手 (Claude) 的指令

- **不要解释基础概念**，除非被明确要求。直接输出代码。
- **先读后写：** 修改现有的 `.astro` 组件前，先阅读并模仿现有的 Apple 风格代码。
- **终端操作：** 如需安装依赖（例如 `@tailwindcss/typography`），请先询问或直接输出命令。
