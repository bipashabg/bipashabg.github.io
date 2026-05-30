import React from 'react';
import '../assets/styles/AboutMe.scss';

function AboutMe() {
  return (
    <div className="container" id="about-me">
      <div className="about-me-container">
        <h1>About Me</h1>
        <p>
            I'm a Software Engineer who likes to build and work with scalable, end-to-end applications and understanding the systems that power them. My experience spans full-stack development, AI agents, machine learning, and open-source software, with a strong foundation in data structures, algorithms, and the mathematical principles that underpin modern computing.

I enjoy working across the stack and have built applications using technologies such as Node.js, TypeScript, React, Next.js, Rust, SQL databases, Docker, and Git-based development workflows. Beyond application development, I'm particularly interested in systems design, distributed systems, and low-level programming, driven by a curiosity to understand software from the ground up.

I've also contributed to open-source projects, including pgRouting under the OSGeo ecosystem, where I collaborated on geospatial software used by developers and researchers worldwide. Whether I'm building products, experimenting with AI-driven systems, or exploring new technologies, I enjoy tackling complex problems and continuously expanding my understanding of how software works at every layer.

Outside of programming, you'll usually find me listening to music, designing graphics, watching films, or reading and writing poetry :D
 
        </p>
      </div>
    </div>
  );
}

export default AboutMe;