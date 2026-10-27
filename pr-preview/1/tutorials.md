数字设计可以沿 HDLBits → cocotb → Yosys → OpenROAD → AutoChip 的顺序上手；模拟电路从 ngspice 开始，模型与硬件协同设计可以从 MIT 6.5940 开始。

## 芯片设计基础

- [HDLBits — Verilog Practice](https://hdlbits.01xz.net/wiki/Main_Page) — 从连线、组合逻辑到时序电路与状态机，通过在线仿真判题练习 Verilog，并学习读波形和写 testbench。
- [Tiny Tapeout — Digital Design Guide](https://tinytapeout.com/digital_design/) — 用浏览器中的逻辑门、触发器、加法器与 UART 小项目入门数字设计，再连接到 HDL 模板和芯片制造流程。
- [cocotb — First Steps](https://docs.cocotb.org/en/stable/first_steps.html) — 以计数器为例编写 Python testbench，运行通过与失败的测试，并查看波形，理解设计与验证的基本闭环。
- [SymbiYosys — Getting Started](https://symbiyosys.readthedocs.io/en/latest/quickstart.html) — 围绕 FIFO 编写断言，运行有界检查、证明与覆盖任务，并从反例波形定位设计错误。

## 开源工具上手

- [Yosys — Synthesis Starter](https://yosyshq.readthedocs.io/projects/yosys/en/latest/getting_started/example_synth.html) — 逐步综合一个 FIFO，观察 elaboration、优化与技术映射如何把 RTL 转换为电路表示。
- [OpenROAD Flow Scripts Tutorial](https://openroad-flow-scripts.readthedocs.io/en/latest/tutorials/FlowTutorial.html) — 从 Ibex 与 SKY130 示例跑通 RTL 到 GDS，并结合 GUI、时序报告和各阶段产物理解布局布线流程。
- [OpenLane 2 — Newcomers](https://openlane2.readthedocs.io/en/latest/getting_started/newcomers/index.html) — 用 32 位乘法器学习设计配置、运行流程、查看 GDS 与阶段日志，并修改时钟和引脚配置。
- [ngspice — Tutorial for Beginners](https://ngspice.sourceforge.io/ngspice-tutorial.html) — 从网表、器件模型和安装开始，用小电路理解直流、交流与瞬态仿真及结果绘制。 [批量仿真与脚本](https://ngspice.sourceforge.io/ngspice-control-language-tutorial.html)
- [JKU — Analog (Integrated) Circuit Design](https://iic-jku.github.io/analog-circuit-design/aicd.html) — 结合 Xschem、ngspice、开放 PDK 与 Python notebook，从 gm/ID 尺寸设计推进到 OTA、PVT 与 Monte Carlo 仿真。 [代码与练习](https://github.com/iic-jku/analog-circuit-design)

## AI4Chip 实践

- [AutoChip — Setup and Usage](https://github.com/shailja-thakur/AutoChip) — 按作者的安装、配置与运行步骤，体验 LLM 生成 Verilog 后利用编译和仿真报错反复修复的最小闭环。
- [OpenROAD — Running Claude Code in Docker](https://openroad-flow-scripts.readthedocs.io/en/latest/user/ClaudeCode.html) — 按 OpenROAD 官方步骤把 coding agent 接入含 EDA 工具的容器，执行构建、测试和 RTL-to-GDS 流程。

## 协同设计教程

- [Timeloop / Accelergy — Tutorial Exercises](https://github.com/Accelergy-Project/timeloop-accelergy-exercises) — 通过 Docker 中的 notebook 练习改变架构与映射，观察数据搬运、性能和能耗之间的关系。
- [MIT 6.5940 — TinyML and Efficient AI Computing](https://hanlab.mit.edu/courses/2026-fall-65940) — 结合公开讲义、录像与实验，学习剪枝、量化、神经架构搜索及模型部署如何回应计算和存储约束。
- [Gemmini — Quick Start and Architecture Guide](https://github.com/ucb-bar/gemmini#quick-start) — 构建 Gemmini 硬件、软件和仿真器，运行矩阵乘法与神经网络程序，并理解脉动阵列、存储与数据流。
