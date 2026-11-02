---
title: "Kernel Optimization"
description: "面向 GPU、CPU 和加速器的 kernel 生成、优化、评测与编译工具。"
---

## 生成、优化与评测

- [AccelOpt](https://github.com/zhang677/AccelOpt)（2025/2026） — 利用 slow–fast kernel 对积累优化记忆，在 AWS Trainium 上自主优化 kernel，并提供 NKIBench。 [论文](https://arxiv.org/abs/2511.15915)
- [AKG kernel Agent](https://arxiv.org/abs/2512.23424)（2025） — 用多 agent 自动完成跨 GPU/NPU 的 kernel 生成、迁移和调优，支持多种 kernel DSL。
- [Atrex Kernel Agent](https://github.com/alibaba/atrex-kernel-agent)（2026） — 围绕 GPU 知识库、profiling 工具与结构化工作流完成 kernel 实现、诊断及迭代优化。
- [AutoProfiler](https://github.com/Satissss/AutoProfiler)（2026） — 由优化反馈学习确定性的 profiling 决策树，按 kernel 选择硬件计数器，在固定测量预算内为一次 LLM kernel 改写提供信息。 [论文](https://arxiv.org/abs/2610.36576)
- [AWS Neuron Agentic Development](https://github.com/aws-neuron/neuron-agentic-development) — AWS 官方 NKI agent 工具，覆盖 kernel 编写、编译修复、profiling、性能分析及 API 迁移。
- [CUDA Agent](https://github.com/BytedTsinghua-SIA/CUDA-Agent)（2026） — 把大规模 agentic RL、CUDA 任务数据、专家 skills 与可验证执行环境结合，训练高性能 kernel 生成能力。 [论文](https://arxiv.org/abs/2602.24286)
- [CUDA-L1](https://github.com/ornith-ai/CUDA-L1)（2025/2026） — 以对比强化学习和执行反馈优化 CUDA kernel，讨论性能奖励设计及 reward hacking。 [论文](https://arxiv.org/abs/2507.14111)
- [KernelBench](https://github.com/ScalingIntelligence/KernelBench)（2025） — 以 PyTorch 任务评估模型能否生成正确且更快的 GPU kernel，并提供运行与测量工具。
- [Kevin-32B](https://cognition.com/blog/kevin-32b)（2025） — 通过多轮强化学习训练 CUDA kernel 生成与优化模型，让模型利用执行反馈迭代代码。 [论文](https://arxiv.org/abs/2507.11948) [模型](https://huggingface.co/cognition-ai/Kevin-32B)
- [MaxKernel](https://arxiv.org/abs/2609.04523)（2026） — 针对 TPU kernel 提供人机协作、自主优化和图搜索三种多 agent 模式，结合编译、测试和硬件 profiling。 [代码](https://github.com/AI-Hypercomputer/accelerator-agents)
- [PyTorch KernelAgent / KernelFalcon](https://github.com/meta-pytorch/KernelAgent)（2025–2026） — 将 kernel 生成、数值验证、硬件 profiling 和瓶颈分析组织为多 agent 闭环，并用共享记忆指导优化。 [技术博客](https://pytorch.org/blog/kernelagent-hardware-guided-gpu-kernel-optimization-via-multi-agent-orchestration/)
- [RNGD Multi-Agent Kernel Optimization](https://arxiv.org/abs/2610.38329)（2026） — 通过文档校验、微基准和编译器合法性规则积累 FuriosaAI RNGD 知识，以 Design Trees 搜索三个 Gemma 解码 kernel，并用重复实机对比验收改动。 [测量工具与实验材料](https://github.com/bgchun-fs/multi-agent-kernel-gen-loop)

## Kernel 与编译工具

- [Arm KleidiAI](https://github.com/ARM-software/kleidiai) — 面向 Arm CPU 的 AI micro-kernel 库，提供按硬件架构优化的矩阵计算与数据打包例程。 [主仓库](https://gitlab.arm.com/kleidi/kleidiai)
- [DeepEP](https://github.com/deepseek-ai/DeepEP) — 为 MoE expert parallelism 设计高吞吐与低延迟通信路径，连接模型路由、GPU kernel 和网络传输。
- [oneDNN](https://github.com/uxlfoundation/oneDNN) — 提供深度学习算子与硬件专用 kernel；AMD 与 Intel 宣布计划将 ZenDNN 优化整合到 oneDNN，统一 PyTorch 在 x86 CPU 上的加速路径。 [整合公告](https://newsroom.amd.com/news/amd-intel-collaborate-simplify-ai-development-on-x86-cpus-pytorch/)
- [TileLang](https://github.com/tile-ai/tilelang) — 以 tile 为核心表达 GPU、CPU 和加速器 kernel，简化底层优化与跨硬件后端实现。
- [Triton](https://github.com/triton-lang/triton) — 用于编写高性能 GPU kernel 的语言和编译器，是多项 kernel agent 的代码生成目标。
