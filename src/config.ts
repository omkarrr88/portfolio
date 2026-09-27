export const config = {
    developer: {
        name: "Omkar",
        fullName: "Omkar Kadam",
        title: "Full Stack & ML Developer",
        description: "Full Stack Machine Learning Developer building intelligent systems and modern web applications. Passionate about machine learning, deep learning, and creating next-gen solutions."
    },
    social: {
        github: "omkarrr88",
        email: "omkarkadam181188@gmail.com",
        phone: "+91 9987703661",
        location: "Navi Mumbai, Maharashtra"
    },
    about: {
        title: "About Me",
        description: "I recently completed my BE in Information Technology from Terna Engineering College (Mumbai University, 2026), and I work as a Full Stack Engineer at Riamona Luxury & Fashion Brands, where I build full-stack products end to end — the code, the tests, the CI/CD, and running them in production. Day to day I work with React, Node.js, Python, Prisma, and PostgreSQL. In 2026 I placed 7th out of 31,000+ teams at the Meta PyTorch Hackathon, in the top 10 of 15,000+ teams at the ET AI Hackathon 2.0, and in the top 7 of 7,000+ teams at the iQOO Hackathon Pune City Battle, and I co-authored a research paper now under review at Discover Internet of Things (Springer Nature)."
    },
    experiences: [
        {
            position: "Full Stack Engineer",
            company: "Riamona Luxury & Fashion Brands",
            period: "Jan 2026 - Present",
            location: "Navi Mumbai",
            description: "Building full-stack products end to end — development, testing, CI/CD, and cloud infrastructure across several internal products.",
            responsibilities: [
                "Build and ship full-stack features with React, Node.js, Python, and PostgreSQL",
                "Design and maintain REST/GraphQL APIs and database schemas",
                "Write unit, integration, and end-to-end tests",
                "Maintain CI/CD pipelines on GitHub Actions and Railway",
                "Handle deployments, monitoring, and production issues"
            ],
            technologies: ["React", "Node.js", "Python", "PostgreSQL", "Prisma", "GraphQL", "CI/CD", "Docker", "Railway"]
        }
    ],
    projects: [
        {
            id: 1,
            title: "VayuNetra",
            category: "AI / Multi-Agent RAG",
            technologies: "Python, FastAPI, LangGraph, RAG, GBM + SHAP, Sentinel-2, H3, PostGIS, React, MapLibre, Telegram Bot, IVR",
            image: "/images/vayunetra.webp",
            description: "Top 10 of 15,000+ teams at the ET AI Hackathon 2.0. A LangGraph multi-agent platform for urban air quality across 10 Indian cities: per-km² PM2.5 source attribution (GBM + SHAP), 72-hour calibrated forecasts, RAG-cited enforcement dossiers with draft notice PDFs, and citizen advisories in 8 languages over app, Telegram and real IVR calls — 16,529 modeled cells on ₹0 infrastructure.",
            link: "https://github.com/omkarrr88/VayuNetra"
        },
        {
            id: 2,
            title: "Chakravyuh",
            category: "ML / Reinforcement Learning",
            technologies: "PyTorch, Hugging Face TRL, GRPO, LoRA, Qwen2.5, OpenEnv, FastAPI, Gradio, Docker",
            image: "/images/chakravyuh.webp",
            description: "7th out of 31,000+ teams at the Meta PyTorch Hackathon. A multi-agent reinforcement learning environment for detecting UPI payment fraud. Five agents with asymmetric information — scammer, victim, analyzer, bank monitor, and regulator — play against each other; a Qwen2.5-7B analyzer fine-tuned with LoRA and GRPO reaches 99.3% detection at a 6.7% false-positive rate, statistically tied with Llama-3.3-70B at 10× fewer parameters.",
            link: "https://github.com/omkarrr88/Chakravyuh"
        },
        {
            id: 3,
            title: "Fitmon",
            category: "Mobile / Computer Vision",
            technologies: "Kotlin, Jetpack Compose, MediaPipe, CameraX, Gemma 3n, Room, Firebase, Nearby Connections",
            image: "/images/fitmon.webp",
            description: "Top 7 of 7,000+ teams at the iQOO Hackathon Pune City Battle. An Android fitness game where the front camera grades every rep: on-device MediaPipe pose tracking scores depth, range, tempo, and alignment, and the score becomes damage against an adaptive boss. An on-device Gemma 3n coach speaks only from measured telemetry, two phones duel over Nearby Connections with no server, and camera frames never leave the phone.",
            link: "https://github.com/omkarrr88/ClashFit"
        },
        {
            id: 4,
            title: "PyTorch Debugger",
            category: "ML / Reinforcement Learning",
            technologies: "PyTorch, OpenEnv, FastAPI, WebSockets, Plotly, Docker, Hugging Face Spaces, pytest",
            image: "/images/pytorch-debugger.webp",
            description: "Built for the online round of the Meta PyTorch Hackathon. An OpenEnv RL environment where AI agents debug broken PyTorch training runs across 7 real failures — exploding and vanishing gradients, data leakage, overfitting, BatchNorm left in eval mode, training-loop bugs, and a misconfigured LR scheduler — with rewards gated on what the agent has actually inspected. 245 tests at 95% coverage.",
            link: "https://github.com/omkarrr88/PyTorch-Training-Run-Debugger"
        },
        {
            id: 5,
            title: "Smart PUC",
            category: "Blockchain / ML",
            technologies: "Solidity, Hardhat, OpenZeppelin, FastAPI, Web3.py, Scikit-learn, Docker",
            image: "/images/smart-puc.webp",
            description: "A blockchain-based system for monitoring vehicle emissions and PUC compliance in India. OBD devices sign live emission telemetry, testing stations validate it, and records go on-chain so no single party can fake the data. Tracks all five Bharat Stage VI pollutants with physics-based models and an ML ensemble for fraud detection, and issues emission certificates as NFTs.",
            link: "https://github.com/omkarrr88/Smart_PUC"
        },
        {
            id: 6,
            title: "V2V Communication",
            category: "IoT / Research",
            technologies: "Python, Simulation, Networking, IoT, Sensor Processing",
            image: "/images/v2v-research.webp",
            description: "A simulation where vehicles warn each other about blind spots and likely collisions before they happen, using a Severity-Gated Collision Risk Indexing approach. The work became a research paper, now under review at Discover Internet of Things (Springer Nature).",
            link: "https://github.com/omkarrr88/V2V"
        }
    ],
    contact: {
        email: "omkarkadam181188@gmail.com",
        github: "https://github.com/omkarrr88",
        linkedin: "https://linkedin.com/in/omkarrrr",
        phone: "+91 9987703661"
    },
    resume: "/resume.pdf",
    skills: {
        develop: {
            title: "FULL-STACK",
            description: "Modern web development & scalable applications",
            details: "Building responsive, production-grade web applications using React, Node.js, Express, and TypeScript, backed by Prisma and PostgreSQL, plus native Android apps in Kotlin and Jetpack Compose. Shipping with proper testing, CI/CD, and cloud deployment.",
            tools: ["React", "Next.js", "TypeScript", "Node.js", "Express.js", "NestJS", "GraphQL", "Prisma", "PostgreSQL", "Supabase", "Redis", "TailwindCSS", "Kotlin", "Jetpack Compose", "Firebase", "Docker", "Railway", "GitHub Actions"]
        },
        design: {
            title: "ML & AI",
            description: "Machine learning, agents & AI-powered products",
            details: "Training and shipping ML models — computer vision, NLP, reinforcement learning — and building AI systems with RAG, LLM APIs, and multi-agent pipelines using PyTorch, LangGraph, and pgvector, including LoRA and GRPO fine-tuning of open LLMs.",
            tools: ["Python", "PyTorch", "TensorFlow", "Scikit-learn", "OpenCV", "MediaPipe", "NLTK", "Pandas", "NumPy", "RAG", "LangChain", "LangGraph", "LLM APIs", "MCP", "pgvector", "Hugging Face", "LoRA / GRPO", "Streamlit", "Gradio"]
        }
    }
};
