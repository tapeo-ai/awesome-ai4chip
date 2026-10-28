第一次接触芯片设计，可以先看 [EDA 101](/resources/eda/eda-101)：用一张流程图认识 RTL、验证、综合、布局布线与签核，以及各阶段使用的软件。

## AI Model

适合熟悉 LLM、想研究 RTL 生成、领域 post-training 或评测的读者。建议按综述、评测、训练实现的顺序阅读。

1. [LLMs for EDA: A Survey](https://arxiv.org/abs/2501.09655) — 第 3 节介绍 EDA 任务，第 4 节整理模型适配方法，第 5.1 节介绍数据与评测。用它确定研究对象：生成 RTL、生成断言、读懂设计文档，分别需要什么数据和检查方式。
2. [VerilogEval](https://github.com/NVlabs/verilog-eval) — 按 README 的 `spec-to-rtl` 流程，从一条规格、生成的 Verilog 追到仿真结果。它解决最基本的评测问题：代码能编译，与代码符合规格，是两件不同的事。
3. [CodeV-R1](https://github.com/IPRC-DIP/CodeV-R1) — 看一个具体的 Verilog post-training 项目。先读 `test/` 的评测说明，再看 `sft/` 的训练配置，最后看 `verl/` 的 RL 流程与 testbench reward；对照公开数据，理解推理蒸馏和仿真反馈分别如何进入训练。

如果还不能读简单 RTL，先做 [HDLBits](https://hdlbits.01xz.net/wiki/Main_Page) 的组合逻辑、时序逻辑题，再读 [cocotb First Steps](https://docs.cocotb.org/en/stable/first_steps.html)，用 Python testbench 理解时钟、复位、断言和波形。继续研究时，按问题查 [Data](/resources/ai-model/data)、[Benchmark](/resources/ai-model/benchmark) 和 [Training](/resources/ai-model/training)。

## AI EDA

适合已有 RTL / EDA 基础、准备开发设计 agent 或自动优化流程的读者。

1. [The Dawn of Agentic EDA](https://arxiv.org/abs/2512.23189) — 先读第 2 节的 agent 架构，再选第 3 节 RTL / Verification 或第 4 节 Physical Design。重点看工具调用、任务拆分与反馈如何组织，以及哪些步骤仍依赖确定性的 EDA 检查。
2. [OpenROAD Flow Scripts Tutorial](https://openroad-flow-scripts.readthedocs.io/en/latest/tutorials/FlowTutorial.html) — 用 Ibex / SKY130 示例了解完整的 RTL-to-GDS 流程。先读 Running the Automated RTL-to-GDS Flow，再对照目录说明打开综合、Floorplan、CTS、Routing 的结果；这份教程把运行命令、阶段产物、GUI 和时序报告放在了一起。
3. [OpenROAD — Running Claude Code in Docker](https://openroad-flow-scripts.readthedocs.io/en/latest/user/ClaudeCode.html) — 在带有 EDA 工具的容器里接入 coding agent，了解 agent 如何访问工程、执行构建和测试。适合在跑通过一次 ORFS 后继续阅读，把现有设计流程接入 agent。

做综合优化，接着看 [Yosys Synthesis Starter](https://yosyshq.readthedocs.io/projects/yosys/en/latest/getting_started/example_synth.html)，逐步观察 FIFO 如何从 RTL 变成网表；做验证，接着看 [SymbiYosys Getting Started](https://symbiyosys.readthedocs.io/en/latest/quickstart.html)，学习断言、有界检查、证明与反例。具体项目见 [AI EDA](/resources/eda/ai-eda) 和 [EDA Optimization](/resources/eda/optimization)。

### Analog / Mixed-Signal

有电路基础、希望搭建模拟电路设计与优化环境的读者，可以直接沿 [JKU Analog Circuit Design](https://iic-jku.github.io/analog-circuit-design/aicd.html) 学习：第 1、2 章准备 Xschem、ngspice 和开放 PDK，第 3 章学习 gm/ID 尺寸设计，再进入第 8 章的 OTA 仿真、PVT 与 Monte Carlo 分析。课程配有电路文件与 Python notebook。

要把仿真接到参数搜索或 agent 中，再读 [ngspice Control Language Tutorial](https://ngspice.sourceforge.io/ngspice-control-language-tutorial.html) 的循环仿真、修改器件参数和数据导出部分。

## Chip for AI

适合有机器学习或计算机体系结构基础、想研究模型与加速器协同设计的读者。

1. [MIT 6.5940 — TinyML and Efficient AI Computing](https://hanlab.mit.edu/courses/2026-fall-65940) — 先看 Introduction，再选 Quantization 和 Neural Architecture Search。讲义、录像与实验帮助理解精度、计算量、存储需求和部署成本之间的关系，适合建立 Hardware-aware ML 的基础。
2. [Timeloop / Accelergy v4](https://timeloop.csail.mit.edu/v4) 与[配套练习](https://github.com/Accelergy-Project/timeloop-accelergy-exercises) — 先读 Problem、Architecture 和 Constraints，区分工作负载、硬件结构与映射约束；再运行练习，对照 Stats / Mapping 输出比较数据搬运、周期与能耗。适合学习 DSE，而不必先实现一套 RTL 加速器。

想进一步理解真实加速器的硬件与软件配合，读 [Gemmini Quick Start](https://github.com/ucb-bar/gemmini#quick-start)：从仿真器中的矩阵乘法示例开始，再读 Architecture 中的脉动阵列、Scratchpad、Accumulator 和数据流。后续按兴趣进入 [Hardware-aware ML](/resources/chip-for-ai/hardware-aware-ml)、[DSE](/resources/chip-for-ai/dse)、[DSA](/resources/chip-for-ai/dsa) 或 [Kernel Optimization](/resources/chip-for-ai/kernel-optimization)。
