+++
title = "Vibe Coding a Local LLM Security Scanner, Part 0"
date = 2026-04-21
description = "Before We Start, What Are We Doing Here?"
+++

## Back Story

I've been playing with running local AI models since the first open source
models appeared. Early on I was running small models on a 6GB 1660Ti on my home
laptop and was amazed it could even produce coherent text. For text generation
early on, I started simple with
[OobaBooga](https://github.com/oobabooga/textgen) and eventually moved up to
[Ollama](https://ollama.com/) and then landed at
[vLLM](https://github.com/vllm-project/vllm)

At work I had the luck of being able to purchase some 4090s to experiment with
using 24GB of VRAM. Unfortunately that project got cut short before I could get
all 3 of our 4090s into 1 box but that is a story for another time...

Anyways, last year I decided to upgrade my old laptop and ended up with a RTX
5080 Laptop (180W) and 16GB of that sweet sweet GDDR7. Looking back I wish I
had paid the premium for the 5090 but oh well, such is life friends.
[Laptop](https://www.msi.com/Laptop/Raider-18-HX-AI-A2XWX)

## The Idea

Equipped with this and a modest ChatGPT / Codex subscription, I began vibe
coding together a security scanner. The main idea was this: point the tool at a
local folder or a public GitHub repo, let it walk the tree, skip the obvious
junk, break source files into chunks that fit a local model, and ask for
structured findings instead of vague chatty output. From there it deduplicates
overlaps, writes markdown reports plus JSON artifacts.

### Thoughts on Vibe Coding

I haven't posted about it yet, but I am not a huge fan of vibe coding...
I'm giving it a shot though to see where we end up. It just produces far more
than I check and is far from perfect. I wouldn't say this project is a new
operating system or anything. I think in reality it's a pretty simple idea with
pretty simple code. I just write slower than it can spit out code, and I'm sure
someone has written code somewhere like this before...

### Models

Currently I'm experimenting with models, [Qwen3.5 9B](https://huggingface.co/Qwen/Qwen3.5-9B) using bitsandbytes in vLLM
fits pretty well on my GPU with a 256k context window. Currently testing on smaller code bases with a 64K window and 4x requests parallel. I'd say that's decent,
with a nice long thinking output we'll see how it does.

Stay tuned, we'll go over the vLLM startup and configuration then dig into the
code. For now you can follow my vibe coding on [git](https://github.com/pfisher99/vibe-code-scanner).
