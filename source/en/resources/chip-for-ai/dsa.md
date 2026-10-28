---
title: "DSA (Domain-specific Architecture)"
description: "Specialized accelerators, model-specific chips, and compute-in-memory architectures for AI workloads."
---

## Domain-specific Accelerators

- [Etched](https://www.etched.com/) — Co-designs chips, racks, interconnects, and software for large-model inference, with material on low-voltage inference and cluster-level memory.
- [Gemmini](https://github.com/ucb-bar/gemmini) (2019/2021) — A parameterized systolic-array accelerator generator that combines RTL, a RISC-V host, memory systems, and software for full-system DNN evaluation. [Paper](https://arxiv.org/abs/1911.09925)
- [Jalapeño](https://openai.com/index/jalapeno-first-results/) (2026) — OpenAI's example of co-designing chips, memory, networking, and inference software, also describing the use of AI in hardware design and kernel optimization.
- [Taalas HC1](https://taalas.com/the-path-to-ubiquitous-ai/) (2026) — Hardwires specific models into silicon; the HC1 demonstration runs Llama 3.1 8B, with official material on its architecture and inference approach.

## CIM (Compute-in-Memory)

- [AccelForge / HWComponents](https://github.com/Accelergy-Project/accelforge) — Carry forward CiMLoop architecture and component models to evaluate mappings, area, energy, and latency for accelerators including compute-in-memory; the original CiMLoop repository is no longer maintained. [Component Models](https://github.com/Accelergy-Project/hwcomponents) [Original CiMLoop Repository](https://github.com/mit-emze/cimloop) [CiMLoop Paper](https://arxiv.org/abs/2405.07259)
- [CrossSim](https://github.com/sandialabs/cross-sim) — Evaluates how analog crossbar nonidealities, including device errors, drift, noise, and ADC effects, affect algorithm accuracy, with hardware-aware training support.
- [DNN+NeuroSim](https://github.com/neurosim/NeuroSim) — Combines device, circuit, and DNN models to assess the accuracy, performance, energy, and area of compute-in-memory accelerators.
- [IBM AIHWKit / AIHWKit-Lightning](https://github.com/IBM/aihwkit) — Models analog compute-in-memory noise and nonidealities in PyTorch, supporting hardware-aware training. [AIHWKit-Lightning](https://github.com/IBM/aihwkit-lightning)
