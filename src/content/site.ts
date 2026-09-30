/**
 * Everything the prototype says about Omkar. Facts only from the resume
 * (public/resume.pdf) — no invented numbers.
 */

export interface Chapter {
  /** Ring number, 7 (outer) to 1 (inner); 0 is the centre. */
  readonly ring: number
  readonly label: string
  /** Section id when the chapter exists in the prototype. */
  readonly anchor: string | null
}

export const chapters: readonly Chapter[] = [
  { ring: 7, label: 'Intro', anchor: 'intro' },
  { ring: 6, label: 'Now', anchor: 'now' },
  { ring: 5, label: 'Chakravyuh', anchor: 'chakravyuh' },
  { ring: 4, label: 'VayuNetra', anchor: null },
  { ring: 3, label: 'Fitmon', anchor: null },
  { ring: 2, label: 'More work', anchor: null },
  { ring: 1, label: 'Beyond code', anchor: null },
  { ring: 0, label: 'Centre · contact', anchor: null },
]

export const chapterForRing = (ring: number): Chapter =>
  chapters.find((c) => c.ring === ring) ?? chapters[0]

export const profile = {
  name: 'Omkar Kadam',
  role: 'Full-stack & ML engineer',
  place: 'Navi Mumbai',
  intro:
    'I build products end to end, from the code and the tests to the pipeline, and I train the models that go inside them.',
  resume: '/resume.pdf',
  github: 'https://github.com/omkarrr88',
  results: [
    { rank: '7th', field: '31,000+ teams', event: 'Meta PyTorch Hackathon' },
    { rank: 'Top 10', field: '15,000+ teams', event: 'ET AI Hackathon 2.0' },
    { rank: 'Top 7', field: '7,000+ teams', event: 'iQOO Pune City Battle' },
  ],
} as const

export const now = {
  headline: 'I work as a Full Stack Engineer at Riamona Luxury & Fashion Brands.',
  body:
    'Since January 2026 I have built and shipped features for several internal products with React, Node.js, Python and PostgreSQL, along with the REST and GraphQL APIs and database schemas behind them. I write the tests, maintain the GitHub Actions and Railway pipelines that run them, and handle deployments and production issues.',
  education: 'BE Information Technology, Terna Engineering College, Mumbai University, 2026',
} as const

export const chakravyuh = {
  number: '05',
  title: 'Chakravyuh',
  devanagari: 'चक्रव्यूह',
  subtitle: 'Multi-agent reinforcement learning for UPI fraud detection',
  category: 'ML / Reinforcement learning',
  date: 'April 2026',
  place: 'Bengaluru',
  placement: '7th of 31,000+ teams, Meta PyTorch Hackathon',
  figure: {
    src: '/images/chakravyuh-reward-fix.webp',
    width: 1385,
    height: 791,
    alt: 'Bar chart from the Chakravyuh repo comparing v1 and v2 of the analyzer: detection 100% then 99.3%, false-positive rate 36% then 6.7%, F1 96.0% then 99.0%.',
    caption: 'From the repo: the reward-hacking fix. Detection holds at 99.3% while false positives fall from 36% to 6.7% (144 scam and 30 benign test cases).',
  },
  body: [
    'A five-agent OpenEnv environment for UPI fraud. A scammer, a victim, an analyzer, a bank monitor and a regulator play against each other, each seeing only part of the picture.',
    'A Qwen2.5-7B analyzer fine-tuned with LoRA and GRPO reaches 99.3% detection at a 6.7% false-positive rate, statistically tied with Llama-3.3-70B at a tenth of the parameters.',
  ],
  facts: [
    { term: 'Agents', detail: 'Scammer, victim, analyzer, bank monitor, regulator' },
    { term: 'Model', detail: 'Qwen2.5-7B, LoRA + GRPO' },
    { term: 'Compared with', detail: 'Llama-3.3-70B, Qwen2.5-72B, gpt-oss-120b, DeepSeek-V3, DeepSeek-R1, Gemma-3-27B' },
    { term: 'My part', detail: 'Evaluation suite (frontier baselines, significance tests, leakage audit) and the Gradio demo' },
    { term: 'Stack', detail: 'PyTorch, Hugging Face TRL, OpenEnv, FastAPI, Gradio, Docker' },
  ],
  link: 'https://github.com/omkarrr88/Chakravyuh',
} as const
