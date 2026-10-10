import { useEffect } from 'react';
import { Header } from './components/Header';
import { setupAnchorLinks, setupLayers } from './components/layers';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { Cars } from './sections/Cars';
import { Transport } from './sections/Transport';
import { Contact } from './sections/Contact';
import { Footer } from './sections/Footer';

export default function App() {
  useEffect(() => {
    const offLinks = setupAnchorLinks();
    const offLayers = setupLayers();
    return () => {
      offLinks();
      offLayers();
    };
  }, []);

  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <About />
        <Cars />
        <Transport />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
