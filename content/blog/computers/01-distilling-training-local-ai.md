+++
title = "Let's Build a Local AI Model in 16GB of VRAM!"
date = 2026-04-26
description = "It's pronounced Fronkensteen!"
draft = true
+++

# The Idea
I came across [GuppyLM](https://github.com/arman-bd/guppylm) not long ago, it's a tiny llm that is single-turn and talks like a fish, and it peeked my interest in training small local AIs for fun and to show others. It's something I've wanted to do for a long while but never had a reason to do it. Well now with my blog I do, I shall share it with you. My internet friends!

## CatGPT?
I have cats, this means I tend to spend a bit of time thinking about cats. What if we generated a ton of training data in regards to cats? And then made a model from that? Is that even possible? It should be, maybe!

## Getting Started
I'm currently running Qwen3.5 9B on my laptop which boasts a cut down version of the RTX 5080 with 16GB of VRAM. We're doing this small size, on a laptop, just because... this is where we'll distill our training data from. We'll suck out all the cats facts we can, mix in some random nonsense so it can hopefully respond if something about cats isn't said, and bake it in the oven at 350F for many many hours...

### Training Data
Cleaning Text, Lots of Regex: \[[^\]]*\]  \[Illustration:[\s\S]*?\]

Corpus, OCR/Book Distill, Corpus Re-Write, New Corpus (Not Started)

Just Distill Questions and Answers

Encyclopedia, Context Adjustment 256 -> 768, Keep Paragraphs together and label.

Tokenizer memory leak loading and computing all text files, thanks Codex. Patched.

Second Polishes, SFT
""