import type { Project } from './types'

/**
 * Projects, in the order you meet them. Every number is from the project's
 * own repo (README, eval logs, test output) or the resume; nothing is rounded
 * up or estimated. Caveats the repos disclose are kept.
 */

export const chakravyuh: Project = {
  id: 'chakravyuh',
  title: 'Chakravyuh',
  subtitle: 'Multi-agent reinforcement learning for UPI fraud detection',
  category: 'ML · Reinforcement learning',
  date: 'April 2026',
  place: 'Bengaluru',
  placement: '7th of 31,000+ teams · Meta PyTorch Hackathon',
  hook: 'India loses over ₹13,000 crore a year to UPI fraud, and rule-based detectors miss almost a quarter of the newer scams.',
  figureLayout: 'chart',
  figures: [
    {
      src: '/images/chakravyuh-reward-fix.webp',
      width: 1385,
      height: 791,
      alt: 'Bar chart from the Chakravyuh repo comparing v1 and v2 of the analyzer: detection 100% then 99.3%, false-positive rate 36% then 6.7%, F1 96.0% then 99.0%.',
    },
  ],
  caption:
    'The reward-hacking fix, from the repo. Detection holds at 99.3% while false positives fall from 36% to 6.7% (144 scam and 30 benign test cases).',
  numbers: [
    { value: '99.3%', label: 'of 144 scam scenarios detected' },
    { value: '6.7%', label: 'false positives on benign chats, down from 36%' },
    { value: '97.1%', label: 'on post-2024 scam types, where scripted rules catch 76.5%' },
    { value: 'p = 0.61', label: 'against Llama-3.3-70B: a tie, at a tenth of the parameters' },
  ],
  body: [
    'A five-agent OpenEnv environment for UPI fraud. A scammer, a victim, an analyzer, a bank monitor and a regulator play against each other, and each sees only part of the picture: the analyzer reads the chat, the bank monitor sees only the transaction.',
    'The first analyzer caught every scam and flagged 36% of harmless chats along with them; it had learned that calling everything fraud paid. A heavier false-positive penalty, no format reward on benign flags and stronger benign calibration brought false positives down to 6.7% while detection held at 99.3%.',
  ],
  facts: [
    { term: 'My part', detail: 'The evaluation suite (frontier baselines, significance tests, leakage audit) and the Gradio demo' },
    { term: 'Model', detail: 'Qwen2.5-7B-Instruct, LoRA r=64, trained with GRPO' },
    { term: 'Beats', detail: 'DeepSeek-V3 (p = 0.043) and Gemma-3-27B (p = 0.0002) on false positives' },
    { term: 'Tested', detail: '341-test suite; 175-scenario benchmark' },
    { term: 'Caveat', detail: 'Small benign set (n = 30, 95% CI for false positives 1.8–20.7%); one seed, one epoch' },
    { term: 'Stack', detail: 'PyTorch, Hugging Face TRL and PEFT, OpenEnv, FastAPI, Gradio, Docker' },
  ],
  links: [
    { label: 'Source on GitHub', href: 'https://github.com/omkarrr88/Chakravyuh' },
    { label: 'Live demo', href: 'https://ujjwalpardeshi-chakravyuh.hf.space/demo/' },
  ],
}

export const vayunetra: Project = {
  id: 'vayunetra',
  title: 'VayuNetra',
  subtitle: 'Hyperlocal air-quality intelligence for 10 Indian cities',
  category: 'AI agents · Geospatial ML',
  date: 'August 2026',
  place: 'Hyderabad',
  placement: 'Top 10 of 15,000+ teams · ET AI Hackathon 2.0',
  hook: 'Air-quality monitors tell a city how bad the air is. They don’t say who is to blame, or where to send an inspector.',
  figureLayout: 'screen',
  figures: [
    {
      src: '/images/vayunetra-console.webp',
      width: 1600,
      height: 1000,
      alt: 'The VayuNetra enforcement console for Delhi: a map of the city with ranked pollution cells, and a panel for one cell in Punjabi Bagh attributing 79% of its pollution to construction dust.',
    },
  ],
  caption:
    'The live enforcement console, Delhi. Each 1 km² cell carries its source attribution and the evidence behind it, all the way to a signed notice.',
  numbers: [
    { value: '16,529', label: 'H3 cells modelled across 10 cities' },
    { value: '+9–21%', label: 'forecast skill over persistence, 24 to 72 hours ahead' },
    { value: '51–54%', label: 'of Very-Poor onsets in Delhi flagged 1–3 days early' },
    { value: '₹0', label: 'spent on infrastructure' },
  ],
  body: [
    'VayuNetra turns air-quality readings into interventions. It fuses ground sensors, satellite data, weather and mobility, attributes PM2.5 to its sources for every square kilometre with gradient boosting and SHAP, forecasts 72 hours ahead with calibrated uncertainty, and gives inspectors RAG-cited dossiers with draft notices.',
    'Citizens get advisories in 8 languages over the app, Telegram and IVR calls. Attribution lands within Δ 0.042 of SAFAR’s published Delhi apportionment and Δ 0.099 of CSTEP’s for Bengaluru.',
  ],
  facts: [
    { term: 'My part', detail: 'Full stack: the ML models, the LangGraph agent graph and API, and the React console' },
    { term: 'Scale', detail: '647 emission sources, 5,495 vulnerability zones, 451K readings, about 400 cited recommendations' },
    { term: 'Forecast', detail: 'Delhi, Mumbai and Kolkata; interval coverage 0.783 in Delhi, 0.749 in Kolkata' },
    { term: 'Tested', detail: '562 backend tests, 7 end-to-end flows, 9 officer journeys' },
    { term: 'Stack', detail: 'Python, FastAPI, LangGraph, scikit-learn, Supabase (PostGIS, pgvector), React, MapLibre, deck.gl, H3' },
  ],
  links: [
    { label: 'Source on GitHub', href: 'https://github.com/omkarrr88/VayuNetra' },
    { label: 'Live console', href: 'https://vayunetra-aqi.vercel.app' },
  ],
}

export const fitmon: Project = {
  id: 'fitmon',
  title: 'Fitmon',
  subtitle: 'An Android fitness game where the camera referees every rep',
  category: 'Android · On-device ML',
  date: 'September 2026',
  place: 'Pune',
  placement: 'Top 7 of 7,000+ teams · iQOO Hackathon, HealthTech track',
  hook: 'Fitness apps count your reps. Fitmon’s camera decides whether a rep counts at all.',
  figureLayout: 'phones',
  figures: [
    {
      src: '/images/fitmon-train.webp',
      width: 540,
      height: 1202,
      alt: 'Fitmon home screen: a vermilion card reading “Ready to fight?” with a Start a fight button, streak counters and the game modes.',
      label: 'Home',
    },
    {
      src: '/images/fitmon-fight.webp',
      width: 540,
      height: 1202,
      alt: 'A boss fight mid-set: the Pacemaker boss at 53%, 14 reps, fatigue reading Working, a ×1.6 combo, and the coach line “Depth held. Same tempo.”',
      label: 'Boss fight',
    },
    {
      src: '/images/fitmon-progress.webp',
      width: 540,
      height: 1202,
      alt: 'Progress screen: form over the last 20 sessions, reps this week as bars, and a twelve-week activity grid.',
      label: 'Progress',
    },
  ],
  caption: 'Screens from the Android build.',
  numbers: [
    { value: '33', label: 'body landmarks tracked at 30 fps, on the phone' },
    { value: '4', label: 'checks on every rep: depth, range, tempo, alignment' },
    { value: '836', label: 'Kotlin tests, plus 82 screenshot baselines' },
    { value: '0', label: 'camera frames that leave the device' },
  ],
  body: [
    'The front camera is the referee. MediaPipe tracks the body on the phone, and every rep is graded on depth, range against your own first reps, tempo and alignment before it counts as damage against an adaptive boss. A fatigue model changes how the boss fights back as you tire.',
    'Between sets, an on-device Gemma 3n coach speaks from 23 measured telemetry fields and nothing else, so it can’t praise a rep it didn’t see. Two phones can duel over Nearby Connections with no server; they exchange score events, not state.',
  ],
  facts: [
    { term: 'My part', detail: 'Full stack across the whole build' },
    { term: 'Form score', detail: 'Depth 0.40, range 0.25, tempo 0.20, alignment 0.15' },
    { term: 'Game', detail: '16 modes, 22 achievements, 57 exercises; XP comes from rep quality, never from opening the app' },
    { term: 'Stack', detail: 'Kotlin, Jetpack Compose, CameraX, MediaPipe, Room, Firebase Auth and Firestore, Filament' },
  ],
  links: [
    { label: 'Source on GitHub', href: 'https://github.com/omkarrr88/ClashFit' },
    { label: 'Project site', href: 'https://fitmon-iqoo.vercel.app' },
  ],
}

export const debugger_: Project = {
  id: 'debugger',
  title: 'PyTorch Training Run Debugger',
  short: 'Run Debugger',
  subtitle: 'An RL environment where agents debug broken training runs',
  category: 'ML · RL environment',
  date: 'April 2026',
  placement: 'Online round · Meta PyTorch Hackathon',
  hook: 'Training runs fail in quiet ways: exploding gradients, leaked data, a BatchNorm layer left in eval mode.',
  figures: [],
  numbers: [
    { value: '245', label: 'tests, 95% coverage' },
    { value: '0.91 vs 0.52', label: 'heuristic baseline vs Llama 3.1 8B' },
  ],
  body: [
    'Seven real failures, from exploding gradients and data leakage to BatchNorm left in eval mode and bad learning-rate schedules. The agent starts with loss curves, a config and logs, and has to inspect gradients, data, weights and code to find the cause.',
    'Rewards are gated on what the agent inspected first, which teaches it to investigate before it fixes; hard tasks plant red herrings. Every episode runs real PyTorch: 20 forward and backward passes per reset.',
  ],
  facts: [
    { term: 'My part', detail: 'Full stack across the whole build' },
    { term: 'Stack', detail: 'PyTorch, OpenEnv, FastAPI, WebSockets, Plotly, Docker, Hugging Face Spaces' },
  ],
  links: [{ label: 'Source on GitHub', href: 'https://github.com/omkarrr88/PyTorch-Training-Run-Debugger' }],
}

export const smartPuc: Project = {
  id: 'smart-puc',
  title: 'Smart PUC',
  subtitle: 'Vehicle emission records that no single party can fake',
  category: 'Blockchain · IoT',
  date: 'May 2026',
  placement: 'Research prototype',
  hook: 'Bharat Stage VI limits five pollutants. A check that looks only at CO2 missed 246 violations in 5,000 synthetic samples.',
  figures: [],
  numbers: [
    { value: '246', label: 'violations a CO2-only test misses, in 5,000 synthetic samples' },
    { value: '48.9 ms', label: 'median, from OBD reading to on-chain record' },
  ],
  body: [
    'OBD devices sign live emission telemetry, testing stations check it, and the record goes on-chain. It tracks all five Bharat Stage VI pollutants (CO2, CO, NOx, HC, PM2.5) with EPA MOVES3 physics models.',
    'A four-part fraud ensemble (physics limits, Isolation Forest, temporal consistency, drift detection) reaches F1 0.922 on synthetic attacks. Compliance certificates are ERC-721 tokens.',
  ],
  facts: [
    { term: 'My part', detail: 'Full stack across the whole build' },
    { term: 'Contracts', detail: 'Emission registry, ERC-721 certificate, ERC-20 reward token; 33+ Hardhat tests' },
    { term: 'Status', detail: 'Benchmarked on a local Hardhat network' },
    { term: 'Stack', detail: 'Solidity, Hardhat, OpenZeppelin, FastAPI, Web3.py, scikit-learn' },
  ],
  links: [{ label: 'Source on GitHub', href: 'https://github.com/omkarrr88/Smart_PUC' }],
}

export const v2v: Project = {
  id: 'v2v',
  title: 'V2V Blind Spot Detection',
  short: 'V2V',
  subtitle: 'Vehicles that warn each other before a collision',
  category: 'Research · Vehicle safety',
  date: 'May 2026',
  placement: 'Finalist · Avishkar 2025 · Paper under review',
  hook: 'Every connected car already broadcasts its position, speed and acceleration. I built a collision-risk score from just those fields.',
  figureLayout: 'chart',
  figures: [
    {
      src: '/images/v2v-roc.webp',
      width: 1100,
      height: 960,
      alt: 'ROC curves: the physics model (AUC 0.9869) sits far above XGBoost (0.7725), the time-to-collision baseline (0.8886) and the static box baseline (0.8737).',
    },
  ],
  caption: 'ROC against kinematic near-miss labels: the physics model against XGBoost, time-to-collision and static-box baselines.',
  numbers: [
    { value: '0.987', label: 'AUC against near-miss labels' },
    { value: '0.942', label: 'AUC against 27 collisions SUMO recorded on its own' },
  ],
  body: [
    'A collision-risk index built from the five fields every vehicle already broadcasts in an SAE J2735 safety message: position (x and y), speed, acceleration and deceleration. A multiplicative severity gate stops noisy, low-level signals from raising alarms.',
    'Tested on 146,051 vehicle-pair observations over a 539-edge model of the Atal Bridge road network in Navi Mumbai, in SUMO simulation. Hardware testing is still ahead.',
  ],
  facts: [
    { term: 'My part', detail: 'The messaging between vehicles, the sensor data processing and the risk score' },
    { term: 'Robustness', detail: 'AUC 0.9954 ± 0.0041 across 6 seeds' },
    { term: 'Stack', detail: 'Python, SUMO (TraCI), XGBoost, scikit-learn, Pandas, Streamlit' },
  ],
  links: [{ label: 'Source on GitHub', href: 'https://github.com/omkarrr88/V2V' }],
}

export const featured: readonly Project[] = [chakravyuh, vayunetra, fitmon]
export const moreWork: readonly Project[] = [debugger_, smartPuc, v2v]
/** Every project, in the order Work shows them and Next/Previous walks through them. */
export const projects: readonly Project[] = [...featured, ...moreWork]

export const projectById = (id: string): Project | undefined => projects.find((p) => p.id === id)
