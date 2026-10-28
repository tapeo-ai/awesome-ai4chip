---
title: "Hardware-aware ML"
description: "Model precision, attention mechanisms, and algorithms designed around hardware constraints."
---

## Models and Algorithms

- [BitNet / bitnet.cpp](https://github.com/microsoft/BitNet) — Incorporates low-bit representations such as ternary weights into model training and provides CPU/GPU inference kernels, connecting model precision choices with execution hardware. [System Paper](https://arxiv.org/abs/2502.11880)
- [FlashAttention](https://github.com/Dao-AILab/flash-attention) — Designs exact attention around GPU memory hierarchies and data movement, illustrating joint optimization of algorithms, kernels, and hardware.
- [Insights into DeepSeek-V3](https://arxiv.org/abs/2505.09343) (2025) — Examines how MLA, MoE, FP8, and network topology shape large-model training and inference requirements for compute, memory, and communication hardware.
- [Native Sparse Attention](https://arxiv.org/abs/2502.11089) (2025) — Co-designs trainable sparse attention with hardware arithmetic intensity and access patterns, combining token compression, selection, and local windows.
