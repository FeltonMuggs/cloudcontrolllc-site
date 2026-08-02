# DNaI Genomic Vault — hardware provisioning (Raspberry Pi 5)

Dockerfile for the on-device vault enclave: `linux/arm64` (Pi 5,
Cortex-A76 crypto extensions), Debian Bookworm base, Zymkey 5 HSM.
Two stages: a Rust builder for the local vault API, and a hardened
runtime that boots the API on :8080 (`dna-vault.local`) plus the Python
HSM pipeline daemon, with an rfkill air-gap check at start.

## Not yet buildable — companion files missing

The Dockerfile copies three files that are not in the repo yet:

- `Cargo.toml` — Rust manifest for `dna-vault-api`
- `src/main.rs` — the Rust local API server
- `dnai_secure_pipeline.py` — the Python HSM pipeline daemon

Add them to this directory, then build **on the Pi (or any arm64 host)**:

```bash
docker build -t dnai-vault-hw .
docker run --rm -p 8080:8080 \
  --device /dev/zkm0 --device /dev/i2c-1 \   # Zymkey passthrough (omit → simulation mode)
  --cap-add NET_ADMIN \                      # required for the rfkill air-gap lock
  dnai-vault-hw
```

Cross-building from x86_64 needs `docker buildx` + QEMU (`--platform linux/arm64`).

## Review notes (to resolve before first build)

1. **`pip3 install pycrypto` will break the build** — pycrypto is
   abandoned (no release since 2013, known CVEs) and does not compile
   against Bookworm's Python 3.11. Replace with `pycryptodome` (drop-in
   `Crypto` namespace) — or drop it entirely: `python3-cryptography` is
   already installed via apt, and Zymbit's own userspace lib is `zku`.
2. **Rust dependency-cache stage is inert** — the stub `src/main.rs` is
   written but `cargo build` is commented out before the real source is
   copied, so dependencies rebuild from scratch every time. Either
   uncomment the pre-build or remove the stub block.
3. **Air-gap check is advisory in-container** — `rfkill` inside Docker
   only sees host radios with `--cap-add NET_ADMIN` (and `/sys` access);
   without it the check silently passes. Treat the real air-gap as a
   host-level control, not a container one.
4. `PEAK_RSS_LIMIT_MB=250` is exported but nothing enforces it — wire it
   to `--memory` at `docker run` or a cgroup limit if it's a real bound.

Testnet-era guardrails apply: this box handles synthetic/demo genomes
until the go-live gates clear. No seeds, keys, or `.env` in the repo.
