import { watchmateMedia } from "../data/projectMedia";
import Reveal from "./Reveal";

export default function WatchMatePreview({ hero = false }) {
  const { desktop, mobile } = watchmateMedia;
  const imageLoading = hero ? "eager" : "lazy";
  const Frame = hero ? "div" : Reveal;
  return (
    <figure
      className={`application-preview ${hero ? "preview-hero" : "preview-feature"}`}
    >
      <Frame className="preview-devices">
        <a
          className="preview-desktop"
          href={hero ? "#watchmate" : "https://mywatchmate.us"}
          aria-label={
            hero
              ? "See the WatchMate project"
              : "Open WatchMate live application"
          }
          {...(hero ? {} : { target: "_blank", rel: "noopener noreferrer" })}
        >
          <div className="window-bar">
            <span className="window-controls" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span>mywatchmate.us</span>
            <span aria-hidden="true">↗</span>
          </div>
          <img
            src={desktop.src}
            width={desktop.width}
            height={desktop.height}
            alt={desktop.alt}
            loading={imageLoading}
            fetchPriority={hero ? "high" : "auto"}
            decoding="async"
          />
        </a>
        <div className="preview-phone">
          <div className="phone-speaker" aria-hidden="true" />
          <img
            src={mobile.src}
            width={mobile.width}
            height={mobile.height}
            alt={mobile.alt}
            loading={imageLoading}
            decoding="async"
          />
        </div>
      </Frame>
      <figcaption>
        {hero ? (
          <>
            <strong>WatchMate</strong>
            <span>
              <span className="status-dot" />
              Live application
            </span>
          </>
        ) : (
          <>
            <span>Public home page</span>
            <span>Desktop & mobile captures</span>
          </>
        )}
      </figcaption>
    </figure>
  );
}
