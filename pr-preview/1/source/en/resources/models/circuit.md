---
title: "Non-LLM Models"
description: "Circuit generation, policy networks, graph representation learning, and surrogate models."
---

## Specialized Generative Models and Policy Networks

- [AnalogGenie](https://github.com/xz-group/AnalogGenie) (2025) — Represents circuits as device-pin sequences and trains an approximately 12M-parameter autoregressive Transformer from scratch to generate analog circuit topologies. [Paper](https://openreview.net/forum?id=jCPak79Kev) [Data](https://huggingface.co/datasets/JianGao666/AnalogGenie)
- [AstRL](https://arxiv.org/abs/2602.12402) (2026) — Uses a graph neural network as a transistor-topology policy, combining expert behavior cloning, PPO, and simulation feedback to generate analog and mixed-signal circuits.
- [LEGO-Size](https://research.nvidia.com/labs/electronic-design-automation/publication/lu2025ispd/) (2025) — NVIDIA pretrains a specialized Transformer on library-cell sequences with self-supervision, follows with supervised learning, and uses GPU-based differentiable timing analysis to optimize gate sizes. [Paper](https://research.nvidia.com/labs/electronic-design-automation/papers/yichen_LEGO_ispd25.pdf)

## Circuit Representations and Surrogate Models

- [DeepGate4](https://github.com/zyzheng17/DeepGate4-ICLR-25) (2025) — Combines a GNN encoder with a sparse graph Transformer, using gate-level and graph-level multitask supervision to learn functional and structural representations of large AIGs. [Paper](https://arxiv.org/abs/2502.01681)
- [Multimodal Thermal Solver for 3DICs](https://doi.org/10.1109/MLCAD65511.2025.11189201) (2025) — UMD and Synopsys combine block-level thermal response learning, multimodal mapping, and linear superposition to predict thermal fields across chip sizes and power distributions. [Technical Talk](https://www.ieee-edps.com/archives/2025/c/0400chang.pdf)
- [Pieceformer](https://arxiv.org/abs/2506.15907) (2025) — Georgia Tech and Cadence combine message passing, partitioned graph Transformers, and contrastive self-supervision to measure netlist similarity and reuse partitioning experience.
- [TRACE](https://github.com/zyzheng17/TRACE_DAC26) (2026) — Encodes RTL and netlists with a Transformer that follows logical levels, learning circuit representations through function-shift prediction and contrastive learning. [Paper](https://arxiv.org/abs/2509.21886) [Data](https://huggingface.co/datasets/zyzheng23/TRACE_dataset)
