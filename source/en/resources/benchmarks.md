---
title: "Benchmarks and Evaluation"
description: "Evaluation of RTL, verification, PPA, physical design, long-running workflows, and analog circuits."
---

## RTL Generation, Understanding, and Repository Context

- [ChipVerilog](https://github.com/HKUSTGZ-MICS-LYU/ChipVerilog) (2026) — Builds multilevel RTL generation tasks from OpenCores designs, combining module equivalence checks with system-level simulation. [Paper](https://arxiv.org/abs/2607.13079)
- [NotSoTiny](https://huggingface.co/datasets/HPAI-BSC/NotSoTiny-26-07) (2025) — Builds contextual module-completion tasks from ongoing Tiny Tapeout projects, using formal equivalence checks to address limitations of static benchmarks. [Paper](https://arxiv.org/abs/2512.20823) [Code](https://github.com/HPAI-BSC/TuRTLe)
- [RTL-BenchMT](https://github.com/hkust-zhiyao/RTL-BenchMT) (2026) — Uses agents and formal verification to identify specification ambiguities, revise problems, and expand RTL generation benchmarks.
- [RTLLM](https://github.com/hkust-zhiyao/RTLLM) (2023) — Evaluates RTL generation from natural-language specifications, with reference designs, testbenches, and synthesis-quality measurements. [Paper](https://arxiv.org/abs/2308.05345)
- [VerilogEval](https://github.com/NVlabs/verilog-eval) (2023) — Evaluates Verilog completion and specification-to-RTL generation, using simulation to check functionality and analyze common failures. [Paper](https://arxiv.org/abs/2309.07544)
- [Vhdl-RepoBench](https://arxiv.org/abs/2610.05380) (2026) — Preserves VHDL hierarchy and cross-file dependencies to evaluate completion, repository summarization, and specification-to-module generation.

## Verification, Assertions, and Debugging

- [AssertionBench](https://github.com/achieve-lab/assertion_data_for_LLM) (2025) — Evaluates LLM-generated RTL assertions using OpenCores designs and formally checked reference assertions. [Paper](https://arxiv.org/abs/2406.18627)
- [AssertLLM2](https://github.com/hkust-zhiyao/AssertLLM2) (2026) — Evaluates how SVA prevents and detects bugs using specifications, complete RTL, and injected mutations. Reproduction requires JasperGold. [Paper](https://arxiv.org/abs/2605.27472)
- [FIXME](https://github.com/ChatDesignVerification/FIXME) (2025) — Covers specification understanding, reference models, testbenches, SVA generation, and RTL repair with textual and multimodal specifications. The current flow depends on VCS and VC Static. [Paper](https://arxiv.org/abs/2507.04276)
- [FVEval](https://github.com/NVlabs/FVEval) (2024) — Evaluates formal verification capabilities through NL2SVA and Design2SVA assertion-generation tasks. Full evaluation requires Cadence Jasper. [Paper](https://arxiv.org/abs/2410.23299)
- [HierSVA](https://arxiv.org/abs/2606.13706) (2026) — Builds reference SVA for hierarchical RTL and separately evaluates provability, vacuity, specification alignment, mutation detection, and coverage. Reproduction requires VC Formal. [Code](https://github.com/HierSVAAnon/HierSVACodeAndArtifacts) [Data](https://huggingface.co/datasets/AnonymousHierSVA/HierSVA)
- [ICCAD 2026 — Regression Failure Bucketing](https://www.iccad-contest.org/2026/Problems.html) (2026) — Synopsys' verification regression failure-bucketing task, with problem descriptions, test materials, and interim evaluation results.

## PPA Optimization and HLS

- [Bench4HLS](https://github.com/zfsadik/Bench4HLS) (2026) — Evaluates simulation correctness, synthesizability, and PPA of LLM-generated HLS C++, from kernels to accelerators. The current toolchain uses Vitis HLS/Vivado. [Paper](https://arxiv.org/abs/2601.19941)
- [CktEvo](https://github.com/cure-lab/cktevo) (2026) — Targets multi-file IP repositories to optimize RTL PPA while preserving functional correctness. [Paper](https://arxiv.org/abs/2603.08718)
- [MetRex](https://github.com/scale-lab/MetRex) (2025) — Pairs RTL with synthesized area, delay, static power, and natural-language reasoning to evaluate metric estimation. [Paper](https://arxiv.org/abs/2411.03471) [Data](https://huggingface.co/datasets/scale-lab/MetRex)
- [Pluto](https://github.com/scale-lab/Pluto) (2025) — Evaluates the efficiency of LLM-generated hardware against reference implementations optimized separately for area, delay, and power. [Paper](https://arxiv.org/abs/2510.14756) [Data](https://huggingface.co/datasets/scale-lab/Pluto)
- [RTL-OPT](https://github.com/hkust-zhiyao/RTL-OPT) (2026) — Provides pairs of suboptimal RTL and manually optimized references to evaluate PPA improvements that preserve functionality. [Paper](https://arxiv.org/abs/2601.01765)

## Netlists and Physical Design

- [FloorSet Challenge](https://github.com/IntelLabs/FloorSet/blob/main/iccad2026contest/README.md) (2026) — Intel provides synthetic SoC floorplanning data with design constraints, optimizer templates, and evaluation scripts for comparing data-driven floorplanning methods.
- [ICCAD 2025 — Incremental Placement Optimization](https://www.iccad-contest.org/2025/Problems.html) (2025) — NVIDIA's joint gate-sizing, buffer-insertion, and cell-movement task evaluates incremental optimization after detailed placement. [Paper Page](https://research.nvidia.com/labs/electronic-design-automation/publication/lu2025iccad/)
- [ICCAD 2026 — LLM-Assisted Netlist Exploration and Transformation](https://www.iccad-contest.org/2026/Problems.html) (2026) — Cadence's LLM-assisted netlist exploration and transformation task, with problem descriptions and test materials.

## Integrated Design Tasks and Long-Running Workflow Evaluation

- [Build-A-Chip-Bench](https://chipagents.ai/research/build-a-chip-bench) (2026) — Evaluates agents from workload specifications to GDS, checking functionality, timing, routing, and DRC before scoring PPA. The live leaderboard is forthcoming.
- [ChipBench](https://github.com/zhongkaiyu/ChipBench) (2026) — Covers hierarchical Verilog generation, RTL debugging, and generation of Python, SystemC, and CXXRTL reference models. [Paper](https://arxiv.org/abs/2601.21448)
- [CLOSER-Bench](https://arxiv.org/abs/2607.16632) (2026) — Compares spec-to-RTL, RTL-to-GDS, and spec-to-GDS workflows across 10 experimental tasks, studying budget allocation and cross-stage repair.
- [CVDP](https://github.com/NVlabs/cvdp_benchmark) (2025) — Engineer-written chip design and verification tasks spanning single modules and repositories, with Docker environments. Some tasks use commercial EDA tools. [Paper](https://arxiv.org/abs/2506.14074) [Data](https://huggingface.co/datasets/nvidia/cvdp-benchmark-dataset)

## Analog, Mixed-Signal, and Multimodal Evaluation

- [AMSbench](https://github.com/Why0912/AMSBench) (2025) — A multimodal benchmark for analog and mixed-signal schematic perception, analysis, and design. [Data](https://huggingface.co/datasets/wwhhyy/AMSBench)
- [AnalogGym](https://github.com/CODA-Team/AnalogGym) (2024) — Provides multiple analog topologies, specifications, and simulation tests for comparing automated sizing methods.
- [CircuitSense](https://github.com/xz-group/CircuitSense) (2026) — Evaluates circuit-image perception, symbolic equation derivation, and design reasoning, with a synthetic data generation pipeline. [Data](https://huggingface.co/datasets/armanakbari4/CircuitSense)
- [Long-Horizon Analog Design Bench](https://arxiv.org/abs/2609.33356) (2026) — Evaluates analog and mixed-signal agents on long-running SKY130/ngspice design tasks, using schematic-level electrical specifications for acceptance.
- [NetlistBench](https://arxiv.org/abs/2608.12197) (2026) — Uses deterministic structural oracles to assess SPICE netlist recognition, editing, hierarchy operations, and equivalence judgments.
