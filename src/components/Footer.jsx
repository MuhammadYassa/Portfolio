import { profile } from "../data/portfolio";
export default function Footer() {
  return (
    <footer className="footer shell">
      <span>
        © {profile.contentYear} {profile.name}
      </span>
      <span>A work in progress. In the best way.</span>
      <a href="#home">Back to top ↑</a>
    </footer>
  );
}
