import type { NextPage } from 'next';
import Nav from 'src/components/Nav';
import Hero from 'src/components/Hero';
import Footer from 'src/components/Footer';
import Section from 'src/components/Section';

const Home: NextPage = () => {
  return (
    <>
      <Nav />
      <Hero />
      <Section />
      <Footer />
    </>
  );
};

export default Home;
