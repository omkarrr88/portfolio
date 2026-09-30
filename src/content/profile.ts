import type { BrandId } from './brands'
import type { Achievement, Education, Experience, Leadership, Publication, SkillGroup } from './types'

/** Every fact here is taken from public/resume.tex; keep the two in step. */

export const person = {
  name: 'Omkar Kadam',
  role: 'Full-stack & ML engineer',
  place: 'Navi Mumbai',
  intro:
    'I build products end to end, from the code and the tests to the pipeline, and I train the models that go inside them.',
  email: 'omkarkadam181188@gmail.com',
  github: 'https://github.com/omkarrr88',
  linkedin: 'https://www.linkedin.com/in/omkarrrr',
  resume: '/resume.pdf',
  lookingFor: 'Full-stack, platform and ML engineering roles.',
} as const

export const experience: readonly Experience[] = [
  {
    role: 'Full Stack Engineer',
    org: 'Riamona Luxury and Fashion Brands Pvt. Ltd.',
    place: 'Navi Mumbai',
    period: 'Jan 2026 – Present',
    points: [
      'Build and ship full-stack features for several internal products using React, Node.js, Python and PostgreSQL, along with the REST/GraphQL APIs and database schemas behind them.',
      'Write unit, integration and end-to-end tests for what I build, and maintain the GitHub Actions and Railway pipelines that run them on every push.',
      'Handle deployments, monitoring and production issues across staging and production, and work with the team to turn requirements into shipped features.',
    ],
    stack: ['React', 'Node.js', 'Python', 'Prisma', 'PostgreSQL', 'GraphQL', 'GitHub Actions', 'Railway'],
  },
]

export const education: readonly Education[] = [
  {
    title: 'BE, Information Technology',
    school: 'Terna Engineering College, Nerul',
    place: 'Mumbai University',
    period: 'Nov 2022 – June 2026',
  },
  {
    title: 'CBSE 12th, Science',
    school: 'D.A.V. Public School, Airoli',
    place: 'Navi Mumbai',
    period: 'June 2020 – July 2022',
  },
  {
    title: 'CBSE 10th',
    school: 'D.A.V. Public School, Airoli',
    place: 'Navi Mumbai',
    period: 'May 2020',
  },
]

export const skills: readonly SkillGroup[] = [
  { group: 'Languages', items: ['Python', 'JavaScript', 'TypeScript', 'Kotlin', 'Java', 'SQL', 'HTML', 'CSS'] },
  {
    group: 'AI engineering',
    items: ['RAG', 'LLM APIs', 'MCP', 'LangChain', 'LangGraph', 'pgvector', 'OpenEnv', 'Gradio', 'Hugging Face Transformers', 'TRL', 'PEFT', 'Hugging Face Spaces', 'LoRA and GRPO fine-tuning'],
  },
  {
    group: 'ML & data',
    items: ['PyTorch', 'TensorFlow', 'Scikit-learn', 'NLTK', 'OpenCV', 'MediaPipe', 'Pandas', 'NumPy', 'Streamlit', 'Deep learning', 'NLP', 'Computer vision', 'Reinforcement learning'],
  },
  {
    group: 'Web & frameworks',
    items: ['React', 'Next.js', 'Node.js', 'Express.js', 'NestJS', 'Flask', 'FastAPI', 'Prisma', 'TailwindCSS', 'Vite', 'Three.js', 'WebSockets'],
  },
  { group: 'Mobile', items: ['Android', 'Jetpack Compose', 'CameraX', 'Room', 'Firebase Auth', 'Firestore'] },
  { group: 'Databases', items: ['PostgreSQL', 'PostGIS', 'MySQL', 'MongoDB', 'Supabase', 'Redis', 'SQLAlchemy'] },
  { group: 'Cloud & DevOps', items: ['Google Cloud', 'AWS', 'Docker', 'Railway', 'Vercel', 'GitHub Actions', 'Git'] },
  { group: 'APIs & integration', items: ['REST APIs', 'GraphQL', 'JWT', 'OAuth', 'Shopify Admin API', 'BeautifulSoup'] },
  { group: 'Blockchain', items: ['Solidity', 'Web3.js', 'Hardhat'] },
  { group: 'Testing & monitoring', items: ['pytest', 'Vitest', 'Playwright', 'Sentry'] },
]

export const achievements: readonly Achievement[] = [
  {
    id: 'meta-pytorch',
    brands: ['meta', 'pytorch'],
    short: 'Meta PyTorch',
    result: '7th',
    field: 'of 31,000+ teams',
    event: 'Meta PyTorch Hackathon',
    organiser: 'Scaler School of Technology',
    place: 'Bengaluru',
    date: 'Apr 2026',
    detail: 'Online round with the PyTorch Training Run Debugger, then the offline finals (top 800) with Chakravyuh.',
    wonWith: [
      { projectId: 'debugger', note: 'Online round' },
      { projectId: 'chakravyuh', note: 'Offline finals, top 800' },
    ],
  },
  {
    id: 'et-ai',
    brands: ['economic-times'],
    short: 'ET AI Hackathon',
    result: 'Top 10',
    field: 'of 15,000+ teams',
    event: 'ET AI Hackathon 2.0',
    organiser: 'The Economic Times',
    place: 'Hyderabad',
    date: 'Aug 2026',
    detail: 'Presented VayuNetra at the Hyderabad finale.',
    href: 'https://economictimes.indiatimes.com/et-ai-hackathon/2nd-edition',
    wonWith: [{ projectId: 'vayunetra', note: 'Presented at the Hyderabad finale' }],
  },
  {
    id: 'iqoo',
    brands: ['iqoo'],
    short: 'iQOO Hackathon',
    result: 'Top 7',
    field: 'of 7,000+ teams',
    event: 'iQOO Hackathon 2026, Pune City Battle',
    organiser: 'iQOO',
    place: 'Pune',
    date: 'Sept 2026',
    detail: 'Placed in the HealthTech track with Fitmon.',
    href: 'https://iqoo.reskilll.com/',
    wonWith: [{ projectId: 'fitmon', note: 'HealthTech track' }],
  },
  {
    id: 'avishkar',
    brands: [],
    short: 'Avishkar',
    result: 'Finalist',
    event: 'Avishkar Research Project Competition 2025',
    organiser: 'Mumbai University',
    place: 'Mumbai',
    date: '2025',
    detail: "Reached the finals of Mumbai University's inter-collegiate research competition with the V2V research.",
    wonWith: [{ projectId: 'v2v', note: 'The research behind it' }],
  },
]

export const leadership: readonly Leadership[] = [
  {
    org: 'Computer Society of India, Terna Chapter',
    href: 'https://www.instagram.com/csi_terna',
    peak: 'Vice Chairperson, CSI',
    roles: [
      { title: 'Advisor', period: 'Oct 2025 – Sep 2026' },
      { title: 'Vice Chairperson', period: 'Oct 2024 – Oct 2025' },
      { title: 'Technical Executive', period: 'Nov 2023 – Oct 2024' },
    ],
    detail: 'Rose to Vice Chairperson, leading a 40-member team that ran 10+ AI/ML workshops and seminars.',
  },
  {
    org: 'Training & Placement Cell, Terna',
    href: 'https://www.instagram.com/tnp_terna',
    peak: 'Deputy Secretary, T&P Cell',
    roles: [
      { title: 'Deputy Secretary', period: 'Nov 2024 – Oct 2025' },
      { title: 'Hospitality Committee Member', period: 'Nov 2023 – Nov 2024' },
    ],
    detail: 'Worked with 20+ recruiters and ran mock interviews to get students placement-ready.',
  },
  {
    org: 'Revive Cultural Fest, Terna',
    href: 'https://www.instagram.com/reviveterna',
    peak: 'Hospitality HOD, Revive',
    roles: [
      { title: 'Hospitality HOD', period: 'Jan 2025 – Jan 2026' },
      { title: 'Senior Member', period: 'Jan 2024 – Jan 2025' },
      { title: 'Committee Member', period: 'Dec 2022 – Jan 2024' },
    ],
    detail: 'Ran hospitality for 1,000+ attendees and guest judges with 50+ volunteers.',
  },
]

export const publication: Publication = {
  id: 'paper',
  short: 'V2V paper',
  title:
    'Vehicle-to-Vehicle Communication for Blind Spot Detection and Accident Prevention Using Severity-Gated Collision Risk Indexing',
  role: 'Co-author',
  venue: 'Discover Internet of Things (Springer Nature)',
  status: 'Submitted, under peer review',
  date: 'April 2026',
  projectId: 'v2v',
}

/** Logos of the events a project placed at, for the placement line on its sheet. */
export const brandsForProject = (projectId: string): readonly BrandId[] =>
  achievements.filter((a) => a.wonWith.some((w) => w.projectId === projectId)).flatMap((a) => a.brands)
