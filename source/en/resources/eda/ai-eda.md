---
title: "AI EDA"
description: "Chip design agents, tool orchestration, verification, debugging, and cross-task memory."
---

AI EDA connects models to chip design and verification through tool use, design context and iterative feedback. This page covers design agents, long-running workflows, and the harnesses used to execute and evaluate them. For commercial products and platforms, see [AI EDA Platforms in Closed Source](/en/resources/eda/closed-source#ai-eda-platforms).

## RTL, HLS, and FPGA Design

- [ACE-RTL](https://github.com/NVlabs/ACE-RTL) (2026) — NVIDIA uses generation, reflection, and coordination roles to maintain iterative context, combining simulation feedback with RTL generation, verification, and repair. [Paper](https://arxiv.org/abs/2602.10218) [Nemotron RTL Case Study](https://developer.nvidia.com/blog/nvidia-nemotron-3-ultra-leads-open-models-on-accuracy-and-efficiency-in-agentic-rtl-coding/)
- [AHRR](https://github.com/ZijD/AHRR) (2026) — Combines agent-driven HLS with refinement of the compiled RTL to compare how abstraction levels affect hardware design efficiency. [Paper](https://arxiv.org/abs/2609.21157)
- [AMD Ross](https://github.com/Xilinx/ross-ai-assistant) (2026) — AMD's FPGA/SoC agent skills and examples connect to Vivado through MCP, covering RTL simulation, timing analysis, HLS optimization, and on-board debugging. [MCP and Tool Downloads](https://www.amd.com/en/support/downloads/ross-agentic-ai.html)
- [Spec2RTL-Agent](https://arxiv.org/abs/2506.13905) (2025) — NVIDIA, Cadence, and Georgia Tech decompose complex specifications into implementation plans, use multiple agents to generate and repair synthesizable C++, and convert it to RTL through HLS.

## Verification, Debugging, and Design Data Queries

- [Back-to-the-Future (BTTF)](https://arxiv.org/abs/2610.06790) (2026) — Stores simulation waveforms in SQLite so agents can query signals in natural language and correlate them with versioned RTL.
- [ChipXplore](https://github.com/scale-lab/ChipXplore) (2025) — Organizes PDK libraries and physical design data into SQL and graph databases for natural-language queries and exploration.
- [RTLExplain](https://research.ibm.com/publications/rtlexplain-a-structured-approach-to-rtl-code-summarization-and-question-answering-for-medium-to-large-designs-using-llms--1) (2025) — IBM builds structured knowledge bases for medium-to-large RTL projects, using RAG for code summaries, documentation generation, and design Q&A.
- [UCAgent](https://github.com/XS-MLVP/UCAgent) (2026) — Organizes RTL verification through staged checks and a Python verification toolchain, connecting Picker, Toffee, and language models. [Paper](https://arxiv.org/abs/2603.25768)

## Analog and RF Design

- [AnalogAgent](https://arxiv.org/abs/2603.23910) (2026) — Uses separate roles for code generation, design optimization, and knowledge organization, with evolving memory to reuse analog design feedback.
- [AnalogCoder](https://github.com/laiyao1/AnalogCoder) (2025) — Designs analog circuits through Python/PySpice code generation, simulation feedback, and a subcircuit library. [Data](https://github.com/laiyao1/AnalogCoder/blob/main/problem_set.tsv)
- [AnalogCoder-Pro](https://github.com/laiyao1/AnalogCoderPro) (2026) — Combines circuit generation, waveform-image diagnosis, and parameter optimization to jointly explore analog topologies and device sizes. [Data](https://github.com/laiyao1/AnalogCoderPro/blob/master/problem_set.tsv)
- [HeaRT](https://arxiv.org/abs/2511.19669) (2025) — Uses hierarchical circuit reasoning trees to organize subcircuit and feedback-loop identification, and to adapt designs when specifications change.
- [RFChipAgent](https://arxiv.org/abs/2610.10858) (2026) — Connects retrieval, topology selection, schematic construction, and sizing under human supervision, using analog/RF simulation feedback to guide multiple agents.
- [White-Box Reasoning](https://arxiv.org/abs/2508.13172) (2025) — Grounds LLM reasoning about analog design in device data from gm/Id lookup tables, demonstrated on a two-stage operational amplifier.

## Tool Orchestration, Evaluation, and Cross-Task Memory

- [ChipMEM](https://arxiv.org/abs/2609.27067) (2026) — Stores experience checked by synthesis, simulation, or formal verification as cross-task memory to guide later tool selection and execution.
- [Design Conductor / VerCore](https://arxiv.org/abs/2603.08716) (2026) — Generates RISC-V RTL from specifications, verifies it, and produces GDS using ASAP7 technology models to explore long-running agent design workflows. [Follow-up FPGA Case Study](https://arxiv.org/abs/2605.05170)
- [Harbor](https://github.com/harbor-framework/harbor) — Organizes agent evaluation around task instructions, container environments, reference solutions, and graders, supporting separate verifier environments and trajectory collection. [Task Format](https://docs.harborframework.com/tasks/overview)
- [HORIZON](https://arxiv.org/abs/2606.28279) (2026) — Uses Markdown to describe design tasks, evaluation methods, and acceptance criteria, guiding agents through iterative development in Git repositories.
- [JARVIS](https://arxiv.org/abs/2505.14978) (2025) — NVIDIA fine-tunes ChipNeMo on synthetic EDA scripts, then combines API-graph checks, rules, retrieval, and multi-agent repair to generate tool scripts.
- [MCP4EDA](https://arxiv.org/abs/2507.19570) (2025) — Orchestrates open-source RTL-to-GDS tools through MCP and optimizes synthesis scripts using post-place-and-route PPA feedback.
- [OpenROAD-MCP](https://github.com/The-OpenROAD-Project/OpenROAD-MCP) (2026) — Provides agents with persistent OpenROAD sessions, command execution, historical metrics, and access to ORFS report plots.
- [TuRTLe](https://github.com/HPAI-BSC/TuRTLe) (2025) — Unifies multiple RTL benchmarks and EDA tools, covering syntax, functionality, equivalence, synthesis, PPA, and code-completion metrics. [Paper](https://arxiv.org/abs/2504.01986)
