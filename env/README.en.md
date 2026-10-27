# Environments and examples

Runnable chip-design tasks using the [Harbor task format](https://docs.harborframework.com/tasks/overview).

- [C14: RTL optimization for quadratic feature maps](examples/fw_c14_overcomplete_banks_v1/README.en.md) — Includes task instructions, input specifications, starter RTL, an independent grader, and reference solutions. Yosys, OpenROAD, and the SKY130 standard-cell library evaluate functionality, area, and delay.

Each example records large dependencies and their checksums in `assets.json`. Run `prepare.py` to restore these files before execution. Task code and configuration are kept in Git.

Format references: [Task configuration](https://docs.harborframework.com/tasks/configuration) · [Separate verifier environments](https://docs.harborframework.com/tasks/separate-verifier).
