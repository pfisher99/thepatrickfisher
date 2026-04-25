+++
title = "Vibe Coding a Local LLM Security Scanner, Part 1"
date = 2026-04-22
description = "Where are we going with only 16GB of VRAM?"
+++

## vLLM Install

I'm currently running Windows so I run vLLM via [WSL](https://learn.microsoft.com/en-us/windows/wsl/install). I also have [uv](https://docs.astral.sh/uv/getting-started/installation/) installed.

vLLM from the nightly builds as I'm running CUDA 13+, here is the [guide](https://docs.vllm.ai/en/latest/getting_started/installation/gpu/#nvidia-cuda).

You might be able to skip the guide with this if you've already setup uv and activated the env:

```
uv pip install -U vllm \
    --torch-backend=auto \
    --extra-index-url https://wheels.vllm.ai/nightly # add variant subdirectory here if needed
```

## vLLM Startup, Model Selection, and Speed, Oh My!

In my first post I mentioned I was using bitsandbytes with the plain [Qwen3.5-9B]([Qwen/Qwen3.5-9B](https://huggingface.co/Qwen/Qwen3.5-9B)) model. That startup for vLLM looks like this and should work just fine with 16GB VRAM and 256K context (Note, we are using fp8 quants for the context window which helps us cut down on the size of our conversation that is in memory at any time by reducing it to 8bit instead of 16bit with a little accuracy loss):

Oh and since we're vibe coding, here is some more sloppy slop. It's quite the long script but it works? 

{% code_block(title="start-vllm-qwen3.5-9b-bnb.sh", language="bash", collapsed=true, download="/downloads/vibe-coding-sec-scan/start-vllm-qwen3.5-9b-bnb.sh") %}
```bash
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
  --chat-template ~/vllm/jinja-patch.jinja
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
```
{% end %}

#### Quick Notes
I added an extra jinja script in there you might have noticed, actually you didn't because you didn't read the entire script but it's [here](https://huggingface.co/froggeric/Qwen3.5-35B-A3B-Uncensored-FernflowerAI-MLX-8bit/blob/main/chat_template.jinja) and some notes on it [here](https://www.reddit.com/r/LocalLLaMA/comments/1sis1vn/the_definitive_qwen_35_jinja_template/)

You can play with the setting for GPU_MEM_UTIL, my laptop won't go over 0.92 even though I have 100% free GPU memory as my integrated graphics handles the Windows load... 

And don't forget to set the MODEL_DIR.

### But Wait, There's a Better Model!

Bitsandbytes is great for in-flight quantization to save memory but it's not the best way to go. I started testing out some new models, previously I ran AWQ which still seems to be a good choice. You can find the AWQ Qwen3.5 9B [here](https://huggingface.co/cyankiwi/Qwen3.5-9B-AWQ-4bit).

Lately though I'm feeling experimental and I found out about NVFP4 models which seem to only work on Blackwell cards so I'm running that now. Download it [here]([AxionML/Qwen3.5-9B-NVFP4](https://huggingface.co/AxionML/Qwen3.5-9B-NVFP4)) if your card supports it.

You can still use the same script as above, just #comment out the --quantization bitsandbytes line and adjust the model directory and you should be good.

The biggest difference I have seen with the NVFP4 model is that my concurrency throughput is a lot higher. With bitsandbytes I was hitting ~82t/s and extra requests seemed to eat into that budget. Now with NVFP4 I do much better with concurrent requests. Remember my scanner is setup for 64K context x 4... 305.2t/s...

{{ figure(src="/images/computers/vibe-coding-sec-part-1/terminal-output00.png", alt="Pretty, pretty, pretty, pretty, good...", caption="", width=1280) }}

## Next Time!

Using this setup to maybe find vulnerabilities? So far it is finding things, but do they even matter?
