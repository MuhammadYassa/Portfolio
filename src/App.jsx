import AboutMe from "./components/AboutMe";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { BrowserRouter } from "react-router-dom";


function App() {
  return (
    <BrowserRouter>
      <main className = "flex flex-col bg-[#0d0a20] justify-center align-middle text-center">
        <Header></Header>
        <AboutMe></AboutMe>
        <Projects></Projects>
        <Contact></Contact>
        <Footer></Footer>
      </main>
    </BrowserRouter>
  );
}

export default App;
