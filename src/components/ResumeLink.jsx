import { profile } from "../data/portfolio";
export default function ResumeLink() {
  return profile.resume ? (
    <a
      className="button button-outline"
      href={profile.resume}
      download="Muhammad-Yassa-Resume.pdf"
      target="_blank"
      rel="noopener noreferrer"
    >
      Download Resume <span aria-hidden="true">↓</span>
    </a>
  ) : (
    <a
      className="button button-outline"
      href={`mailto:${profile.email}?subject=Resume%20request`}
    >
      Request my resume <span aria-hidden="true">↗</span>
    </a>
  );
}
