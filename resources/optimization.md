覆盖强化学习、搜索与可微优化；部分项目也是构建学习型设计方法的基础设施。

- [AlphaChip / Circuit Training](https://github.com/google-research/circuit_training) — 用分布式深度强化学习进行芯片宏单元布局，公开训练框架与 checkpoint。
- [ASPEN](https://research.nvidia.com/labs/electronic-design-automation/publication/deng2025aspen/)（2025） — Cornell、NVIDIA 与 UMD 让 LLM 提议和选择 e-graph 重写规则，再用 PPA 反馈搜索功能等价的 RTL 数据通路。 [论文](https://www.csl.cornell.edu/~zhiruz/pdfs/aspen-mlcad2025.pdf)
- [C3PO](https://research.nvidia.com/labs/electronic-design-automation/publication/lu2026aspdac/)（2026） — NVIDIA 以 GPU 可微优化联合处理时序、可布线性与线长，并在布局迭代中调整多目标权重。 [论文](https://hhsiao30.github.io/papers/yichen_apsdac26__Camera_Ready_eXpress.pdf)
- [CROP](https://arxiv.org/abs/2507.02128)（2025） — Duke 与 Synopsys 将 RTL 分层摘要转成设计向量，检索相似电路的参数经验，再用 RAG 与 LLM 引导 EDA 流程调参。
- [DREAMPlace](https://github.com/limbo018/DREAMPlace) — 借用深度学习计算框架和 GPU 加速全局及详细布局，为学习型物理设计提供基础。
- [OpenROAD AutoTuner](https://github.com/The-OpenROAD-Project/OpenROAD-flow-scripts/tree/master/tools/AutoTuner) — 通过分布式超参数搜索自动调节 RTL-to-GDS 流程参数，并收集 PPA 指标。
- [SynAct](https://arxiv.org/abs/2608.12751)（2026） — 读取实时综合报告和工具知识，闭环选择命令并优化时序及 PPA。
