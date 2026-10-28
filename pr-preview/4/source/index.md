---
title: "Awesome AI4Chip"
description: "AI for Chip 与 Chip / Infra Co-design 的论文、开源项目、产品、教程和环境示例。"
updated: "2026-10-28"
---

![AI4Chip 资源架构：模型、agents 与 harness、设计执行、评测、数据环境及芯片与基础设施协同设计](/assets/ai4chip-architecture.png)

我们会持续把 Awesome AI4Chip 建设成**最全面的 AI for Chip 资讯与资源入口**，持续整理论文、开源项目、数据集、评测、工具产品和技术文章，帮助不同背景的读者**快速建立认知**：了解关键问题与技术路线，找到入门材料和可复现的项目，跟进研究与产业进展。

## 从哪里开始

| 背景 / 需求 | 建议先看 | 后续阅读 |
| --- | --- | --- |
| 刚接触芯片设计，想了解设计流程和常用软件 | [EDA 101](/resources/eda/eda-101)：设计环节、软件界面与主要产物 | 按兴趣选择 [Guide](#guide) 中的路线 |
| 熟悉 LLM，想做 RTL 生成、领域 post-training 或评测 | [LLMs for EDA: A Survey](https://arxiv.org/abs/2501.09655)：任务分类、模型适配、数据与评测 | [AI Model](#ai-model)：VerilogEval → CodeV-R1 |
| 有 RTL / EDA 基础，想开发设计 agent | [The Dawn of Agentic EDA](https://arxiv.org/abs/2512.23189)：agent 架构、工具调用与设计反馈 | [AI EDA](#ai-eda)：OpenROAD 流程 → 接入 coding agent |
| 有电路基础，想做模拟电路设计与自动化 | [JKU Analog Circuit Design](https://iic-jku.github.io/analog-circuit-design/aicd.html)：电路设计、仿真与尺寸优化 | [Analog / Mixed-Signal](#analog--mixed-signal)：ngspice 批量仿真与参数搜索 |
| 有 ML 或体系结构基础，想研究模型与加速器协同设计 | [MIT 6.5940](https://hanlab.mit.edu/courses/2026-fall-65940)：高效模型与硬件部署 | [Chip for AI](#chip-for-ai)：Timeloop / Accelergy → Gemmini |

## Latest

- **2026-10-26** · [Cadence Maestro](https://www.cadence.com/en_US/home/company/newsroom/press-releases/pr/2026/cadence-introduces-maestro-a-domain-specialized-ai-model.html) — 发布面向芯片与系统设计的领域模型组合，结合 EDA 工具反馈训练。
- **2026-10-22** · [Back-to-the-Future (BTTF)](https://arxiv.org/abs/2610.06790) — 更新论文，用 SQLite 波形数据和自然语言查询辅助 RTL 调试。
- **2026-10-07** · [RFChipAgent](https://arxiv.org/abs/2610.10858) — 发布模拟/RF 多 agent 设计流程，串联检索、拓扑选择与仿真优化。
- **2026-10-04** · [VHDL-REPOBENCH](https://arxiv.org/abs/2610.05380) — 发布仓库级 VHDL 评测，关注跨文件依赖和层次设计理解。
- **2026-10** · [Build-A-Chip-Bench](https://chipagents.ai/research/build-a-chip-bench) — 介绍从工作负载规格到 GDS 的长流程评测，结合功能验收与 PPA 评分。

## 目录

- [Guide](#guide)
- AI Model
  - [Data](/resources/ai-model/data)
  - [Benchmark](/resources/ai-model/benchmark)
  - [Training](/resources/ai-model/training)
  - [Harbor 环境示例](/resources/ai-model/harbor-examples)
- EDA
  - [EDA 101](/resources/eda/eda-101)
  - [Open Source](/resources/eda/open-source)
  - [Closed Source](/resources/eda/closed-source)
  - [AI EDA](/resources/eda/ai-eda)
  - [EDA Optimization](/resources/eda/optimization)
- Chip for AI
  - [Hardware-aware ML](/resources/chip-for-ai/hardware-aware-ml)
  - [DSE (Design Space Exploration)](/resources/chip-for-ai/dse)
  - [DSA (Domain-specific Architecture)](/resources/chip-for-ai/dsa)
  - [Kernel Optimization](/resources/chip-for-ai/kernel-optimization)
- [Surveys & Articles](/resources/articles)

## Guide

### AI Model

适合熟悉 LLM、想研究 RTL 生成、领域 post-training 或评测的读者。

1. [LLMs for EDA: A Survey](https://arxiv.org/abs/2501.09655) — 介绍了 EDA 任务，模型，数据与评测等。可以快速了解LLM和EDA领域在做的关键方向
2. [VerilogEval](https://github.com/NVlabs/verilog-eval) — 按 README 的 `spec-to-rtl` 流程，了解从spec、Verilog 到仿真结果的评测流程。
3. [CodeV-R1](https://github.com/IPRC-DIP/CodeV-R1) — 从一个具体的 Verilog post-training 项目，了解`sft/` 的训练配置，最后看 `verl/` 的 RL 流程与 testbench reward；对照公开数据，理解推理蒸馏和仿真反馈分别如何进入训练。

如果还不能读简单 RTL，先做 [HDLBits](https://hdlbits.01xz.net/wiki/Main_Page) 的组合逻辑、时序逻辑题，再读 [cocotb First Steps](https://docs.cocotb.org/en/stable/first_steps.html)，用 Python testbench 理解时钟、复位、断言和波形。继续研究时，按问题查 [Data](/resources/ai-model/data)、[Benchmark](/resources/ai-model/benchmark) 和 [Training](/resources/ai-model/training)。

### AI EDA

适合已有 RTL / EDA 基础、准备开发设计 agent 或自动优化流程的读者。

1. [The Dawn of Agentic EDA](https://arxiv.org/abs/2512.23189) — 建议先读第 2 节的 agent 架构，再选第 3 节 RTL / Verification 或第 4 节 Physical Design。
2. [OpenROAD Flow Scripts Tutorial](https://openroad-flow-scripts.readthedocs.io/en/latest/tutorials/FlowTutorial.html) — 用 Ibex / SKY130 示例了解完整的 RTL-to-GDS 流程。
3. [OpenROAD — Running Claude Code in Docker](https://openroad-flow-scripts.readthedocs.io/en/latest/user/ClaudeCode.html) — 在带有 EDA 工具的容器里接入 coding agent，了解 agent 如何访问工程、执行构建和测试。

做综合优化，接着看 [Yosys Synthesis Starter](https://yosyshq.readthedocs.io/projects/yosys/en/latest/getting_started/example_synth.html)，逐步观察 FIFO 如何从 RTL 变成网表；做验证，接着看 [SymbiYosys Getting Started](https://symbiyosys.readthedocs.io/en/latest/quickstart.html)，学习断言、有界检查、证明与反例。具体项目见 [AI EDA](/resources/eda/ai-eda) 和 [EDA Optimization](/resources/eda/optimization)。

#### Analog / Mixed-Signal

有电路基础、希望搭建模拟电路设计与优化环境的读者，可以直接沿 [JKU Analog Circuit Design](https://iic-jku.github.io/analog-circuit-design/aicd.html) 学习：第 1、2 章准备 Xschem、ngspice 和开放 PDK，第 3 章学习 gm/ID 尺寸设计，再进入第 8 章的 OTA 仿真、PVT 与 Monte Carlo 分析。课程配有电路文件与 Python notebook。

要把仿真接到参数搜索或 agent 中，再读 [ngspice Control Language Tutorial](https://ngspice.sourceforge.io/ngspice-control-language-tutorial.html) 的循环仿真、修改器件参数和数据导出部分。

### Chip for AI

适合有机器学习或计算机体系结构基础、想研究模型与加速器协同设计的读者。

1. [MIT 6.5940 — TinyML and Efficient AI Computing](https://hanlab.mit.edu/courses/2026-fall-65940) — 适合建立 Hardware-aware ML 的基础。
2. [Timeloop / Accelergy v4](https://timeloop.csail.mit.edu/v4) 与[配套练习](https://github.com/Accelergy-Project/timeloop-accelergy-exercises) — 适合学习 DSE，而不必先实现一套 RTL 加速器。

想进一步理解真实加速器的硬件与软件配合，读 [Gemmini Quick Start](https://github.com/ucb-bar/gemmini#quick-start)：从仿真器中的矩阵乘法示例开始，再读 Architecture 中的脉动阵列、Scratchpad、Accumulator 和数据流。后续按兴趣进入 [Hardware-aware ML](/resources/chip-for-ai/hardware-aware-ml)、[DSE](/resources/chip-for-ai/dse)、[DSA](/resources/chip-for-ai/dsa) 或 [Kernel Optimization](/resources/chip-for-ai/kernel-optimization)。

## Contributors

感谢每一位参与维护的朋友。欢迎补充新工作、修正链接和描述，或贡献可执行环境。

[![Contributors](https://contrib.rocks/image?repo=tapeo-ai/awesome-ai4chip&max=100)](https://github.com/tapeo-ai/awesome-ai4chip/graphs/contributors)

## 交流与联系

欢迎 **Star / 分享 / 提 PR**。可以通过 [Pull requests](https://github.com/tapeo-ai/awesome-ai4chip/pulls) 补充工作、修正内容，或通过 [Issues](https://github.com/tapeo-ai/awesome-ai4chip/issues) 提出建议。

- 邮箱：[dengjiaji@foxnmail.com](mailto:dengjiaji@foxnmail.com)
- 个人 GitHub：[Dengjiaji](https://github.com/Dengjiaji)
- 微信：`dengjiajicarl`，添加时请备注「机构 + 姓名 + 来意」。

欢迎扫码加入 AI4CHIP 微信交流群，一起交流相关研究与工程实践。

<p align="center"><img src="/assets/ai4chip-qrcode.jpg" width="300" alt="AI4CHIP 微信交流群二维码" /></p>
