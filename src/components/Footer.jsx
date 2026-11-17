import { profile } from "../data/portfolio";
export default function Footer() {
  return (
    <footer className="footer shell">
      <span>
        © {profile.contentYear} {profile.name}
      </span>
      <a href="#home">Back to top ↑</a>
    </footer>
  );
}
