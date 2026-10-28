## RTL 生成、理解与仓库上下文

- [ChipVerilog](https://github.com/HKUSTGZ-MICS-LYU/ChipVerilog)（2026） — 从 OpenCores 设计构建多层次 RTL 生成任务，结合模块等价检查与系统级仿真。 [论文](https://arxiv.org/abs/2607.13079)
- [NotSoTiny](https://huggingface.co/datasets/HPAI-BSC/NotSoTiny-26-07)（2025） — 随 Tiny Tapeout 项目更新构建带上下文的模块补全任务，使用形式等价检查降低静态基准局限。 [论文](https://arxiv.org/abs/2512.20823) [代码](https://github.com/HPAI-BSC/TuRTLe)
- [RTL-BenchMT](https://github.com/hkust-zhiyao/RTL-BenchMT)（2026） — 用 agent 与形式验证引导识别规格歧义、修订问题并扩展 RTL 生成 benchmark。
- [RTLLM](https://github.com/hkust-zhiyao/RTLLM)（2023） — 从自然语言规格生成 RTL，配套参考设计、testbench 和综合质量评测。 [论文](https://arxiv.org/abs/2308.05345)
- [VerilogEval](https://github.com/NVlabs/verilog-eval)（2023） — 提供 Verilog 代码补全与 spec-to-RTL 评测，用仿真验证生成功能并分析常见失败。 [论文](https://arxiv.org/abs/2309.07544)
- [Vhdl-RepoBench](https://arxiv.org/abs/2610.05380)（2026） — 保留 VHDL 跨文件层次和依赖，评测补全、仓库摘要及规格到模块生成。

## 验证、断言与调试

- [AssertionBench](https://github.com/achieve-lab/assertion_data_for_LLM)（2025） — 基于 OpenCores 设计与经过形式核验的参考断言，评估 LLM 从 RTL 生成断言。 [论文](https://arxiv.org/abs/2406.18627)
- [AssertLLM2](https://github.com/hkust-zhiyao/AssertLLM2)（2026） — 围绕规格、完整 RTL 和突变 bug 评估 SVA 的预防错误与发现错误能力。 重跑需要 JasperGold。 [论文](https://arxiv.org/abs/2605.27472)
- [FIXME](https://github.com/ChatDesignVerification/FIXME)（2025） — 覆盖规格理解、参考模型、testbench、SVA 生成与 RTL 修复，含文本和多模态规格。 当前流程含 VCS、VC Static 依赖。 [论文](https://arxiv.org/abs/2507.04276)
- [FVEval](https://github.com/NVlabs/FVEval)（2024） — 通过 NL2SVA 与 Design2SVA 任务，评估从指令和 RTL 生成断言的形式验证能力。 完整评测需要 Cadence Jasper。 [论文](https://arxiv.org/abs/2410.23299)
- [HierSVA](https://arxiv.org/abs/2606.13706)（2026） — 为层次 RTL 构建参考 SVA，分别评估可证明性、空泛性、规格一致性、突变检测与覆盖率。 重跑需要 VC Formal。 [代码](https://github.com/HierSVAAnon/HierSVACodeAndArtifacts) [数据](https://huggingface.co/datasets/AnonymousHierSVA/HierSVA)
- [ICCAD 2026 — Regression Failure Bucketing](https://www.iccad-contest.org/2026/Problems.html)（2026） — Synopsys 提供的验证回归失败归类任务，附题目说明、测试材料与阶段评测结果。

## PPA 优化与 HLS

- [Bench4HLS](https://github.com/zfsadik/Bench4HLS)（2026） — 评测 LLM 生成 HLS C++ 的仿真正确性、综合可行性与 PPA，覆盖从 kernel 到加速器的任务。 当前工具链为 Vitis HLS/Vivado。 [论文](https://arxiv.org/abs/2601.19941)
- [CktEvo](https://github.com/cure-lab/cktevo)（2026） — 以多文件 IP 仓库为对象，在保持功能正确的前提下优化 RTL 的 PPA。 [论文](https://arxiv.org/abs/2603.08718)
- [MetRex](https://github.com/scale-lab/MetRex)（2025） — 将 RTL 与综合后的面积、时延、静态功耗及自然语言推理对应，评估指标估算能力。 [论文](https://arxiv.org/abs/2411.03471) [数据](https://huggingface.co/datasets/scale-lab/MetRex)
- [Pluto](https://github.com/scale-lab/Pluto)（2025） — 用面向面积、时延和功耗分别优化的参考实现评估 LLM 生成硬件的效率。 [论文](https://arxiv.org/abs/2510.14756) [数据](https://huggingface.co/datasets/scale-lab/Pluto)
- [RTL-OPT](https://github.com/hkust-zhiyao/RTL-OPT)（2026） — 提供次优 RTL 与人工优化参考对，评估功能保持前提下的 PPA 改进。 [论文](https://arxiv.org/abs/2601.01765)

## 网表与物理设计

- [FloorSet Challenge](https://github.com/IntelLabs/FloorSet/blob/main/iccad2026contest/README.md)（2026） — Intel 提供带设计约束的合成 SoC floorplanning 数据、优化器模板与评测脚本，用于比较数据驱动的布局规划方法。
- [ICCAD 2025 — Incremental Placement Optimization](https://www.iccad-contest.org/2025/Problems.html)（2025） — NVIDIA 提供门尺寸调整、缓冲插入和单元移动的联合任务，评测详细布局后的增量优化。 [论文页](https://research.nvidia.com/labs/electronic-design-automation/publication/lu2025iccad/)
- [ICCAD 2026 — LLM-Assisted Netlist Exploration and Transformation](https://www.iccad-contest.org/2026/Problems.html)（2026） — Cadence 提供的 LLM 辅助网表探索与变换任务，附题目说明和测试材料。

## 综合设计任务与长流程评测

- [Build-A-Chip-Bench](https://chipagents.ai/research/build-a-chip-bench)（2026） — 评测 agent 从工作负载规格完成 GDS 的能力，检查功能、时序、布线和 DRC，再按 PPA 评分。 实时榜单待上线。
- [ChipBench](https://github.com/zhongkaiyu/ChipBench)（2026） — 覆盖层次化 Verilog 生成、RTL 调试及 Python/SystemC/CXXRTL 参考模型生成。 [论文](https://arxiv.org/abs/2601.21448)
- [CLOSER-Bench](https://arxiv.org/abs/2607.16632)（2026） — 以 10 项试验任务比较 spec-to-RTL、RTL-to-GDS 和 spec-to-GDS 流程，研究预算分配与跨阶段修复。
- [CVDP](https://github.com/NVlabs/cvdp_benchmark)（2025） — 由工程师编写芯片设计与验证任务，涵盖单模块和仓库级工作，并提供 Docker 运行环境。 部分任务使用商业 EDA 工具。 [论文](https://arxiv.org/abs/2506.14074) [数据](https://huggingface.co/datasets/nvidia/cvdp-benchmark-dataset)

## 模拟、混合信号与多模态

- [AMSbench](https://github.com/Why0912/AMSBench)（2025） — 覆盖模拟/混合信号原理图感知、分析和设计的多模态评测。 [数据](https://huggingface.co/datasets/wwhhyy/AMSBench)
- [AnalogGym](https://github.com/CODA-Team/AnalogGym)（2024） — 提供多类模拟拓扑、规格和仿真测试，支持比较自动尺寸优化方法。
- [CircuitSense](https://github.com/xz-group/CircuitSense)（2026） — 评估从电路图感知到符号方程推导及设计推理，并提供合成生成流水线。 [数据](https://huggingface.co/datasets/armanakbari4/CircuitSense)
- [Long-Horizon Analog Design Bench](https://arxiv.org/abs/2609.33356)（2026） — 以 SKY130/ngspice 下的长时设计任务评估模拟/混合信号 agent，验收范围是原理图级电气指标。
- [NetlistBench](https://arxiv.org/abs/2608.12197)（2026） — 以确定性结构 oracle 检验 SPICE 网表识别、编辑、层次操作及等价判断。
