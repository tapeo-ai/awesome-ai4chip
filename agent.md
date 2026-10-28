# 仓库维护说明

本仓库是 AI for Chip 的 Awesome 链接清单，Chip for AI 与 Model–Chip–Infra Co-design 是重点延伸方向。

## 文件分工

- `README.md` / `README.en.md`：项目介绍、架构图、Latest、目录、Guide、Contributors 和交流入口，是网页首页正文的唯一来源。
- `docs/resources/ai-model/`：Data、Benchmark、Training。
- `docs/resources/eda/`：EDA 101、Open Source、Closed Source、AI EDA、EDA Optimization。Agent 与 harness 的工作收在 AI EDA。
- `docs/resources/chip-for-ai/`：Hardware-aware ML、DSE (Design Space Exploration)、DSA (Domain-specific Architecture)、Kernel Optimization。
- `docs/resources/articles.mdx`：Surveys & Articles。每个项目的完整介绍只维护一处，Guide 按学习用途引用。
- `docs/latest.mdx` 与 `docs/en/latest.mdx`：各语言近期动态的唯一来源；`npm run docs:sync` 将其同步到对应 README 标记区域。
- README 的 `## Guide`：按背景和目标精选综述、完整课程网站与实践入口。不另设 Guide、Roadmap 或 Tutorials 文档。
- `docs/resources/eda/eda-101.mdx`：EDA 101，连接设计环节、主要产物、开源与商业软件、真实界面和流程图，作为 EDA 导航的第一篇。
- `docs/index.mdx` / `docs/en/index.mdx`：保留首页 frontmatter，正文由 `npm run docs:sync` 从相应 README 生成，dev/build 也会从 README 生成当前预览。脚本转换文档、图片与示例链接；请修改 README 后同步，避免直接编辑首页正文。`docs/contributors.mdx` 是贡献者入口。
- `docs/docs.json`：Mintlify 导航与站点配置；新增手写页面时同步加入中英文导航。
- `assets/`：公开的项目 logo、资源架构图和 EDA 流程 SVG。原创图内使用英文，配色采用暖白、橄榄绿和陶土色。`assets/eda-101/` 保存正文引用的真实工具界面与流程图。提示词留在本地，不提交。
- `docs/en/`、`README.en.md`：对应英文正文与首页。中文默认展示，英文页面使用 `/en/` 前缀；两种语言的文件路径、分类和资源链接一一对应。
- `env/examples/`：具体的环境与数据格式示例，当前使用 Harbor 格式。网页在 AI Model 下直接展示“Harbor 环境示例”，不设额外环境索引页。
- `src/`、`scripts/`：静态页面、内容生成与检查；`.github/workflows/` 管理 PR 构建、预览和正式发布。
- `scripts/redirects.mjs`：页面迁移映射，自动覆盖中英文以及生产和 PR 预览路径。
- `agent.md`：维护流程和编辑约定。

调研底稿、聊天记录和内部实验报告留在仓库外。当前不设置 `CONTRIBUTING.md`、Related Awesome Lists 或公开调研专题目录。

## 本地预览与发布

使用 Node.js 22；文档基于 Mintlify 官方 `@mintlify/astro` 集成，静态搜索使用 Pagefind。

```sh
npm ci
npm run docs:sync
npm run check
npm test
npm run build
npm run preview
```

`npm run dev` 支持编辑预览。搜索索引在构建时生成，检查搜索时使用 `npm run build` 后的 `npm run preview`。

生产站为 `https://tapeo-ai.github.io/awesome-ai4chip/`。PR 每次更新通过检查后发布到 `/awesome-ai4chip/pr-preview/<编号>/`，地址显示在发布 workflow 的 Summary；合并到 `main` 后更新生产站。PR 关闭时自动移除对应预览。GitHub Pages 的 Source 设为 GitHub Actions，无需额外 secret。

正文使用普通 Markdown 和少量 YAML frontmatter，文件扩展名为 `.mdx`。必填 `title`、`description`，正文从 H2 开始；站内链接使用 `/resources/...` 等根路径，构建自动加上生产或 PR 预览的路径前缀。新增页面时确保 `docs/docs.json` 导航和相对链接检查通过。

构建自动生成网页、搜索、环境展示、Markdown 下载、`llms.txt` 和 sitemap。`.generated-docs/`、`.generated-public/`、`.mintlify/`、`.astro/`、`dist/`、依赖目录与 IDE 配置不提交。不要提交提示词、过程截图、日志或临时调研文件。

首页的更新时间维护在中英文 `docs/index.mdx` 的 `updated` 字段（YYYY-MM-DD），网页自动按语言显示为小号灰字。同步修改对应 README 的更新时间。

Latest 保留少量近期工作，写清发布或修订日期，按日期倒序排列，月份不明确时保留原来源给出的粒度。同时更新 `docs/latest.mdx` 与 `docs/en/latest.mdx` 后执行 `npm run docs:sync`，把同步后的 README 一起提交；CI 会检查两者一致。

中英文资源条目保持相同的项目名称、顺序和外部链接；翻译说明文字和标题。英文正文的站内链接指向 `/en/`。每次新增或修改内容同步更新对应语言，CI 检查页面配对和外部链接一致性。环境示例使用 `README.md` / `README.en.md`，代码、配置和原始任务说明共用一份。

`assets/ai4chip-qrcode.jpg` 是文末居中展示的微信群二维码；更新时替换同名图片。联系方式维护在 README 的 Community 区域，保留个人微信号以便群二维码失效后联系。

Contributors 使用 GitHub 贡献记录生成的头像图，并链接到仓库贡献者列表，无需手工维护名单。

## 收录范围

研究工作优先收录 2025 年以来的成果。较早的资源保留常用评测、数据格式、教程和仍在使用的开源框架；同一系列优先链接当前版本。

关注以下方向：

- AI Model：以数据、评测和训练为主；Training 按 CPT、SFT、Distillation、Preference Optimization、RL 等训练方法组织。
- AI EDA：设计与调试、工具调用、上下文、记忆、长流程任务及验收，包括相关 harness。
- EDA Optimization：电路表示与性能预测、RTL 与逻辑优化、物理设计优化、模拟电路设计。相关图网络、代理模型和策略网络按所解决的任务归入同一篇，不设置“非 LLM 模型”目录。
- 数据与环境：训练语料、设计表示、工具反馈、开放 PDK、可执行任务和数据格式。
- Benchmark：功能、验证、PPA、仓库任务、端到端设计及模拟电路评测。
- Open Source / Closed Source：开源 EDA 软件和商业 EDA 产品，以官方项目、产品文档和技术材料为入口。
- Chip for AI：Hardware-aware ML、DSE、DSA 和 Kernel Optimization；CIM 属于 DSA，架构与集群模拟、映射和性能建模服务于 DSE。
- Guide：精选与 AI4Chip 直接相关的综述、课程和实践入口，写清适合谁、阅读顺序、每份材料解决什么问题，以及可继续深入的资料；不收泛用 LLM 课程，不硬凑材料数量。

团队自己的公开工作按用途放入对应分类；可复用的任务示例放入 `env/examples/`。

## 查找与核实

日常增量检索以最近七天为窗口，兼顾新发布和延迟索引的材料。沿已收录工作的作者、机构、引用和后续版本继续查找，定期检查主要项目的发布动态。

优先查看作者论文、官方仓库、数据卡、产品文档和技术博客。搜索摘要与转载用于发现线索，条目内容以原始来源为依据。

模型条目写清基础模型、训练数据或信号、训练目标。监督微调、偏好优化与强化学习都属于 post-training。仅使用提示、RAG、工具反馈或搜索的工作，按主要贡献归入 AI EDA 或相应优化章节。厂商工作按内容收录到对应分类，包括模型、评测、工具、产品和技术文章。

适配预训练 T5、CodeT5 等较小语言模型的工作也归入 Training；电路图网络、生成器和策略网络按任务归入 EDA Optimization。验证反馈应写清被检查的是代码、电路还是断言，以及反馈用于筛选数据、训练模型还是推理期搜索。

添加或更新前核实项目名称、任务用途、日期和链接。区分论文、代码、权重、数据和产品入口，链接文字应与目标内容对应。遇到重命名、仓库迁移或新版本，更新已有条目，避免重复收录。撤稿或已被替代的条目应移除或换成后续工作。

不把厂商宣传数字写成独立评测结论。判断资源是否值得收录，主要看它能帮助读者理解什么问题、运行什么工具或开展什么实验。

## 条目写法

采用普通 Awesome 格式：

```markdown
- [项目名称](官方入口)（年份） — 一句话说明它做什么。 [论文](链接) [代码](链接) [数据](链接)
```

持续维护的工具可以省略年份。只添加已经核实的辅助链接，同一项目一般保留一个主条目；教程可单独链接其上手文档。

直接介绍用途和方法，避免宣传、排名口号、过度防御和调研过程说明。必要的使用信息简短写明，例如需要某个商业工具或榜单待发布。不要把“本次未核验”“不能声称”“避免误解”等编辑笔记放进条目。

技术名称保持原名，中文和英文之间留空格。普通小节按项目名称排序，教程按上手顺序排列。新增分类应由内容需要决定，不为少量链接预建空目录。

目录优先使用专业术语，常用缩写首次配英文全称，例如 DSA (Domain-specific Architecture)。中英文页面使用相同的专业分类名称，说明文字按语言编写。

## Guide 与 EDA 101

Guide 只在中英文 README 中维护，自动同步到网页首页。旧 Guide 地址跳转到首页 `#guide`，不设独立页面，也不按教程条数生成指标。Guide 与 EDA 101 都是说明性页面，不计入 Awesome 资源条目数。优先有完整组织的课程网站、作者综述和官方教程；说明具体值得读的章节或示例，不添加泛泛的路线介绍、机械的学习成果段落或凑数链接。需要的延伸材料与相应路线放在同一篇中，不按每日动态扩充入门必读清单。

EDA 101 的流程图、软件对应表与正文一起更新。数字 ASIC 流程包含验证与反馈；DRC/LVS 属于物理验证和签核，模拟设计另列分支。真实界面和参考流程图从公开原始资料获取，保存到 `assets/eda-101/` 并直接嵌入正文，图注注明作者或机构、来源链接及图号／页码；中英文共用图片。保持原图内容，不生成仿真软件截图，不复制整篇资料。新增图片时同步更新 `scripts/prepare-docs.mjs` 的公开图片名单。操作视频保留链接。

移动页面时更新 README、站点首页、导航及站内引用，并在 `scripts/redirects.mjs` 保留旧网页入口。同一内容只保留一份正文，中英文各自对应，不为不同导航入口复制页面。

## 环境示例

网页展示直接从 `env/examples/<任务名>/` 生成。添加 `task.toml`、中英文 README、`instruction.md` 和相关任务文件后，示例会自动进入 AI Model 下的单页文件浏览器，无需另写网站页面或修改导航。更新任务时改原文件，生成器负责目录、文件预览、下载和依赖信息；有多个示例时自动显示选择器。仅发布允许类型、大小范围内的文本文件，排除符号链接、敏感文件、生成副本与日志；大型工具与工艺文件继续通过 `assets.json` 与 `prepare.py` 管理。

保留任务说明、规格、代码、验证器和参考解。大型工具包、工艺库、生成副本与运行日志通过忽略规则留在 Git 外。

`assets.json` 记录依赖的来源、大小、SHA-256 和版本；`prepare.py` 恢复依赖并生成运行所需副本。更换来源归档时同步更新这些信息。若以后采用 Hugging Face 等存储，使用固定版本的下载入口和校验值。

保持 Harbor 的 agent 环境、验证环境和参考解分工。调整示例时检查任务配置、Docker 构建上下文、产物路径和评分入口。原任务的功能要求和评分逻辑应保持一致；文档中的指标范围应与实际验证器相符。

## 每次更新的检查

1. 检查新增和变更链接、项目重名、重复条目、年份及分类。
2. 执行 `npm run docs:sync`、`npm run check`、`npm test`、`npm run build`，检查导航、内部链接、图片和环境下载入口，检查中英文的对应页面与内容。
3. 检查 Git 变更范围，排除大型资产、缓存、凭据和内部资料。
4. 修改环境代码时执行对应任务检查；修改发布脚本时运行 `python3 scripts/test-publish-pages.py`。
5. 用简短提交说明概括新增、替换和移除的内容。只提交本次维护涉及的文件，保留已有的无关本地改动。

定时任务按已配置的远程和分支提交、推送。没有实质更新时不制造空提交。更新仓库与向讨论群发消息分别执行，群消息遵循单独的通知配置。
