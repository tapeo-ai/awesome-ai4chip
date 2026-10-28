<h1 align="center"><img src="assets/awesome-ai4chip-logo.png" width="40" height="40" align="absmiddle" alt="AI4Chip logo"> Awesome AI4Chip</h1>

<p align="center"><a href="README.md">中文</a> · <strong>English</strong></p>

![AI4Chip research map](assets/ai4chip-architecture.png)

<!-- intro:start -->

We will continue building Awesome AI4Chip into **the most comprehensive source of AI for Chip news and resources**, collecting papers, open-source projects, datasets, benchmarks, tools, products, and technical articles. The goal is to help readers from different backgrounds **quickly understand the field**: identify key problems and technical approaches, find learning material and reproducible projects, and follow research and industry developments.

## Where to Start

| Background / Goal | Start with | Continue with |
| --- | --- | --- |
| New to chip design; want to understand the flow and common software | [EDA 101](docs/en/resources/eda/eda-101.mdx): design stages, tool interfaces, and key artifacts | Choose a path in the [Guide](#guide) |
| Familiar with LLMs; interested in RTL generation, domain post-training, or evaluation | [LLMs for EDA: A Survey](https://arxiv.org/abs/2501.09655): tasks, model adaptation, data, and evaluation | [AI Model](#ai-model): VerilogEval → CodeV-R1 |
| RTL / EDA experience; want to build design agents | [The Dawn of Agentic EDA](https://arxiv.org/abs/2512.23189): agent architectures, tool calls, and design feedback | [AI EDA](#ai-eda): OpenROAD flow → coding agent integration |
| Circuit fundamentals; interested in analog design and automation | [JKU Analog Circuit Design](https://iic-jku.github.io/analog-circuit-design/aicd.html): circuit design, simulation, and sizing | [Analog / Mixed-Signal](#analog--mixed-signal): ngspice batch simulation and parameter search |
| ML or computer architecture background; interested in model–accelerator co-design | [MIT 6.5940](https://hanlab.mit.edu/courses/2026-fall-65940): efficient models and hardware deployment | [Chip for AI](#chip-for-ai): Timeloop / Accelergy → Gemmini |

<!-- intro:end -->

<!-- website-link:start -->

**[Online docs](https://tapeo-ai.github.io/awesome-ai4chip/en/)** · [Guide](#guide)

<!-- website-link:end -->

<sub>Updated on October 28, 2026.</sub>

## Latest

<!-- latest:start -->

- **2026-10-26** · [Cadence Maestro](https://www.cadence.com/en_US/home/company/newsroom/press-releases/pr/2026/cadence-introduces-maestro-a-domain-specialized-ai-model.html) — Introduces a family of domain models for chip and system design, trained with EDA tool feedback.
- **2026-10-22** · [Back-to-the-Future (BTTF)](https://arxiv.org/abs/2610.06790) — Updates its paper on RTL debugging with SQLite waveform data and natural-language queries.
- **2026-10-07** · [RFChipAgent](https://arxiv.org/abs/2610.10858) — Presents a multi-agent analog/RF design workflow connecting retrieval, topology selection and simulation-based optimization.
- **2026-10-04** · [VHDL-REPOBENCH](https://arxiv.org/abs/2610.05380) — Introduces repository-level VHDL evaluation focused on cross-file dependencies and hierarchical design understanding.
- **2026-10** · [Build-A-Chip-Bench](https://chipagents.ai/research/build-a-chip-bench) — Describes long-horizon evaluation from workload specifications to GDS, combining functional acceptance with PPA scoring.

<!-- latest:end -->

## Directory

- [Guide](#guide)
- AI Model
  - [Data](docs/en/resources/ai-model/data.mdx)
  - [Benchmark](docs/en/resources/ai-model/benchmark.mdx)
  - [Training](docs/en/resources/ai-model/training.mdx)
  - [Harbor Environment Example](env/examples/fw_c14_overcomplete_banks_v1/README.en.md)
- EDA
  - [EDA 101](docs/en/resources/eda/eda-101.mdx)
  - [Open Source](docs/en/resources/eda/open-source.mdx)
  - [Closed Source](docs/en/resources/eda/closed-source.mdx)
  - [AI EDA](docs/en/resources/eda/ai-eda.mdx)
  - [EDA Optimization](docs/en/resources/eda/optimization.mdx)
- Chip for AI
  - [Hardware-aware ML](docs/en/resources/chip-for-ai/hardware-aware-ml.mdx)
  - [DSE (Design Space Exploration)](docs/en/resources/chip-for-ai/dse.mdx)
  - [DSA (Domain-specific Architecture)](docs/en/resources/chip-for-ai/dsa.mdx)
  - [Kernel Optimization](docs/en/resources/chip-for-ai/kernel-optimization.mdx)
- [Surveys & Articles](docs/en/resources/articles.mdx)

## Guide

<!-- guide:start -->

### AI Model

For readers familiar with LLMs who want to research RTL generation, domain post-training, or evaluation.

1. [LLMs for EDA: A Survey](https://arxiv.org/abs/2501.09655) — Covers EDA tasks, models, data, and evaluation, offering a quick overview of key directions at the intersection of LLMs and EDA.
2. [VerilogEval](https://github.com/NVlabs/verilog-eval) — Follow the README's `spec-to-rtl` workflow to understand evaluation from specifications through Verilog to simulation results.
3. [CodeV-R1](https://github.com/IPRC-DIP/CodeV-R1) — Use this Verilog post-training project to explore the training configurations in `sft/`, then the RL workflow and testbench reward in `verl/`. Compare these with the released data to understand how reasoning distillation and simulation feedback enter training.

If reading simple RTL is still difficult, begin with combinational and sequential logic exercises in [HDLBits](https://hdlbits.01xz.net/wiki/Main_Page), then [cocotb First Steps](https://docs.cocotb.org/en/stable/first_steps.html) to connect Python testbenches with clocks, reset, assertions, and waveforms. Continue through [Data](docs/en/resources/ai-model/data.mdx), [Benchmark](docs/en/resources/ai-model/benchmark.mdx), or [Training](docs/en/resources/ai-model/training.mdx) for your research question.

### AI EDA

For readers with RTL / EDA experience who want to build design agents or automated optimization flows.

1. [The Dawn of Agentic EDA](https://arxiv.org/abs/2512.23189) — Start with section 2 on agent architectures, then choose section 3 on RTL / Verification or section 4 on Physical Design.
2. [OpenROAD Flow Scripts Tutorial](https://openroad-flow-scripts.readthedocs.io/en/latest/tutorials/FlowTutorial.html) — Use the Ibex / SKY130 example to understand the complete RTL-to-GDS flow.
3. [OpenROAD — Running Claude Code in Docker](https://openroad-flow-scripts.readthedocs.io/en/latest/user/ClaudeCode.html) — Connect a coding agent to a container with EDA tools and see how it accesses a project, builds, and runs tests.

For synthesis optimization, continue with [Yosys Synthesis Starter](https://yosyshq.readthedocs.io/projects/yosys/en/latest/getting_started/example_synth.html) to follow a FIFO from RTL to a netlist. For verification, use [SymbiYosys Getting Started](https://symbiyosys.readthedocs.io/en/latest/quickstart.html) to learn assertions, bounded checks, proofs, and counterexamples. Find projects in [AI EDA](docs/en/resources/eda/ai-eda.mdx) and [EDA Optimization](docs/en/resources/eda/optimization.mdx).

#### Analog / Mixed-Signal

Readers with circuit fundamentals who want an analog design and optimization environment can follow [JKU Analog Circuit Design](https://iic-jku.github.io/analog-circuit-design/aicd.html): chapters 1 and 2 introduce Xschem, ngspice, and an open PDK; chapter 3 covers gm/ID sizing; chapter 8 develops OTA simulation, PVT, and Monte Carlo analysis. The course includes circuit files and Python notebooks.

To connect simulation to parameter search or agents, continue with the looping, parameter modification, and data export sections of the [ngspice Control Language Tutorial](https://ngspice.sourceforge.io/ngspice-control-language-tutorial.html).

### Chip for AI

For readers with machine learning or computer architecture foundations who want to study model–accelerator co-design.

1. [MIT 6.5940 — TinyML and Efficient AI Computing](https://hanlab.mit.edu/courses/2026-fall-65940) — A foundation for studying hardware-aware ML.
2. [Timeloop / Accelergy v4](https://timeloop.csail.mit.edu/v4) and its [exercises](https://github.com/Accelergy-Project/timeloop-accelergy-exercises) — Learn DSE without first implementing an RTL accelerator.

To study an accelerator's hardware and software together, continue with [Gemmini Quick Start](https://github.com/ucb-bar/gemmini#quick-start): start with matrix multiplication in the simulator, then read Architecture for the systolic array, scratchpad, accumulator, and dataflow. Explore [Hardware-aware ML](docs/en/resources/chip-for-ai/hardware-aware-ml.mdx), [DSE](docs/en/resources/chip-for-ai/dse.mdx), [DSA](docs/en/resources/chip-for-ai/dsa.mdx), or [Kernel Optimization](docs/en/resources/chip-for-ai/kernel-optimization.mdx) for further work.

<!-- guide:end -->

## Contributors

Thanks to everyone helping maintain this directory. Contributions of new work, corrections to links and descriptions, and executable environments are welcome.

[![Contributors](https://contrib.rocks/image?repo=tapeo-ai/awesome-ai4chip&max=100)](https://github.com/tapeo-ai/awesome-ai4chip/graphs/contributors)

<!-- community:start -->

## Community & Contact

Star the repository, share it with colleagues, or [open a pull request](https://github.com/tapeo-ai/awesome-ai4chip/pulls) to add work and improve the content. Suggestions are also welcome through [Issues](https://github.com/tapeo-ai/awesome-ai4chip/issues).

- Email: [dengjiaji@foxnmail.com](mailto:dengjiaji@foxnmail.com)
- Personal GitHub: [Dengjiaji](https://github.com/Dengjiaji)
- WeChat: `dengjiajicarl`. Please include your institution, name, and reason for connecting.

Scan the code to join the AI4CHIP WeChat group and discuss research and engineering practice.

<p align="center"><img src="assets/ai4chip-qrcode.jpg" width="300" alt="AI4CHIP WeChat community QR code"></p>

<!-- community:end -->
