import { LazyMotion, domAnimation, MotionConfig } from "framer-motion";
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import AboutMe from "./components/AboutMe";
import Experience from "./components/Experience";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation}>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Navigation />
        <main id="main">
          <Hero />
          <Projects />
          <Experience />
          <AboutMe />
          <Contact />
        </main>
        <Footer />
      </LazyMotion>
    </MotionConfig>
  );
}
