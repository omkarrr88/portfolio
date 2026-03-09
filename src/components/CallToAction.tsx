import { config } from "../config";
import "./styles/CallToAction.css";

const CallToAction = () => {
  return (
    <section className="cta-section" aria-label="Call to action">
      <h3 className="cta-headline">Let's build something great together.</h3>
      <p className="cta-subtext">I'm actively looking for full-time or freelance opportunities.</p>
      <div className="cta-buttons">
        <a
          href={config.contact.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="cta-btn cta-btn-hire"
          data-cursor="disable"
          aria-label="Hire me — opens LinkedIn profile"
        >
          Hire Me →
        </a>
      </div>
    </section>
  );
};

export default CallToAction;