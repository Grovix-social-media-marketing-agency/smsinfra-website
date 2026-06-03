import "./home.css";
import { useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet-async";

/* ✅ IMPORTS */
import ServicesSection from "../components/home/ServicesSection";
import AreasSection from "../components/home/AreasSection";

/* ✅ NEW IMPORTS (CORRECT PATHS) */
import Gallery from "../components/home/Gallery";
import WhyChoose from "../components/home/WhyChoose";

/* ✅ ADD THIS IMPORT */
import Testimonials from "../components/home/Testimonials";

/* ✅ ✅ ADDED FAQ IMPORT (ONLY ADDITION) */
import FAQ from "../components/home/FAQ";

/* ✅ ANNOUNCEMENT BANNER */
import AnnouncementBanner from "../components/common/AnnouncementBanner";

/* ⭐ API BASE URL */
const API = process.env.REACT_APP_API_URL || "http://10.145.35.253:5000/api";

/* ⭐ LOCAL FALLBACK LOGOS — always present as the base set */
const LOCAL_LOGOS = [
  { src: `${process.env.PUBLIC_URL}/client1.png`,  alt: "client-1"  },
  { src: `${process.env.PUBLIC_URL}/client2.png`,  alt: "client-2"  },
  { src: `${process.env.PUBLIC_URL}/client3.png`,  alt: "client-3"  },
  { src: `${process.env.PUBLIC_URL}/client4.png`,  alt: "client-4"  },
  { src: `${process.env.PUBLIC_URL}/client5.png`,  alt: "client-5"  },
  { src: `${process.env.PUBLIC_URL}/client6.png`,  alt: "client-6"  },
  { src: `${process.env.PUBLIC_URL}/client7.png`,  alt: "client-7"  },
  { src: `${process.env.PUBLIC_URL}/client8.png`,  alt: "client-8"  },
  { src: `${process.env.PUBLIC_URL}/client9.png`,  alt: "client-9"  },
  { src: `${process.env.PUBLIC_URL}/client10.png`, alt: "client-10" },
  { src: `${process.env.PUBLIC_URL}/client11.png`, alt: "client-11" },
  { src: `${process.env.PUBLIC_URL}/client12.png`, alt: "client-12" },
];

function Home() {

  const [years, setYears] = useState(0);
  const [projects, setProjects] = useState(0);
  const [clients, setClients] = useState(0);

  const statsRef = useRef(null);
  const hasAnimated = useRef(false);

  const [visible, setVisible] = useState(false);
  const overviewRef = useRef(null);

  /* ⭐ OVERVIEW STATE — fetched from CMS, falls back to original hardcoded values */
  const [overview, setOverview] = useState({
    title: "Top Construction Company in Bangalore",
    tagline1: "Turning Dreams Into Reality",
    tagline2: "Integrated Infrastructure & Construction Solutions",
    description: `SMS Infra is a leading construction and infrastructure company based in Chandapura, Bangalore,
            with over 30 years of experience in delivering high-quality engineering and material solutions.

            We specialize in earthmoving services, ready mix concrete (RMC), concrete block manufacturing,
            aggregates, M Sand, and P Sand supply for residential, commercial, and large-scale infrastructure projects across Bangalore.

            Operating within a 30 km service radius from Chandapura, we serve key areas including Electronic City, Sarjapur,
            HSR Layout, BTM Layout, Whitefield, and Marathahalli.

            With advanced machinery, in-house production units, and a strong focus on quality, safety, and timely execution,
            SMS Infra is a trusted partner for builders, developers, and contractors across Bangalore.`,
    yearsTarget: 30,
    projectsTarget: 500,
    clientsTarget: 100,
  });

  /* ⭐ DB LOGOS STATE — fetched from CMS, appended ON TOP of local logos */
  const [dbLogos, setDbLogos] = useState([]);

  /* ⭐ FETCH CMS — single call, reads overview + clientLogos */
  useEffect(() => {
    fetch(`${API}/cms`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.overview?.title) setOverview(data.overview);
        if (Array.isArray(data?.clientLogos) && data.clientLogos.length > 0) setDbLogos(data.clientLogos);
      })
      .catch((err) => console.warn("CMS API unavailable, using defaults.", err));
  }, []);

  /* ⭐ FIXED: always keep all 12 local logos + append any DB-uploaded logos after them */
  const clientLogos = [
    ...LOCAL_LOGOS,
    ...dbLogos.map((l, i) => ({ src: l.url, alt: `client-db-${i + 1}` })),
  ];

  const reversedLogos  = [...clientLogos].reverse();
  const scrollingLogos = [...reversedLogos, ...reversedLogos];

  /* ⭐ TAGLINE WORDS — driven by CMS value */
  const tagline = overview.tagline2 || "Integrated Infrastructure & Construction Solutions";
  const words   = tagline.split(" ");

  useEffect(() => {

    const targetYears    = overview.yearsTarget    ?? 30;
    const targetProjects = overview.projectsTarget ?? 500;
    const targetClients  = overview.clientsTarget  ?? 100;

    const observer = new IntersectionObserver(
      (entries) => {

        const isVisible = entries[0].isIntersecting;
        setVisible(isVisible);

        if (isVisible && !hasAnimated.current) {

          hasAnimated.current = true;

          let y = 0, p = 0, c = 0;

          const interval = setInterval(() => {

            if (y < targetYears)    { y++;     setYears(y);    }
            if (p < targetProjects) { p += 10; setProjects(p); }
            if (c < targetClients)  { c += 2;  setClients(c);  }

            if (y >= targetYears && p >= targetProjects && c >= targetClients) {
              setYears(targetYears);
              setProjects(targetProjects);
              setClients(targetClients);
              clearInterval(interval);
            }

          }, 30);

        }

      },
      { threshold: 0.35 }
    );

    if (statsRef.current)    observer.observe(statsRef.current);
    if (overviewRef.current) observer.observe(overviewRef.current);

    return () => observer.disconnect();

  }, [overview.yearsTarget, overview.projectsTarget, overview.clientsTarget]);

  return (
    <div className="home-wrapper">

      {/* ⭐ ANNOUNCEMENT BANNER */}
      <AnnouncementBanner />

      {/* ✅ SEO */}
      <Helmet>
        <title>SMS Infra | {overview.title}</title>

        <meta
          name="description"
          content="SMS Infra is a leading construction company in Bangalore based in Chandapura with 30+ years experience in RMC, M Sand, P Sand, aggregates, and earthmoving services across Bangalore."
        />

        <meta
          name="keywords"
          content="construction company Bangalore, RMC supplier Bangalore, M Sand supplier Bangalore, excavation services Bangalore, concrete blocks Bangalore"
        />

        <meta property="og:title"       content={`SMS Infra | ${overview.title}`} />
        <meta property="og:description" content="30+ years of construction and infrastructure services in Bangalore." />
        <meta property="og:image"       content="/bg.png" />
        <meta property="og:type"        content="website" />

        <link rel="canonical" href="https://yourdomain.com/" />
      </Helmet>

      {/* ⭐ OVERVIEW */}
      <section
        ref={overviewRef}
        className={`overview ${visible ? "show" : ""}`}
        style={{
          background: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.55)), url("/bg.png")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >

        <div className="overview-container">

          {/* ⭐ from CMS overview.title */}
          <h1 className="overview-title fade-item delay-2">
            {overview.title}
          </h1>

          {/* ⭐ from CMS overview.tagline1 */}
          <h2 className="overview-tagline">
            {overview.tagline1}
          </h2>

          {/* ⭐ animated word-by-word, from CMS overview.tagline2 */}
          <h3 className="overview-tagline">
            {words.map((word, i) => (
              <span
                key={i}
                className={`word ${visible ? "show-word" : ""}`}
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                {word}&nbsp;
              </span>
            ))}
          </h3>

          {/* ⭐ from CMS overview.description */}
          <p className="overview-text fade-item delay-3">
            {overview.description}
          </p>

          {/* ⭐ STATS — from CMS overview.yearsTarget / projectsTarget / clientsTarget */}
          <div className="overview-stats" ref={statsRef}>

            <div className="stat-card fade-item delay-4">
              <h3>{years}+</h3>
              <span>Years of Excellence in Construction & Infrastructure</span>
            </div>

            <div className="stat-card fade-item delay-5">
              <h3>{projects}+</h3>
              <span>Projects Successfully Delivered Across Bangalore</span>
            </div>

            <div className="stat-card fade-item delay-6">
              <h3>{clients}+</h3>
              <span>Trusted Clients & Ongoing Partnerships</span>
            </div>

          </div>

        </div>

      </section>

      {/* ✅ WRAPPED SECTIONS */}
      <div className="home-sections">

        <ServicesSection />

        {/* ✅ TRUSTED CLIENTS — local logos always shown + DB uploaded logos appended */}
        <section className="serviceHub-clients">
          <h2>Trusted By Leading Clients</h2>
          <div className="logos-wrapper">
            <div className="client-logos">
              {scrollingLogos.map((logo, index) => (
                <div key={index} className="logo-box">
                  <img
                    src={typeof logo === "string" ? logo : logo.src}
                    alt={typeof logo === "string" ? `client-${index}` : logo.alt}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <AreasSection />

        <Gallery />

        <WhyChoose />

        {/* ✅ ADDED TESTIMONIALS HERE */}
        <Testimonials />

        {/* ✅ ✅ FAQ ADDED (ONLY ADDITION) */}
        <FAQ />

      </div>

    </div>
  );
}

export default Home;