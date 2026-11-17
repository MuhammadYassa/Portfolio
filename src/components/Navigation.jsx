import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { profile } from "../data/portfolio";
const links = [
  ["Projects", "projects"],
  ["About", "aboutme"],
  ["Contact", "contact"],
];
export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const toggle = useRef(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-15% 0px -60% 0px" },
    );
    for (const [, id] of links) observer.observe(document.getElementById(id));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    function close(event) {
      if (event.key === "Escape" && open) {
        setOpen(false);
        toggle.current?.focus();
      }
    }
    function resize() {
      if (window.innerWidth > 700) setOpen(false);
    }
    document.addEventListener("keydown", close);
    window.addEventListener("resize", resize);
    return () => {
      document.removeEventListener("keydown", close);
      window.removeEventListener("resize", resize);
    };
  }, [open]);
  const items = links.map(([label, id]) => (
    <a
      key={id}
      href={`#${id}`}
      aria-current={active === id ? "location" : undefined}
      onClick={() => setOpen(false)}
    >
      {label}
      <span className="nav-dot" aria-hidden="true" />
    </a>
  ));
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <a className="wordmark" href="#home" aria-label="Muhammad Yassa, home">
          MY<span aria-hidden="true">.</span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {items}
        </nav>
        <a
          className="header-resume text-link"
          href={profile.resume}
          download="Muhammad-Yassa-Resume.pdf"
        >
          Resume <span aria-hidden="true">↗</span>
        </a>
        <button
          ref={toggle}
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen(!open)}
        >
          <span>{open ? "Close" : "Menu"}</span>
          <span
            className={`menu-icon ${open ? "is-open" : ""}`}
            aria-hidden="true"
          >
            <i />
            <i />
          </span>
        </button>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <m.nav
            id="mobile-navigation"
            className="mobile-nav"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: reduced ? 0 : -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduced ? 0 : -8 }}
            transition={{ duration: reduced ? 0 : 0.18 }}
          >
            {items}
            <a href={profile.resume} download="Muhammad-Yassa-Resume.pdf">
              Resume <span aria-hidden="true">↗</span>
            </a>
          </m.nav>
        )}
      </AnimatePresence>
      <noscript>
        <nav className="no-js-nav" aria-label="Navigation without JavaScript">
          {items}
        </nav>
      </noscript>
    </header>
  );
}
