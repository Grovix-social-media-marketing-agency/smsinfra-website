import React, { useState, useEffect, useRef, useCallback } from "react";
import "./Testimonials.css";

/* ⭐ API BASE URL */
const API = process.env.REACT_APP_API_URL || "http://10.145.35.253:5000/api";

/* ORIGINAL DATA */
const initialReviews = [
  {
    name: "Lokesh Reddy Ramareddy",
    role: "Contractor",
    date: "1 year ago",
    text: "We have been working with SMS Infra for over 9 years. The quality of concrete blocks and aggregates along with timely delivery has always been excellent.",
    video: ""
  },
  {
    name: "Keshav Reddy",
    role: "Client",
    date: "5 months ago",
    text: "Top-notch products. Highly reliable construction material supplier in Bangalore.",
    video: ""
  },
  {
    name: "Suhas",
    role: "Local Guide",
    date: "1 year ago",
    text: "Blocks are well cured and properly sized. Good quality for the price.",
    video: ""
  },
  {
    name: "Naveen PV",
    role: "Client",
    date: "9 months ago",
    text: "Good quality concrete blocks with very good finish.",
    video: ""
  }
];

export default function Testimonials() {

  const [reviews, setReviews] = useState(initialReviews);

  /* ⭐ CMS STATE — title and subtitle, fall back to original hardcoded values */
  const [sectionTitle, setSectionTitle]       = useState(null);
  const [sectionSubtitle, setSectionSubtitle] = useState(null);

  const [index, setIndex] = useState(1);
  const [count, setCount] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  const [cardsToShow, setCardsToShow] = useState(window.innerWidth < 768 ? 1.15 : 3);

  const intervalRef = useRef(null);
  const resumeTimeout = useRef(null);
  const isDragging = useRef(false);

  const dragStartX = useRef(0);
  const dragCurrentX = useRef(0);
  const velocity = useRef(0);
  const lastX = useRef(0);
  const lastTime = useRef(0);

  const glowRef = useRef(null);
  const sectionRef = useRef(null);

  /* ⭐ REPLACED: fetch from CMS instead of /api/testimonials */
  useEffect(() => {
    fetch(`${API}/cms`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.testimonials?.title)    setSectionTitle(data.testimonials.title);
        if (data?.testimonials?.subtitle) setSectionSubtitle(data.testimonials.subtitle);
        if (Array.isArray(data?.testimonials?.items) && data.testimonials.items.length > 0) {
          setReviews(data.testimonials.items.map((item) => ({
            name:  item.name  || "",
            role:  item.role  || "",
            date:  item.date  || "",
            text:  item.text  || "",
            video: item.video || "",
          })));
          setIndex(1);
        }
      })
      .catch(() => {}); // silently fall back to initialReviews
  }, []);

  const extended = [
    reviews[reviews.length - 1],
    ...reviews,
    reviews[0]
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setCardsToShow(1.15);
      else setCardsToShow(3);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const next = useCallback(() => setIndex((p) => p + 1), []);
  const prev = useCallback(() => setIndex((p) => p - 1), []);

  const startAuto = useCallback(() => {
    clearInterval(intervalRef.current);
    if (document.hidden) return;
    intervalRef.current = setInterval(next, 3500);
  }, [next]);

  const stopAuto = useCallback(() => clearInterval(intervalRef.current), []);

  const handleUserInteraction = useCallback(() => {
    stopAuto();
    clearTimeout(resumeTimeout.current);
    resumeTimeout.current = setTimeout(startAuto, 5000);
  }, [startAuto, stopAuto]);

  useEffect(() => {
    startAuto();
    return () => {
      stopAuto();
      clearTimeout(resumeTimeout.current);
    };
  }, [startAuto, stopAuto]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) startAuto();
        else stopAuto();
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [startAuto, stopAuto]);

  useEffect(() => {
    if (index === extended.length - 1) {
      setTimeout(() => setIndex(1), 400);
    }
    if (index === 0) {
      setTimeout(() => setIndex(extended.length - 2), 400);
    }
  }, [index, extended.length]);

  const handleDragStart = (x) => {
    dragStartX.current = x;
    dragCurrentX.current = x;
    lastX.current = x;
    lastTime.current = Date.now();
    velocity.current = 0;
    isDragging.current = true;
    stopAuto();
  };

  const handleDragMove = (x) => {
    if (!isDragging.current) return;

    const now = Date.now();
    const dx = x - lastX.current;
    const dt = now - lastTime.current;

    velocity.current = dx / (dt || 1);
    lastX.current = x;
    lastTime.current = now;
    dragCurrentX.current = x;

    const diff = x - dragStartX.current;
    const resistance = Math.sign(diff) * Math.pow(Math.abs(diff), 0.9);
    setDragOffset(resistance);
  };

  const handleRelease = useCallback(() => {
    if (!isDragging.current) return;

    const diff = dragStartX.current - dragCurrentX.current;
    const threshold = window.innerWidth < 768 ? 50 : 80;

    if (diff > threshold || velocity.current < -0.5) next();
    else if (diff < -threshold || velocity.current > 0.5) prev();

    setTimeout(() => setDragOffset(0), 30);

    isDragging.current = false;
    handleUserInteraction();
  }, [next, prev, handleUserInteraction]);

  useEffect(() => {
    window.addEventListener("mouseup", handleRelease);
    window.addEventListener("touchend", handleRelease);
    return () => {
      window.removeEventListener("mouseup", handleRelease);
      window.removeEventListener("touchend", handleRelease);
    };
  }, [handleRelease]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [next, prev]);

  useEffect(() => {
    let start = 0;
    const interval = setInterval(() => {
      start += 2;
      if (start >= 50) {
        start = 50;
        clearInterval(interval);
      }
      setCount(start);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const move = (e) => {
      if (glowRef.current) {
        glowRef.current.style.left = `${e.clientX}px`;
        glowRef.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const handleMouseMove = (e, el) => {
    if (window.innerWidth < 768) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = -(y / rect.height - 0.5) * 8;
    const rotateY = (x / rect.width - 0.5) * 8;

    el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
  };

  const resetTilt = (el) => {
    el.style.transform = "perspective(800px) scale(1)";
  };

  return (
    <section ref={sectionRef} className="premium-slider-section">

      <div className="testimonial-heading">
        <h5 className="heading-tag">TESTIMONIALS</h5> {/* ✅ ONLY ADDITION */}
        {/* ⭐ TITLE — CMS value if set, otherwise original hardcoded */}
        <h2>{sectionTitle || "What Our Clients Say About SMS Infra"}</h2>
        {/* ⭐ SUBTITLE — CMS value if set, otherwise original hardcoded */}
        <p>{sectionSubtitle || "Trusted by builders and homeowners across Bangalore"}</p>
      </div>

      <div ref={glowRef} className="cursor-glow"></div>

      <div className="google-header">
        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google Reviews"/>
        <div className="stars">
  <span>★</span>
  <span>★</span>
  <span>★</span>
  <span>★</span>
  <span>★</span>
</div>
        <p className="rating-text">
          Rated <strong>4.7/5</strong> by <span className="count">{count}+</span> clients
        </p>
      </div>

      <div
        className="slider"
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => handleDragMove(e.clientX)}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
      >
        <div
          className="slider-track"
          style={{
            transform: `translate3d(calc(-${index * (100 / cardsToShow)}% + ${dragOffset}px),0,0)`,
            transition: isDragging.current ? "none" : "transform 0.5s cubic-bezier(0.2,1,0.3,1)"
          }}
        >
          {extended.map((review, i) => {
            const active = i === index;

            return (
              <div
                key={i}
                className={`slide ${active ? "active" : ""}`}
                style={{
                  minWidth: `${100 / cardsToShow}%`,
                  transform: `scale(${active ? 1.05 : 0.92})`,
                  transition: "0.4s ease"
                }}
              >
                <div
                  className="card"
                  onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
                  onMouseLeave={(e) => resetTilt(e.currentTarget)}
                >
                  <div className="top">
                    <div className="avatar">{review.name[0]}</div>
                    <div className="info">
                      <h4>{review.name}</h4>
                      <span>{review.role} • {review.date}</span>
                    </div>
                  </div>

                  <div className="stars">
  <span>★</span>
  <span>★</span>
  <span>★</span>
  <span>★</span>
  <span>★</span>
</div>
                  <p>{review.text}</p>

                  {review.video && active && (
                    <video className="testimonial-video" src={review.video} controls preload="none" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="dots">
        {reviews.map((_, i) => (
          <span
            key={i}
            className={index === i + 1 ? "active" : ""}
            onClick={() => {
              setIndex(i + 1);
              handleUserInteraction();
            }}
          ></span>
        ))}
      </div>
    </section>
  );
}