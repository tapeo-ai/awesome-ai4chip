AI EDA 将模型接入芯片设计与验证，组织工具调用、设计上下文和反馈迭代。这里收录设计 agent、长流程编排，以及支持运行和评测的 harness。 商业产品与平台见 [Closed Source 中的 AI EDA Platforms](/resources/eda/closed-source#ai-eda-platforms)。

## RTL、HLS 与 FPGA 设计

- [ACE-RTL](https://github.com/NVlabs/ACE-RTL)（2026） — NVIDIA 以生成、反思和协调三个角色维护迭代上下文，结合仿真反馈生成、验证与修复 RTL。 [论文](https://arxiv.org/abs/2602.10218) [Nemotron RTL 实践](https://developer.nvidia.com/blog/nvidia-nemotron-3-ultra-leads-open-models-on-accuracy-and-efficiency-in-agentic-rtl-coding/)
- [AHRR](https://github.com/ZijD/AHRR)（2026） — 组合 agent 驱动 HLS 与编译后的 RTL 细化，比较不同抽象层对硬件设计效率的影响。 [论文](https://arxiv.org/abs/2609.21157)
- [AMD Ross](https://github.com/Xilinx/ross-ai-assistant)（2026） — AMD 的 FPGA/SoC agent skills 与示例，通过 MCP 连接 Vivado，覆盖 RTL 仿真、时序分析、HLS 优化和板上调试。 [MCP 与工具下载](https://www.amd.com/en/support/downloads/ross-agentic-ai.html)
- [Spec2RTL-Agent](https://arxiv.org/abs/2506.13905)（2025） — NVIDIA、Cadence 与 Georgia Tech 将复杂规格分解为实现计划，通过多 agent 生成和修正可综合 C++，再经 HLS 转换为 RTL。

## 验证、调试与设计数据查询

- [Back-to-the-Future (BTTF)](https://arxiv.org/abs/2610.06790)（2026） — 把仿真波形存入 SQLite，让 agent 根据自然语言查询信号，并关联对应版本的 RTL。
- [ChipXplore](https://github.com/scale-lab/ChipXplore)（2025） — 把 PDK 库与物理设计数据分别组织成 SQL 和图数据库，支持自然语言查询和探索。
- [RTLExplain](https://research.ibm.com/publications/rtlexplain-a-structured-approach-to-rtl-code-summarization-and-question-answering-for-medium-to-large-designs-using-llms--1)（2025） — IBM 为中大型 RTL 项目构建结构化知识库，结合 RAG 支持代码摘要、文档生成与设计问答。
- [UCAgent](https://github.com/XS-MLVP/UCAgent)（2026） — 以分阶段检查和 Python 验证工具链组织 RTL 验证，连接 Picker、Toffee 与大模型。 [论文](https://arxiv.org/abs/2603.25768)

## 模拟与射频设计

- [AnalogAgent](https://arxiv.org/abs/2603.23910)（2026） — 用代码生成、设计优化、知识整理三个角色及自演化记忆复用模拟设计反馈。
- [AnalogCoder](https://github.com/laiyao1/AnalogCoder)（2025） — 通过 Python/PySpice 代码生成、仿真反馈和子电路库完成模拟电路设计。 [数据](https://github.com/laiyao1/AnalogCoder/blob/main/problem_set.tsv)
- [AnalogCoder-Pro](https://github.com/laiyao1/AnalogCoderPro)（2026） — 结合电路生成、波形图诊断与参数优化，联合探索模拟拓扑和器件尺寸。 [数据](https://github.com/laiyao1/AnalogCoderPro/blob/master/problem_set.tsv)
- [HeaRT](https://arxiv.org/abs/2511.19669)（2025） — 以层次电路推理树组织子电路、反馈回路识别和规格变化下的设计调整。
- [RFChipAgent](https://arxiv.org/abs/2610.10858)（2026） — 在人类监督下串联检索、拓扑选择、原理图和尺寸优化，以模拟/RF 仿真反馈驱动多 agent 设计。
- [White-Box Reasoning](https://arxiv.org/abs/2508.13172)（2025） — 用 gm/Id 查找表为 LLM 模拟设计推理提供器件数据依据，展示两级运放设计案例。

## 工具编排、评测与跨任务记忆

- [ChipMEM](https://arxiv.org/abs/2609.27067)（2026） — 将经过综合、仿真或形式验证的经验存为跨任务记忆，辅助后续芯片设计工具选择与执行。
- [Design Conductor / VerCore](https://arxiv.org/abs/2603.08716)（2026） — 从规格生成 RISC-V RTL，完成验证并在 ASAP7 工艺模型下生成 GDS，探索长流程 agent 设计。 [后续 FPGA 案例](https://arxiv.org/abs/2605.05170)
- [Harbor](https://github.com/harbor-framework/harbor) — 以任务说明、容器环境、参考解和评分器组织 agent 评测，支持独立验证环境与轨迹收集。 [任务格式](https://docs.harborframework.com/tasks/overview)
- [HORIZON](https://arxiv.org/abs/2606.28279)（2026） — 用 Markdown 描述设计任务、评估方法和验收条件，组织 agent 在 Git 仓库中迭代开发。
- [JARVIS](https://arxiv.org/abs/2505.14978)（2025） — NVIDIA 在合成 EDA 脚本上微调 ChipNeMo，再结合 API 图检查、规则、检索和多 agent 修复生成工具脚本。
- [MCP4EDA](https://arxiv.org/abs/2507.19570)（2025） — 通过 MCP 编排开源 RTL-to-GDS 工具，并用布局布线后的 PPA 反馈优化综合脚本。
- [OpenROAD-MCP](https://github.com/The-OpenROAD-Project/OpenROAD-MCP)（2026） — 为 agent 提供持久 OpenROAD 会话、命令执行、历史指标和 ORFS 报告图访问。
- [TuRTLe](https://github.com/HPAI-BSC/TuRTLe)（2025） — 统一多套 RTL 基准和 EDA 工具，覆盖语法、功能、等价、综合、PPA 与代码补全指标。 [论文](https://arxiv.org/abs/2504.01986)
