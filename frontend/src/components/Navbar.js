import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./navbar.css";

export default function Navbar() {

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [servicesOpen, setServicesOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);

  // 🔥 NEW: CMS DATA
  const [cms, setCms] = useState(null);
  const [socialLinks, setSocialLinks] = useState(null); // ⭐ ADDED

  const navRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // 🔥 FETCH CMS (SAFE)
  useEffect(() => {
    fetch("http://10.145.35.253:5000/api/cms") // local/dev
      .catch(() => fetch(`${process.env.REACT_APP_API_URL || "http://10.145.35.253:5000"}/api/cms`)) // ⭐ production fallback
      .then(res => res.json())
      .then(data => {
        setCms(data);
        if (data?.navbarSocial) setSocialLinks(data.navbarSocial); // ⭐ reads navbar-specific social links
      })
      .catch(() => {});
  }, []);

  /* SCROLL EFFECT */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* LOCK BODY SCROLL */
  useEffect(() => {
    if (window.innerWidth <= 900) {
      document.body.style.overflow = menuOpen ? "hidden" : "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [menuOpen]);

  /* CLOSE ON OUTSIDE CLICK */
  useEffect(() => {
    const handleClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /* SWIPE TO CLOSE */
  useEffect(() => {
    const handleTouchStart = (e) => {
      touchStartX.current = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e) => {
      touchEndX.current = e.changedTouches[0].screenX;

      if (touchStartX.current - touchEndX.current > 70) {
        closeMenu();
      }
    };

    if (menuOpen) {
      window.addEventListener("touchstart", handleTouchStart);
      window.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
    setServicesOpen(false);
    setProjectsOpen(false);
  };

  const handleNavClick = () => {
    closeMenu();
  };

  const toggleServices = () => {
    if (window.innerWidth <= 900) {
      setServicesOpen(true);
      setProjectsOpen(false);
    } else {
      setServicesOpen(!servicesOpen);
      setProjectsOpen(false);
    }
  };

  const toggleProjects = () => {
    if (window.innerWidth <= 900) {
      setProjectsOpen(true);
      setServicesOpen(false);
    } else {
      setProjectsOpen(!projectsOpen);
      setServicesOpen(false);
    }
  };

  /* 🔥 CTA (CMS READY) */
  const handleQuoteClick = () => {
    navigate("/contact");
    closeMenu();
  };

  return (
    <>
      <div
        className={`menu-overlay ${menuOpen ? "show" : ""}`}
        onClick={closeMenu}
      />

      <nav className={scrolled ? "navbar scrolled" : "navbar"} ref={navRef}>

        <div className="nav-container">

          {/* LOGO */}
          <div className="logo" onClick={() => { navigate("/"); handleNavClick(); }}>
            <img src={cms?.navbar?.logo || "/logo.png"} alt="logo" />
            <span>SMS INFRA</span>
          </div>

          {/* MENU */}
          <ul
            className={`${menuOpen ? "nav-links active" : "nav-links"} ${
              servicesOpen || projectsOpen ? "submenu-active" : ""
            }`}
          >

            {/* HOME */}
            <li>
              <Link to="/" onClick={handleNavClick}
                className={location.pathname === "/" ? "nav-active" : ""}>
                Home
              </Link>
            </li>

            {/* ABOUT */}
            <li>
              <Link to="/about" onClick={handleNavClick}
                className={location.pathname === "/about" ? "nav-active" : ""}>
                About
              </Link>
            </li>

            {/* SERVICES */}
            <li className={`dropdown-parent ${servicesOpen ? "open" : ""}`}>
              <span
                className={location.pathname.includes("/services") ? "nav-active" : ""}
                onClick={toggleServices}
              >
                Services ▾
              </span>

              <ul className={`dropdown ${servicesOpen ? "show" : ""}`}>
                {window.innerWidth <= 900 && (
                  <li className="back-btn" onClick={() => setServicesOpen(false)}>← Back</li>
                )}

                {/* 🔥 ONLY ADDITION */}
                <li>
                  <Link to="/services" onClick={handleNavClick}>
                    All Services
                  </Link>
                </li>

                <li><Link to="/services/earthmovers" onClick={handleNavClick}>Earthmovers</Link></li>
                <li><Link to="/services/rmc" onClick={handleNavClick}>Ready Mix Concrete</Link></li>
                <li><Link to="/services/solid-blocks" onClick={handleNavClick}>Solid Blocks</Link></li>
                <li><Link to="/services/aggregates" onClick={handleNavClick}>Aggregates</Link></li>
                <li><Link to="/services/msand" onClick={handleNavClick}>M Sand & P Sand</Link></li>
                <li><Link to="/services/builders" onClick={handleNavClick}>Builders Projects</Link></li>
              </ul>
            </li>

            {/* PROJECTS */}
            <li className={`dropdown-parent ${projectsOpen ? "open" : ""}`}>
              <span
                className={location.pathname.includes("/projects") ? "nav-active" : ""}
                onClick={toggleProjects}
              >
                Projects ▾
              </span>

              <ul className={`dropdown ${projectsOpen ? "show" : ""}`}>
                {window.innerWidth <= 900 && (
                  <li className="back-btn" onClick={() => setProjectsOpen(false)}>← Back</li>
                )}

                <li><Link to="/projects/residential" onClick={handleNavClick}>Residential</Link></li>
                <li><Link to="/projects/commercial" onClick={handleNavClick}>Commercial</Link></li>
                <li><Link to="/projects/sites" onClick={handleNavClick}>Construction Sites</Link></li>
                <li><Link to="/projects/machinery" onClick={handleNavClick}>Machinery</Link></li>
                <li><Link to="/projects/production" onClick={handleNavClick}>Production Units</Link></li>
              </ul>
            </li>

            {/* CAREERS */}
            <li>
              <Link to="/careers" onClick={handleNavClick}
                className={location.pathname === "/careers" ? "nav-active" : ""}>
                Careers
              </Link>
            </li>

            {/* CONTACT */}
            <li>
              <Link to="/contact" onClick={handleNavClick}
                className={location.pathname === "/contact" ? "nav-active" : ""}>
                Contact
              </Link>
            </li>

            {/* CTA */}
            <li className="nav-quote-section">
              <button className="quote-btn" onClick={handleQuoteClick}>
                {cms?.navbar?.ctaText || "Get Quote"}
              </button>

              {/* ⭐ SOCIAL ICONS — now CMS-driven with brand colors */}
              <div className="nav-social-mobile">

                {/* Instagram — CMS or hardcoded fallback */}
                <a
                  href={socialLinks?.instagram || "https://www.instagram.com/smsinfra"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-instagram" style={{ color: "#E1306C" }}></i>
                </a>

                {/* LinkedIn — CMS or hardcoded fallback */}
                <a
                  href={socialLinks?.linkedin || "https://www.linkedin.com/company/sms-builders-and-infra-projects/"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-linkedin" style={{ color: "#0077b5" }}></i>
                </a>

                {/* ⭐ Facebook — only shown if set in CMS */}
                {socialLinks?.facebook && (
                  <a
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-facebook-f" style={{ color: "#1877f2" }}></i>
                  </a>
                )}

                {/* ⭐ YouTube — only shown if set in CMS */}
                {socialLinks?.youtube && (
                  <a
                    href={socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-youtube" style={{ color: "#ff0000" }}></i>
                  </a>
                )}

              </div>
            </li>

          </ul>

          {/* HAMBURGER */}
          <div
            className={`hamburger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>

        </div>
      </nav>
    </>
  );
}