Covers circuit representation and performance prediction, RTL and logic optimization, physical design, and analog circuit design, using representation learning, reinforcement learning, search, and differentiable optimization.

## Circuit Representation & Performance Prediction

- [DeepGate4](https://github.com/zyzheng17/DeepGate4-ICLR-25) (2025) — Combines a GNN encoder with a sparse graph Transformer, using gate-level and graph-level multitask supervision to learn functional and structural representations of large AIGs. [Paper](https://arxiv.org/abs/2502.01681)
- [Multimodal Thermal Solver for 3DICs](https://doi.org/10.1109/MLCAD65511.2025.11189201) (2025) — UMD and Synopsys combine block-level thermal response learning, multimodal mapping, and linear superposition to predict thermal fields across chip sizes and power distributions. [Technical Talk](https://www.ieee-edps.com/archives/2025/c/0400chang.pdf)
- [Pieceformer](https://arxiv.org/abs/2506.15907) (2025) — Georgia Tech and Cadence combine message passing, partitioned graph Transformers, and contrastive self-supervision to measure netlist similarity and reuse partitioning experience.
- [TRACE](https://github.com/zyzheng17/TRACE_DAC26) (2026) — Encodes RTL and netlists with a Transformer that follows logical levels, learning circuit representations through function-shift prediction and contrastive learning. [Paper](https://arxiv.org/abs/2509.21886) [Data](https://huggingface.co/datasets/zyzheng23/TRACE_dataset)

## RTL & Logic Optimization

- [ASPEN](https://research.nvidia.com/labs/electronic-design-automation/publication/deng2025aspen/) (2025) — Cornell, NVIDIA, and UMD use LLMs to propose and select e-graph rewrite rules, then use PPA feedback to search for functionally equivalent RTL datapaths. [Paper](https://www.csl.cornell.edu/~zhiruz/pdfs/aspen-mlcad2025.pdf)
- [SynAct](https://arxiv.org/abs/2608.12751) (2026) — Reads live synthesis reports and tool knowledge to select commands in a feedback loop and optimize timing and PPA.

## Physical Design Optimization

- [AlphaChip / Circuit Training](https://github.com/google-research/circuit_training) — Uses distributed deep reinforcement learning for chip macro placement, with an open training framework and checkpoints.
- [C3PO](https://research.nvidia.com/labs/electronic-design-automation/publication/lu2026aspdac/) (2026) — NVIDIA jointly optimizes timing, routability, and wirelength with GPU-based differentiable optimization, adjusting objective weights during placement iterations. [Paper](https://hhsiao30.github.io/papers/yichen_apsdac26__Camera_Ready_eXpress.pdf)
- [CROP](https://arxiv.org/abs/2507.02128) (2025) — Duke and Synopsys turn hierarchical RTL summaries into design vectors, retrieve parameter settings from similar circuits, and use RAG and LLMs to guide EDA flow tuning.
- [DREAMPlace](https://github.com/limbo018/DREAMPlace) — Uses deep learning frameworks and GPUs to accelerate global and detailed placement, providing infrastructure for learning-based physical design.
- [LEGO-Size](https://research.nvidia.com/labs/electronic-design-automation/publication/lu2025ispd/) (2025) — NVIDIA pretrains a specialized Transformer on library-cell sequences with self-supervision, follows with supervised learning, and uses GPU-based differentiable timing analysis to optimize gate sizes. [Paper](https://research.nvidia.com/labs/electronic-design-automation/papers/yichen_LEGO_ispd25.pdf)
- [OpenROAD AutoTuner](https://github.com/The-OpenROAD-Project/OpenROAD-flow-scripts/tree/master/tools/AutoTuner) — Tunes RTL-to-GDS flow parameters through distributed hyperparameter search and collects PPA metrics.

## Analog Circuit Design

- [AnalogGenie](https://github.com/xz-group/AnalogGenie) (2025) — Represents circuits as device-pin sequences and trains an approximately 12M-parameter autoregressive Transformer from scratch to generate analog circuit topologies. [Paper](https://openreview.net/forum?id=jCPak79Kev) [Data](https://huggingface.co/datasets/JianGao666/AnalogGenie)
- [AstRL](https://arxiv.org/abs/2602.12402) (2026) — Uses a graph neural network as a transistor-topology policy, combining expert behavior cloning, PPO, and simulation feedback to generate analog and mixed-signal circuits.
