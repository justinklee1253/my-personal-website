import React from 'react';
import Layout from './components/Layout';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';

function App() {
  return (
    <Layout>
      <Navbar />
      <Home />
      <About />
      <Projects />
      <Contact />
    </Layout>
  );
}

export default App;