---
title: "Getting Started and Tutorials"
description: "Hands-on material for chip design fundamentals, open-source EDA, AI4Chip workflows, and co-design."
---

For digital design, follow HDLBits → cocotb → Yosys → OpenROAD → AutoChip. Start analog circuits with ngspice, and model-hardware co-design with MIT 6.5940.

## Chip Design Fundamentals

- [HDLBits — Verilog Practice](https://hdlbits.01xz.net/wiki/Main_Page) — Practice Verilog from wiring and combinational logic to sequential circuits and state machines, using online simulation checks while learning waveforms and testbenches.
- [Tiny Tapeout — Digital Design Guide](https://tinytapeout.com/digital_design/) — Start digital design with browser-based projects using logic gates, flip-flops, adders, and UARTs, then move to HDL templates and chip fabrication flows.
- [cocotb — First Steps](https://docs.cocotb.org/en/stable/first_steps.html) — Write Python testbenches for a counter, run passing and failing tests, and inspect waveforms to understand the basic design-verification loop.
- [SymbiYosys — Getting Started](https://symbiyosys.readthedocs.io/en/latest/quickstart.html) — Write FIFO assertions, run bounded checks, proofs, and coverage tasks, and use counterexample waveforms to locate design bugs.

## Getting Started with Open-Source Tools

- [Yosys — Synthesis Starter](https://yosyshq.readthedocs.io/projects/yosys/en/latest/getting_started/example_synth.html) — Synthesize a FIFO step by step, observing how elaboration, optimization, and technology mapping transform RTL into a circuit representation.
- [OpenROAD Flow Scripts Tutorial](https://openroad-flow-scripts.readthedocs.io/en/latest/tutorials/FlowTutorial.html) — Run an Ibex and SKY130 example from RTL to GDS, using the GUI, timing reports, and intermediate artifacts to understand placement and routing.
- [OpenLane 2 — Newcomers](https://openlane2.readthedocs.io/en/latest/getting_started/newcomers/index.html) — Use a 32-bit multiplier to learn design configuration, flow execution, GDS and log inspection, and changes to clock and pin settings.
- [ngspice — Tutorial for Beginners](https://ngspice.sourceforge.io/ngspice-tutorial.html) — Start with netlists, device models, and installation, then use small circuits to learn DC, AC, and transient simulation and plotting. [Batch Simulation and Scripting](https://ngspice.sourceforge.io/ngspice-control-language-tutorial.html)
- [JKU — Analog (Integrated) Circuit Design](https://iic-jku.github.io/analog-circuit-design/aicd.html) — Use Xschem, ngspice, open PDKs, and Python notebooks to progress from gm/ID sizing to OTA design, PVT analysis, and Monte Carlo simulation. [Code and Exercises](https://github.com/iic-jku/analog-circuit-design)

## AI4Chip in Practice

- [AutoChip — Setup and Usage](https://github.com/shailja-thakur/AutoChip) — Follow the authors' installation, configuration, and usage instructions to try a minimal loop in which an LLM generates Verilog and repairs it using compiler and simulator errors.
- [OpenROAD — Running Claude Code in Docker](https://openroad-flow-scripts.readthedocs.io/en/latest/user/ClaudeCode.html) — Follow OpenROAD's instructions to connect a coding agent to an EDA container for builds, tests, and RTL-to-GDS flows.

## Co-design Tutorials

- [Timeloop / Accelergy — Tutorial Exercises](https://github.com/Accelergy-Project/timeloop-accelergy-exercises) — Use Docker notebooks to vary architectures and mappings and observe the relationships between data movement, performance, and energy.
- [MIT 6.5940 — TinyML and Efficient AI Computing](https://hanlab.mit.edu/courses/2026-fall-65940) — Use public lectures, videos, and labs to study how pruning, quantization, neural architecture search, and deployment address compute and memory constraints.
- [Gemmini — Quick Start and Architecture Guide](https://github.com/ucb-bar/gemmini#quick-start) — Build Gemmini hardware, software, and simulators, run matrix multiplication and neural networks, and learn about systolic arrays, memory, and dataflow.
