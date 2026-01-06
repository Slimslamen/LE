import About from "../components/About";
import FAQ from "../components/FAQ";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Services from "../components/Services";
import Testimonials from "../components/Testimonials";
import Contact from "../components/Contact";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";

function App() {
  return (
    <div>
      <link rel="canonical" href="https://lavinelektriska.se" />
      <Header />
      <Reveal>
        <Hero />
      </Reveal>
      <Reveal>
        <Services />
      </Reveal>
      <Reveal>
        <About />
      </Reveal>
      <Reveal>
        <Testimonials />
      </Reveal>
      <Reveal>
        <FAQ />
      </Reveal>
      <Reveal>
        <Contact showContent={false} />
      </Reveal>
      <Reveal>
        <CTA />
      </Reveal>
      <Footer />
    </div>
  );
}

export default App;
