import { useEffect } from 'react';
import { Header } from './components/Header';
import { setupAnchorLinks, setupLayers } from './components/layers';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { Cars } from './sections/Cars';
import { Promos } from './sections/Promos';
import { Transport } from './sections/Transport';
import { Faq } from './sections/Faq';
import { Contact } from './sections/Contact';
import { Footer } from './sections/Footer';
import { CarPage } from './pages/CarPage';
import { TransportPage } from './pages/TransportPage';
import { usePage } from './page';
import { carFor } from './routes';
import { scrollToSection } from './components/layers';

export default function App() {
  const page = usePage();
  const car = carFor(page);

  useEffect(() => {
    const offLinks = setupAnchorLinks();
    const offLayers = setupLayers();
    // Al llegar desde otra página con #sección, se desplaza a ella ya pintada.
    const id = window.location.hash.slice(1);
    if (id) requestAnimationFrame(() => scrollToSection(id));
    return () => {
      offLinks();
      offLayers();
    };
  }, []);

  return (
    <>
      <Header />
      <main id="main">
        {car ? (
          <CarPage car={car} />
        ) : page === 'transport' ? (
          <TransportPage />
        ) : (
          <>
            <Hero />
            <About />
            <Cars />
            <Promos />
            <Transport />
            <Faq />
            <Contact />
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
