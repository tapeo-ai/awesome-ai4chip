## Generation, Optimization, and Evaluation

- [AccelOpt](https://github.com/zhang677/AccelOpt) (2025/2026) — Builds optimization memory from slow-fast kernel pairs to autonomously optimize kernels on AWS Trainium, and provides NKIBench. [Paper](https://arxiv.org/abs/2511.15915)
- [AKG kernel Agent](https://arxiv.org/abs/2512.23424) (2025) — Uses multiple agents to generate, port, and tune kernels across GPUs and NPUs, supporting several kernel DSLs.
- [Atrex Kernel Agent](https://github.com/alibaba/atrex-kernel-agent) (2026) — Uses a GPU knowledge base, profiling tools, and structured workflows for kernel implementation, diagnosis, and iterative optimization.
- [AWS Neuron Agentic Development](https://github.com/aws-neuron/neuron-agentic-development) — AWS's official NKI agent tools cover kernel authoring, compilation repair, profiling, performance analysis, and API migration.
- [CUDA Agent](https://github.com/BytedTsinghua-SIA/CUDA-Agent) (2026) — Combines large-scale agentic RL, CUDA task data, expert skills, and verifiable execution environments to train high-performance kernel generation. [Paper](https://arxiv.org/abs/2602.24286)
- [CUDA-L1](https://github.com/ornith-ai/CUDA-L1) (2025/2026) — Optimizes CUDA kernels with contrastive reinforcement learning and execution feedback, discussing performance rewards and reward hacking. [Paper](https://arxiv.org/abs/2507.14111)
- [KernelBench](https://github.com/ScalingIntelligence/KernelBench) (2025) — Uses PyTorch tasks to evaluate whether models can generate correct and faster GPU kernels, with execution and measurement tools.
- [Kevin-32B](https://cognition.com/blog/kevin-32b) (2025) — Trains CUDA kernel generation and optimization through multi-turn reinforcement learning, enabling iterative code improvement with execution feedback. [Paper](https://arxiv.org/abs/2507.11948) [Model](https://huggingface.co/cognition-ai/Kevin-32B)
- [MaxKernel](https://arxiv.org/abs/2609.04523) (2026) — Provides human-agent collaboration, autonomous optimization, and graph-search modes for TPU kernels, combining compilation, testing, and hardware profiling. [Code](https://github.com/AI-Hypercomputer/accelerator-agents)
- [PyTorch KernelAgent / KernelFalcon](https://github.com/meta-pytorch/KernelAgent) (2025–2026) — Organizes kernel generation, numerical validation, hardware profiling, and bottleneck analysis into a multi-agent loop, with shared memory guiding optimization. [Technical Blog](https://pytorch.org/blog/kernelagent-hardware-guided-gpu-kernel-optimization-via-multi-agent-orchestration/)

## Kernel Libraries and Compilers

- [Arm KleidiAI](https://github.com/ARM-software/kleidiai) — An AI micro-kernel library for Arm CPUs, with architecture-optimized matrix operations and data-packing routines. [Main Repository](https://gitlab.arm.com/kleidi/kleidiai)
- [DeepEP](https://github.com/deepseek-ai/DeepEP) — Provides high-throughput and low-latency communication paths for MoE expert parallelism, connecting model routing, GPU kernels, and network transport.
- [TileLang](https://github.com/tile-ai/tilelang) — Expresses GPU, CPU, and accelerator kernels through tiles to simplify low-level optimization and implementation across hardware backends.
- [Triton](https://github.com/triton-lang/triton) — A language and compiler for high-performance GPU kernels, used as a code-generation target by multiple kernel agents.
