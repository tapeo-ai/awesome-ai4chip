[所有环境](/environments/) · [任务源文件](https://github.com/tapeo-ai/awesome-ai4chip/blob/main/env/examples/fw_c14_overcomplete_banks_v1/README.md)

## 概览

一个 Harbor 格式的 AI for Chip 任务：优化两组二次布尔特征映射，在保持所有输入下功能一致的前提下，降低面积并满足时序约束。

| 任务 | 输入位宽 | 输出位宽 | 面积上限 | 延迟上限 |
| --- | ---: | ---: | ---: | ---: |
| alpha | 24 | 64 | 12,475.79 µm² | 11.53 ns |
| beta | 36 | 80 | 15,864.54 µm² | 11.29 ns |

功能规格写在 `spec_*.json` 中，starter RTL 提供可优化的初始实现。验证器用 GF(2) 代数正规形检查完整功能，再用 Yosys/ABC、SKY130 HD 和 OpenROAD/OpenSTA 评估面积与时序。指标采用布局前单元面积和零互连寄生时序。

### 目录

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

### 准备依赖

需要 Python 3.10+，以及本地原始归档 `fw_c14_overcomplete_banks_v1.tgz`。在本目录执行：

```bash
python3 prepare.py --archive /path/to/fw_c14_overcomplete_banks_v1.tgz
python3 prepare.py --check
```

脚本校验原始包的 SHA-256，只取出 OpenROAD runtime 和三个 SKY130 工艺文件，逐个校验后生成 `tests/public/`。这些大文件不进入 Git，脚本也不联网下载。

OpenROAD runtime 为 **Linux x86-64**，两个 Dockerfile 使用 `linux/amd64`。Apple Silicon 等 ARM 主机需要容器运行时支持 x86-64 仿真。

### 运行

安装 [Harbor](https://docs.harborframework.com/) 并启动 Docker 后，在本目录用参考解检查完整流程：

```bash
harbor run -p . -a oracle
```

任务使用 [separate verifier](https://docs.harborframework.com/tasks/separate-verifier)：agent 交付 `output/feature_alpha.v` 和 `output/feature_beta.v`，验证器在独立环境中读取产物并输出结果。

### 来源

本示例来自 `fw_c14_overcomplete_banks_v1.tgz`，保留原始规格、starter、参考解和验证逻辑。Python 依赖锁定文件来自同一工作台；外部资产的校验值记录在 [assets.json](/environments/fw_c14_overcomplete_banks_v1/assets.json)。SKY130 文件的 Apache-2.0 许可保留在 [technology/LICENSE](https://github.com/tapeo-ai/awesome-ai4chip/blob/main/env/examples/fw_c14_overcomplete_banks_v1/environment/files/technology/LICENSE)，OpenROAD runtime 内含各组件的许可说明。

## 任务说明

Two original fixed-function sensor feature banks exceed their SKY130-HD allocations.
The supplied starter RTL implements the required functions but has poor sharing.
Recover compact implementations for BOTH projects and validate the entire contract.

Write /home/node/workspace/output/feature_alpha.v and feature_beta.v, defining
modules feature_alpha and feature_beta with exactly ports x (input) and y (output).
Dimensions differ: alpha maps 24 input bits to 64 output bits; beta maps 36 to 80.
Bus indices start at zero, with x[i] and y[i] using their literal bit indices.
Do not truncate coefficient vectors or output words to a machine integer width.

cases.json and each spec_*.json are authoritative. Output polynomials are algebraic
normal forms over GF(2): XOR every listed monomial; a hexadecimal mask selects input
bits to AND. Mask 0 is constant one. Repeated variables obey x_i*x_i=x_i. The function
must match for ALL input words, including dense simultaneous activations and zero.
Only generic combinational RTL is allowed: no sequential state, unknown values,
technology cells, black boxes, simulator side effects, file reads or runtime inputs
beyond x. Any topology meeting the exact function and physical budgets is accepted.

Each core must jointly meet max_area_um2 and max_delay_ns in its spec. Mapping uses
yowasp-yosys 0.69.0.0.post1233 and ABC with the provided SKY130 HD TT Liberty. Native
OpenROAD v2.0-17598-ga008522d8 uses the supplied LEF geometry to sum cell areas and
OpenSTA to calculate delay with the given slew, output load and virtual clock. These
are explicitly pre-layout, zero-interconnect-parasitic metrics, not tapeout signoff.
The budgets have margin above independently verified feasible implementations.

Existing bring-up automation is available:
  python3 /home/node/workspace/input/bringup.py alpha /home/node/workspace/output
and similarly beta. It reports synthesis/PPA and deliberately LIMITED zero/one-hot
functional smoke coverage. A green bring-up result is NOT a complete functional
certificate. Inspect coverage and perform independent equivalence reasoning/testing
before release. Exact functions, correct oversized starters and native EDA tools are
provided, so additional validation does not require private expected data. The final
trusted verifier independently checks the all-input Boolean functions and PPA.

Joint output sharing and structural algebra may be useful. Unlike a square change
of independent input coordinates, the number of nonlinear feature components in
these banks can exceed the number of input bits. A method that works only for small
or nonredundant cases may silently lose essential structure in a batch. Save reusable
optimization and validation code in output/ if you create one; the two RTL modules
are the scored artifacts. Do not modify the technology libraries or reinterpret the
specification to improve a report. The verifier uses fresh trusted copies.

Inputs are at `/home/node/workspace/input`.

## 配置

[查看 task.toml](https://github.com/tapeo-ai/awesome-ai4chip/blob/main/env/examples/fw_c14_overcomplete_banks_v1/task.toml)

```toml
version = "1.0"
artifacts = ["/home/node/workspace/output"]

[metadata]
author_name = "Frontier Workbenches"
difficulty = "unknown"
category = "chip"
tags = ["original", "native-pilot", "difficulty-unmeasured"]

[agent]
timeout_sec = 9800.0

[verifier]
environment_mode = "separate"
timeout_sec = 900.0

[environment]
build_timeout_sec = 1800.0
cpus = 4
memory_mb = 8192
storage_mb = 10240
```

## 目录与依赖

```text
fw_c14_overcomplete_banks_v1/
├── environment/
│   ├── files/
│   │   ├── software/
│   │   ├── technology/
│   │   ├── bringup.py
│   │   ├── cases.json
│   │   ├── README.md
│   │   ├── runtime.json
│   │   ├── spec_alpha.json
│   │   ├── spec_beta.json
│   │   ├── starter_alpha.v
│   │   └── starter_beta.v
│   └── Dockerfile
├── solution/
│   ├── reference/
│   │   ├── feature_alpha.v
│   │   └── feature_beta.v
│   └── solve.sh
├── tests/
│   ├── asic_lab.py
│   ├── Dockerfile
│   ├── grader.py
│   ├── run_grade.py
│   └── test.sh
├── assets.json
├── instruction.md
├── prepare.py
├── README.en.md
├── README.md
└── task.toml
```

外部工具和工艺依赖记录在 [assets.json](/environments/fw_c14_overcomplete_banks_v1/assets.json)，通过 [prepare.py](https://github.com/tapeo-ai/awesome-ai4chip/blob/main/env/examples/fw_c14_overcomplete_banks_v1/prepare.py) 从本地原始归档恢复并校验。

来源归档: fw_c14_overcomplete_banks_v1.tgz (165.0 MiB)

运行平台: linux/amd64

| 依赖 | 大小 | 版本 |
| --- | ---: | --- |
| environment/files/software/openroad-runtime.tgz | 80.8 MiB | v2.0-17598-ga008522d8 |
| environment/files/technology/sky130_fd_sc_hd__tt_025C_1v80.lib | 12.2 MiB | — |
| environment/files/technology/sky130_fd_sc_hd_merged.lef | 2.2 MiB | — |
| environment/files/technology/sky130_fd_sc_hd.tlef | 17.6 KiB | — |

<details>
<summary>完整依赖与校验值</summary>

```json
{
  "archive": {
    "name": "fw_c14_overcomplete_banks_v1.tgz",
    "size": 173018261,
    "sha256": "2b528e901cfa58f5105debbc67c6fb21aacf99c614e698766482e26719b2a6c9"
  },
  "platform": "linux/amd64",
  "files": [
    {
      "path": "environment/files/software/openroad-runtime.tgz",
      "archive_member": "environment/files/software/openroad-runtime.tgz",
      "size": 84764595,
      "sha256": "0ba5d74cde4e71bdd192e0440fb6a8c7bbba9bcb893539e844faf556dae48a41",
      "version": "v2.0-17598-ga008522d8",
      "source": "Precision-Innovations/OpenROAD Debian package; portable dependency closure recorded in the runtime MANIFEST.json",
      "license": "Multiple upstream licenses; retain runtime notices/ and Python LICENSE.txt"
    },
    {
      "path": "environment/files/technology/sky130_fd_sc_hd__tt_025C_1v80.lib",
      "archive_member": "environment/files/technology/sky130_fd_sc_hd__tt_025C_1v80.lib",
      "size": 12800135,
      "sha256": "ec0e1067a35c8bf20b11e58d1e8ac53326067e4dac84a125cc1b917a3518d0d9",
      "source": "SKY130 HD technology files from the source archive; exact upstream revision not recorded",
      "upstream": "https://github.com/google/skywater-pdk",
      "license": "Apache-2.0",
      "license_file": "environment/files/technology/LICENSE"
    },
    {
      "path": "environment/files/technology/sky130_fd_sc_hd_merged.lef",
      "archive_member": "environment/files/technology/sky130_fd_sc_hd_merged.lef",
      "size": 2258431,
      "sha256": "44180aaa0068b1fcb0789f128b090304c01ad48f511d3f7afa66c90b3e176ec5",
      "source": "SKY130 HD technology files from the source archive; exact upstream revision not recorded",
      "upstream": "https://github.com/google/skywater-pdk",
      "license": "Apache-2.0",
      "license_file": "environment/files/technology/LICENSE"
    },
    {
      "path": "environment/files/technology/sky130_fd_sc_hd.tlef",
      "archive_member": "environment/files/technology/sky130_fd_sc_hd.tlef",
      "size": 18031,
      "sha256": "8e99b4e8b016db0713029ebcae6b2cc2aedd9c2c49682e2f23521dd0b1a2085e",
      "source": "SKY130 HD technology files from the source archive; exact upstream revision not recorded",
      "upstream": "https://github.com/google/skywater-pdk",
      "license": "Apache-2.0",
      "license_file": "environment/files/technology/LICENSE"
    }
  ]
}
```

</details>

### 小文件下载

- [README.en.md](/environments/fw_c14_overcomplete_banks_v1/README.en.md) · [源码](https://github.com/tapeo-ai/awesome-ai4chip/blob/main/env/examples/fw_c14_overcomplete_banks_v1/README.en.md)

- [README.md](/environments/fw_c14_overcomplete_banks_v1/README.md) · [源码](https://github.com/tapeo-ai/awesome-ai4chip/blob/main/env/examples/fw_c14_overcomplete_banks_v1/README.md)

- [assets.json](/environments/fw_c14_overcomplete_banks_v1/assets.json) · [源码](https://github.com/tapeo-ai/awesome-ai4chip/blob/main/env/examples/fw_c14_overcomplete_banks_v1/assets.json)

- [environment/Dockerfile](/environments/fw_c14_overcomplete_banks_v1/environment/Dockerfile) · [源码](https://github.com/tapeo-ai/awesome-ai4chip/blob/main/env/examples/fw_c14_overcomplete_banks_v1/environment/Dockerfile)

- [environment/files/README.md](/environments/fw_c14_overcomplete_banks_v1/environment/files/README.md) · [源码](https://github.com/tapeo-ai/awesome-ai4chip/blob/main/env/examples/fw_c14_overcomplete_banks_v1/environment/files/README.md)

- [environment/files/cases.json](/environments/fw_c14_overcomplete_banks_v1/environment/files/cases.json) · [源码](https://github.com/tapeo-ai/awesome-ai4chip/blob/main/env/examples/fw_c14_overcomplete_banks_v1/environment/files/cases.json)

- [environment/files/runtime.json](/environments/fw_c14_overcomplete_banks_v1/environment/files/runtime.json) · [源码](https://github.com/tapeo-ai/awesome-ai4chip/blob/main/env/examples/fw_c14_overcomplete_banks_v1/environment/files/runtime.json)

- [environment/files/spec_alpha.json](/environments/fw_c14_overcomplete_banks_v1/environment/files/spec_alpha.json) · [源码](https://github.com/tapeo-ai/awesome-ai4chip/blob/main/env/examples/fw_c14_overcomplete_banks_v1/environment/files/spec_alpha.json)

- [environment/files/spec_beta.json](/environments/fw_c14_overcomplete_banks_v1/environment/files/spec_beta.json) · [源码](https://github.com/tapeo-ai/awesome-ai4chip/blob/main/env/examples/fw_c14_overcomplete_banks_v1/environment/files/spec_beta.json)

- [instruction.md](/environments/fw_c14_overcomplete_banks_v1/instruction.md) · [源码](https://github.com/tapeo-ai/awesome-ai4chip/blob/main/env/examples/fw_c14_overcomplete_banks_v1/instruction.md)

- [task.toml](/environments/fw_c14_overcomplete_banks_v1/task.toml) · [源码](https://github.com/tapeo-ai/awesome-ai4chip/blob/main/env/examples/fw_c14_overcomplete_banks_v1/task.toml)

- [tests/Dockerfile](/environments/fw_c14_overcomplete_banks_v1/tests/Dockerfile) · [源码](https://github.com/tapeo-ai/awesome-ai4chip/blob/main/env/examples/fw_c14_overcomplete_banks_v1/tests/Dockerfile)
