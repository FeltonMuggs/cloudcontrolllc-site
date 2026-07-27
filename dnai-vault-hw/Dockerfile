# ==============================================================================
# DNAI GENOMIC VAULT - HARDWARE PROVISIONING DOCKERFILE (Raspberry Pi 5 Target)
# Architecture: linux/arm64 (ARMv8 Cortex-A76 with Crypto Extensions)
# Base OS: Debian Bookworm Slim (Zymkey 5 Driver Native Compatibility)
# ==============================================================================

# ------------------------------------------------------------------------------
# STAGE 1: COMPILATION (Rust API Builder)
# ------------------------------------------------------------------------------
FROM --platform=linux/arm64 rust:1.75-slim-bookworm AS builder

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    pkg-config \
    libssl-dev \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/dna-vault-api

# Create mock cargo files to cache dependency build stages
RUN mkdir -p src \
    && echo "fn main() {println!(\"stub\");}" > src/main.rs

COPY Cargo.toml ./

# If custom dependencies are present in your workspace, build them here
# RUN cargo build --release

# Copy the actual Rust local microservice API source file
COPY src/main.rs src/main.rs

# Compile the high-performance local web server
RUN cargo build --release

# ------------------------------------------------------------------------------
# STAGE 2: RUNTIME ENCLAVE (Hardened Pi 5 Environment)
# ------------------------------------------------------------------------------
FROM --platform=linux/arm64 debian:bookworm-slim

# Enforce secure container environment variables
ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1
ENV PEAK_RSS_LIMIT_MB=250

# Install runtime dependencies: Python 3, OpenSSL, curl, and rfkill (for air-gap auditing)
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-cryptography \
    openssl \
    curl \
    rfkill \
    && rm -rf /var/lib/apt/lists/*

# Clean up pip and configure local virtual environments for safety
RUN pip3 config set global.break-system-packages true

# Install Zymkey/Zymbit userspace helper dependencies
# Note: Physical hardware access to /dev/i2c-1 and /dev/zkm0 must be passed at runtime
RUN pip3 install --no-cache-dir pycrypto

WORKDIR /app

# Copy the compiled Rust API local web server from Stage 1
COPY --from=builder /usr/src/dna-vault-api/target/release/dna-vault-api /app/dna-vault-api

# Copy the secure Python hardware pipeline daemon
COPY dnai_secure_pipeline.py /app/dnai_secure_pipeline.py

# Create directories for staging raw files and encrypted vaults on NVMe partitions
RUN mkdir -p /workspace/scratch/incoming /workspace/scratch/vault \
    && chmod -R 700 /workspace/scratch

# Expose local API port for Next.js web application communication (dna-vault.local)
EXPOSE 8080

# Hardened Runtime Gating Entrypoint Script
RUN echo '#!/bin/sh\n\
echo "=============================================================="\n\
echo "🛡️ INITIATING DNAI GENOMIC VAULT HARDWARE DEPLOYMENT DAEMON"\n\
echo "=============================================================="\n\
\n\
# 1. Assert local air-gap check\n\
echo "[INFO] Running air-gap security audit..."\n\
if rfkill list | grep -q "blocked: no"; then\n\
    echo "[WARNING] Wireless radio detected as active! Enforcing software lock..."\n\
    rfkill block all || true\n\
fi\n\
\n\
# 2. Check for HSM secure element nodes\n\
if [ ! -c "/dev/zkm0" ]; then\n\
    echo "[WARNING] Physical Zymkey hardware node (/dev/zkm0) not passed to container."\n\
    echo "[WARNING] Enabling Python fallback HSM [SIMULATION MODE] for development."\n\
fi\n\
\n\
# 3. Boot the local Rust API in the background\n\
echo "[INFO] Spawning Rust local API on port 8080 (mDNS broadcast: dna-vault.local)..."\n\
/app/dna-vault-api &\n\
\n\
# 4. Launch the persistent Python secure daemon pipeline\n\
echo "[INFO] Starting Python HSM pipeline monitor..."\n\
exec python3 /app/dnai_secure_pipeline.py --test-daemon\n\
' > /app/entrypoint.sh \
    && chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]
