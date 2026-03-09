import { useEffect } from "react";
import { Users, Sparkles, Briefcase, Trophy } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles/Extracurriculars.css";

gsap.registerPlugin(ScrollTrigger);

const activities = [
  {
    Icon: Users,
    title: "Computer Society of India (CSI)",
    role: "Vice Chairperson",
    description:
      "Leading technical initiatives, organizing workshops, coding competitions, and fostering a collaborative learning environment for students interested in technology.",
    colorClass: "extra-icon--blue",
  },
  {
    Icon: Briefcase,
    title: "Training & Placement Cell",
    role: "Deputy Secretary",
    description:
      "Bridging the gap between industry and academia by organizing placement drives, training sessions, and career development workshops for students.",
    colorClass: "extra-icon--green",
  },
  {
    Icon: Sparkles,
    title: "Revive Cultural Fest",
    role: "Hospitality Head",
    description:
      "Managing hospitality operations for the annual cultural festival, coordinating with teams to ensure a memorable experience for all participants and guests.",
    colorClass: "extra-icon--orange",
  },
  {
    Icon: Trophy,
    title: "Avishkar Research Competition 2025",
    role: "Finalist — Mumbai University",
    description:
      "Selected as a finalist in Avishkar 2025, one of the most prestigious inter-collegiate research competitions organised by Mumbai University, competing among hundreds of student teams across disciplines. Presented original research demonstrating analytical thinking and structured technical communication.",
    colorClass: "extra-icon--purple",
  },
];

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

      gsap.fromTo(
        ".extra-card",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".extra-grid",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

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
          <h2 id="extra-heading">Extracurricular Activities</h2>
        </div>

        <div className="extra-grid">
          {activities.map(({ Icon, title, role, description, colorClass }, index) => (
            <div key={index} className="extra-card">
              <div className={`extra-card-icon ${colorClass}`}>
                <Icon size={32} />
              </div>
              <h3 className="extra-card-title">{title}</h3>
              <p className="extra-card-role">{role}</p>
              <p className="extra-card-desc">{description}</p>
            </div>
          ))}
        </div>

        <p className="extra-tagline">
          Beyond academics, I actively participate in various campus organizations and
          events. These experiences have helped me develop strong leadership,
          communication, and organizational skills while contributing to a vibrant
          campus community.
        </p>
    </section>
  );
};

export default Extracurriculars;
