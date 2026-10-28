## 模型与算法

- [BitNet / bitnet.cpp](https://github.com/microsoft/BitNet) — 将三值权重等低比特设计引入模型训练，并提供 CPU/GPU 推理 kernel，连接模型精度选择与执行硬件。 [系统论文](https://arxiv.org/abs/2502.11880)
- [FlashAttention](https://github.com/Dao-AILab/flash-attention) — 围绕 GPU 存储层次与数据搬运设计精确注意力计算，是算法、kernel 和硬件协同优化的代表。
- [Insights into DeepSeek-V3](https://arxiv.org/abs/2505.09343)（2025） — 从 MLA、MoE、FP8 与网络拓扑出发，系统讨论大模型训练和推理对计算、存储及通信硬件的要求。
- [Native Sparse Attention](https://arxiv.org/abs/2502.11089)（2025） — 将可训练稀疏注意力与硬件算术强度和访问模式一起设计，结合 token 压缩、选择与局部窗口。
