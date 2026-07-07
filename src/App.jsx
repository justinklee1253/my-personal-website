import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, MotionConfig } from "framer-motion";
import Nav from "./components/Nav.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Training from "./pages/Training.jsx";
import Contact from "./pages/Contact.jsx";

export default function App() {
  const location = useLocation();
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-canvas">
        <div className="mx-auto flex min-h-screen max-w-col flex-col px-5 sm:px-8">
          <Nav />
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/training" element={<Training />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </AnimatePresence>
          <Footer />
        </div>
      </div>
    </MotionConfig>
  );
}
