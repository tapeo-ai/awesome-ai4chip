## CPT (Continued Pretraining)

- [FreeV / FreeSet](https://arxiv.org/abs/2505.06096)（2025） — 用经过许可筛选、去重和语法检查的 Verilog 语料，对 Llama-3.1-8B 进行领域继续预训练。 [数据](https://huggingface.co/datasets/SETH-TAMU/FreeSet-V1.0-LabUse)

## SFT & Reasoning Distillation

- [AnalogSeeker](https://arxiv.org/abs/2508.10409)（2025） — 从模拟电路教材构建问答与推理数据，通过带 KL 正则的 SFT 训练 Qwen2.5-32B 的电路知识与推理能力。 [模型](https://huggingface.co/analogllm/analog_model)
- [AST-guided SVRF Code Synthesis](https://arxiv.org/abs/2507.00352)（2025） — Siemens EDA 对 T5 系列模型进行 AST 引导微调，并结合 RAG 从自然语言生成 SVRF 物理验证规则。
- [DeepRTL](https://github.com/PeterLau61/DeepRTL)（2025） — 基于 CodeT5+，按行、代码块和模块逐步进行指令微调，联合学习 Verilog 理解与生成。 [论文](https://arxiv.org/abs/2502.15832) [数据](https://huggingface.co/datasets/liuyi2000/deeprtl_finetuning_dataset)
- [IBM EDA Assistants with RAFT](https://research.ibm.com/publications/improving-llm-powered-eda-assistants-with-raft)（2025） — 用合成 EDA 问答进行检索增强微调，并用真实问题引导训练数据生成，改善设计文档问答。
- [LaMAGIC2](https://proceedings.mlr.press/v267/chang25b.html)（2025） — 以预训练 Flan-T5-base 为基础改造数值输入和电路表示，通过监督微调生成满足指标的电源转换器拓扑。 [代码](https://github.com/turtleben/LaMAGIC)
- [ReasoningV](https://github.com/BUAA-CLab/ReasoningV)（2025） — 先用 LoRA 学习 Verilog 基础，再以通过仿真的代码及对应推理轨迹做全参数微调，并按题目难度选择推理方式。 [论文](https://arxiv.org/abs/2504.14560)
- [RF-Agent (RFIC)](https://github.com/Nina-nina123/RF-Agent)（2026） — 从 RF 教材蒸馏问答与推理数据，对 Llama / Qwen 小型语言模型做 SFT，并比较不同 RAG 方法。 [论文](https://arxiv.org/abs/2607.18772)
- [ScaleRTL](https://arxiv.org/abs/2506.05566)（2025） — NVIDIA 用 DeepSeek-R1 生成的长链推理数据微调 R1-Distill-Qwen-32B，并通过推理期反思与自纠错延长 RTL 推理。
- [SiliconMind-V1](https://github.com/AS-SiliconMind/SiliconMind-V1)（2026） — 将多 agent 生成和自纠错轨迹蒸馏进 Qwen、OLMo 等模型，通过两轮 SFT 学习 RTL 生成与调试。 [论文](https://arxiv.org/abs/2603.08719)
- [VeriThoughts](https://github.com/wilyub/VeriThoughts)（2025） — 利用 Verilog 形式等价反馈构建训练数据，并对 Qwen 系列进行推理 SFT。 [论文](https://arxiv.org/abs/2505.20302)

## Representation Learning & Knowledge Distillation

- [DeepRTL2](https://arxiv.org/abs/2506.15697)（2025） — 在 Llama / DeepSeek-Coder 上结合课程微调与对比学习，让同一模型支持 RTL 生成、理解、检索和性能预测。
- [VeriDistill](https://ijcai.org/proceedings/2025/1033)（2025） — 华为诺亚方舟实验室冻结代码 LLM，训练轻量 QoR 预测头，并用 LUT 图网络蒸馏补充低层电路信息。

## Preference Optimization & RL

- [Alpha-RTL / TTT-RTL](https://arxiv.org/abs/2606.05253)（2026） — 针对每个 RTL 设计在测试时更新模型参数，结合树搜索与语法、仿真、PPA 奖励优化实现。
- [BUFFALO](https://research.nvidia.com/labs/electronic-design-automation/publication/lu2025buffalo/)（2025） — NVIDIA 与 Georgia Tech 微调预训练 T5-Large，联合生成缓冲树结构与位置，再通过网级和全芯片级 GRPO 优化 PPA。 [论文](https://gtcad.gatech.edu/www/papers/Hsiao-ICCAD25.pdf)
- [ChipMATE](https://github.com/zhongkaiyu/ChipMATE)（2026） — 分别训练 Verilog 与 Python 参考模型 agent，再用交叉验证驱动的 X-GRPO 学习多轮协作生成 RTL。 [论文](https://arxiv.org/abs/2605.12857)
- [ChipSeek](https://github.com/rong-hash/chipseek)（2026） — 先做推理冷启动 SFT，再通过 CDPO 将仿真、综合与 PPA 反馈用于强化学习，兼顾功能正确性和设计质量。 [论文](https://aclanthology.org/2026.acl-long.1154/)
- [CodeV-R1 / QiMeng-CodeV-R1](https://github.com/IPRC-DIP/CodeV-R1)（2025） — 通过自动 testbench 筛选训练数据，先蒸馏推理能力，再用自适应 DAPO 优化 Verilog 生成。 [论文](https://arxiv.org/abs/2505.24183) [数据](https://huggingface.co/datasets/zhuyaoyu/CodeV-R1-dataset)
- [CovR](https://arxiv.org/abs/2609.19189)（2026） — 从覆盖率反馈生成推理与激励数据，先做 SFT，再用 GRPO 训练高覆盖率 testbench 生成模型。
- [RTLSeek](https://arxiv.org/abs/2603.27630)（2026） — 在 SFT 后分阶段进行 GRPO 训练，用 EDA 反馈和 AST 多样性奖励兼顾功能正确与不同实现方式。
- [VeriPrefer](https://github.com/CatIIIIIIII/VeriPrefer)（2025） — 把 testbench 执行结果转成代码偏好对，在 SFT 后用 DPO 提高 Verilog 生成的功能正确性。 [论文](https://arxiv.org/abs/2504.15804) [数据](https://huggingface.co/datasets/LLM-EDA/pyra_tb)
- [VeriReason](https://github.com/NellyW8/VeriReason)（2025） — 先做推理数据 SFT，再用 testbench 与代码结构反馈进行 GRPO 训练，提升 RTL 生成和自检查能力。 [论文](https://arxiv.org/abs/2505.11849) [数据](https://huggingface.co/collections/AI4EDA-CASE/verireason)
- [VeriRL](https://github.com/ZJU-OmniAI/VeriRL)（2025） — 交替进行 SFT 与 Reinforce++，用 testbench 监督训练奖励模型，并通过轨迹重评分和样本平衡改进 RTL 生成。 [论文](https://arxiv.org/abs/2508.18462) [数据](https://huggingface.co/datasets/tttboy/Veribench-53K)
