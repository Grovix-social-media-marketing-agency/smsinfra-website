import "./gallery.css";
import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";

/* ⭐ API BASE URL */
const API = process.env.REACT_APP_API_URL || "http://10.145.35.253:5000/api";

function Gallery() {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const isMobile = window.innerWidth < 768; // 🔥 detect mobile

  const getRoute = (category) => {
    switch (category) {
      case "residential":
        return "/projects/residential";
      case "commercial":
        return "/projects/commercial";
      case "construction":
        return "/projects/sites";
      case "machinery":
        return "/projects/machinery";
      case "materials":
        return "/projects/production";
      default:
        return "/projects";
    }
  };

  const staticProjects = useMemo(() => [
    { id: "res-1", title: "Residential Projects", category: "residential", image: "/residential-1.jpg" },
    { id: "com-1", title: "Commercial", category: "commercial", image: "/commercial.png" },
    { id: "con-1", title: "Construction Sites", category: "construction", image: "/construction Site-1.jpg" },
    { id: "con-2", title: "Construction Sites", category: "construction", image: "/construction Site-2.jpg" },
    { id: "con-3", title: "Construction Sites", category: "construction", image: "/construction Site-3.jpg" },
    { id: "con-4", title: "Construction Sites", category: "construction", image: "/construction Site-4.jpg" },
    { id: "mach-1", title: "Machinery & Infrastructure", category: "machinery", image: "/Machinery1.jpg" },
    { id: "mach-2", title: "Machinery & Infrastructure", category: "machinery", image: "/Machinery-2.jpg" },
    { id: "mach-3", title: "Machinery & Infrastructure", category: "machinery", image: "/Machinery-3.png" },
    { id: "mach-4", title: "Machinery & Infrastructure", category: "machinery", image: "/Machinery-5.jpg" },
    { id: "mach-5", title: "Machinery & Infrastructure", category: "machinery", image: "/Machinery-6.png" },
    { id: "mat-1", title: "Material Production Units", category: "materials", image: "/Production Units-1.png" },
    { id: "mat-2", title: "Material Production Units", category: "materials", image: "/Production Units-2.jpg" },
    { id: "mat-3", title: "Material Production Units", category: "materials", image: "/Production Units-3.JPG" },
    { id: "mat-4", title: "Material Production Units", category: "materials", image: "/Production Units-4.png" },
    { id: "mat-5", title: "Material Production Units", category: "materials", image: "/Production Units-5.JPG" },
    { id: "mat-6", title: "Material Production Units", category: "materials", image: "/Production Units-6.png" },
    { id: "mat-7", title: "Material Production Units", category: "materials", image: "/Production Units-7.png" },
  ], []);

  const [projects, setProjects] = useState(staticProjects);
  const [selected, setSelected] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  /* ⭐ CMS STATE — title and subtitle, fall back to original hardcoded values */
  const [galleryTitle, setGalleryTitle] = useState(null);
  const [gallerySubtitle, setGallerySubtitle] = useState(null);

  useEffect(() => {
    // ✅ ORIGINAL fetch — unchanged
    fetch("http://localhost:5000/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (data?.length) {
          setProjects((prev) => {
            // Avoid duplicating /api/projects entries on top of what CMS already set
            const base = prev.filter((p) => !p._id); // keep static/cms cards
            return [...base, ...data];
          });
        }
      })
      .catch(() => {});

    // ⭐ Fetch CMS gallery — title, subtitle, and ALL images (static + uploaded)
    fetch(`${API}/cms`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.gallery?.title) setGalleryTitle(data.gallery.title);
        if (data?.gallery?.subtitle) setGallerySubtitle(data.gallery.subtitle);

        // ⭐ Always keep all 18 staticProjects as base.
        // Append only non-static (Cloudinary uploaded) images from DB on top.
        if (Array.isArray(data?.gallery?.images) && data.gallery.images.length > 0) {
          const uploadedCards = data.gallery.images
            .filter((img) => !img.isStatic)
            .map((img, i) => ({
              id: `cms-gallery-${img.publicId || i}`,
              title: img.caption || "Gallery",
              category: "gallery",
              image: img.url,
            }));
          // staticProjects always shown; uploaded images appended after
          setProjects([...staticProjects, ...uploadedCards]);
        }
        // else: staticProjects stays as default (already set as initial state)
      })
      .catch(() => {});
  }, [staticProjects]); // eslint-disable-line react-hooks/exhaustive-deps

  // ⭐ Map static publicId prefix → original category for correct navigation
  // eslint-disable-next-line no-unused-vars
  const getStaticCategory = (publicId) => {
    if (!publicId) return "gallery";
    if (publicId.startsWith("static-res")) return "residential";
    if (publicId.startsWith("static-com")) return "commercial";
    if (publicId.startsWith("static-con")) return "construction";
    if (publicId.startsWith("static-mach")) return "machinery";
    if (publicId.startsWith("static-mat")) return "materials";
    return "gallery";
  };

  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % projects.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [projects.length, paused]);

  // 3D EFFECT (unchanged)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rafId;

    const handleMove = (e) => {
      cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        const rect = container.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 30;
        const rotateY = (centerX - x) / 30;

        const activeCard = container.querySelector(".voyager-card.active");

        if (activeCard) {
          activeCard.style.transform =
            activeCard.style.transform
              .replace(/rotateX\(.*?\)/, "")
              .replace(/rotateY\(.*?\)/, "") +
            ` rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }
      });
    };

    const reset = () => {
      const activeCard = container.querySelector(".voyager-card.active");
      if (!activeCard) return;

      activeCard.style.transform = activeCard.style.transform
        .replace(/rotateX\(.*?\)/, "")
        .replace(/rotateY\(.*?\)/, "");
    };

    container.addEventListener("mousemove", handleMove);
    container.addEventListener("mouseleave", reset);

    return () => {
      cancelAnimationFrame(rafId);
      container.removeEventListener("mousemove", handleMove);
      container.removeEventListener("mouseleave", reset);
    };
  }, []);

  const next = () =>
    setCurrentIndex((prev) => (prev + 1) % projects.length);

  const prev = () =>
    setCurrentIndex((prev) =>
      prev === 0 ? projects.length - 1 : prev - 1
    );

  return (
    <section
      className="gallery-section reveal"
      ref={containerRef}
      style={{
        background: `linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.92)), url(${process.env.PUBLIC_URL + "/gallery-bg.png"})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="gallery-glass" />

      <Helmet>
        <title>Our Projects | SMS Infra Bangalore</title>
      </Helmet>

      {/* ⭐ TITLE — uses CMS value if set, otherwise original JSX */}
      {galleryTitle ? (
        <motion.h1
          className="gallery-title"
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9 }}
          viewport={{ once: true }}
          dangerouslySetInnerHTML={{ __html: galleryTitle }}
        />
      ) : (
        <motion.h1
          className="gallery-title"
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9 }}
          viewport={{ once: true }}
        >
          Our <span>Projects</span>
        </motion.h1>
      )}

      {/* ⭐ SUBTITLE — uses CMS value if set, otherwise original JSX */}
      <motion.p
        className="gallery-subtitle"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        viewport={{ once: true }}
      >
        {gallerySubtitle || "SMS Infra construction company in Bangalore specializing in residential, commercial, infrastructure, machinery, and material production projects."}
      </motion.p>

      <div
        className="voyager-container"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="voyager-bg"
          style={{
            backgroundImage: `url(${projects[currentIndex]?.image})`,
          }}
        />

        {projects.map((item, i) => {
          const offset = i - currentIndex;

          return (
            <motion.div
              key={item._id || item.id}
              className={`voyager-card ${i === currentIndex ? "active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                if (i === currentIndex) {
                  navigate(getRoute(item.category));
                } else {
                  setCurrentIndex(i);
                }
              }}
              drag="x"
              dragElastic={0.25}   // 🔥 smoother
              dragMomentum={true}
              dragConstraints={{ left: 0, right: 0 }}
              onDragStart={() => setPaused(true)}
              onDragEnd={(e, info) => {
                setPaused(false);

                const threshold = 60; // 🔥 smoother swipe

                if (info.offset.x < -threshold) next();
                if (info.offset.x > threshold) prev();
              }}
              animate={{
                x: offset * (isMobile ? 180 : 280),   // 🔥 tighter on mobile
                scale: offset === 0 ? 1 : (isMobile ? 0.85 : 0.75),
                rotateY: offset * (isMobile ? -12 : -20), // 🔥 softer rotation
                opacity: Math.abs(offset) > 3 ? 0 : 1,
                zIndex: 100 - Math.abs(offset),
              }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 18,
              }}
            >
              <img src={item.image} alt={item.title} />
              <div className="voyager-overlay">
                <h3>{item.title}</h3>
              </div>
            </motion.div>
          );
        })}

        <div className="voyager-arrows">
          <button onClick={prev}>‹</button>
          <button onClick={next}>›</button>
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div className="lightbox" onClick={() => setSelected(null)}>
            <motion.img src={selected.image} className="lightbox-img" />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default Gallery;