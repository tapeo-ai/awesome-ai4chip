# Optimize two quadratic feature banks with exact functional and pre-layout PPA checks

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
