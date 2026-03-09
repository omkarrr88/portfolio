import { useState } from "react";
import { MdArrowOutward } from "react-icons/md";

interface Props {
  image: string;
  alt?: string;
  video?: string;
  link?: string;
}

const WorkImage = (props: Props) => {
  const [isVideo, setIsVideo] = useState(false);
  const [video, setVideo] = useState("");
  const handleMouseEnter = async () => {
    if (props.video) {
      setIsVideo(true);
      const response = await fetch(`src/assets/${props.video}`);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      setVideo(blobUrl);
    }
  };

  return (
    <div className="work-image">
      <a
        className="work-image-in"
        href={props.link}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsVideo(false)}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor={"disable"}
        aria-label={`View ${props.alt || 'project'} — opens in new tab`}
      >
        {props.link && (
          <div className="work-link">
            <MdArrowOutward aria-hidden="true" />
          </div>
        )}
        <img src={props.image} alt={props.alt ? `Screenshot of ${props.alt} project` : 'Project screenshot'} loading="lazy" decoding="async" />
        {isVideo && <video src={video} autoPlay muted playsInline loop aria-hidden="true"></video>}
      </a>
    </div>
  );
};

export default WorkImage;
