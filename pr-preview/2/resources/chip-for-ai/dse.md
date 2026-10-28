## 搜索与实验框架

- [AlphaEvolve](https://deepmind.google/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/)（2025–2026） — 结合 LLM、程序进化与自动验证优化算法，官方披露了 TPU 算术电路、训练 kernel 和数据中心调度案例。 [后续实践](https://deepmind.google/blog/alphaevolve-impact/)
- [ArchGym](https://github.com/srivatsankrishnan/oss-arch-gym)（2023） — 统一搜索算法与架构模拟器接口，用于机器学习驱动的设计空间探索和实验数据收集。 [论文](https://arxiv.org/abs/2306.08888)
- [CHIA](https://github.com/ucb-bar/chia)（2026） — 用工作流图和可扩展运行时组织 AI 驱动的硬件/软件协同设计实验，示例覆盖 RTL、gem5 对齐、微架构实现和关键路径优化。 [论文](https://arxiv.org/abs/2606.27350)

## 架构与映射评估

- [Accel-Sim](https://accel-sim.github.io/) — 对 GPU 等可编程加速器进行轨迹驱动仿真与实机校验，配合功耗模型研究新架构及 AI workload。
- [GenZ](https://github.com/abhibambhaniya/GenZ-LLM-Analyzer)（2024） — 分析不同 LLM 推理场景下的算力、存储和通信需求，探索模型特征与平台设计参数的关系。 [论文](https://arxiv.org/abs/2406.01698)
- [LLMCompass](https://github.com/PrincetonUniversity/LLMCompass)（2024） — 用模型执行、硬件映射与面积成本模型评估 LLM 推理平台，支持芯片参数及系统配置探索。 [论文](https://arxiv.org/abs/2312.03134)
- [MAESTRO](https://github.com/maestro-project/maestro) — 以数据流与 tiling 描述分析 DNN 加速器的数据复用、性能和硬件成本。
- [SCALE-Sim v3](https://github.com/scalesim-project/scale-sim-v3)（2025） — 对指定网络和脉动阵列配置进行周期级仿真，输出时序、内存带宽与访存轨迹。 [v3 论文](https://arxiv.org/abs/2504.15377)
- [Timeloop / Accelergy](https://timeloop.csail.mit.edu/) — 用工作负载、架构和映射描述探索张量加速器设计空间，并估计性能、数据搬运、能耗与面积。 [代码](https://github.com/NVlabs/timeloop) [相关代码](https://github.com/Accelergy-Project/accelergy) [格式](https://timeloop.csail.mit.edu/v4/input-formats/design)
- [ZigZag](https://github.com/KULeuven-MICAS/zigzag) — 面向 DNN 加速器联合探索存储层次、空间/时间映射及其能耗和延迟，扩展覆盖存算一体。 [论文](https://arxiv.org/abs/2007.11360)

## 集群与工作负载

- [ASTRA-sim](https://github.com/astra-sim/astra-sim) — 联合模拟分布式 AI 的工作负载调度、集合通信与计算/存储/网络架构，支持多层次系统设计探索。 [后续论文](https://arxiv.org/abs/2606.10440)
- [MLCommons Chakra](https://github.com/mlcommons/chakra) — 以开放执行图描述 AI workload 的计算、访存、通信和依赖，并提供 trace 转换、生成及仿真衔接工具。 [格式与工具指南](https://github.com/mlcommons/chakra/blob/main/USER_GUIDE.md) [新版论文](https://arxiv.org/abs/2605.11333)
