import "./projects.css";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function Projects() {
  const [projects, setProjects] = useState([]);
  const location = useLocation();

  // 🔥 FETCH DATA FROM BACKEND
  useEffect(() => {
    fetch("http://localhost:5000/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.log(err));
  }, []);

  // 🔥 SCROLL TO SECTION
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  // 🔥 FILTER FUNCTION
  const getCategoryData = (category) => {
    return projects.filter((item) => item.category === category);
  };

  return (
    <div className="projects-page">

      <h1 className="projects-title">Our Projects</h1>
      <p className="projects-subtitle">
        A showcase of our work across construction and infrastructure.
      </p>

      {/* 🏡 RESIDENTIAL */}
      <section id="residential" className="project-section">
        <h2>Residential Projects</h2>
        <div className="project-grid">
          {getCategoryData("residential").map((item) => (
            <img key={item._id} src={item.image} alt={item.title} />
          ))}
        </div>
      </section>

      {/* 🏢 COMMERCIAL */}
      <section id="commercial" className="project-section">
        <h2>Commercial</h2>
        <div className="project-grid">
          {getCategoryData("commercial").map((item) => (
            <img key={item._id} src={item.image} alt={item.title} />
          ))}
        </div>
      </section>

      {/* 🏗️ CONSTRUCTION */}
      <section id="construction" className="project-section">
        <h2>Construction Sites</h2>
        <div className="project-grid">
          {getCategoryData("construction").map((item) => (
            <img key={item._id} src={item.image} alt={item.title} />
          ))}
        </div>
      </section>

      {/* 🚜 MACHINERY */}
      <section id="machinery" className="project-section">
        <h2>Machinery & Infrastructure</h2>
        <div className="project-grid">
          {getCategoryData("machinery").map((item) => (
            <img key={item._id} src={item.image} alt={item.title} />
          ))}
        </div>
      </section>

      {/* 🏭 MATERIALS */}
      <section id="materials" className="project-section">
        <h2>Material Production Units</h2>
        <div className="project-grid">
          {getCategoryData("materials").map((item) => (
            <img key={item._id} src={item.image} alt={item.title} />
          ))}
        </div>
      </section>

    </div>
  );
}

export default Projects;
