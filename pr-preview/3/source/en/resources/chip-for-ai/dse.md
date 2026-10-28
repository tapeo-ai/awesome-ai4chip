---
title: "DSE (Design Space Exploration)"
description: "Search, simulation, and performance modeling for exploring accelerator architectures, mappings, and cluster configurations."
---

## Search and Experiment Frameworks

- [AlphaEvolve](https://deepmind.google/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/) (2025–2026) — Combines LLMs, program evolution, and automated verification to optimize algorithms, with official examples in TPU arithmetic circuits, training kernels, and data-center scheduling. [Follow-up Case Studies](https://deepmind.google/blog/alphaevolve-impact/)
- [ArchGym](https://github.com/srivatsankrishnan/oss-arch-gym) (2023) — Unifies search-algorithm and architecture-simulator interfaces for ML-driven design-space exploration and experimental data collection. [Paper](https://arxiv.org/abs/2306.08888)
- [CHIA](https://github.com/ucb-bar/chia) (2026) — Uses workflow graphs and an extensible runtime for AI-driven hardware/software co-design experiments, with examples covering RTL, gem5 alignment, microarchitecture implementation, and critical-path optimization. [Paper](https://arxiv.org/abs/2606.27350)

## Architecture and Mapping Evaluation

- [Accel-Sim](https://accel-sim.github.io/) — Combines trace-driven simulation and hardware validation for programmable accelerators such as GPUs, with power modeling for architecture and AI workload research.
- [GenZ](https://github.com/abhibambhaniya/GenZ-LLM-Analyzer) (2024) — Analyzes compute, memory, and communication requirements across LLM inference scenarios to explore relationships between model characteristics and platform design parameters. [Paper](https://arxiv.org/abs/2406.01698)
- [LLMCompass](https://github.com/PrincetonUniversity/LLMCompass) (2024) — Evaluates LLM inference platforms using execution, hardware mapping, and area-cost models, supporting chip-parameter and system-configuration exploration. [Paper](https://arxiv.org/abs/2312.03134)
- [MAESTRO](https://github.com/maestro-project/maestro) — Uses dataflow and tiling descriptions to analyze data reuse, performance, and hardware costs in DNN accelerators.
- [SCALE-Sim v3](https://github.com/scalesim-project/scale-sim-v3) (2025) — Performs cycle-level simulation for a specified network and systolic-array configuration, producing timing, memory-bandwidth, and access traces. [v3 Paper](https://arxiv.org/abs/2504.15377)
- [Timeloop / Accelergy](https://timeloop.csail.mit.edu/) — Explores tensor-accelerator design spaces through workload, architecture, and mapping descriptions, estimating performance, data movement, energy, and area. [Code](https://github.com/NVlabs/timeloop) [Related Code](https://github.com/Accelergy-Project/accelergy) [Format](https://timeloop.csail.mit.edu/v4/input-formats/design)
- [ZigZag](https://github.com/KULeuven-MICAS/zigzag) — Jointly explores DNN accelerator memory hierarchies, spatial and temporal mappings, energy, and latency, with extensions for compute-in-memory. [Paper](https://arxiv.org/abs/2007.11360)

## Clusters and Workloads

- [ASTRA-sim](https://github.com/astra-sim/astra-sim) — Jointly simulates distributed AI workload scheduling, collective communication, and compute/memory/network architectures for multilevel system design exploration. [Follow-up Paper](https://arxiv.org/abs/2606.10440)
- [MLCommons Chakra](https://github.com/mlcommons/chakra) — Represents AI workload computation, memory access, communication, and dependencies as open execution graphs, with trace conversion, generation, and simulation integration tools. [Format and Tool Guide](https://github.com/mlcommons/chakra/blob/main/USER_GUIDE.md) [Updated Paper](https://arxiv.org/abs/2605.11333)
