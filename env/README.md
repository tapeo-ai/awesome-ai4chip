# 环境与示例

这里放可执行的芯片设计任务，采用 [Harbor 任务格式](https://docs.harborframework.com/tasks/overview)。

- [C14：二次特征映射的 RTL 优化](examples/fw_c14_overcomplete_banks_v1/README.md) — 包含任务说明、输入规格、初始 RTL、独立评分器和参考解，使用 Yosys、OpenROAD 与 SKY130 标准单元库评估功能、面积和时延。

示例中的 `assets.json` 记录大型依赖及校验值，`prepare.py` 在运行前恢复这些文件。Git 中保留任务代码和配置。

格式参考：[任务配置](https://docs.harborframework.com/tasks/configuration) · [独立验证环境](https://docs.harborframework.com/tasks/separate-verifier)。
