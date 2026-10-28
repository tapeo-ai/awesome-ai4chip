---
title: "Data"
description: "RTL 语料、网表与原理图数据，以及设计数据接口和指标格式。"
---

## RTL 语料与合成数据

- [CircuitWeave](https://arxiv.org/abs/2607.23523)（2026） — 通过结构化电路契约融合合成原理图拓扑与文本行为规格，提供可执行的 RTL 生成数据。 [数据](https://huggingface.co/datasets/fengjiahao0421/CircuitWeave)
- [DeepCircuitX](https://zeju.gitbook.io/lcm-team/deepcircuitx/introduction-of-our-dataset)（2025） — 覆盖仓库、文件、模块和代码块的 RTL 及多粒度注释，并关联综合网表和 PPA 数据。 [论文](https://arxiv.org/abs/2502.18297)
- [hdl2v](https://arxiv.org/abs/2506.04544)（2025） — 将 VHDL、Chisel 和 PyMTL3 代码翻译或编译成 Verilog，扩展训练所用的人类编写 HDL 语料。 [数据](https://huggingface.co/datasets/hdl2v/vhdl-dataset)
- [PyraNet](https://huggingface.co/datasets/bnadimi/PyraNet-Verilog)（2025） — 提供带描述、编译信息、复杂度与质量排序的分层 Verilog 数据。 [论文](https://arxiv.org/abs/2412.06947)
- [VerilogDB](https://arxiv.org/abs/2507.13369)（2025） — 通过语法、可综合性检查与模块元信息提取构建用于 RTL 模型训练的结构化 Verilog 数据库。

## 网表、原理图与物理设计数据

- [CircuitNet (1.0–3.0)](https://circuitnet.github.io/)（2022–2026） — 提供面向拥塞、DRC、IR drop、时序及 RTL-to-layout 学习的多模态设计数据。 [代码](https://github.com/circuitnet/CircuitNet) [数据](https://circuitnet.github.io/intro/download.html)
- [Masala-CHAI](https://github.com/jitendra-bhandari/Masala-CHAI)（2024–2026） — 通过多模态模型、元件检测和验证，把模拟电路原理图转换为 SPICE 网表与数据。
- [Netlistify](https://github.com/NYCU-AI-EDA/Netlistify)（2025） — NYCU 与 NVIDIA 联合识别器件、方向和连线，将原理图转换成 SPICE 网表，并提供合成图像数据与预训练模型。 [论文](https://research.nvidia.com/labs/electronic-design-automation/papers/netlistify_mlcad25.pdf)

## 数据接口与指标格式

- [CircuitOps](https://github.com/NVlabs/CircuitOps)（2023） — 以关系表和属性图统一电路中间表示，连接 EDA 数据导出、ML 数据集构建与部署。
- [METRICS2.1 / Metrics4ML](https://github.com/ieee-ceda-datc/datc-rdf-Metrics4ML)（2021） — 定义 RTL-to-GDS 流程指标的 JSON 命名和层次结构，并提供可追溯实验数据。
