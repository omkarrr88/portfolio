import { useEffect, useRef, useState } from "react";
import "./styles/TechStackNew.css";

interface TechItem {
  name: string;
  icon: string;
  url: string;
}

const D = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";
const S = (name: string) => `https://cdn.simpleicons.org/${name}/c2a4ff`;

// All ✅ verified tech stack items — inverted pyramid: 14→13→12→11→9→7→5
const techStack: TechItem[][] = [
  // Row 1 — core languages + pillars
  [
    { name: "Python",      icon: `${D}/python/python-original.svg`,                              url: "https://python.org" },
    { name: "JavaScript",  icon: `${D}/javascript/javascript-original.svg`,                      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
    { name: "TypeScript",  icon: `${D}/typescript/typescript-original.svg`,                      url: "https://typescriptlang.org" },
    { name: "Java",        icon: `${D}/java/java-original.svg`,                                  url: "https://java.com" },
    { name: "C",           icon: `${D}/c/c-original.svg`,                                        url: "https://en.cppreference.com/w/c" },
    { name: "HTML5",       icon: `${D}/html5/html5-original.svg`,                                url: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
    { name: "CSS3",        icon: `${D}/css3/css3-original.svg`,                                  url: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
    { name: "React",       icon: `${D}/react/react-original.svg`,                                url: "https://react.dev" },
    { name: "Next.js",     icon: `${D}/nextjs/nextjs-original.svg`,                              url: "https://nextjs.org" },
    { name: "Vite",        icon: `${D}/vitejs/vitejs-original.svg`,                              url: "https://vitejs.dev" },
    { name: "Node.js",     icon: `${D}/nodejs/nodejs-original.svg`,                              url: "https://nodejs.org" },
    { name: "TensorFlow",  icon: `${D}/tensorflow/tensorflow-original.svg`,                      url: "https://tensorflow.org" },
    { name: "PyTorch",     icon: `${D}/pytorch/pytorch-original.svg`,                            url: "https://pytorch.org" },
  ],
  // Row 2 — backend + APIs + databases
  [
    { name: "Django",      icon: `${D}/django/django-plain.svg`,                                 url: "https://djangoproject.com" },
    { name: "Flask",       icon: `${D}/flask/flask-original.svg`,                                url: "https://flask.palletsprojects.com" },
    { name: "FastAPI",     icon: `${D}/fastapi/fastapi-original.svg`,                            url: "https://fastapi.tiangolo.com" },
    { name: "NestJS",      icon: `${D}/nestjs/nestjs-original.svg`,                              url: "https://nestjs.com" },
    { name: "Express.js",  icon: `${D}/express/express-original.svg`,                            url: "https://expressjs.com" },
    { name: "Spring Boot", icon: `${D}/spring/spring-original.svg`,                              url: "https://spring.io/projects/spring-boot" },
    { name: "GraphQL",     icon: `${D}/graphql/graphql-plain.svg`,                               url: "https://graphql.org" },
    { name: "MongoDB",     icon: `${D}/mongodb/mongodb-original.svg`,                            url: "https://mongodb.com" },
    { name: "MySQL",       icon: `${D}/mysql/mysql-original.svg`,                                url: "https://mysql.com" },
    { name: "PostgreSQL",  icon: `${D}/postgresql/postgresql-original.svg`,                      url: "https://postgresql.org" },
    { name: "Docker",      icon: `${D}/docker/docker-original.svg`,                              url: "https://docker.com" },
    { name: "GitHub",      icon: `${D}/github/github-original.svg`,                              url: "https://github.com" },
  ],
  // Row 3 — frontend frameworks + more DBs + cloud
  [
    { name: "Three.js",    icon: `${D}/threejs/threejs-original.svg`,                            url: "https://threejs.org" },
    { name: "Vue.js",      icon: `${D}/vuejs/vuejs-original.svg`,                                url: "https://vuejs.org" },
    { name: "Angular",     icon: `${D}/angularjs/angularjs-original.svg`,                        url: "https://angular.io" },
    { name: "Tailwind",    icon: `${D}/tailwindcss/tailwindcss-original.svg`,                    url: "https://tailwindcss.com" },
    { name: "Bootstrap",   icon: `${D}/bootstrap/bootstrap-original.svg`,                        url: "https://getbootstrap.com" },
    { name: "Redis",       icon: `${D}/redis/redis-original.svg`,                                url: "https://redis.io" },
    { name: "SQLite",      icon: `${D}/sqlite/sqlite-original.svg`,                              url: "https://sqlite.org" },
    { name: "Supabase",    icon: `${D}/supabase/supabase-original.svg`,                          url: "https://supabase.com" },
    { name: "SQLAlchemy",  icon: `${D}/sqlalchemy/sqlalchemy-original.svg`,                      url: "https://sqlalchemy.org" },
    { name: "AWS",         icon: `${D}/amazonwebservices/amazonwebservices-original-wordmark.svg`, url: "https://aws.amazon.com" },
    { name: "GCP",         icon: `${D}/googlecloud/googlecloud-original.svg`,                    url: "https://cloud.google.com" },
    { name: "Kubernetes",  icon: `${D}/kubernetes/kubernetes-original.svg`,                      url: "https://kubernetes.io" },
  ],
  // Row 4 — ML/AI + deploy
  [
    { name: "LangChain",   icon: S("langchain"),                                                  url: "https://langchain.com" },
    { name: "Streamlit",   icon: `${D}/streamlit/streamlit-original.svg`,                        url: "https://streamlit.io" },
    { name: "Scikit-learn",icon: `${D}/scikitlearn/scikitlearn-original.svg`,                    url: "https://scikit-learn.org" },
    { name: "OpenCV",      icon: `${D}/opencv/opencv-original.svg`,                              url: "https://opencv.org" },
    { name: "Pandas",      icon: `${D}/pandas/pandas-original.svg`,                              url: "https://pandas.pydata.org" },
    { name: "NumPy",       icon: `${D}/numpy/numpy-original.svg`,                                url: "https://numpy.org" },
    { name: "Vercel",      icon: `${D}/vercel/vercel-original.svg`,                              url: "https://vercel.com" },
    { name: "Netlify",     icon: `${D}/netlify/netlify-original.svg`,                            url: "https://netlify.com" },
    { name: "Cloudflare",  icon: `${D}/cloudflare/cloudflare-original.svg`,                      url: "https://cloudflare.com" },
    { name: "Railway",     icon: S("railway"),                                                    url: "https://railway.app" },
    { name: "Render",      icon: S("render"),                                                     url: "https://render.com" },
  ],
  // Row 5 — blockchain + viz + CI + ORMs
  [
    { name: "Solidity",    icon: `${D}/solidity/solidity-original.svg`,                          url: "https://soliditylang.org" },
    { name: "Hardhat",     icon: `${D}/hardhat/hardhat-original.svg`,                            url: "https://hardhat.org" },
    { name: "Web3.js",     icon: S("web3dotjs"),                                                  url: "https://web3js.org" },
    { name: "Matplotlib",  icon: `${D}/matplotlib/matplotlib-original.svg`,                      url: "https://matplotlib.org" },
    { name: "Plotly",      icon: `${D}/plotly/plotly-original.svg`,                              url: "https://plotly.com" },
    { name: "GH Actions",  icon: `${D}/githubactions/githubactions-original.svg`,                url: "https://github.com/features/actions" },
    { name: "Prisma",      icon: `${D}/prisma/prisma-original.svg`,                              url: "https://prisma.io" },
    { name: "Sequelize",   icon: `${D}/sequelize/sequelize-original.svg`,                        url: "https://sequelize.org" },
    { name: "JWT",         icon: S("jsonwebtokens"),                                              url: "https://jwt.io" },
  ],
  // Row 6 — testing + tooling
  [
    { name: "pytest",      icon: `${D}/pytest/pytest-original.svg`,                              url: "https://pytest.org" },
    { name: "Vitest",      icon: `${D}/vitest/vitest-original.svg`,                              url: "https://vitest.dev" },
    { name: "Playwright",  icon: `${D}/playwright/playwright-original.svg`,                      url: "https://playwright.dev" },
    { name: "Sentry",      icon: S("sentry"),                                                     url: "https://sentry.io" },
    { name: "Postman",     icon: `${D}/postman/postman-original.svg`,                            url: "https://postman.com" },
    { name: "Colab",       icon: `${D}/googlecolab/googlecolab-original.svg`,                    url: "https://colab.research.google.com" },
    { name: "Cloudinary",  icon: S("cloudinary"),                                                 url: "https://cloudinary.com" },
  ],
  // Row 7 — tip of pyramid
  [
    { name: "Shadcn/UI",   icon: S("shadcnui"),                                                   url: "https://ui.shadcn.com" },
    { name: "Radix UI",    icon: S("radixui"),                                                    url: "https://radix-ui.com" },
    { name: "Razorpay",    icon: S("razorpay"),                                                   url: "https://razorpay.com" },
    { name: "Auth0",       icon: S("auth0"),                                                      url: "https://auth0.com" },
    { name: "Mongoose",    icon: S("mongoose"),                                                   url: "https://mongoosejs.com" },
  ],
];

const TechStackNew = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [videoVisible, setVideoVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVideoVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px 0px" }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="techstack-new" ref={sectionRef}>
      {/* Video Background — loads only when the section approaches the viewport */}
      <div className="techstack-video-container">
        {videoVisible && (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="techstack-video"
          >
            <source src="/video/video.webm" type="video/webm" />
          </video>
        )}
        {/* Dark Overlay */}
        <div className="techstack-overlay"></div>
      </div>

      {/* Content */}
      <div className="techstack-content">
        <h2>Tech Stack</h2>
        
        <div className="techstack-pyramid">
          {techStack.map((row, rowIndex) => (
            <div key={rowIndex} className="techstack-row">
              {row.map((tech, techIndex) => (
                <a
                  key={techIndex}
                  href={tech.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="techstack-item"
                  title={tech.name}
                  data-cursor="disable"
                >
                  <img src={tech.icon} alt={tech.name} />
                  <span>{tech.name}</span>
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechStackNew;
