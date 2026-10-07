import { Header } from './components/Header';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { Cars } from './sections/Cars';
import { Contact } from './sections/Contact';
import { Footer } from './sections/Footer';

export default function App() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <About />
        <Cars />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
