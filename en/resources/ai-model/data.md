## RTL Corpora and Synthetic Data

- [CircuitWeave](https://arxiv.org/abs/2607.23523) (2026) — Uses structured circuit contracts to combine synthetic schematic topologies with textual behavioral specifications, providing executable RTL generation data. [Data](https://huggingface.co/datasets/fengjiahao0421/CircuitWeave)
- [DeepCircuitX](https://zeju.gitbook.io/lcm-team/deepcircuitx/introduction-of-our-dataset) (2025) — Provides RTL and multilevel annotations at repository, file, module, and block scales, linked to synthesized netlists and PPA data. [Paper](https://arxiv.org/abs/2502.18297)
- [hdl2v](https://arxiv.org/abs/2506.04544) (2025) — Translates or compiles VHDL, Chisel, and PyMTL3 into Verilog to expand human-written HDL training corpora. [Data](https://huggingface.co/datasets/hdl2v/vhdl-dataset)
- [PyraNet](https://huggingface.co/datasets/bnadimi/PyraNet-Verilog) (2025) — Provides hierarchical Verilog data with descriptions, compilation information, complexity measures, and quality rankings. [Paper](https://arxiv.org/abs/2412.06947)
- [VerilogDB](https://arxiv.org/abs/2507.13369) (2025) — Builds a structured RTL training database through syntax and synthesizability checks and module metadata extraction.

## Netlist, Schematic, and Physical Design Data

- [CircuitNet (1.0–3.0)](https://circuitnet.github.io/) (2022–2026) — Provides multimodal design data for congestion, DRC, IR drop, timing, and RTL-to-layout learning. [Code](https://github.com/circuitnet/CircuitNet) [Data](https://circuitnet.github.io/intro/download.html)
- [Masala-CHAI](https://github.com/jitendra-bhandari/Masala-CHAI) (2024–2026) — Converts analog schematics into SPICE netlists and datasets using multimodal models, component detection, and verification.
- [Netlistify](https://github.com/NYCU-AI-EDA/Netlistify) (2025) — NYCU and NVIDIA jointly identify devices, orientations, and connections to convert schematics into SPICE netlists, with synthetic images and pretrained models. [Paper](https://research.nvidia.com/labs/electronic-design-automation/papers/netlistify_mlcad25.pdf)

## Data Interfaces and Metric Formats

- [CircuitOps](https://github.com/NVlabs/CircuitOps) (2023) — Unifies circuit intermediate representations through relational tables and property graphs, connecting EDA data export, ML dataset construction, and deployment.
- [METRICS2.1 / Metrics4ML](https://github.com/ieee-ceda-datc/datc-rdf-Metrics4ML) (2021) — Defines JSON naming conventions and hierarchies for RTL-to-GDS metrics, with traceable experimental data.
