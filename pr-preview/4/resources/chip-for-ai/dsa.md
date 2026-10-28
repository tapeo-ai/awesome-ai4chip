## Domain-specific Accelerators

- [Etched](https://www.etched.com/) — 围绕大模型推理协同设计芯片、机架、互联和软件，介绍低电压推理与集群级内存方案。
- [Gemmini](https://github.com/ucb-bar/gemmini)（2019/2021） — 可参数化脉动阵列加速器生成器，将 RTL、RISC-V 主机、内存系统及软件栈联合用于 DNN 全系统评估。 [论文](https://arxiv.org/abs/1911.09925)
- [Jalapeño](https://openai.com/index/jalapeno-first-results/)（2026） — OpenAI 的芯片、内存、网络和推理软件协同设计案例，同时介绍 AI 在硬件设计与 kernel 优化中的使用。
- [Taalas HC1](https://taalas.com/the-path-to-ubiquitous-ai/)（2026） — 将特定模型直接固化进硅芯片；HC1 技术演示运行 Llama 3.1 8B，官方介绍其架构和推理方式。

## CIM (Compute-in-Memory)

- [AccelForge / HWComponents](https://github.com/Accelergy-Project/accelforge) — 承接 CiMLoop 的架构与组件模型，联合评估存算一体等加速器的映射、面积、能耗和时延；CiMLoop 原仓库已停止维护。 [组件模型](https://github.com/Accelergy-Project/hwcomponents) [CiMLoop 原仓库](https://github.com/mit-emze/cimloop) [CiMLoop 论文](https://arxiv.org/abs/2405.07259)
- [CrossSim](https://github.com/sandialabs/cross-sim) — 评估模拟交叉阵列的器件误差、漂移、噪声和 ADC 等非理想性对算法精度的影响，支持硬件感知训练。
- [DNN+NeuroSim](https://github.com/neurosim/NeuroSim) — 将器件、电路与 DNN 计算结合建模，用于存算一体加速器的精度、性能、能耗和面积评估。
- [IBM AIHWKit / AIHWKit-Lightning](https://github.com/IBM/aihwkit) — 在 PyTorch 中建模模拟存算一体硬件的噪声和非理想性，支持硬件感知训练。 [AIHWKit-Lightning](https://github.com/IBM/aihwkit-lightning)
