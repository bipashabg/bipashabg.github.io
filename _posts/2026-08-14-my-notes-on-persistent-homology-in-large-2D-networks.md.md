
# My Notes on Persistent Homology in analyzing large 2D networks (roads).

## This is not a teaching material but rather an account on how I ended up here.

I started this journey some 5-6 months back trying to answer a fairly practical question. I had built a system called **RouteScape**, a visual analytics tool for reasoning about routing confidence in road networks that are degraded, incomplete, or unreliable, the kind you find in conflict zones and disaster areas where OpenStreetMap data is sparse and you cannot fully trust that a road is where the map says it is. I had a working system, a set of heuristics, and a nagging feeling that I was approximating something that already had a proper name in mathematics. I just did not know what that name was. My entire journey so far of uncovering the problem was mostly hit-and-trial to be very honest but it lead me to very enriching revelations in the process.

RouteScape assigns a confidence score to each edge in a road network based on data quality signals, then tries to show which parts of the network remain reliably routable and which fall away as confidence drops. I had two visual primitives I was proud of, a confidence-weighted route band and a routing confidence horizon, and I had validated the approach across three real networks in Uttarakhand, Kathmandu, and Port-au-Prince.

But when I tried to describe*what changes as the confidence threshold moves, I kept reaching for words I couldn't quite justify. I would say the "topology" of the reliable network changes, without being able to say precisely what I meant by topology, or how to measure that change in a principled way. I was thresholding a weighted graph and watching connected regions appear and disappear, and I had the strong intuition that this was a known mathematical object dressed up in my own ad hoc language.

That intuition turned out to be right. The object is **persistent homology**, and getting there required talking to people who actually knew the field.

My first instinct, after reading around, was that the **Euler Characteristic Transform (ECT)** might be the descriptor I wanted. It summarises the shape of embedded structures, and a road network is a structure embedded in 2D space, so it seemed like a natural fit.

I came across Dr. David Beers, a postdoctoral scholar in Mason Porter's group at UCLA, and struck a conversation with him. He took the time to explain, generously and in detail, why this was probably the wrong path. He told me that the ECT is typically used to compare shapes that are *topologically the same but geometrically different*, like the approximately planar boundaries of cells, which are essentially embedded cycle graphs. Road networks are not like that. They vary enormously in their topology, they can have drastically different numbers of loops, and the ECT is very sensitive to exactly that kind of variation. Trying to use it to compare road networks would fight against the tool's strengths.

That single feedback saved me weeks. It also explained something I had been struggling to articulate: why my early experiments with ECT-style descriptors felt unstable in a way I couldn't pin down. They were unstable because the tool was responding to the very loop-structure variation I was trying to see past. He reframed what I was actually trying to do.

So basically, I was not really trying to compare many networks against each other. I was looking at a single network and asking how varying one parameter, the confidence threshold, changes its structure. And "topology," he pointed out, means different things to different people. Depending on what I actually meant, **persistent homology** was very likely the right tool.

This landed. What RouteScape does, stripped of its visual layer, is define a filtration on a road network: start with only the highest-confidence edges and progressively admit lower-confidence ones as you lower the threshold. As you do this, connected components merge, and cycles appear and close. Persistent homology is precisely the machinery for tracking which of these features are born, how long they persist, and when they die, as a filtration parameter varies. The "routing confidence horizon" I had built by hand was, I now understood, a rough sketch of a persistence-based summary. David also gave me the right entry point into the literature: **"A roadmap for the computation of persistent homology" by Otter et al.** 

Following the roadmap paper and reading it properly, rather than skimming it, is what finally gave me the vocabulary I had been missing: filtration, persistence diagram, barcode, the distinction between H0 features (connected components, which in my case correspond to *which regions become unreachable*) and H1 features (cycles, which I am still working out the routing interpretation of).

I want to be honest that I am at the beginning of this. I have started working through the material. But the shape of the problem is now clear to me in a way it simply was not a few weeks ago.

I had built RouteScape bottom-up, from a practical need, and I had reinvented, badly and partially, a piece of mathematics that already exists in a complete and beautiful form. That is a slightly humbling thing to discover, but it is also enormously freeing. It means:

- Everything I was doing informally has a formal counterpart, which means it has stability guarantees, established algorithms, and a language other researchers already share.
- Tracking connected components as low-confidence edges drop out is exactly the question of which regions become unreachable, and persistent homology tracks precisely this.
- This is the open question I am most excited about. Loops in a road network correspond to alternative routes; whether their persistence structure says something useful about routing robustness is something I genuinely do not know yet, and want to find out.
- This was the original ECT temptation, and while the ECT itself is the wrong tool, the underlying desire, a stable, meaningful distance between two network states, is a real studied problem in TDA.

See ya on further updates!
