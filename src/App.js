import React from 'react';
import Layout from './components/Layout';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';

function App() {
  return (
    <Layout>
      <Navbar />
      <Home />
      <About />
    </Layout>
  );
}

export default App;