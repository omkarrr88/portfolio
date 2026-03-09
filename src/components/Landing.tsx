import { PropsWithChildren } from "react";
import "./styles/Landing.css";
import { config } from "../config";

const Landing = ({ children }: PropsWithChildren) => {
  return (
    <>
      <section className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Hello! I am</h2>
            <h1>
              OMKAR
              {" "}
              <br />
              <span>KADAM</span>
            </h1>
          </div>
          <div className="landing-info">
            <h3>An</h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">ML Engineer</div>
            </h2>
            <h2>
              <div className="landing-h2-info">Full-Stack Dev</div>
            </h2>
          </div>
          <div className="mobile-photo">
            <img src="/images/mypicnbg.webp" alt="Omkar Kadam — Full Stack Developer and ML Engineer" loading="eager" />
          </div>
        </div>
        {children}
      </section>
    </>
  );
};

export default Landing;