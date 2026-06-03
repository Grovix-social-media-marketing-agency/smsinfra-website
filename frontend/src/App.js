import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Loader from "./loader/Loader";

/* ⭐ ADD THIS */
import Footer from "./components/common/Footer";

/* Main Pages */
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Projects from "./pages/Projects";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";

/* ⭐ AREA PAGES */
import ElectronicCity  from "./pages/areas/ElectronicCity";
import Sarjapur        from "./pages/areas/Sarjapur";
import HsrLayout       from "./pages/areas/HsrLayout";
import BtmLayout       from "./pages/areas/BtmLayout";
import Whitefield      from "./pages/areas/Whitefield";
import Marathahalli    from "./pages/areas/Marathahalli";
import Banashankari    from "./pages/areas/Banashankari";
import Attibele        from "./pages/areas/Attibele";

/* Services Dropdown Pages */
import Earthmovers from "./pages/services/Earthmovers";
import RMC from "./pages/services/RMC";
import SolidBlocks from "./pages/services/SolidBlocks";
import Aggregates from "./pages/services/Aggregates";
import Builders from "./pages/services/Builders";

/* ⭐ IMPORTANT — rename file to MSand.js (avoid spaces) */
import MSand from "./pages/services/MSand";

/* Projects Dropdown Pages */
import Residential from "./pages/projects/Residential";
import Commercial from "./pages/projects/Commercial";
import Sites from "./pages/projects/Sites";
import Machinery from "./pages/projects/Machinery";
import Production from "./pages/projects/Production";

/* 🔥 ADMIN IMPORTS */
import AdminLogin from "./components/admin/AdminLogin";
import AdminDashboard from "./components/admin/AdminDashboard";
import ProtectedRoute from "./components/admin/ProtectedRoute";

/* 🔥 NEW IMPORT (ADDED) */
import ResetPassword from "./components/admin/ResetPassword";

import "./App.css";

/* ⭐ Initialize Google Analytics */
ReactGA.initialize("G-TYZ50WN491");

/* ⭐ SCROLL TO TOP — scrolls to top on every route change */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

/* 🔥 NEW COMPONENT (handles admin visibility) */
function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  /* ⭐ Track every page view */
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);

  return (
    <>
      {/* ⭐ SCROLL TO TOP on every navigation */}
      <ScrollToTop />

      {/* ✅ Hide Navbar in Admin */}
      {!isAdminPage && <Navbar />}

      {/* ✅ Hide floating buttons in Admin */}
      {!isAdminPage && (
        <div className="floating-contact">
          <a
            href="https://wa.me/917676590081?text=Hi%20I%20need%20a%20quote"
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-btn"
          >
            <i className="fab fa-whatsapp"></i>
          </a>

          <a href="tel:+917676590045" className="call-btn">
            <i className="fas fa-phone"></i>
          </a>
        </div>
      )}

      <Routes>

        {/* ⭐ Landing Page */}
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Home />
            </>
          }
        />

        {/* ⭐ Main Pages */}
        <Route path="/about"    element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/careers"  element={<Careers />} />
        <Route path="/contact"  element={<Contact />} />

        {/* ⭐ AREA PAGES */}
        <Route path="/construction-services-electronic-city" element={<ElectronicCity />} />
        <Route path="/construction-services-sarjapur"        element={<Sarjapur />} />
        <Route path="/construction-services-hsr-layout"      element={<HsrLayout />} />
        <Route path="/construction-services-btm-layout"      element={<BtmLayout />} />
        <Route path="/construction-services-whitefield"      element={<Whitefield />} />
        <Route path="/construction-services-marathahalli"    element={<Marathahalli />} />
        <Route path="/construction-services-banashankari"    element={<Banashankari />} />
        <Route path="/construction-services-attibele"        element={<Attibele />} />

        {/* ⭐ Services Dropdown Routes */}
        <Route path="/services/earthmovers"  element={<Earthmovers />} />
        <Route path="/services/rmc"          element={<RMC />} />
        <Route path="/services/solid-blocks" element={<SolidBlocks />} />
        <Route path="/services/aggregates"   element={<Aggregates />} />
        <Route path="/services/msand"        element={<MSand />} />
        <Route path="/services/builders"     element={<Builders />} />

        {/* ⭐ Projects Dropdown Routes */}
        <Route path="/projects/residential" element={<Residential />} />
        <Route path="/projects/commercial"  element={<Commercial />} />
        <Route path="/projects/sites"       element={<Sites />} />
        <Route path="/projects/machinery"   element={<Machinery />} />
        <Route path="/projects/production"  element={<Production />} />

        {/* 🔥 ADMIN ROUTES */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* 🔥 RESET PASSWORD ROUTE */}
        <Route path="/admin/reset/:token" element={<ResetPassword />} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>

      {/* ✅ FOOTER (hidden in admin pages) */}
      {!isAdminPage && <Footer />}

    </>
  );
}

function App() {
  /* ✅ Check sessionStorage — loader only runs once per browser session */
  const alreadyVisited = sessionStorage.getItem("loaderShown");

  const [showLoader, setShowLoader] = useState(!alreadyVisited);
  const [appReady, setAppReady]     = useState(!!alreadyVisited);

  function handleDone() {
    sessionStorage.setItem("loaderShown", "true"); /* ✅ Mark visited */
    setShowLoader(false);
    setAppReady(true);
  }

  return (
    <Router>
      {/* Loader: only shown on first visit per session */}
      {showLoader && <Loader onDone={handleDone} />}

      {/* App: shown immediately if already visited, else after loader */}
      {appReady && <AppContent />}
    </Router>
  );
}

export default App;