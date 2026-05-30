import '../assets/styles/Project.scss';
import Chip from '@mui/material/Chip';
import GitHubIcon from '@mui/icons-material/GitHub';
import LaunchIcon from '@mui/icons-material/Launch';

type ProjectItem = {
    title: string;
    url: string;
    description: string;
    labels: string[];
};

const projects: ProjectItem[] = [
    {
        title: "Shramik.AI",
        url: "https://github.com/lakshyashishir/Shramik.ai",
        description: "Shramik.ai is an AI-powered platform that helps migrant and blue-collar workers discover job opportunities, earn a portable skill passport, and receive multilingual assistance through conversational AI, improving accessibility and financial inclusion. Built the Skill Passport component, voice onboarding endpoint, job board page, screening page design.",
        labels: ["NextJS", "Azure OpenAI GPT-4.1", "PostgreSQL", "MediaPipe", "Azure Blob Storage", "Sarvam AI STT/TTS", "Twilio/IVR"],
    },
    {
        title: "NDVI Analysis",
        url: "https://github.com/bipashabg/NDVI_Analysis",
        description: "Analyzed the Normalized Difference Vegetation Index of a raw Sentinel-2 satellite image using Machine Learning techniques.",
        labels: ["Python", "Rasterio", "Computer Vision"],
    },
    {
        title: "Swap-It",
        url: "https://swapit-iitr.vercel.app/",
        description: "Swap-It is a peer-to-peer exchange platform for college students that allows users to trade useful and desirable items seamlessly, and also for NGOs to register themselves and collect materials and reduce generated annual waste with integrated chat management system and a database to keep a track of exchanged goods.",
        labels: ["Supabase", "Expo/React Native", "Typescript"],
    },
    {
        title: "NFCPay",
        url: "https://base-frontend-seven.vercel.app/",
        description: "NFCPay is a Farcaster Mini App that lets users tap-to-pay using NFC card, or pick a contact from Google Contacts. Execute and track on-chain payments seamlessly with a simple and friendly UX.",
        labels: ["NextJS", "Farcaster Mini App", "Coinbase Onchain Kit", "Google Contacts API", "Wagmi"],
    },
    {
        title: "Credix",
        url: "https://github.com/bipashabg/Credix",
        description: "An on-chain orderbook-based lending platform where multiple isolated lending pools compete to provide the best available interest rates to borrowers, powered by efficient rate sorting and real-time price oracles.",
        labels: ["Pyth", "NextJS", "Solidity", "Foundry", "Tailwind"],
    },
    {
        title: "Eth Tools",
        url: "https://github.com/bipashabg/eth-tools",
        description: "A library of tools and utilities for Ethereum development, including a Solidity linter, a bytecode analyzer, and a gas cost estimator, designed to enhance the efficiency and security of smart contract development.",
        labels: ["Rust", "VueJS"],
    },
    {
        title: "Reflections of Self",
        url: "https://itch.io/jam/byog-2024/rate/2988256",
        description: "A 2D RPG inspired game with dialogues and movement made in Godot Game Engine for Build Your Own Game Jam '24.",
        labels: ["Godot Game Engine", "C#"],
    },
];

const isSourceCode = (url: string) => url.includes("github.com");

function Project() {
    return (
        <div className="projects-container" id="projects">
            <h1>Projects</h1>
            <div className="projects-grid">
                {projects.map((project, index) => {
                    const sourceCode = isSourceCode(project.url);
                    return (
                        <div className="project" key={index}>
                            <a href={project.url} target="_blank" rel="noreferrer">
                                <h2>{project.title}</h2>
                            </a>
                            <p>{project.description}</p>
                            <div className="flex-chips">
                                <span className="chip-title">Tech stack:</span>
                                {project.labels.map((label, i) => (
                                    <Chip key={i} className="chip" label={label} />
                                ))}
                            </div>
                            <a
                                className="project-link"
                                href={project.url}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {sourceCode ? <GitHubIcon fontSize="small" /> : <LaunchIcon fontSize="small" />}
                                {sourceCode ? "Source Code" : "Live Demo"}
                            </a>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Project;
