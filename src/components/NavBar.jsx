import { useEffect, useRef, useState } from "react";
export default function NavBar() {
  const [open, setOpen] = useState(false);
  const toggle = useRef(null);
  const [active, setActive] = useState(null);
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
      },
      { rootMargin: "-10% 0px -60% 0px", threshold: 0 },
    );
    for (const id of ["home", "projects", "experience", "about", "contact"]) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    }
    return () => observer.disconnect();
  }, []);
  const links = [
    ["Projects", "#projects"],
    ["Experience", "#experience"],
    ["About", "#about"],
    ["Contact", "#contact"],
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
          <a
            key={href}
            href={href}
            aria-current={active === href ? "location" : undefined}
            onClick={() => {
              setOpen(false);
              setActive(href);
            }}
          >
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}
