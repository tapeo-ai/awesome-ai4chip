AI EDA 将模型接入芯片设计与验证，组织工具调用、设计上下文和反馈迭代。这里收录设计 agent、长流程编排，以及支持运行和评测的 harness。 商业产品与平台见 [Closed Source 中的 AI EDA Platforms](/resources/eda/closed-source#ai-eda-platforms)。

## RTL、HLS 与 FPGA 设计

- [ACE-RTL](https://github.com/NVlabs/ACE-RTL)（2026） — NVIDIA 以生成、反思和协调三个角色维护迭代上下文，结合仿真反馈生成、验证与修复 RTL。 [论文](https://arxiv.org/abs/2602.10218) [Nemotron RTL 实践](https://developer.nvidia.com/blog/nvidia-nemotron-3-ultra-leads-open-models-on-accuracy-and-efficiency-in-agentic-rtl-coding/)
- [AHRR](https://github.com/ZijD/AHRR)（2026） — 组合 agent 驱动 HLS 与编译后的 RTL 细化，比较不同抽象层对硬件设计效率的影响。 [论文](https://arxiv.org/abs/2609.21157)
- [AMD Ross](https://github.com/Xilinx/ross-ai-assistant)（2026） — AMD 的 FPGA/SoC agent skills 与示例，通过 MCP 连接 Vivado，覆盖 RTL 仿真、时序分析、HLS 优化和板上调试。 [MCP 与工具下载](https://www.amd.com/en/support/downloads/ross-agentic-ai.html)
- [FPGA-GEN](https://arxiv.org/abs/2611.25351)（2026） — 用显式任务契约和有界工具反馈生成、选择与修复 HLS C，以协同仿真、Vivado 综合和器件适配检查筛选候选，并保留同一 RTL 的验收证据。
- [HLSClaw](https://github.com/gjskywalker/HLSClaw)（2026） — 把 HLS 代码重构和 directive 搜索做成可执行 skills，由 agent 根据综合反馈编排；在真实 HLS 基准上相对 ScaleHLS 取得 1.98 倍几何平均延迟提升。 [论文](https://arxiv.org/abs/2611.02784)
- [LLM Agent-Based Design of RISC-V CPUs with FPGA-in-the-Loop Evaluation](https://arxiv.org/abs/2610.39570)（2026） — 在人类监督下用 Artix-7 板上测量指导 RISC-V 微架构迭代，并以长程运行反馈定位性能退化；公开 RTL 快照与案例记录。 [实验材料](https://github.com/kadomoto-lab/llm-cpu-fpga-loop)
- [MementoHLS](https://github.com/ZD-zhu/MementoHLS)（2026） — 把跨任务 HLS 修复知识写成可执行契约，并用本任务的失败轨迹阻止无效修改；在 94 个 HLS-Eval 任务上报告同一候选的仿真且综合 pass@1 为 58.9%（对照 41.7%）。 [论文](https://arxiv.org/abs/2611.07324)
- [Spec2RTL-Agent](https://arxiv.org/abs/2506.13905)（2025） — NVIDIA、Cadence 与 Georgia Tech 将复杂规格分解为实现计划，通过多 agent 生成和修正可综合 C++，再经 HLS 转换为 RTL。

## 验证、调试与设计数据查询

- [Agentic UVM Testbench Synthesis](https://arxiv.org/abs/2611.16202)（2026） — 从编码接口、协议与覆盖意图的 Verification Manifest 生成 UVM testbench，以分类编译诊断和覆盖缺口双闭环修复，作者在 AMBA 桥接等案例中保留人工纠正。
- [Back-to-the-Future (BTTF)](https://arxiv.org/abs/2610.06790)（2026） — 把仿真波形存入 SQLite，让 agent 根据自然语言查询信号，并关联对应版本的 RTL。
- [ChipXplore](https://github.com/scale-lab/ChipXplore)（2025） — 把 PDK 库与物理设计数据分别组织成 SQL 和图数据库，支持自然语言查询和探索。
- [GI-RTL-Fuzz](https://arxiv.org/abs/2610.38489)（2026） — 以 BNF 语法覆盖引导 LLM 生成 RTL，对 Verilator、Icarus Verilog 和 ModelSim 做差分测试，定位 lint 与仿真输出不一致。
- [GRODE-RTL](https://arxiv.org/abs/2611.25661)（2026） — 从可疑寄存器提取单时钟级扇入锥，将网表节点映射回源码并按依赖距离压缩上下文，帮助工具型 agent 修复跨代码区域的 RTL 故障。
- [MicroAssert](https://arxiv.org/abs/2611.24872)（2026） — 从 CPU RTL 识别微架构功能区域，以结构化契约生成局部与跨区域断言，再用形式证明及覆盖反馈扩展验证范围。
- [RTLExplain](https://research.ibm.com/publications/rtlexplain-a-structured-approach-to-rtl-code-summarization-and-question-answering-for-medium-to-large-designs-using-llms--1)（2025） — IBM 为中大型 RTL 项目构建结构化知识库，结合 RAG 支持代码摘要、文档生成与设计问答。
- [RTLREX](https://arxiv.org/abs/2611.10798)（2026-11-07，补录） — 从门级网表或真值表恢复高层 RTL，以工具辅助结构分析和语法代价改写压缩表示，并用独立等价检查验证全部输入行为。
- [UCAgent](https://github.com/XS-MLVP/UCAgent)（2026） — 以分阶段检查和 Python 验证工具链组织 RTL 验证，连接 Picker、Toffee 与大模型。 [论文](https://arxiv.org/abs/2603.25768)

## 模拟与射频设计

- [AnalogAgent](https://arxiv.org/abs/2603.23910)（2026） — 用代码生成、设计优化、知识整理三个角色及自演化记忆复用模拟设计反馈。
- [AnalogCoder](https://github.com/laiyao1/AnalogCoder)（2025） — 通过 Python/PySpice 代码生成、仿真反馈和子电路库完成模拟电路设计。 [数据](https://github.com/laiyao1/AnalogCoder/blob/main/problem_set.tsv)
- [AnalogCoder-Pro](https://github.com/laiyao1/AnalogCoderPro)（2026） — 结合电路生成、波形图诊断与参数优化，联合探索模拟拓扑和器件尺寸。 [数据](https://github.com/laiyao1/AnalogCoderPro/blob/master/problem_set.tsv)
- [CASCoDe](https://arxiv.org/abs/2611.11710)（2026） — 将模拟尺寸、布局、局部修整与布线组织为分层动作和反馈树搜索，用 DRC/LVS 与寄生后仿真共同驱动 SKY130 放大器的电路与版图协同设计。
- [CRAFT](https://arxiv.org/abs/2611.25908)（2026） — 通过 DeX 的预计算器件查找表、工作点和小信号求解为固定拓扑计算尺寸，在商业 28 nm 电路上以独立 HSPICE 仿真验收最终设计。
- [HeaRT](https://arxiv.org/abs/2511.19669)（2025） — 以层次电路推理树组织子电路、反馈回路识别和规格变化下的设计调整。
- [OPERA](https://arxiv.org/abs/2610.39395)（2026） — 将专家提供的 gm/ID 方法与 gLayout 生成器结合，在设计师审批节点下完成 SKY130 运放尺寸、版图、DRC/LVS 和提取后 PVT 验证。 [基准网表](https://github.com/AMPICLab/AMPICBench)
- [Pixelated RFIC Passive Reasoning](https://arxiv.org/abs/2611.27559)（2026） — 研究语言模型从像素化 RF 无源版图预测阻抗和损耗，以及在有限电磁仿真与网格修改预算下调试设计；区分无工具预测与仿真反馈修复。
- [Power Electronics Schematic Synthesis](https://arxiv.org/abs/2610.38201)（2026） — 将自然语言规格转成经过分销商数据、器件降额和 ngspice 瞬态校核的 KiCad 原理图，覆盖 Buck、Boost、反激、DAB 和半桥 LLC。
- [ReLay](https://arxiv.org/abs/2611.25328)（2026） — 从已有模拟版图恢复 gLayout 生成程序，并把重复结构沉淀为库函数，支持参数缩放、跨 PDK 迁移和后续 agent 的布局复用。
- [RFChipAgent](https://arxiv.org/abs/2610.10858)（2026） — 在人类监督下串联检索、拓扑选择、原理图和尺寸优化，以模拟/RF 仿真反馈驱动多 agent 设计。
- [SGLayout](https://arxiv.org/abs/2611.25410)（2026） — 用 schema 连接代码实例与几何属性，将结构检查、视觉评估和 DRC 违规定位回代码，在 GDSFactory 参数化版图任务中迭代修复。
- [White-Box Reasoning](https://arxiv.org/abs/2508.13172)（2025） — 用 gm/Id 查找表为 LLM 模拟设计推理提供器件数据依据，展示两级运放设计案例。

## 工具编排、评测与跨任务记忆

- [ChipMEM](https://arxiv.org/abs/2609.27067)（2026） — 将经过综合、仿真或形式验证的经验存为跨任务记忆，辅助后续芯片设计工具选择与执行。
- [ChipOmni](https://arxiv.org/abs/2611.13020)（2026-11-09，补录） — 结合多模态理解、动态规划和工具验证更新任务上下文，覆盖模拟电路、RTL、testbench 与断言生成，并报告 RISC-V 规格到微型 SoC GDSII 的案例。
- [Design Conductor / VerCore](https://arxiv.org/abs/2603.08716)（2026） — 从规格生成 RISC-V RTL，完成验证并在 ASAP7 工艺模型下生成 GDS，探索长流程 agent 设计。 [后续 FPGA 案例](https://arxiv.org/abs/2605.05170)
- [Execution-Grounded EDA Scripting](https://arxiv.org/abs/2611.19056v2)（2026-11-14，补录） — 长鑫存储通过 MCP 连接 API 检索、文档和沙箱执行，迭代生成 PyAether、SKILL 与 Tcl 脚本；论文报告生产部署，449 项评测检查脚本效果而非完整 DRC/LVS 签核。
- [Harbor](https://github.com/harbor-framework/harbor) — 以任务说明、容器环境、参考解和评分器组织 agent 评测，支持独立验证环境与轨迹收集。 [任务格式](https://docs.harborframework.com/tasks/overview)
- [HORIZON](https://arxiv.org/abs/2606.28279)（2026） — 用 Markdown 描述设计任务、评估方法和验收条件，组织 agent 在 Git 仓库中迭代开发。
- [JARVIS](https://arxiv.org/abs/2505.14978)（2025） — NVIDIA 在合成 EDA 脚本上微调 ChipNeMo，再结合 API 图检查、规则、检索和多 agent 修复生成工具脚本。
- [MCP4EDA](https://arxiv.org/abs/2507.19570)（2025） — 通过 MCP 编排开源 RTL-to-GDS 工具，并用布局布线后的 PPA 反馈优化综合脚本。
- [Meta-RTL](https://arxiv.org/abs/2611.25891)（2026） — 固定优化模型、EDA 流程与每设计预算，从最小循环演化可执行 RTL 搜索 harness，并用综合、等价检查和未见设计评估搜索策略的迁移。
- [OpenLayout](https://github.com/fenggev56/OpenLayout)（2026） — 用分阶段执行、诊断与优化 agent 编排物理设计；公开实现提供 OpenROAD/Nangate45 流程、可复用 skills 和按时序、DRC 及预算反馈迭代的宏布局任务。 [论文](https://arxiv.org/abs/2611.18517)
- [OpenROAD-MCP](https://github.com/The-OpenROAD-Project/OpenROAD-MCP)（2026） — 为 agent 提供持久 OpenROAD 会话、命令执行、历史指标和 ORFS 报告图访问。
- [PCBRouteAgent](https://chip-ai-agent.github.io/research/pcbrouteagent/)（2026） — 面向 PCB 布线的多模态 agent，将全局布线规划、KiCad 原生布线执行与反馈驱动重规划结合，并在 PCBWorld-Bench 上评估。 [论文](https://arxiv.org/abs/2611.08175)
- [SiliconGym](https://arxiv.org/abs/2611.25658)（2026） — 以版本化工作区、执行预算和验收门控评分统一 RTL、testbench、PPA、仓库修复与 SoC 流程，支持状态化 RL 交互及开源和商业工具后端的配对评估。
- [TuRTLe](https://github.com/HPAI-BSC/TuRTLe)（2025） — 统一多套 RTL 基准和 EDA 工具，覆盖语法、功能、等价、综合、PPA 与代码补全指标。 [论文](https://arxiv.org/abs/2504.01986)
