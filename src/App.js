import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Home />
      {/* Your other components will go here */}
    </div>
  );
}

export default App;