> #### persistent homology | tda | spatial data science

As someone who still cannot operate a vehicle on a difficult path, my friends have been making me sit behind them while on a scooty. However, they always complain that I lead them to a wrong path and that I cannot understand the map well, and for the longest time I believed that I might be a bit spatially challenged lol but then I started observing how the rendering of edges as road lines are not always accurate in these navigation apps, while some people accept it as it is, it poses a real challenge and threat in conflict and disaster zones. I wanted to develop a system that validates this uncertainty claim and assign a 'confidence' scoring to these paths so that not just the navigation can be trusted more but to find a way to point out the deviation in routing in real time.

I have tried to simplify the language so that it is easier for any general reader to understand what I am trying to convey.

The maps these apps rely on are not always fresh, and not always complete. A huge amount of the world's road data comes from OpenStreetMap, which if you have not heard of yet is a free, community-built map that anyone can edit, a kind of Wikipedia for streets. In well-mapped places it's excellent. In others, a road might have been added once, by one person, a few years back, and never touched again.

That's usually fine but suppose during a flood in the Himalayas, roads wash away overnight. After an earthquake, whole neighbourhoods become unreachable. In parts of Port-au-Prince today, armed groups control the main roads, and the map simply doesn't know. In those moments, the people who most need reliable directions, who are aid workers, ambulance drivers, rescue teams are handed a clean blue line that quietly hides how much of it is a guess.

That gap is what I yearn to resolve, even by a tiny bit. I wanted to build a way to see the uncertainty that navigation tools hide.

### IDEA:
Give every road a confidence score.
The starting point is simple. Instead of treating every road as equally trustworthy, I give each one a confidence score (a number between 0 and 1 that estimates how much we should believe it's really there and passable.)

Where does that number come from? From clues already sitting inside the map data: How recently was this road edited? How many different people have touched it? Is it a major highway or a tiny unnamed track? Is it in an area known to be unstable? None of these clues is perfect on its own, but together they tell the same way you'd trust a Wikipedia article more if it was recently updated by many editors than one written once and abandoned.

Once every road has a score, you can finally draw the trust layer of navigation apps.

A road network of Port-au-Prince where each street is coloured by a confidence score. Major arterial roads glow gold for high confidence; the dense mesh of smaller residential streets is coloured deep blue for low confidence.
<img width="1177" height="1008" alt="image" src="https://github.com/user-attachments/assets/4c4d9b9d-4c6f-4939-8241-2eb1438e7496" />

Port-au-Prince, coloured by confidence. The bright gold lines are the major arteries (well-mapped, frequently edited, trustworthy). The deep-blue mesh around them is the tangle of smaller streets we know much less about. To a rescue team, this single picture says, "stay on the gold if you can".
A normal routing tool shows you the shortest path. This can show you which parts of that path you can actually believe.

### Secondly, we introduce:
A line that gets thicker when it's unsure
A coloured map of a whole city is useful for planning. But when you're actually travelling from one point to another, you want to know about your route specifically. So the second idea takes a single path and draws it as a confidence-weighted band.
<img width="1568" height="731" alt="image" src="https://github.com/user-attachments/assets/c61444cb-299c-4e30-8213-6e6fb4d92964" />


Where the road is trustworthy, the line is thin and solid. Where it's uncertain, the line swells and fades, thick and see-through, like the route itself is unsure of its footing. You don't need to read any numbers. Your eye goes straight to the parts that might let you down.

Two side-by-side maps of the same trip across Port-au-Prince. The left route, found by one algorithm, has an average confidence of 0.559. The right route, found by another, has 0.508. Both lines vary in thickness along their length, swelling where the road is less certain.
The same trip, planned two different ways. Both get you there. But the route on the left travels over slightly more trustworthy roads. In a crisis, that difference is the whole decision and normally it's completely invisible.
Here's something I didn't expect to find. Different routing algorithms don't just differ in speed. They differ in how trustworthy the roads they choose are, and by how consistently they cope as more of the map falls apart. Some degrade gently. Others hold up fine until a tipping point, then fail suddenly. That tipping point is something you'd want to know about before you rely on one.

### Thirdly:
How far can you get before trust runs out?
The last picture asks a different question. Standing at one spot, in which directions can you travel and still trust the road under you, and in which directions does that trust run out fast?

I call this the confidence horizon. Starting from a chosen origin, it colours every reachable place by how trustworthy the whole journey there would be. The result reveals that reliability isn't the same in every direction. Some ways out of a place stay solid for miles. Others turn uncertain within a couple of streets.
<img width="1288" height="930" alt="image" src="https://github.com/user-attachments/assets/0f964e45-81c4-4be5-9e4f-67e985e9da74" />

A cloud of points spreading out from a starred origin in Uttarakhand. Points are coloured from deep blue to gold by how trustworthy the route to them is. Gold arms of high confidence reach out in some directions and the dark blue patches of low confidence sit in others.
This above image result is the confidence horizon around one origin in Uttarakhand. Gold means you can trust the whole way there, deep blue means the journey passes through roads we're unsure of. Notice it isn't a smooth circle. For someone deciding which way to send a convoy, that shape is the plan.
Put together, these three views, the city map, the single route, and the horizon are a small toolkit for reasoning about something we normally pretend doesn't exist: that some guesses are better than the rest :p

After getting my project peer-reviewed, they liked the two new ways of drawing uncertainty, and pointed out exactly what needed to be stronger which were clearer evidence in the figures, and a firmer mathematical foundation under the confidence scores.

They were right on both counts. The figures you've just seen are the rebuilt versions. And while I admit that most of the initial statistics were mostly based on heuristics, I wanted to build a stronger mathematical validation to my results which is what I will be doing next.

Here's the next part I'm most excited about, and I'll keep it plain.

My confidence scores started as a simple recipe. I mixed a few clues together and out came a number. That works, but there's a fair question hiding in it was why that method and not some other one? 

First, I'll treat each road's confidence score as a height and build what's called a superlevel set filtration, which just means starting at full confidence and slowly letting in less and less trustworthy roads while watching the network grow. As I do that, I'll track the connected pieces of the network, the quantity topologists call H0, and record the moment each piece appears and the moment it merges into another. That record is called a persistence diagram, and it captures how reachability survives as trust falls. Then I'll lay that persistence diagram next to my original confidence horizon for the same city and check whether they agree, which will be the real test. If they do, my simpler method is validated mathematically. I still have to sharpen my foundational knowledge and I would really appreciate some guidance on it further. If it is not validated, the mismatch is itself a finding worth chasing. After that I want to look at H1, which tracks loops, or alternative routes, because a place you can still reach two different ways is far safer than one hanging by a single thread, and I suspect that's where the most useful signal is hiding.

A note on the pictures. Every figure here comes from real road data for Uttarakhand in India, Kathmandu in Nepal, and Port-au-Prince in Haiti, three places facing very different kinds of disruption. The colours use a palette called `cividis`, chosen so the maps stay readable for people with colour blindness.
