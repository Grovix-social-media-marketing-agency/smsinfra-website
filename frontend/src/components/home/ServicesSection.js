import "./ServicesSection.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

/* ⭐ PROFESSIONAL ICONS */
import {
  FaTruck,
  FaCubes,
  FaIndustry,
  FaCog,
  FaTools,
  FaBuilding,
  FaHome, FaWrench, FaBolt, FaLeaf, FaWater, FaFire,
  FaStar, FaHammer, FaCity, FaMountain, FaRoad, FaWarehouse,
} from "react-icons/fa";

/* ⭐ API BASE URL */
const API = process.env.REACT_APP_API_URL || "https://smsinfra-website.onrender.com/api";

/* ⭐ ICON MAP — resolves DB string name to React Icon component */
const ICON_MAP = {
  FaTruck, FaCubes, FaIndustry, FaCog, FaTools, FaBuilding,
  FaHome, FaWrench, FaBolt, FaLeaf, FaWater, FaFire,
  FaStar, FaHammer, FaCity, FaMountain, FaRoad, FaWarehouse,
};

function ServicesSection() {

  const navigate = useNavigate();
  const sectionRef = useRef(null);

  /* ⭐ CMS STATE — null means not loaded yet, so original JSX renders */
  const [cmsServices, setCmsServices] = useState(null);

  /* ⭐ FETCH serviceCards from CMS — only overrides if DB has data */
  useEffect(() => {
    fetch(`${API}/cms`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.serviceCards?.cards?.length > 0) {
          setCmsServices(data.serviceCards);
        }
      })
      .catch((err) => console.warn("ServicesSection: CMS unavailable, using defaults.", err));
  }, []);

  /* ⭐ PREMIUM SCROLL ANIMATION (UPDATED) */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("services-show");
          } else {
            entry.target.classList.remove("services-show"); // 🔥 allows re-animation
          }
        });
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  /* ⭐ If CMS data loaded — render dynamic cards from DB */
  if (cmsServices) {
    return (
      <section
        ref={sectionRef}
        className="content-section services-section services-fade"
        style={{ position: "relative", zIndex: 1 }}
      >
        <h3 className="services-main-heading">{cmsServices.heading}</h3>
        <h2 className="services-title">{cmsServices.title}</h2>
        <p className="services-subtitle">{cmsServices.subtitle}</p>
        <div className="services-grid">
          {cmsServices.cards.map((card, i) => {
            const Icon = ICON_MAP[card.icon] || FaTools;
            return (
              <div key={i} className="services-card" onClick={() => navigate(card.link)}>
                <Icon className="services-icon" />
                <span>{card.name}</span>
                <button className="know-more-btn" onClick={(e) => { e.stopPropagation(); navigate(card.link); }}>
                  Know More →
                </button>
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  /* ✅ ORIGINAL JSX — shown while loading or if CMS unavailable (unchanged) */
  return (
    <section
      ref={sectionRef}
      className="content-section services-section services-fade"
      style={{
        position: "relative",
        zIndex: 1
      }}
    >

      {/* 🔥 MAIN TITLE */}
      <h3 className="services-main-heading">
        OUR SERVICES
      </h3>

      {/* 🔥 SEO HEADING */}
      <h2 className="services-title">
        Construction & Concrete Product Services in Bangalore
      </h2>

      {/* 🔥 SEO CONTENT */}
      <p className="services-subtitle">
        At SMS Infra, we offer a wide range of construction and material supply
        services in Bangalore, ensuring quality, reliability, and timely delivery
        for every residential, commercial, and infrastructure project.
      </p>

      <div className="services-grid">

        {/* ⭐ RMC */}
        <div
          className="services-card"
          onClick={() => navigate("/services/rmc")}
        >
          <FaTruck className="services-icon" />
          <span>Ready Mix Concrete (RMC)</span>

          <button
            className="know-more-btn"
            onClick={(e) => {
              e.stopPropagation();
              navigate("/services/rmc");
            }}
          >
            Know More →
          </button>
        </div>

        {/* ⭐ MSAND */}
        <div
          className="services-card"
          onClick={() => navigate("/services/msand")}
        >
          <FaCubes className="services-icon" />
          <span>M Sand & P Sand</span>

          <button
            className="know-more-btn"
            onClick={(e) => {
              e.stopPropagation();
              navigate("/services/msand");
            }}
          >
            Know More →
          </button>
        </div>

        {/* ⭐ BLOCKS */}
        <div
          className="services-card"
          onClick={() => navigate("/services/solid-blocks")}
        >
          <FaIndustry className="services-icon" />
          <span>Concrete Blocks</span>

          <button
            className="know-more-btn"
            onClick={(e) => {
              e.stopPropagation();
              navigate("/services/solid-blocks");
            }}
          >
            Know More →
          </button>
        </div>

        {/* ⭐ AGGREGATES */}
        <div
          className="services-card"
          onClick={() => navigate("/services/aggregates")}
        >
          <FaCog className="services-icon" />
          <span>Aggregates</span>

          <button
            className="know-more-btn"
            onClick={(e) => {
              e.stopPropagation();
              navigate("/services/aggregates");
            }}
          >
            Know More →
          </button>
        </div>

        {/* ⭐ EARTHMOVERS */}
        <div
          className="services-card"
          onClick={() => navigate("/services/earthmovers")}
        >
          <FaTools className="services-icon" />
          <span>Earthmovers & Excavation</span>

          <button
            className="know-more-btn"
            onClick={(e) => {
              e.stopPropagation();
              navigate("/services/earthmovers");
            }}
          >
            Know More →
          </button>
        </div>

        {/* ⭐ BUILDERS */}
        <div
          className="services-card"
          onClick={() => navigate("/services/builders")}
        >
          <FaBuilding className="services-icon" />
          <span>Infrastructure / Builders Projects</span>

          <button
            className="know-more-btn"
            onClick={(e) => {
              e.stopPropagation();
              navigate("/services/builders");
            }}
          >
            Know More →
          </button>
        </div>

      </div>

    </section>
  );
}

export default ServicesSection;
