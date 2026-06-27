import { useEffect } from "react";
import { GraduationCap, Calendar, MapPin } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles/Education.css";

gsap.registerPlugin(ScrollTrigger);

const education = [
  {
    degree: "Bachelor of Engineering in Information Technology",
    institution: "Terna Engineering College",
    university: "Mumbai University",
    location: "Navi Mumbai, Maharashtra",
    period: "November 2022 - June 2026",
    description:
      "Recently graduated with a focus on software engineering, machine learning, and web technologies. Held active leadership roles across technical societies and campus organisations throughout the program.",
  },
  {
    degree: "Higher Secondary Education (CBSE 12th Science)",
    institution: "D.A.V. Public School",
    location: "Airoli, Navi Mumbai",
    period: "June 2020 - July 2022",
    description:
      "Completed higher secondary education with a focus on science and mathematics.",
  },
  {
    degree: "Secondary Education (CBSE 10th)",
    institution: "D.A.V. Public School",
    location: "Airoli, Navi Mumbai",
    period: "May 2020",
    description: "Completed secondary education with strong academic performance.",
  },
];

const Education = () => {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".education-title",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".education-section",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        ".education-card",
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".education-list",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="education-section section-container" id="education" aria-labelledby="education-heading">
        <div className="education-title">
          <h2 id="education-heading">Education</h2>
        </div>

        <div className="education-list">
          {education.map((item, index) => (
            <div key={index} className="education-card">
              <div className="education-card-icon">
                <GraduationCap size={28} />
              </div>
              <div className="education-card-content">
                <h3 className="education-degree">{item.degree}</h3>
                <div className="education-meta">
                  <p className="education-institution">{item.institution}</p>
                  {item.university && (
                    <p className="education-university">{item.university}</p>
                  )}
                  <div className="education-details">
                    <span className="education-detail">
                      <MapPin size={14} />
                      {item.location}
                    </span>
                    <span className="education-detail">
                      <Calendar size={14} />
                      {item.period}
                    </span>
                  </div>
                </div>
                <p className="education-description">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
    </section>
  );
};

export default Education;
