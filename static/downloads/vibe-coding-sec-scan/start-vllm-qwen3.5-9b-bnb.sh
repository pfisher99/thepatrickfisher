#!/usr/bin/env bash
set -euo pipefail

MODEL_DIR="${MODEL_DIR:-$HOME/models/Qwen3.5-9B}"
HOST="${HOST:-127.0.0.1}"
PORT="${PORT:-8000}"
SERVED_MODEL_NAME="${SERVED_MODEL_NAME:-Qwen3.5-9B-local}"
#SERVED_MODEL_NAME="gpt-5.4-mini"
# Memory-first defaults for a 16 GB laptop GPU.
# Leave at 256k first; if it won't start, try MAX_MODEL_LEN=auto or 128k.
MAX_MODEL_LEN="${MAX_MODEL_LEN:-256k}"
GPU_MEM_UTIL="${GPU_MEM_UTIL:-0.92}"

# Batched Run Settings
MAX_NUM_SEQS="${MAX_NUM_SEQS:-6}"
MAX_NUM_BATCHED_TOKENS="${MAX_NUM_BATCHED_TOKENS:-8196}"

# Optional escape hatches if you still need more room.
CPU_OFFLOAD_GB="${CPU_OFFLOAD_GB:-0}"   # e.g. 6 or 8
KV_OFFLOAD_GB="${KV_OFFLOAD_GB:-0}"     # e.g. 8 or 12

# BitsAndBytes is required for in-flight 4-bit quantization.
python3 - <<'PY'
import importlib.util, sys
mods = ["vllm", "bitsandbytes"]
missing = [m for m in mods if importlib.util.find_spec(m) is None]
if missing:
    print("Missing Python packages:", ", ".join(missing), file=sys.stderr)
    print("Install example:", file=sys.stderr)
    print("  pip install -U bitsandbytes>=0.49.2", file=sys.stderr)
    sys.exit(1)
PY

ARGS=(
  --host "$HOST"
  --port "$PORT"
  --served-model-name "$SERVED_MODEL_NAME"

  --tensor-parallel-size 1
  --max-model-len "$MAX_MODEL_LEN"
  --reasoning-parser qwen3

  # Skip the vision side entirely; this is the official memory-saving text-only path.
  --language-model-only

  # In-flight 4-bit quantization.
  --quantization bitsandbytes

  # Shrink KV memory.
  --kv-cache-dtype fp8

  # Give vLLM as much of the 16 GB as is reasonable.
  --gpu-memory-utilization "$GPU_MEM_UTIL"

  # Keep batching conservative on a laptop.
  --max-num-seqs "$MAX_NUM_SEQS"
  --max-num-batched-tokens "$MAX_NUM_BATCHED_TOKENS"
  --enable-chunked-prefill
  --enable-prefix-caching
  --enable-auto-tool-choice
  --tool-call-parser qwen3_coder
  --chat-template /home/sqeak/vllm/jinja-patch.jinja
)

# Optional: if FP8 KV quality seems odd, try uncommenting this.
# It is deprecated in docs, but still available today.
# ARGS+=( --calculate-kv-scales )

if [[ "$CPU_OFFLOAD_GB" != "0" ]]; then
  ARGS+=( --cpu-offload-gb "$CPU_OFFLOAD_GB" )
fi

if [[ "$KV_OFFLOAD_GB" != "0" ]]; then
  ARGS+=( --kv-offloading-size "$KV_OFFLOAD_GB" --kv-offloading-backend native )
fi

echo "Starting vLLM with model: $MODEL_DIR"
echo "Context: $MAX_MODEL_LEN | GPU util: $GPU_MEM_UTIL | CPU offload: $CPU_OFFLOAD_GB GiB | KV offload: $KV_OFFLOAD_GB GiB"

exec vllm serve "$MODEL_DIR" "${ARGS[@]}"
