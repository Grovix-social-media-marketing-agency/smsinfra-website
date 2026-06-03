import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./footer.css";

/* ⭐ API BASE URL */
const API = process.env.REACT_APP_API_URL || "http://10.145.35.253:5000/api";

function Footer() {
  /* ⭐ CMS STATE — all start null so original hardcoded values render as fallback */
  const [tagline, setTagline]     = useState(null);
  const [subtext, setSubtext]     = useState(null);
  const [phone1, setPhone1]       = useState(null);
  const [phone2, setPhone2]       = useState(null); // ⭐ now reads from CMS contact.phone2
  const [email1, setEmail1]       = useState(null);
  const [email2, setEmail2]       = useState(null); // ⭐ now reads from CMS contact.email2
  const [address, setAddress]     = useState(null);
  const [areas, setAreas]         = useState(null); // null = use hardcoded
  const [socialLinks, setSocialLinks] = useState(null); // ⭐ null = use hardcoded

  /* ⭐ FETCH CMS DATA */
  useEffect(() => {
    fetch(`${API}/cms`)
      .then((res) => res.json())
      .then((data) => {
        // Overview → tagline1 as footer tagline, tagline2 as subtext
        if (data?.overview?.tagline1) setTagline(data.overview.tagline1);
        if (data?.overview?.tagline2) setSubtext(data.overview.tagline2);

        // Contact details
        if (data?.contact?.phone)   setPhone1(data.contact.phone);
        if (data?.contact?.phone2)  setPhone2(data.contact.phone2);  // ⭐ ADDED
        if (data?.contact?.email)   setEmail1(data.contact.email);
        if (data?.contact?.email2)  setEmail2(data.contact.email2);  // ⭐ ADDED
        if (data?.contact?.address) setAddress(data.contact.address);

        // ⭐ Social links
        if (data?.social) setSocialLinks(data.social);

        // Areas from areasSection
        if (Array.isArray(data?.areasSection?.areas) && data.areasSection.areas.length > 0) {
          setAreas(data.areasSection.areas);
        }
      })
      .catch(() => {}); // silently fall back to hardcoded values
  }, []);

  return (
    <footer className="footer">

      {/* BRAND */}
      <div className="footer-top">
        <div className="footer-brand">
          <img src="/Logo.png" alt="SMS Infra Logo" className="footer-logo" />

          {/* ⭐ TAGLINE — CMS overview.tagline1 or original hardcoded */}
          <p className="footer-tagline">{tagline || "Turning Dreams Into Reality"}</p>
          {/* ⭐ SUBTEXT — CMS overview.tagline2 or original hardcoded */}
          <p className="footer-subtext">
            {subtext || "Reliable Construction & Material Supply in Bangalore"}
          </p>
        </div>
      </div>

      {/* LINKS */}
      <div className="footer-links">

        {/* COMPANY */}
        <div className="footer-col">
          <h4>Company</h4>
          <NavLink to="/" className={({ isActive }) => isActive ? "active-link" : ""}>Home</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? "active-link" : ""}>About</NavLink>
          <NavLink to="/services" className={({ isActive }) => isActive ? "active-link" : ""}>Services</NavLink>
          <NavLink to="/projects" className={({ isActive }) => isActive ? "active-link" : ""}>Projects</NavLink>
          <NavLink to="/careers" className={({ isActive }) => isActive ? "active-link" : ""}>Careers</NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? "active-link" : ""}>Contact</NavLink>
        </div>

        {/* SERVICES */}
        <div className="footer-col">
          <h4>Services</h4>
          <NavLink to="/services/earthmovers" className={({ isActive }) => isActive ? "active-link" : ""}>Earthmovers</NavLink>
          <NavLink to="/services/rmc" className={({ isActive }) => isActive ? "active-link" : ""}>Ready Mix Concrete</NavLink>
          <NavLink to="/services/solid-blocks" className={({ isActive }) => isActive ? "active-link" : ""}>Concrete Solid Blocks</NavLink>
          <NavLink to="/services/aggregates" className={({ isActive }) => isActive ? "active-link" : ""}>Aggregates</NavLink>
          <NavLink to="/services/msand" className={({ isActive }) => isActive ? "active-link" : ""}>M Sand & P Sand</NavLink>
          <NavLink to="/services/builders" className={({ isActive }) => isActive ? "active-link" : ""}>Builders & Infrastructure</NavLink>
        </div>

        {/* PROJECTS */}
        <div className="footer-col">
          <h4>Projects</h4>
          <NavLink to="/projects/residential" className={({ isActive }) => isActive ? "active-link" : ""}>Residential Projects</NavLink>
          <NavLink to="/projects/commercial" className={({ isActive }) => isActive ? "active-link" : ""}>Commercial Projects</NavLink>
          <NavLink to="/projects/sites" className={({ isActive }) => isActive ? "active-link" : ""}>Construction Sites</NavLink>
          <NavLink to="/projects/machinery" className={({ isActive }) => isActive ? "active-link" : ""}>Machinery & Infrastructure</NavLink>
          <NavLink to="/projects/production" className={({ isActive }) => isActive ? "active-link" : ""}>Material Production Units</NavLink>
        </div>

        {/* CONTACT */}
        <div className="footer-col">
          <h4>Contact</h4>

          {/* ⭐ PHONE — CMS contact.phone or original hardcoded */}
          <a href={`tel:${(phone1 || "7676590045").replace(/\D/g, "")}`}>
            📞 {phone1 || "7676590045"}
          </a>
          {/* ⭐ PHONE2 — from CMS contact.phone2, falls back to hardcoded, hidden if set to empty */}
          {phone2 !== "" && (
            <a href={`tel:${(phone2 || "9513355502").replace(/\D/g, "")}`}>
              📞 {phone2 || "9513355502/20/37/40/48/64/72"}
            </a>
          )}

          {/* ⭐ EMAIL — CMS contact.email or original hardcoded */}
          <a href={`mailto:${email1 || "sales@smsinfra.com"}`}>
            ✉️ {email1 || "sales@smsinfra.com"}
          </a>
          {/* ⭐ EMAIL2 — from CMS contact.email2, falls back to hardcoded, hidden if set to empty */}
          {email2 !== "" && (
            <a href={`mailto:${email2 || "enquiry@smsinfra.com"}`}>
              ✉️ {email2 || "enquiry@smsinfra.com"}
            </a>
          )}

          {/* ⭐ ADDRESS — CMS contact.address or original hardcoded */}
          <a
            href="https://www.google.com/maps/search/?api=1&query=SMS+Elite+Chandapura+Bangalore"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-address"
          >
            📍 {address || <>407/11, SMS ELITE, 3rd Floor,<br />Chandapura, Anekal Taluk,<br />Bengaluru - 560081</>}
          </a>
        </div>

        {/* SERVICE AREAS */}
        <div className="footer-col">
          <h4>Service Areas</h4>

          {/* ⭐ AREAS — from CMS areasSection.areas or original hardcoded */}
          {areas ? (
            areas.map((area) => (
              <NavLink
                key={area.slug}
                to={`/construction-services-${area.slug}`}
                className={({ isActive }) => isActive ? "active-link" : ""}
              >
                {area.label}
              </NavLink>
            ))
          ) : (
            <>
              <NavLink to="/construction-services-electronic-city" className={({ isActive }) => isActive ? "active-link" : ""}>Electronic City</NavLink>
              <NavLink to="/construction-services-whitefield" className={({ isActive }) => isActive ? "active-link" : ""}>Whitefield</NavLink>
              <NavLink to="/construction-services-sarjapur" className={({ isActive }) => isActive ? "active-link" : ""}>Sarjapur</NavLink>
              <NavLink to="/construction-services-hsr-layout" className={({ isActive }) => isActive ? "active-link" : ""}>HSR Layout</NavLink>
              <NavLink to="/construction-services-marathahalli" className={({ isActive }) => isActive ? "active-link" : ""}>Marathahalli</NavLink>
              <NavLink to="/construction-services-banashankari" className={({ isActive }) => isActive ? "active-link" : ""}>Banashankari</NavLink>
              <NavLink to="/construction-services-btm-layout" className={({ isActive }) => isActive ? "active-link" : ""}>BTM Layout</NavLink>
              <NavLink to="/construction-services-attibele" className={({ isActive }) => isActive ? "active-link" : ""}>Attibele</NavLink>
            </>
          )}

        </div>

      </div>

      {/* ⭐ SOCIAL MEDIA — from CMS social or original hardcoded */}
      <div className="footer-social">
        {/* Instagram — CMS or hardcoded */}
        {(socialLinks?.instagram ?? "https://www.instagram.com/smsinfra") && (
          <a
            href={socialLinks?.instagram || "https://www.instagram.com/smsinfra"}
            target="_blank"
            rel="noopener noreferrer"
            data-label="Instagram"
          >
            <i className="fab fa-instagram"></i>
          </a>
        )}

        {/* LinkedIn — CMS or hardcoded */}
        {(socialLinks?.linkedin ?? "https://www.linkedin.com/company/sms-builders-and-infra-projects/") && (
          <a
            href={socialLinks?.linkedin || "https://www.linkedin.com/company/sms-builders-and-infra-projects/"}
            target="_blank"
            rel="noopener noreferrer"
            data-label="LinkedIn"
          >
            <i className="fab fa-linkedin-in"></i>
          </a>
        )}

        {/* ⭐ Facebook — only shown if set in CMS */}
        {socialLinks?.facebook && (
          <a
            href={socialLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            data-label="Facebook"
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
            data-label="YouTube"
          >
            <i className="fab fa-youtube" style={{ color: "#ff0000" }}></i>
          </a>
        )}
      </div>

      {/* BOTTOM */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} SMS Infra. All Rights Reserved.</p>

        <p className="footer-credit">
          Designed & Developed by <span>Grovix Social Media Marketing</span>
        </p>
      </div>

    </footer>
  );
}

export default Footer;