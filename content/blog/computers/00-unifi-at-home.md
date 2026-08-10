+++
title = "My Starter UniFi Stack @ Home"
date = 2026-07-03
description = "Moving on from consumer networking..."
draft = false
+++

It's finally arrived, my new UniFi networking stack for my tiny apartment! 

# The Stack

## Cloud Gateway Max

Although my internet is cable and only 500/20, I went with the [Max](https://store.ui.com/us/en/category/cloud-gateways-compact/collections/cloud-gateway-max/products/ucg-max) gateway which can handle ~2.3Gbps for [IDS](https://en.wikipedia.org/wiki/Intrusion_detection_system). The 5x 2.5Gbps ports are very handy, someday I'll hopefully hit the 1Gbps up/down but not currently available for my apartment. Either way, it at least bumps my internal networking from my current 1Gbps to 2.5Gbps. If only it had some PoE as I would have liked to be able to add a PoE-powered switch or AP.

## Pro Max 16 PoE
I figured downstream I'd add some PoE and a little beefier of a switch. This currently resides in a different room than my gateway, which is another reason I would have loved the gateway to have PoE. The [Pro Max 16 PoE](https://store.ui.com/us/en/category/switching-professional-max-xg/products/usw-pro-max-16-poe) seemed like the right choice for me. The uplink is running via the 2.5Gbps ports, maybe I should have gotten the Cloud Gateway Fiber with SFP ports? I suppose my apartment lacks the cabling so another reason I stuck with plain ethernet.

## U7 Pro Wall
For WiFi I went with the [U7 Pro Wall](https://store.ui.com/us/en/category/wifi-wall/products/u7-pro-wall). Luckily my new home laptop has WiFi 7 so I can make full use of the bandwidth. The range is pretty good, currently it is running on PoE and using a 2.5Gbps port on the switch. I've come to really appreciate the PoE for saving me wall outlets and extra wires!

## The Legacy AP
Prior to the upgrade, my gateway router was the [ASUS RT-AXE7800](https://www.asus.com/us/networking-iot-servers/wifi-routers/asus-wifi-routers/rt-axe7800/). Downstream from that, where my current switch now exists, was a [Netgear Nighthawk AC1900](https://www.netgear.com/support/product/r7000). The secondary AP was used for the 2.4Ghz band and to provide ethernet to my living room while the gateway remains in a bedroom.

I've kept the old ASUS router online as it now serves as a second access point, it at least has a single 2.5Gbps port which is connected to my new Cloud Max gateway. I kept this online as a legacy network while I moved devices to a new IP subnet layout. It is still online as it is in another room from my U7 and provides a bit better wifi connection to our back bedroom which lacks any cabling. If I wasn't stuck in an apartment I may find a way to run cabling there somehow!

# The Layout
I did, however, manage to run ethernet between my living room and a guest bedroom. When we moved in here, I noticed the coaxial wall outlets between the rooms were directly across from each other. I could take one off and see right to the other one! I promptly ordered some short cables and some new covers for the outlets like these, off Amazon, [HDMI Coax Ethernet Wall Plate, 1 Port 4K HDMI Keystone, 1 Port Coax Keystone, 1 Port CAT6 Keystone Wall Plate](https://www.amazon.com/HDMI-Ethernet-Plate-Keystone-Female/dp/B07P5F948R/).

So now my Cloud Gateway lives in the bedroom, where my old desktop and modem live, and connected through the wall in my living room is the Pro Max 16 along with the U7 pointing directly at my couch. (I'm a good 8-10ft. from it so I think the danger is pretty low...) The switch in my living room hosts a plethora of connected devices as well, since I still prefer the majority of my non-movable devices to be wired.

# The Experience
I sure have enjoyed the UniFi stack! The cloud interface is awesome, being able to subnet and mirror ports and just play with networking at home is so fun! I've setup my WireGuard VPN for home access, which allows me to get to my ProxMox server hosting some internal services like [BookStack](https://www.bookstackapp.com/) for my networking docs and [Mealie](https://mealie.io/) for our recipes and food planning! ProxMox supports VLAN tagging, which is very cool and allows me to maintain a different firewall setup for my servers on another subnet than our other devices.

I could go on and on but I'll let you lookup things from here on your own. Just wanted to toot my own horn as I move on from consumer gear and enjoy some fun home networking.

Thanks for reading!