import { useRef, useState } from "react";
export default function NavBar() {
  const [open, setOpen] = useState(false);
  const toggle = useRef(null);
  const links = [
    ["Work", "#projects"],
    ["Experience", "#experience"],
    ["About", "#about"],
    ["Say hello ↗", "#contact"],
  ];
  function closeOnEscape(event) {
    if (event.key === "Escape" && open) {
      setOpen(false);
      toggle.current?.focus();
    }
  }
  return (
    <nav
      className="navigation shell"
      aria-label="Main navigation"
      onKeyDown={closeOnEscape}
    >
      <a className="wordmark" href="#home" aria-label="Muhammad Yassa, home">
        my<span className="wordmark-dot">.</span>
        <span className="wordmark-caption">MUHAMMAD YASSA</span>
      </a>
      <button
        ref={toggle}
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="nav-links"
        onClick={() => setOpen(!open)}
      >
        {open ? "Close ×" : "Menu +"}
      </button>
      <div id="nav-links" className={`nav-links ${open ? "is-open" : ""}`}>
        {links.map(([label, href]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}
