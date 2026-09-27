import { useEffect } from "react";
import { Users, Sparkles, Briefcase, Trophy, type LucideIcon } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles/Extracurriculars.css";

gsap.registerPlugin(ScrollTrigger);

interface Activity {
  Icon: LucideIcon;
  title: string;
  role: string;
  description: string;
  colorClass: string;
}

const achievements: Activity[] = [
  {
    Icon: Trophy,
    title: "Meta PyTorch Hackathon",
    role: "7th Place — out of 31,000+ teams",
    description:
      "Built PyTorch Training Run Debugger in the online round, then Chakravyuh, a multi-agent reinforcement learning environment for detecting UPI payment fraud, for the offline finals in Bengaluru.",
    colorClass: "extra-icon--gold",
  },
  {
    Icon: Trophy,
    title: "ET AI Hackathon 2.0",
    role: "Top 10 — out of 15,000+ teams",
    description:
      "Placed in the top 10 at The Economic Times' AI Hackathon with VayuNetra, a multi-agent platform that traces, forecasts, and acts on urban air pollution, presented at the Hyderabad finale.",
    colorClass: "extra-icon--purple",
  },
  {
    Icon: Trophy,
    title: "iQOO Hackathon — Pune City Battle",
    role: "Top 7 — out of 7,000+ teams",
    description:
      "Placed in the top 7 in the HealthTech track of iQOO's phone-first AI hackathon with Fitmon, an Android fitness game where the front camera grades every rep.",
    colorClass: "extra-icon--gold",
  },
  {
    Icon: Trophy,
    title: "Avishkar Research Competition 2025",
    role: "Finalist — Mumbai University",
    description:
      "Reached the finals of Avishkar 2025, Mumbai University's inter-collegiate research competition, presenting the V2V research project against hundreds of teams.",
    colorClass: "extra-icon--purple",
  },
];

const activities: Activity[] = [
  {
    Icon: Users,
    title: "Computer Society of India (CSI)",
    role: "Advisor & Former Vice Chairperson",
    description:
      "Started as Technical Executive and moved up to Vice Chairperson, leading a 40-member team that organised 10+ AI/ML workshops and seminars. Now an Advisor to the new committee.",
    colorClass: "extra-icon--blue",
  },
  {
    Icon: Briefcase,
    title: "Training & Placement Cell",
    role: "Deputy Secretary",
    description:
      "Joined as a Hospitality Committee Member and was promoted to Deputy Secretary, working with 20+ HR professionals and recruiters and running mock interviews to get students placement-ready.",
    colorClass: "extra-icon--green",
  },
  {
    Icon: Sparkles,
    title: "Revive Cultural Fest",
    role: "Hospitality Head",
    description:
      "Worked up from Committee Member to Hospitality HOD over 3 years at Revive, the college's cultural fest, running hospitality for 1,000+ attendees with a team of 50+ volunteers.",
    colorClass: "extra-icon--orange",
  },
];

const renderCard = ({ Icon, title, role, description, colorClass }: Activity) => (
  <div key={title} className="extra-card">
    <div className={`extra-card-icon ${colorClass}`}>
      <Icon size={32} />
    </div>
    <h3 className="extra-card-title">{title}</h3>
    <p className="extra-card-role">{role}</p>
    <p className="extra-card-desc">{description}</p>
  </div>
);

const Extracurriculars = () => {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".extra-title",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".extra-section",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.utils.toArray<HTMLElement>(".extra-grid").forEach((grid) => {
        gsap.fromTo(
          grid.querySelectorAll(".extra-card"),
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: grid,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      gsap.fromTo(
        ".extra-tagline",
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          delay: 0.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".extra-tagline",
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="extra-section section-container" id="extracurriculars" aria-labelledby="extra-heading">
        <div className="extra-title">
          <h2 id="extra-heading">Achievements &amp; Activities</h2>
        </div>

        <div className="extra-grid extra-grid--four">
          {achievements.map(renderCard)}
        </div>

        <div className="extra-grid">
          {activities.map(renderCard)}
        </div>

        <p className="extra-tagline">
          Outside my day job, I build for national hackathons, and through college I
          took on leadership roles in campus organizations and events. Both taught me
          to ship under pressure, lead teams, and communicate ideas clearly.
        </p>
    </section>
  );
};

export default Extracurriculars;
