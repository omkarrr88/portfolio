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
        description: "I recently completed my BE in Information Technology from Terna Engineering College (Mumbai University, 2026), and I work as a Platform Engineer at Riamona Luxury & Fashion Brands, where I build full-stack products end to end — the code, the tests, the CI/CD, and running them in production. Day to day I work with React, Node.js, Python, Prisma, and PostgreSQL. I recently placed 7th out of 31,000+ teams at the Meta PyTorch Hackathon and co-authored a research paper now under review at Discover Internet of Things (Springer Nature)."
    },
    experiences: [
        {
            position: "Platform Engineer",
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
            title: "V2V Communication",
            category: "IoT / Research",
            technologies: "Python, Simulation, Networking, IoT, Sensor Processing",
            image: "/images/v2v.webp",
            description: "A simulation where vehicles warn each other about blind spots and likely collisions before they happen, using a Severity-Gated Collision Risk Indexing approach. The work became a research paper, now under review at Discover Internet of Things (Springer Nature).",
            link: "https://github.com/omkarrr88/V2V"
        },
        {
            id: 7,
            title: "Smart PUC",
            category: "Blockchain / ML",
            technologies: "Solidity, Hardhat, OpenZeppelin, FastAPI, Web3.py, Scikit-learn, Docker",
            image: "/images/placeholder.webp",
            description: "A blockchain-based system for monitoring vehicle emissions and PUC compliance in India. OBD devices sign live emission telemetry, testing stations validate it, and records go on-chain so no single party can fake the data. Tracks all five Bharat Stage VI pollutants with physics-based models and an ML ensemble for fraud detection, and issues emission certificates as NFTs.",
            link: "https://github.com/omkarrr88/Smart_PUC"
        },
        {
            id: 8,
            title: "Chakravyuh",
            category: "ML / Reinforcement Learning",
            technologies: "PyTorch, Hugging Face Transformers, GRPO, LoRA, Qwen2.5, FastAPI, Docker",
            image: "/images/placeholder.webp",
            description: "A multi-agent reinforcement learning environment for detecting UPI payment fraud, built for the Meta PyTorch Hackathon (7th out of 31,000+ teams). Five agents with asymmetric information — scammer, victim, analyzer, bank monitor, and regulator — train against each other, with LoRA-fine-tuned models trained in PyTorch using GRPO.",
            link: "https://github.com/UjjwalPardeshi/Chakravyuh"
        },
        {
            id: 2,
            title: "Shopify Gold Price Automation",
            category: "Automation / Backend",
            technologies: "Python, Flask, PostgreSQL, Shopify GraphQL API, BeautifulSoup, Railway, Telegram Bot",
            image: "/images/gold-automation.webp",
            description: "End-to-end automated pricing engine for a jewellery Shopify store. Scrapes live gold rates from IBJA twice daily, recalculates 55,000+ variant prices using a component-wise formula (gold weight × purity rate + diamond + making charge), and pushes all updates via Shopify GraphQL Bulk Operations — fully unattended.",
            link: ""
        },
        {
            id: 3,
            title: "Invoice & Payment Portal",
            category: "Full Stack / Enterprise",
            technologies: "React, TypeScript, Express.js, Prisma, PostgreSQL, TailwindCSS, shadcn/ui, Railway",
            image: "/images/invoice-portal.webp",
            description: "Enterprise financial management platform with invoice tracking, slab-based early-payment discounts, daily interest penalty calculations, UTR verification workflow, and role-based access for 5 user types. Supports bulk Excel invoice import and a payment simulator showing how payable amounts change by date.",
            link: ""
        },
        {
            id: 4,
            title: "Face Recognition Attendance",
            category: "Computer Vision",
            technologies: "Python, OpenCV, Computer Vision, MySQL, Haarcascades",
            image: "/images/face-recognition.webp",
            description: "Automated attendance system using face recognition with OpenCV and Haarcascade classifiers. Features real-time face detection and MySQL database integration.",
            link: "https://github.com/omkarrr88/face-recognition-attendance-system"
        },
        {
            id: 5,
            title: "Fitness Tracker",
            category: "Full Stack",
            technologies: "JavaScript, Chart.js, Responsive Design, Analytics",
            image: "/images/fitness.webp",
            description: "A comprehensive fitness tracking application with data visualization using Chart.js. Features responsive design and analytics dashboard for tracking workouts.",
            link: "https://github.com/omkarrr88/Fitness-Tracker"
        },
        {
            id: 6,
            title: "Movie Recommendation",
            category: "ML / Full Stack",
            technologies: "Python, NLTK, Scikit-learn, React, Flask, APIs",
            image: "/images/movie.webp",
            description: "Machine learning-powered movie recommendation system using NLTK and Scikit-learn. Features a React frontend with Flask backend and external API integration.",
            link: "https://github.com/omkarrr88/movie-recommendation-system"
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
            title: "ML ENGINEER",
            description: "Building intelligent systems & ML solutions",
            details: "Developing machine learning models, computer vision systems, and NLP solutions using Python, TensorFlow, and Scikit-learn. Specializing in deep learning, NLP, and intelligent automation.",
            tools: ["Python", "TensorFlow", "Scikit-learn", "NLTK", "OpenCV", "Pandas", "NumPy", "Deep Learning", "NLP", "Computer Vision"]
        },
        design: {
            title: "FULL-STACK",
            description: "Modern web development & scalable applications",
            details: "Building responsive, production-grade web applications using React, Node.js, Express, and TypeScript, backed by Prisma and PostgreSQL. Shipping with proper testing, CI/CD, and cloud deployment.",
            tools: ["React", "Node.js", "Express.js", "TypeScript", "Prisma", "PostgreSQL", "TailwindCSS", "Docker", "Railway", "Git"]
        }
    }
};
