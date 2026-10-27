从 AI 辅助设计延伸到模型、芯片、编译器和集群的共同设计，收录有明确技术材料或工具入口的工作。

## AI 驱动的架构与协同设计

- [AlphaEvolve](https://deepmind.google/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/)（2025–2026） — 结合 LLM、程序进化与自动验证优化算法，官方披露了 TPU 算术电路、训练 kernel 和数据中心调度案例。 [后续实践](https://deepmind.google/blog/alphaevolve-impact/)
- [CHIA](https://github.com/ucb-bar/chia)（2026） — 用工作流图和可扩展运行时组织 AI 驱动的硬件/软件协同设计实验，示例覆盖 RTL、gem5 对齐、微架构实现和关键路径优化。 [论文](https://arxiv.org/abs/2606.27350)

## 模型、算子与硬件协同设计

- [BitNet / bitnet.cpp](https://github.com/microsoft/BitNet) — 将三值权重等低比特设计引入模型训练，并提供 CPU/GPU 推理 kernel，连接模型精度选择与执行硬件。 [系统论文](https://arxiv.org/abs/2502.11880)
- [FlashAttention](https://github.com/Dao-AILab/flash-attention) — 围绕 GPU 存储层次与数据搬运设计精确注意力计算，是算法、kernel 和硬件协同优化的代表。
- [Insights into DeepSeek-V3](https://arxiv.org/abs/2505.09343)（2025） — 从 MLA、MoE、FP8 与网络拓扑出发，系统讨论大模型训练和推理对计算、存储及通信硬件的要求。
- [Native Sparse Attention](https://arxiv.org/abs/2502.11089)（2025） — 将可训练稀疏注意力与硬件算术强度和访问模式一起设计，结合 token 压缩、选择与局部窗口。
