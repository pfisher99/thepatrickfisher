+++
title = "Simple Mods to my BitAxe Gamma 602"
date = 2026-02-17
description = "Let's get cooling..."
+++

Back in January, I got a little bored and dove back into the world of crypto mining. And before you ask, yes that ship sailed well past already. It's definitely long gone into the ocean and I remain quite on-shore...

For whatever reason, I stumbled upon these BitAxe units and thought it would be super neat to own one and take a shot at solo mining bitcoin. At current rate I should hit a block in the next 15,000 years! Oh boy!

So I ended up purchasing a [BitAxe Gamma 602 by Power Mining](https://shop.powermining.io/products/bitaxe-gamma).

I really enjoy hardware, so having my own [ASIC](https://en.wikipedia.org/wiki/Application-specific_integrated_circuit) was something new for sure!

Upon booting, however, I found that the unit immediately throttled itself! I didn't take screenshots at the time, but the unit fully under-volted itself from 1.15V to 1.1V and dropped clock from the default 525MHz to something like 450MHz.

Growing up building my own PCs, I had an idea: it's time for some thermal paste! I reached for my handy Arctic Silver—I’ve been using this stuff since I was a kid! Come to realize, in a pre-game discussion with ChatGPT, that this would surely be conductive, and since the BM1370 has exposed circuits, this probably wouldn't be good. Finally, AI has come through! Hah!

After some further discussion with a clanker named ChatGPT, some MX-6 paste was ordered...

{{ figure(src="/images/hobbies/bitaxe-gamma-mods/p0.jpg", alt="MX-6", caption="Sweet, sweet thermal paste. It's probably edible...", width=640) }}

Once in-hand, I set to pry the dastardly BitAxe board from its enclosure designed for maximum brand recognition. Really, it's just a 3D-printed case for the board. The PCB itself was simply wedged into four pegs on the corners. I pried it up with a tiny screwdriver and only managed to break two of the pegs—sweet!

{{ figure(src="/images/hobbies/bitaxe-gamma-mods/p1.jpg", alt="Eek, it broke...", caption="The left pegs broke off. I would take another non-blurry photo, but I might break the last two pegs. ;)", width=480) }}

Once that disaster was over, I could finally access the back of the board to remove the stock heatsink and clean off that chip. ChatGPT said it would be small—I usually work on CPUs—so this was smaller than usual. The paste looked like cheap glue that had been blobbed on. I swiftly cleaned it off with some 99% isopropyl.

{{ figure(src="/images/hobbies/bitaxe-gamma-mods/p2.jpg", alt="All stripped...", caption="That's a BM1370 alright! Still needs some more cleaning.", width=480) }}

Sadly, I didn't take a final picture of the MX-6 paste applied. I used a butter knife to smoothly apply a perfect layer onto the shiny part of that bad boy, but didn't plan to make this post till later—and we're not going back in for that pic.

This did wonders! My temps dropped 10–15C and I could finally run at stock 525MHz, 1.15V! But is stock good enough? It's not... I found out on AliExpress you can order single- and quad-core units with liquid cooling! Well damn! Time to see how far we can go on air alone!

Using a laser thermometer, I identified the warmest regions of the board and placed some wonderful copper heatsinks bought for a Raspberry Pi 4. Here's where they ended up:

{{ figure(src="/images/hobbies/bitaxe-gamma-mods/p4.jpg", alt="", caption="", width=480) }}

{{ figure(src="/images/hobbies/bitaxe-gamma-mods/p5.jpg", alt=".", caption="", width=480) }}

This seemed all fine and dandy, until you realize without airflow over those copper sinks, they are just holding onto all the heat they are pulling off. Solution? Aim a 120mm fan at it!

The end result: my miner sits in the bottom corner of a bookshelf on top of a 120mm fan...

{{ figure(src="/images/hobbies/bitaxe-gamma-mods/p3.jpg", alt=".", caption="", width=480) }}

Now things were looking nice—temps kept dropping and I kept turning up the volts until it couldn't take it anymore! The 120mm fan I settled on is a variable 3V–12V fan. Currently around 5V, I can max out at 750MHz, 1.18V. Pushing 12V (and a lot of noise), I can hit 775MHz, 1.19V with 0 errors. The temperatures will rise unless my apartment is under 70F—not possible—but the chip seems to be capable of it!

{{ figure(src="/images/hobbies/bitaxe-gamma-mods/p6.jpg", alt=".", caption="This isn't stable with the fan at 5V and a warm California apartment.", width=900) }}

In the end, I settle for more modest speeds: 700MHz @ 1.17V, producing a hash rate of 1.428 TH/s, a ~29% increase over the base silicon. While my odds still remain somewhere in the next 12,000 years or so, I had some fun doing a bit of hardware modding on something a little different.

{{ figure(src="/images/hobbies/bitaxe-gamma-mods/p7.jpg", alt=".", caption="For reference, my apartment is around 75F right now. At night these temps lower quite a bit.", width=900) }}

And that is that! Here's hoping I mine a block before the price drops to nothing, eh!?