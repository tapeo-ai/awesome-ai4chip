<h1 align="center"><img src="assets/awesome-ai4chip-logo.png" width="40" height="40" align="middle" alt="AI4Chip logo"> Awesome AI4Chip</h1>

<p align="center"><strong>中文</strong> · <a href="README.en.md">English</a></p>

![AI4Chip 资源架构：模型、agents 与 harness、设计执行、评测、数据环境及芯片与基础设施协同设计](assets/ai4chip-architecture.png)

Awesome AI4Chip 汇集 AI 参与芯片设计的论文、开源项目、工具与产品，涵盖规格理解、RTL 生成与验证、模拟电路设计、综合和物理实现。我们从模型与训练方法、agent 与 harness、数据、执行环境和 benchmark 梳理这些工作，也关注 Chip for AI，以及模型、芯片、编译器和集群基础设施之间的协同设计。

**[在线文档](https://tapeo-ai.github.io/awesome-ai4chip/)** · [入门与教程](docs/tutorials.mdx) · [环境与示例](env/README.md)

<sub>更新于 2026 年 10 月 27 日。</sub>

## Latest

<!-- latest:start -->

- **2026-10-26** · [Cadence Maestro](https://www.cadence.com/en_US/home/company/newsroom/press-releases/pr/2026/cadence-introduces-maestro-a-domain-specialized-ai-model.html) — 发布面向芯片与系统设计的领域模型组合，结合 EDA 工具反馈训练。
- **2026-10-22** · [Back-to-the-Future (BTTF)](https://arxiv.org/abs/2610.06790) — 更新论文，用 SQLite 波形数据和自然语言查询辅助 RTL 调试。
- **2026-10-07** · [RFChipAgent](https://arxiv.org/abs/2610.10858) — 发布模拟/RF 多 agent 设计流程，串联检索、拓扑选择与仿真优化。
- **2026-10-04** · [VHDL-REPOBENCH](https://arxiv.org/abs/2610.05380) — 发布仓库级 VHDL 评测，关注跨文件依赖和层次设计理解。
- **2026-10** · [Build-A-Chip-Bench](https://chipagents.ai/research/build-a-chip-bench) — 介绍从工作负载规格到 GDS 的长流程评测，结合功能验收与 PPA 评分。

<!-- latest:end -->

## 目录

- 模型：[LLM 与训练方法](docs/resources/models/llm.mdx) · [非 LLM 模型](docs/resources/models/circuit.mdx)
- [Agents 与 Harness](docs/resources/agents.mdx)
- [综合与物理设计优化](docs/resources/optimization.mdx)
- [数据集与设计表示](docs/resources/data.mdx)
- [工具与可执行环境](docs/resources/tools.mdx)
- [Benchmark 与评测](docs/resources/benchmarks.mdx)
- [商业产品与平台](docs/resources/products.mdx)
- 协同设计：[AI 驱动设计与模型硬件协同设计](docs/resources/codesign/models-hardware.mdx) · [专用芯片与存算一体](docs/resources/codesign/chips-cim.mdx) · [架构、映射与集群基础设施](docs/resources/codesign/architecture-infra.mdx) · [Kernel agents 与编译基础设施](docs/resources/codesign/kernels.mdx)
- [综述与实践文章](docs/resources/articles.mdx)

## Contributors

感谢每一位参与维护的朋友。欢迎补充新工作、修正链接和描述，或贡献可执行环境。

[![Contributors](https://contrib.rocks/image?repo=tapeo-ai/awesome-ai4chip&max=100)](https://github.com/tapeo-ai/awesome-ai4chip/graphs/contributors)

[提交 PR](https://github.com/tapeo-ai/awesome-ai4chip/pulls) · [提出建议](https://github.com/tapeo-ai/awesome-ai4chip/issues)
