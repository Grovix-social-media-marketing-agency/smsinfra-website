import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./hero.css";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

function Hero() {
  const [showVideo, setShowVideo] = useState(false);
  const [skipIntro, setSkipIntro] = useState(false);
  const [showCard, setShowCard] = useState(true);

  const [bgImage, setBgImage] = useState("/construction.png");
  const [media, setMedia] = useState(null);

  const videoRef = useRef(null);
  const introTimer = useRef(null);

  const navigate = useNavigate();

  // ✅ fetch hero media from backend
  useEffect(() => {
    fetch(`${API}/hero`)
      .then((r) => r.json())
      .then((data) => setMedia(data))
      .catch(() => {/* silently use local fallbacks */});
  }, []);

  /* 🔥 BACKGROUND SWITCH */
  useEffect(() => {
    const updateBg = () => {
      if (window.innerWidth <= 768) {
        setBgImage(media?.mobileImage?.url || "/construction-mobile.png");
      } else {
        setBgImage(media?.desktopImage?.url || "/construction.png");
      }
    };

    updateBg();
    window.addEventListener("resize", updateBg);
    return () => window.removeEventListener("resize", updateBg);
  }, [media]);

  useEffect(() => {
    introTimer.current = setTimeout(() => {
      setShowVideo(true);
    }, 3000);

    return () => clearTimeout(introTimer.current);
  }, []);

  useEffect(() => {
    if (showVideo && videoRef.current) {
      videoRef.current.playbackRate = 1.4;

      videoRef.current.onended = () => {
        handleAutoSkip();
      };
    }
  }, [showVideo]);

  const handleAutoSkip = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });

    setTimeout(() => {
      setSkipIntro(true);
    }, 400);
  };

  const handleSkip = () => {
    clearTimeout(introTimer.current);
    handleAutoSkip();
  };

  /* ⭐ REPLAY HERO */
  useEffect(() => {
    const replayHero = () => {
      if (window.scrollY < 60) {
        setSkipIntro(false);
        setShowVideo(false);
        setShowCard(true);

        clearTimeout(introTimer.current);

        introTimer.current = setTimeout(() => {
          setShowVideo(true);
        }, 3000);
      }
    };

    window.addEventListener("scroll", replayHero);
    return () => window.removeEventListener("scroll", replayHero);
  }, []);

  // ✅ Ticker items from DB, fallback to original hardcoded list
  const defaultTicker = "Earthmovers,Ready Mix Concrete,Solid Blocks,Aggregates,M Sand & P Sand,Infrastructure Projects";
  const tickerItems = (media?.ticker || defaultTicker).split(",").map((s) => s.trim()).filter(Boolean);

  // ✅ FIX: repeat items enough times to always fill the scroll track smoothly
  // Ensures even a single item loops seamlessly without gaps
  const minRepeats = Math.max(2, Math.ceil(8 / tickerItems.length));
  const repeatedTicker = Array.from({ length: minRepeats }, () => tickerItems).flat();

  return (
    <div className={`hero-container ${skipIntro ? "fade-out" : ""}`}>
      
      {/* ⭐ INTRO IMAGE */}
      {!showVideo && (
        <div
          className="hero-bg"
          style={{ backgroundImage: `url(${bgImage})` }}
        >
          <img src="/Logo.png" alt="logo" className="hero-logo animate-logo" />
        </div>
      )}

      {/* ⭐ VIDEO SECTION */}
      {showVideo && (
        <>
          <video ref={videoRef} className="hero-video" autoPlay muted>
            <source src={media?.video?.url || "/video/hero.mp4"} type="video/mp4" />
          </video>

          {/* ⭐ GLASSY CORPORATE CARD */}
          {showCard && (
            <div className="hero-glass-card">

              <span className="close-card" onClick={() => setShowCard(false)}>
                ✕
              </span>

              {/* ✅ Tagline from DB, fallback to original */}
              <h1>{media?.tagline || "Turning Dreams Into Reality"}</h1>

              <div className="hero-moving-services">
                <div className="hero-moving-track">
                  {/* ✅ FIXED: repeat enough copies so scroll loop is always seamless */}
                  {repeatedTicker.map((item, i) => (
                    <React.Fragment key={i}>
                      {item} <span className="dot">✦</span>{" "}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="hero-cta-buttons">
                <button
                  className="quote-btn"
                  onClick={() => navigate("/contact")}
                >
                  Get a Quote
                </button>

                <button
                  className="service-btn"
                  onClick={() => navigate("/services")}
                >
                  View Services
                </button>
              </div>

            </div>
          )}

          <button className="skip-btn" onClick={handleSkip}>
            Skip Intro →
          </button>
        </>
      )}
    </div>
  );
}

export default Hero;
