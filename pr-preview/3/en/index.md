![AI4Chip research map](/assets/ai4chip-architecture.png)

AI for Chip connects machine learning, chip design, and computer systems. We aim to build Awesome AI4Chip into the most comprehensive source of AI for Chip news and resources, collecting papers, open-source projects, datasets, benchmarks, tools, products, and technical articles. The goal is to help readers from different backgrounds **build a clear understanding of the field**: identify key problems and technical approaches, find learning material and reproducible projects, and follow research and industry developments.

Our main focus is AI for Chip: model data, training, and evaluation; specification understanding; RTL generation and verification; analog circuits; synthesis; and physical implementation. We also cover Chip for AI and co-design across models, kernels, chip architectures, and infrastructure. The directory is organized into AI Model, EDA, and Chip for AI, with selected material and reading paths in the [Guide](#guide).

## Latest

- **2026-10-26** · [Cadence Maestro](https://www.cadence.com/en_US/home/company/newsroom/press-releases/pr/2026/cadence-introduces-maestro-a-domain-specialized-ai-model.html) — Introduces a family of domain models for chip and system design, trained with EDA tool feedback.
- **2026-10-22** · [Back-to-the-Future (BTTF)](https://arxiv.org/abs/2610.06790) — Updates its paper on RTL debugging with SQLite waveform data and natural-language queries.
- **2026-10-07** · [RFChipAgent](https://arxiv.org/abs/2610.10858) — Presents a multi-agent analog/RF design workflow connecting retrieval, topology selection and simulation-based optimization.
- **2026-10-04** · [VHDL-REPOBENCH](https://arxiv.org/abs/2610.05380) — Introduces repository-level VHDL evaluation focused on cross-file dependencies and hierarchical design understanding.
- **2026-10** · [Build-A-Chip-Bench](https://chipagents.ai/research/build-a-chip-bench) — Describes long-horizon evaluation from workload specifications to GDS, combining functional acceptance with PPA scoring.

## Directory

- [Guide](#guide)
- AI Model
  - [Data](/en/resources/ai-model/data)
  - [Benchmark](/en/resources/ai-model/benchmark)
  - [Training](/en/resources/ai-model/training)
  - [Harbor Environment Example](/en/resources/ai-model/harbor-examples)
- EDA
  - [EDA 101](/en/resources/eda/eda-101)
  - [Open Source](/en/resources/eda/open-source)
  - [Closed Source](/en/resources/eda/closed-source)
  - [AI EDA](/en/resources/eda/ai-eda)
  - [EDA Optimization](/en/resources/eda/optimization)
- Chip for AI
  - [Hardware-aware ML](/en/resources/chip-for-ai/hardware-aware-ml)
  - [DSE (Design Space Exploration)](/en/resources/chip-for-ai/dse)
  - [DSA (Domain-specific Architecture)](/en/resources/chip-for-ai/dsa)
  - [Kernel Optimization](/en/resources/chip-for-ai/kernel-optimization)
- [Surveys & Articles](/en/resources/articles)

## Guide

If chip design is new to you, start with [EDA 101](/en/resources/eda/eda-101): a flow diagram connects RTL, verification, synthesis, place and route, and signoff to the software used at each stage.

### AI Model

For readers familiar with LLMs who want to research RTL generation, domain post-training, or evaluation. Read the survey, establish an evaluation setup, then study a training implementation.

1. [LLMs for EDA: A Survey](https://arxiv.org/abs/2501.09655) — Section 3 covers EDA tasks, section 4 model adaptation, and section 5.1 data and evaluation. Use it to identify the data and checks needed for a particular task: generating RTL, generating assertions, or answering questions about design documents.
2. [VerilogEval](https://github.com/NVlabs/verilog-eval) — Follow the README's `spec-to-rtl` flow from a specification through generated Verilog to simulation results. It makes a basic evaluation distinction concrete: compiling successfully and implementing the specification are different requirements.
3. [CodeV-R1](https://github.com/IPRC-DIP/CodeV-R1) — Study a concrete Verilog post-training project. Read the evaluation instructions in `test/`, training configurations in `sft/`, then the RL pipeline and testbench reward in `verl/`. Compare these with the released data to see how reasoning distillation and simulation feedback enter training.

If reading simple RTL is still difficult, begin with combinational and sequential logic exercises in [HDLBits](https://hdlbits.01xz.net/wiki/Main_Page), then [cocotb First Steps](https://docs.cocotb.org/en/stable/first_steps.html) to connect Python testbenches with clocks, reset, assertions, and waveforms. Continue through [Data](/en/resources/ai-model/data), [Benchmark](/en/resources/ai-model/benchmark), or [Training](/en/resources/ai-model/training) for your research question.

### AI EDA

For readers with RTL / EDA experience who want to build design agents or automated optimization flows.

1. [The Dawn of Agentic EDA](https://arxiv.org/abs/2512.23189) — Read section 2 on agent architectures, then choose section 3 on RTL / Verification or section 4 on Physical Design. Follow how tool calls, task decomposition, and feedback are organized, and where deterministic EDA checks remain necessary.
2. [OpenROAD Flow Scripts Tutorial](https://openroad-flow-scripts.readthedocs.io/en/latest/tutorials/FlowTutorial.html) — Follow the Ibex / SKY130 example through RTL to GDS. Start with Running the Automated RTL-to-GDS Flow, then use the directory guide to inspect synthesis, floorplan, CTS, and routing results. The tutorial connects commands, artifacts, the GUI, and timing reports.
3. [OpenROAD — Running Claude Code in Docker](https://openroad-flow-scripts.readthedocs.io/en/latest/user/ClaudeCode.html) — Connect a coding agent to a container with EDA tools and see how it accesses a project, builds, and runs tests. Read this after completing an ORFS run to bring an existing design flow into an agent workflow.

For synthesis optimization, continue with [Yosys Synthesis Starter](https://yosyshq.readthedocs.io/projects/yosys/en/latest/getting_started/example_synth.html) to follow a FIFO from RTL to a netlist. For verification, use [SymbiYosys Getting Started](https://symbiyosys.readthedocs.io/en/latest/quickstart.html) to learn assertions, bounded checks, proofs, and counterexamples. Find projects in [AI EDA](/en/resources/eda/ai-eda) and [EDA Optimization](/en/resources/eda/optimization).

#### Analog / Mixed-Signal

Readers with circuit fundamentals who want an analog design and optimization environment can follow [JKU Analog Circuit Design](https://iic-jku.github.io/analog-circuit-design/aicd.html): chapters 1 and 2 introduce Xschem, ngspice, and an open PDK; chapter 3 covers gm/ID sizing; chapter 8 develops OTA simulation, PVT, and Monte Carlo analysis. The course includes circuit files and Python notebooks.

To connect simulation to parameter search or agents, continue with the looping, parameter modification, and data export sections of the [ngspice Control Language Tutorial](https://ngspice.sourceforge.io/ngspice-control-language-tutorial.html).

### Chip for AI

For readers with machine learning or computer architecture foundations who want to study model–accelerator co-design.

1. [MIT 6.5940 — TinyML and Efficient AI Computing](https://hanlab.mit.edu/courses/2026-fall-65940) — Start with Introduction, then Quantization and Neural Architecture Search. Lectures, videos, and labs connect accuracy, computation, memory requirements, and deployment cost, providing a foundation for hardware-aware ML.
2. [Timeloop / Accelergy v4](https://timeloop.csail.mit.edu/v4) and its [exercises](https://github.com/Accelergy-Project/timeloop-accelergy-exercises) — Read Problem, Architecture, and Constraints to distinguish workloads, hardware, and mapping constraints. Then run the exercises and compare data movement, cycles, and energy using Stats / Mapping outputs. This introduces DSE without first implementing an RTL accelerator.

To study an accelerator's hardware and software together, continue with [Gemmini Quick Start](https://github.com/ucb-bar/gemmini#quick-start): start with matrix multiplication in the simulator, then read Architecture for the systolic array, scratchpad, accumulator, and dataflow. Explore [Hardware-aware ML](/en/resources/chip-for-ai/hardware-aware-ml), [DSE](/en/resources/chip-for-ai/dse), [DSA](/en/resources/chip-for-ai/dsa), or [Kernel Optimization](/en/resources/chip-for-ai/kernel-optimization) for further work.

## Contributors

Thanks to everyone helping maintain this directory. Contributions of new work, corrections to links and descriptions, and executable environments are welcome.

[![Contributors](https://contrib.rocks/image?repo=tapeo-ai/awesome-ai4chip&max=100)](https://github.com/tapeo-ai/awesome-ai4chip/graphs/contributors)

## Community & Contact

Star the repository, share it with colleagues, or [open a pull request](https://github.com/tapeo-ai/awesome-ai4chip/pulls) to add work and improve the content. Suggestions are also welcome through [Issues](https://github.com/tapeo-ai/awesome-ai4chip/issues).

- Email: [dengjiaji@foxnmail.com](mailto:dengjiaji@foxnmail.com)
- Personal GitHub: [Dengjiaji](https://github.com/Dengjiaji)
- WeChat: `dengjiajicarl`. Please include your institution, name, and reason for connecting.

Scan the code to join the AI4CHIP WeChat group and discuss research and engineering practice.

<p align="center"><img src="/assets/ai4chip-qrcode.jpg" width="300" alt="AI4CHIP WeChat community QR code" /></p>
