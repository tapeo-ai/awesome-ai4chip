覆盖电路表示与性能预测、RTL 与逻辑优化、物理设计和模拟电路设计，方法包括表示学习、强化学习、搜索与可微优化。

## Circuit Representation & Performance Prediction

- [DeepGate4](https://github.com/zyzheng17/DeepGate4-ICLR-25)（2025） — 结合 GNN 编码器和稀疏图 Transformer，以门级和图级多任务监督学习大规模 AIG 的功能与结构表示。 [论文](https://arxiv.org/abs/2502.01681)
- [Multimodal Thermal Solver for 3DICs](https://doi.org/10.1109/MLCAD65511.2025.11189201)（2025） — UMD 与 Synopsys 结合分块热响应学习、多模态映射和线性叠加，预测不同芯片尺寸与功率分布下的热场。 [技术演讲](https://www.ieee-edps.com/archives/2025/c/0400chang.pdf)
- [Pieceformer](https://arxiv.org/abs/2506.15907)（2025） — Georgia Tech 与 Cadence 结合消息传递、分区图 Transformer 和对比自监督学习，衡量网表相似性并复用设计划分经验。
- [TRACE](https://github.com/zyzheng17/TRACE_DAC26)（2026） — 用按逻辑层级计算的 Transformer 编码 RTL 和网表，通过功能偏移预测与对比学习获得电路表示。 [论文](https://arxiv.org/abs/2509.21886) [数据](https://huggingface.co/datasets/zyzheng23/TRACE_dataset)

## RTL & Logic Optimization

- [ASPEN](https://research.nvidia.com/labs/electronic-design-automation/publication/deng2025aspen/)（2025） — Cornell、NVIDIA 与 UMD 让 LLM 提议和选择 e-graph 重写规则，再用 PPA 反馈搜索功能等价的 RTL 数据通路。 [论文](https://www.csl.cornell.edu/~zhiruz/pdfs/aspen-mlcad2025.pdf)
- [SynAct](https://arxiv.org/abs/2608.12751)（2026） — 读取实时综合报告和工具知识，闭环选择命令并优化时序及 PPA。

## Physical Design Optimization

- [AlphaChip / Circuit Training](https://github.com/google-research/circuit_training) — 用分布式深度强化学习进行芯片宏单元布局，公开训练框架与 checkpoint。
- [C3PO](https://research.nvidia.com/labs/electronic-design-automation/publication/lu2026aspdac/)（2026） — NVIDIA 以 GPU 可微优化联合处理时序、可布线性与线长，并在布局迭代中调整多目标权重。 [论文](https://hhsiao30.github.io/papers/yichen_apsdac26__Camera_Ready_eXpress.pdf)
- [CROP](https://arxiv.org/abs/2507.02128)（2025） — Duke 与 Synopsys 将 RTL 分层摘要转成设计向量，检索相似电路的参数经验，再用 RAG 与 LLM 引导 EDA 流程调参。
- [DREAMPlace](https://github.com/limbo018/DREAMPlace) — 借用深度学习计算框架和 GPU 加速全局及详细布局，为学习型物理设计提供基础。
- [LEGO-Size](https://research.nvidia.com/labs/electronic-design-automation/publication/lu2025ispd/)（2025） — NVIDIA 对库单元序列进行专用 Transformer 自监督预训练和监督学习，再用 GPU 可微时序分析优化门尺寸。 [论文](https://research.nvidia.com/labs/electronic-design-automation/papers/yichen_LEGO_ispd25.pdf)
- [OpenROAD AutoTuner](https://github.com/The-OpenROAD-Project/OpenROAD-flow-scripts/tree/master/tools/AutoTuner) — 通过分布式超参数搜索自动调节 RTL-to-GDS 流程参数，并收集 PPA 指标。

## Analog Circuit Design

- [AnalogGenie](https://github.com/xz-group/AnalogGenie)（2025） — 把电路转换成器件引脚序列，从头训练约 12M 参数的自回归 Transformer，生成模拟电路拓扑。 [论文](https://openreview.net/forum?id=jCPak79Kev) [数据](https://huggingface.co/datasets/JianGao666/AnalogGenie)
- [AstRL](https://arxiv.org/abs/2602.12402)（2026） — 以图神经网络作为晶体管拓扑策略，结合专家行为克隆、PPO 和仿真反馈生成模拟与混合信号电路。
