---
title: "AI-Driven Design and Model-Hardware Co-design"
description: "AI-assisted architecture design and joint optimization of models, operators, and hardware."
---

This section extends from AI-assisted design to the joint design of models, chips, compilers, and clusters, focusing on work with technical material or accessible tools.

## AI-Driven Architecture and Co-design

- [AlphaEvolve](https://deepmind.google/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/) (2025–2026) — Combines LLMs, program evolution, and automated verification to optimize algorithms, with official examples in TPU arithmetic circuits, training kernels, and data-center scheduling. [Follow-up Case Studies](https://deepmind.google/blog/alphaevolve-impact/)
- [CHIA](https://github.com/ucb-bar/chia) (2026) — Uses workflow graphs and an extensible runtime for AI-driven hardware/software co-design experiments, with examples covering RTL, gem5 alignment, microarchitecture implementation, and critical-path optimization. [Paper](https://arxiv.org/abs/2606.27350)

## Model, Operator, and Hardware Co-design

- [BitNet / bitnet.cpp](https://github.com/microsoft/BitNet) — Incorporates low-bit representations such as ternary weights into model training and provides CPU/GPU inference kernels, connecting model precision choices with execution hardware. [System Paper](https://arxiv.org/abs/2502.11880)
- [FlashAttention](https://github.com/Dao-AILab/flash-attention) — Designs exact attention around GPU memory hierarchies and data movement, illustrating joint optimization of algorithms, kernels, and hardware.
- [Insights into DeepSeek-V3](https://arxiv.org/abs/2505.09343) (2025) — Examines how MLA, MoE, FP8, and network topology shape large-model training and inference requirements for compute, memory, and communication hardware.
- [Native Sparse Attention](https://arxiv.org/abs/2502.11089) (2025) — Co-designs trainable sparse attention with hardware arithmetic intensity and access patterns, combining token compression, selection, and local windows.
