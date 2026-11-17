import { profile } from "../data/portfolio";
export default function Footer() {
  return (
    <footer className="site-footer shell">
      <p>© {profile.contentYear} Muhammad Yassa</p>
      <span>New York City</span>
      <a className="text-link" href="#home">
        Back to top <span aria-hidden="true">↑</span>
      </a>
    </footer>
  );
}
