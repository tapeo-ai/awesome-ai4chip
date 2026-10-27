FROM --platform=linux/amd64 python:3.11.15-slim@sha256:db3ff2e1800a8581e2c48a27c3995339d47bdf046da21c7627accd3d51053a93
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates gcc g++ iverilog yosys && rm -rf /var/lib/apt/lists/*
WORKDIR /home/node/workspace
COPY . /tests/
RUN python3 -m pip install --no-cache-dir --require-hashes -r /tests/public/software/requirements.lock
RUN mkdir -p /opt/frontier/openroad && tar xzf /tests/public/software/openroad-runtime.tgz -C /opt/frontier/openroad
RUN mkdir -p /home/node/workspace/output
