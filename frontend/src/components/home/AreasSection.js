import "./AreasSection.css";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

/* ⭐ API BASE URL */
const API = process.env.REACT_APP_API_URL || "https://smsinfra-website.onrender.com/api";

/* ⭐ FALLBACK — exact original hardcoded values */
const DEFAULT_AREAS_DATA = {
  heading:  "OUR SERVICE AREAS",
  title:    "Our Service Areas in Bangalore",
  subtitle: "Based in Chandapura, SMS Infra provides construction and material supply services across a 30 km radius in Bangalore. We actively serve key areas including Electronic City, Sarjapur, HSR Layout, BTM Layout, Whitefield, Marathahalli, Banashankari, Attibele, and surrounding regions.",
  badge:    "📍 Serving within 30km radius from Chandapura, Bangalore",
  areas: [
    { label: "Electronic City",  slug: "electronic-city"  },
    { label: "Sarjapur",         slug: "sarjapur"         },
    { label: "HSR Layout",       slug: "hsr-layout"       },
    { label: "BTM Layout",       slug: "btm-layout"       },
    { label: "Whitefield",       slug: "whitefield"       },
    { label: "Marathahalli",     slug: "marathahalli"     },
    { label: "Banashankari",     slug: "banashankari"     },
    { label: "Attibele",         slug: "attibele"         },
  ],
};

function AreasSection() {

  const sectionRef = useRef(null);
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  /* ⭐ CMS STATE — null means not loaded yet, original JSX renders */
  const [cmsAreas, setCmsAreas] = useState(null);

  /* ⭐ FETCH areasSection from CMS on mount */
  useEffect(() => {
    fetch(`${API}/cms`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.areasSection?.areas?.length > 0) {
          setCmsAreas(data.areasSection);
        }
      })
      .catch((err) => console.warn("AreasSection: CMS unavailable, using defaults.", err));
  }, []);

  /* ⭐ Resolve which data to use — CMS if loaded, else original hardcoded */
  const areasData = cmsAreas || DEFAULT_AREAS_DATA;
  const areas     = areasData.areas;
  const loopAreas = [...areas, ...areas]; // 🔥 infinite effect

  /* 🔥 SCROLL ANIMATION */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          } else {
            entry.target.classList.remove("show");
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

  /* 🔥 AUTO SCROLL + LOOP */
  useEffect(() => {
    const container = scrollRef.current;
    let interval;

    const startScroll = () => {
      interval = setInterval(() => {
        if (!container) return;

        const maxScroll = container.scrollWidth - container.clientWidth;

        if (container.scrollLeft >= maxScroll - 10) {
          container.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          container.scrollBy({ left: 300, behavior: "smooth" });
        }
      }, 3000);
    };

    const stopScroll = () => clearInterval(interval);

    startScroll();

    container.addEventListener("mouseenter", stopScroll);
    container.addEventListener("mouseleave", startScroll);

    return () => {
      stopScroll();
      container.removeEventListener("mouseenter", stopScroll);
      container.removeEventListener("mouseleave", startScroll);
    };
  }, []);

  /* 🔥 DOTS UPDATE */
  const handleScroll = () => {
    const container = scrollRef.current;
    const scrollLeft = container.scrollLeft;
    const width = container.clientWidth;

    const index = Math.round(scrollLeft / width);
    setActiveIndex(index % areas.length);
  };

  /* 🔥 ARROWS */
  const scrollLeftFn = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRightFn = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      className="content-section areas-section"
      style={{
        border: "none",
        boxShadow: "none",
        background: "#0f0f0f",
        marginTop: "-2px",
        paddingTop: "80px"
      }}
    >

      {/* 🔥 SMALL TOP HEADING — from CMS areasSection.heading */}
      <h3 className="areas-main-heading">
        {areasData.heading}
      </h3>

      {/* 🔥 MAIN SEO HEADING — from CMS areasSection.title */}
      <h2 className="areas-section-title">
        {areasData.title}
      </h2>

      {/* 🔥 SEO CONTENT — from CMS areasSection.subtitle */}
      <p className="areas-subtitle">
        {areasData.subtitle}
      </p>

      {/* 🔥 BADGE — from CMS areasSection.badge */}
      <div className="areas-badge">
        {areasData.badge}
      </div>

      {/* 🔥 CAROUSEL WRAPPER */}
      <div className="areas-wrapper">

        <button className="scroll-btn left" onClick={scrollLeftFn}>
          ‹
        </button>

        <div
          className="areas-grid"
          ref={scrollRef}
          onScroll={handleScroll}
        >
          {loopAreas.map((area, i) => (
            <Link
              key={i}
              to={`/construction-services-${area.slug}`}
              className="area-card areas-area-card"
              aria-hidden={i >= areas.length ? "true" : undefined}
              tabIndex={i >= areas.length ? -1 : undefined}
            >
              <FaMapMarkerAlt className="area-icon areas-area-icon" />
              Construction Services in {area.label}
            </Link>
          ))}
        </div>

        <button className="scroll-btn right" onClick={scrollRightFn}>
          ›
        </button>

      </div>

      {/* 🔥 DOTS */}
      <div className="dots">
        {areas.map((_, i) => (
          <span
            key={i}
            className={i === activeIndex ? "dot active" : "dot"}
          />
        ))}
      </div>

    </section>
  );
}

export default AreasSection;
