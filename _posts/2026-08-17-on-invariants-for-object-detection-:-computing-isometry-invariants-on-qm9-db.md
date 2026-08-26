Every molecule is just a set of atoms sitting at particular points in 3D space. But there is one thing that makes this interesting, which is that the same molecule can be written down in countless different ways. You can rotate it, shift it somewhere else, flip it like a mirror image, or just list its atoms in a different order. Every one of those changes the raw coordinates you would write on paper, even though it is still, obviously, the exact same molecule.

So how do you compute a descriptor for a molecule that stays the same no matter how it happens to be described? That question can be answered through something called Geometric Data Science.

Instead of describing a molecule by where its atoms are, which changes the moment you rotate or move anything, you describe it by the distances between its atoms, or more precisely the underlying geometry. And distances do not care how the molecule is positioned. Rotate a molecule and the distance between any two atoms stays exactly the same. Move it across the room, flip it around, the distances are untouched.

So any descriptor built purely out of distances is automatically immune to all of those meaningless changes. You get that immunity just from the way the descriptor is built. In the language of the field, this is called an isometry invariant. "Isometry" is the umbrella term for distance-preserving moves like rotation, translation, and reflection, and "invariant" just means it does not change under them.

My task was to compute two of these distance-based invariants, both from Prof. Kurlin's book on Geometric Data Science, on real molecules:

- **SPD (Sorted Pairwise Distances):** take the distances between every pair of atoms in the molecule and sort them into a list.
- **SRD (Sorted Radial Distances):** find the molecule's centre, measure how far each atom sits from that centre, and sort those distances into a list.

That last step is kind of important. It is what removes any dependence on the order you happened to list the atoms in. Once the distances are sorted, the invariant depends only on the molecule's actual shape and nothing else.

The data was chosen from from QM9, a standard benchmark collection of about 134,000 small organic molecules that shows up all over machine learning for chemistry. Each molecule is stored in a simple text file that lists how many atoms it has, some precomputed properties, and then one line per atom giving the element and its x, y, z position.

Eg with methane data:
<img width="1912" height="322" alt="image" src="https://github.com/user-attachments/assets/a3e49f59-fe3b-4bbd-a989-8a03e583af67" />


My task only needed the very smallest molecules, the ones with exactly 3 or 4 atoms. There are only a handful of each in the whole dataset (water, ammonia, hydrogen cyanide, acetylene), which made the output small enough to check carefully by hand.

The code itself is a short, clean Python pipeline, and it moves through a few straightforward stages.

First it reads the files. A parser opens each molecule file and pulls out the atom count, the molecule's ID, and the elements with their coordinates. Two quirks of the QM9 format tripped up the naive approach and were worth handling. Each atom line has an extra trailing column, a partial charge, that needs to be ignored, and some files write numbers in an unusual notation that has to be cleaned up before the computer can read them as numbers.

Then rather than fully processing all 134,000 files, the pipeline peeks at just the first line of each to check the atom count, and only bothers with the 3 and 4 atom molecules.

Next it labels each molecule with a familiar chemical formula, like H2O or CH2O, built by counting its elements and using the standard chemistry convention for ordering them. This is just for identification and is separate from the geometry.

Then for each molecule, the code works out SPD (all the pairwise distances, sorted smallest first) and SRD (distances from the centre, sorted largest first). There is a nice reason these two sort in opposite directions. SPD's smallest distances are the most chemically meaningful, since they are the bonded atoms sitting close together, so they go first. SRD is about overall shape, which is captured by the largest distances from the centre, so those lead instead.

Finally it writes everything into tidy CSV files, one row per molecule, split by molecule size.

<img width="766" height="137" alt="image" src="https://github.com/user-attachments/assets/7d76860b-249a-49dd-96b1-d690ee8db035" />


I tested the code on examples from the Prof. Kurlin's book itself, it included a worked example with two specific shapes, a trapezium and a kite, and published their exact SPD and SRD values. So I ran my code on those two shapes and checked whether it reproduced the published numbers.

<img width="865" height="260" alt="image" src="https://github.com/user-attachments/assets/bd7e2e8e-a1a6-4e16-bf78-3c54909088f5" />
<img width="831" height="97" alt="image" src="https://github.com/user-attachments/assets/9b2fa814-e673-463f-bfe0-39e5375dc104" />
<img width="928" height="147" alt="image" src="https://github.com/user-attachments/assets/8d96304d-8db8-49a6-9979-1617979cf6bf" />

The trapezium and the kite have identical SPD invariants, which the book uses specifically to show that SPD, on its own, cannot always tell two different shapes apart. But their SRD ones are different, so SRD can tell them apart. 

You can also watch the invariants behave sensibly on the real molecules. Symmetric molecules produce matching pairs of values exactly where you would expect. Acetylene (H-C≡C-H), being perfectly symmetric, gives two equal values for its two hydrogens and two equal values for its two carbons. The geometry falls right out of the numbers.

A molecule's raw coordinates are, in a sense, arbitrary. A good descriptor has to see straight through all of that and produce the same answer regardless. Both of these invariants pull that off, and they do it by throwing away the coordinates, keeping only the distances, and sorting them. What is left is a description of the molecule's shape that is blind to everything except the shape itself.

I also want to point out that SPD and SRD are the simpler invariants in Prof. Kurlin's framework, and the book is upfront that they are not the final word. The trapezium and kite example exists to validate SPD's limits, and the more advanced descriptors in later chapters are built to close those gaps. So this task was not about inventing something new. It was about implementing and carefully validating two known descriptors. I am glad to contribute towards this ongoing research!
