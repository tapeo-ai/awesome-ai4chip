# Harbor 环境示例

一个 Harbor 格式的 AI for Chip 任务：优化两组二次布尔特征映射，在保持所有输入下功能一致的前提下，降低面积并满足时序约束。

| 任务 | 输入位宽 | 输出位宽 | 面积上限 | 延迟上限 |
| --- | ---: | ---: | ---: | ---: |
| alpha | 24 | 64 | 12,475.79 µm² | 11.53 ns |
| beta | 36 | 80 | 15,864.54 µm² | 11.29 ns |

功能规格写在 `spec_*.json` 中，starter RTL 提供可优化的初始实现。验证器用 GF(2) 代数正规形检查完整功能，再用 Yosys/ABC、SKY130 HD 和 OpenROAD/OpenSTA 评估面积与时序。指标采用布局前单元面积和零互连寄生时序。

## 目录

```text
task.toml                 # Harbor 任务及资源配置
instruction.md            # agent 读取的任务说明
assets.json               # 外部依赖的大小、SHA-256 和来源
prepare.py                # 从本地原始包恢复依赖
environment/
  Dockerfile              # agent 环境
  files/                  # 规格、starter RTL、bring-up 和工具配置
tests/
  Dockerfile              # 独立 verifier 环境
  test.sh                 # 验证入口
  asic_lab.py             # 精确功能检查与面积/时序计算
  public/                 # prepare.py 生成，不提交 Git
solution/
  solve.sh                # oracle 入口
  reference/              # 两个参考实现
```

`bringup.py` 只做零输入和 one-hot 功能检查，最终判定由 `tests/` 中的完整验证器完成。运行 agent 时只提供 `instruction.md` 和 `environment/`，`tests/`、`solution/` 留在评测侧。

## 准备依赖

需要 Python 3.10+，以及本地原始归档 `fw_c14_overcomplete_banks_v1.tgz`。在本目录执行：

```bash
python3 prepare.py --archive /path/to/fw_c14_overcomplete_banks_v1.tgz
python3 prepare.py --check
```

脚本校验原始包的 SHA-256，只取出 OpenROAD runtime 和三个 SKY130 工艺文件，逐个校验后生成 `tests/public/`。这些大文件不进入 Git，脚本也不联网下载。

OpenROAD runtime 为 **Linux x86-64**，两个 Dockerfile 使用 `linux/amd64`。Apple Silicon 等 ARM 主机需要容器运行时支持 x86-64 仿真。

## 运行

安装 [Harbor](https://docs.harborframework.com/) 并启动 Docker 后，在本目录用参考解检查完整流程：

```bash
harbor run -p . -a oracle
```

任务使用 [separate verifier](https://docs.harborframework.com/tasks/separate-verifier)：agent 交付 `output/feature_alpha.v` 和 `output/feature_beta.v`，验证器在独立环境中读取产物并输出结果。

## 来源

本示例来自 `fw_c14_overcomplete_banks_v1.tgz`，保留原始规格、starter、参考解和验证逻辑。Python 依赖锁定文件来自同一工作台；外部资产的校验值记录在 [assets.json](assets.json)。SKY130 文件的 Apache-2.0 许可保留在 [technology/LICENSE](environment/files/technology/LICENSE)，OpenROAD runtime 内含各组件的许可说明。
