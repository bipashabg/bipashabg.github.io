## GSoC 2025: OSGeo
### Introduction
Hello everyone, I'm Bipasha Gayary, and at the time of writing this, I was at the end of my sophomore year at the Indian Institute of Technology Roorkee, pursuing Geological Technology. I first came across Google Summer of Code (GSoC) during my very first semester and was instantly drawn to it. However, knowing I wasn’t ready just yet, I gave myself time to grow and gain the experience and skills necessary to contribute meaningfully to an open-source project.

This year, I wanted to challenge myself with something unconventional—something outside the usual web development and software stacks I had been working with so far. That’s one of the key reasons I chose this project. I wanted to perfect my grasp of lower-level programming particularly C and C++, data structures, algorithms, and network analysis while also learning something entirely new in the process. Contributing to pgRouting project under the OSGeo Foundation, which is an extension of PostGIS for routing functionality felt like the perfect blend of theory and practical application, all while pushing me outside my comfort zone. I will be learning and working on graph algorithms, specifically the Sloan Sparse matrix ordering algorithm to help reduce the profile and wavefront of graphs and adding it to the list of already existing algorithms on pgRouting.


## Community Bonding Period (May 8 – June 1)
Before the coding period started I had the opportunity to interact with my mentor Vicky Vergara beforehand to get a gist of the work done in pgRouting codebase and familiarize with it. I had to also go over a few tasks to get used to working with psql queries, osm2pgrouting data and other exercises. 

During the bonding period, my main focus was to set up everything needed to hit the ground running once the coding phase began. I started by setting up my development environment to build and test pgRouting locally. This included compiling the project from source and ensuring I could run tests smoothly. 
To contribute effectively, I familiarized myself with the pgRouting codebase, its modular structure, and the development practices followed by the community. I also went through the PostgreSQL documentation for writing C-language functions and explored how pgTap is used for testing PostgreSQL extensions—this was crucial for writing reliable tests later in the project.
Since the implementation of the Sloan ordering algorithm involves graph operations, I spent time understanding the Boost Graph Library (BGL). Currently only the reverse Cuthill Mckee ordering algorithm has been implemented so far in the matrix ordering category. I also reviewed existing BGL-based implementations in the codebase to identify reusable components and establish design consistency.
To keep track of my work, I created a project wiki page to document weekly goals and progress updates. I also made some minor updates to my original proposal based on mentor feedback to ensure a smoother and more accurate implementation plan.
 I attended two weekly sync meetings during this period, where I discussed the plan, clarified expectations, and received valuable guidance from my mentors.



