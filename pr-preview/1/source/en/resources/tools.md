---
title: "Tools and Execution Environments"
description: "Digital design, analog simulation, physical implementation tools, and open PDKs."
---

Tools for executing designs, generating feedback, and reproducing experiments, including conventional EDA tools and open process environments.

## Digital Design and Verification

- [ABC](https://github.com/berkeley-abc/abc) — An open logic synthesis and formal verification system, widely used as an execution backend for learning-based synthesis optimization.
- [cocotb](https://github.com/cocotb/cocotb) — Runs Python testbenches with HDL simulators, supporting executable tasks and verification feedback.
- [GEM](https://github.com/NVlabs/GEM) (2025) — NVIDIA synthesizes RTL into AIGs and maps them to GPU Boolean computation structures to accelerate logic simulation.
- [Icarus Verilog](https://github.com/steveicarus/iverilog) — An open-source Verilog compiler and simulator used as the execution backend for multiple RTL generation benchmarks.
- [INSTA](https://github.com/NVlabs/INSTA) (2025) — NVIDIA's GPU statistical static timing analysis tool provides differentiable timing gradients for gate sizing and other physical design optimization. [Paper](https://research.nvidia.com/labs/electronic-design-automation/papers/yichen_INSTA_dac25.pdf)
- [LibreLane](https://github.com/librelane/librelane) — An extensible Python RTL-to-GDS flow based on OpenLane 2 that preserves configuration and design state at each step.
- [OpenROAD / OpenROAD-flow-scripts](https://github.com/The-OpenROAD-Project/OpenROAD) — Open physical design tools and RTL-to-GDS flows that provide execution environments and PPA feedback for agents. [Flows and Examples](https://github.com/The-OpenROAD-Project/OpenROAD-flow-scripts)
- [SymbiYosys](https://github.com/YosysHQ/sby) — Organizes bounded and unbounded property checking, coverage, and liveness verification for Yosys formal verification flows.
- [Verilator](https://www.veripool.org/verilator/) — Compiles Verilog/SystemVerilog into C++/SystemC simulation models, providing lint, simulation, and coverage feedback.
- [Yosys](https://github.com/YosysHQ/yosys) — An open RTL synthesis framework for synthesizability checks, netlist generation, and synthesis feedback for agents.

## Analog Simulation and Layout

- [ALIGN](https://github.com/ALIGN-analoglayout/ALIGN-public) — Converts SPICE netlists and analog layout constraints into hierarchical layouts and GDSII.
- [GLayout](https://github.com/ReaLLMASIC/gLayout) (2024) — Provides Python interfaces for circuit and layout generation across PDKs, with natural-language-to-layout and verification workflows.
- [KLayout](https://www.klayout.de/) — Provides layout viewing, scripted generation, and DRC/LVS checks, connecting design artifacts with geometric verification.
- [MAGICAL](https://github.com/magical-eda/MAGICAL) — Automatically generates constraints, placement, and routing from analog netlists to produce GDSII.
- [ngspice](https://ngspice.sourceforge.io/) — A scriptable SPICE and mixed-signal simulator that supplies electrical feedback for circuit generation and sizing.

## Integrated Environments and PDKs

- [GF180MCU](https://github.com/google/gf180mcu-pdk) (2022) — An open PDK for GlobalFoundries' 180nm MCU process, supporting analog and digital toolchains. This original Google repository is archived.
- [IHP Open PDK / SG13G2](https://github.com/IHP-GmbH/IHP-Open-PDK) — An open 130nm BiCMOS PDK for analog, mixed-signal, and RF design.
- [IIC-OSIC-TOOLS](https://github.com/iic-jku/IIC-OSIC-TOOLS) — Packages open-source analog and digital EDA tools and multiple open PDKs in a Docker environment.
- [SKY130](https://github.com/google/skywater-pdk) — An open SkyWater 130nm process design kit with device models and technology data for analog and digital experiments.
