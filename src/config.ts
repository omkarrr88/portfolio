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
        description: "I'm a final-year IT student at Terna Engineering College and Platform Engineer at Riamona, where I work on cloud infrastructure and e-commerce platforms. I'm passionate about the intersection of web development and machine learning — I've built projects ranging from a V2V collision simulation to ML-based recommendation engines. VP of CSI & Deputy Secretary of the T&P Cell. I'm actively looking for full-time roles in full-stack development or ML engineering."
    },
    experiences: [
        {
            position: "Platform Engineer",
            company: "Riamona Luxury & Fashion Brands",
            period: "2025 - Present",
            location: "Mumbai",
            description: "Building core technology platform, CI/CD pipelines, and cloud-based solutions for luxury fashion e-commerce.",
            responsibilities: [
                "Developing and maintaining the core technology platform",
                "Building CI/CD pipelines and automation",
                "Implementing cloud-based infrastructure solutions",
                "Working with cross-functional teams on product delivery"
            ],
            technologies: ["Cloud", "CI/CD", "Docker", "Node.js", "React", "DevOps"]
        }
    ],
    projects: [
        {
            id: 1,
            title: "V2V Communication",
            category: "IoT / Simulation",
            technologies: "Python, Simulation, Networking, IoT, Sensor Processing",
            image: "/images/v2v.webp",
            description: "Vehicle-to-Vehicle communication system for collision detection and avoidance. Uses IoT sensors and simulation to enable real-time communication between vehicles.",
            link: "https://github.com/omkarrr88/V2V"
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
            details: "Building responsive and performant web applications using React, Node.js, Express, and databases. Creating seamless user experiences with modern UI/UX principles.",
            tools: ["React", "Node.js", "Express.js", "Flask", "JavaScript", "Java", "MySQL", "MongoDB", "Docker", "Git"]
        }
    }
};
