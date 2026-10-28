<h1 align="center"><img src="assets/awesome-ai4chip-logo.png" width="40" height="40" align="absmiddle" alt="AI4Chip logo"> Awesome AI4Chip</h1>

<p align="center"><strong>中文</strong> · <a href="README.en.md">English</a></p>

![AI4Chip 资源架构：模型、agents 与 harness、设计执行、评测、数据环境及芯片与基础设施协同设计](assets/ai4chip-architecture.png)

Awesome AI4Chip 汇集 AI 参与芯片设计的论文、开源项目、工具与产品，覆盖规格理解、RTL 生成与验证、模拟电路设计、综合和物理实现。目录从 AI Model、EDA、Chip for AI 三个视角展开：围绕数据、评测与训练提升模型能力，通过 AI EDA 和设计优化连接实际任务，并探索模型、计算内核、芯片架构与基础设施的协同设计。Guide 为不同背景的读者提供精选综述、课程和实践路径。

**[在线文档](https://tapeo-ai.github.io/awesome-ai4chip/)** · [Guide](docs/guide.mdx) · [环境与示例](env/README.md)

<sub>更新于 2026 年 10 月 28 日。</sub>

## Latest

<!-- latest:start -->

- **2026-10-26** · [Cadence Maestro](https://www.cadence.com/en_US/home/company/newsroom/press-releases/pr/2026/cadence-introduces-maestro-a-domain-specialized-ai-model.html) — 发布面向芯片与系统设计的领域模型组合，结合 EDA 工具反馈训练。
- **2026-10-22** · [Back-to-the-Future (BTTF)](https://arxiv.org/abs/2610.06790) — 更新论文，用 SQLite 波形数据和自然语言查询辅助 RTL 调试。
- **2026-10-07** · [RFChipAgent](https://arxiv.org/abs/2610.10858) — 发布模拟/RF 多 agent 设计流程，串联检索、拓扑选择与仿真优化。
- **2026-10-04** · [VHDL-REPOBENCH](https://arxiv.org/abs/2610.05380) — 发布仓库级 VHDL 评测，关注跨文件依赖和层次设计理解。
- **2026-10** · [Build-A-Chip-Bench](https://chipagents.ai/research/build-a-chip-bench) — 介绍从工作负载规格到 GDS 的长流程评测，结合功能验收与 PPA 评分。

<!-- latest:end -->

## 目录

- [Guide](docs/guide.mdx)
- AI Model
  - [Data](docs/resources/ai-model/data.mdx)
  - [Benchmark](docs/resources/ai-model/benchmark.mdx)
  - [Training](docs/resources/ai-model/training.mdx)
- EDA
  - [EDA 101](docs/resources/eda/eda-101.mdx)
  - [Open Source](docs/resources/eda/open-source.mdx)
  - [Closed Source](docs/resources/eda/closed-source.mdx)
  - [AI EDA](docs/resources/eda/ai-eda.mdx)
  - [EDA Optimization](docs/resources/eda/optimization.mdx)
  - [Harbor Environments](env/README.md)
- Chip for AI
  - [Hardware-aware ML](docs/resources/chip-for-ai/hardware-aware-ml.mdx)
  - [DSE (Design Space Exploration)](docs/resources/chip-for-ai/dse.mdx)
  - [DSA (Domain-specific Architecture)](docs/resources/chip-for-ai/dsa.mdx)
  - [Kernel Optimization](docs/resources/chip-for-ai/kernel-optimization.mdx)
- [Surveys & Articles](docs/resources/articles.mdx)

## Contributors

感谢每一位参与维护的朋友。欢迎补充新工作、修正链接和描述，或贡献可执行环境。

[![Contributors](https://contrib.rocks/image?repo=tapeo-ai/awesome-ai4chip&max=100)](https://github.com/tapeo-ai/awesome-ai4chip/graphs/contributors)

[提交 PR](https://github.com/tapeo-ai/awesome-ai4chip/pulls) · [提出建议](https://github.com/tapeo-ai/awesome-ai4chip/issues)
