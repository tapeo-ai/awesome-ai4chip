用于执行设计、生成反馈和复现实验的基础工具，包含传统 EDA 工具与开放工艺环境。

## 数字设计与验证

- [ABC](https://github.com/berkeley-abc/abc) — 开放逻辑综合和形式化验证系统，是综合优化学习方法的常用执行后端。
- [cocotb](https://github.com/cocotb/cocotb) — 以 Python 编写 testbench 并连接 HDL 仿真器，适合构建可执行任务与验证反馈。
- [GEM](https://github.com/NVlabs/GEM)（2025） — NVIDIA 将 RTL 综合为 AIG 并映射到 GPU 上的布尔计算结构，加速逻辑仿真。
- [Icarus Verilog](https://github.com/steveicarus/iverilog) — 开源 Verilog 编译与仿真工具，是多项 RTL 生成基准的执行后端。
- [INSTA](https://github.com/NVlabs/INSTA)（2025） — NVIDIA 的 GPU 统计静态时序分析工具，提供可微时序梯度，支持门尺寸调整等物理设计优化。 [论文](https://research.nvidia.com/labs/electronic-design-automation/papers/yichen_INSTA_dac25.pdf)
- [LibreLane](https://github.com/librelane/librelane) — 基于 OpenLane 2 的可扩展 Python RTL-to-GDS 流程，保存各步骤配置和设计状态。
- [OpenROAD / OpenROAD-flow-scripts](https://github.com/The-OpenROAD-Project/OpenROAD) — 开放物理设计工具及 RTL-to-GDS 流程，为 agent 运行与 PPA 反馈提供基础环境。 [流程与示例](https://github.com/The-OpenROAD-Project/OpenROAD-flow-scripts)
- [SymbiYosys](https://github.com/YosysHQ/sby) — 为 Yosys 形式验证流程组织有界与无界性质检查、覆盖率和活性验证。
- [Verilator](https://www.veripool.org/verilator/) — 将 Verilog/SystemVerilog 编译为 C++/SystemC 仿真模型，提供 lint、仿真和覆盖率反馈。
- [Yosys](https://github.com/YosysHQ/yosys) — 开放 RTL 综合框架，可用于可综合性检查、网表生成和 agent 的综合反馈。

## 模拟仿真与版图

- [ALIGN](https://github.com/ALIGN-analoglayout/ALIGN-public) — 将 SPICE 网表和模拟布局约束转换为层次布局与 GDSII。
- [GLayout](https://github.com/ReaLLMASIC/gLayout)（2024） — 提供跨 PDK 的 Python 电路与布局生成接口，并支持自然语言到布局及验证流程。
- [KLayout](https://www.klayout.de/) — 提供版图查看、脚本化生成与 DRC/LVS 检查，连接设计产物和几何验证。
- [MAGICAL](https://github.com/magical-eda/MAGICAL) — 从模拟电路网表自动进行约束生成、布局和布线，输出 GDSII。
- [ngspice](https://ngspice.sourceforge.io/) — 可脚本驱动的开源 SPICE/混合信号仿真器，为电路生成与尺寸优化提供电气反馈。

## 集成环境与 PDK

- [GF180MCU](https://github.com/google/gf180mcu-pdk)（2022） — GlobalFoundries 180nm MCU 工艺的开放 PDK，可用于模拟和数字设计工具链。 此 Google 原始仓库已归档。
- [IHP Open PDK / SG13G2](https://github.com/IHP-GmbH/IHP-Open-PDK) — 面向模拟、混合信号和 RF 的 130nm BiCMOS 开放 PDK。
- [IIC-OSIC-TOOLS](https://github.com/iic-jku/IIC-OSIC-TOOLS) — 将模拟与数字开源 EDA 工具及多个开放 PDK 集成到 Docker 环境。
- [SKY130](https://github.com/google/skywater-pdk) — SkyWater 130nm 开放工艺设计套件，为模拟/数字设计实验提供器件模型和工艺数据。
