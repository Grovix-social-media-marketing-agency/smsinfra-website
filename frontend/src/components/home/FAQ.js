import React, { useState, useRef, useEffect } from "react";
import "./faq.css";

/* ⭐ API BASE URL */
const API = process.env.REACT_APP_API_URL || "http://10.145.35.253:5000/api";

const DEFAULT_FAQ_DATA = [
  {
    question: "What construction materials does SMS Infra supply in Bangalore?",
    answer: "SMS Infra supplies concrete solid blocks, ready mix concrete (RMC), aggregates, M-Sand, and P-Sand for residential and commercial construction projects across Bangalore."
  },
  {
    question: "What is P-Sand and where is it used?",
    answer: "P-Sand (Plastering Sand) is used for wall plastering and finishing. It improves workability, reduces cement consumption, and provides a smooth surface finish."
  },
  {
    question: "What is M-Sand and why is it better than river sand?",
    answer: "M-Sand is manufactured using advanced crushers and offers better strength, durability, and consistency compared to river sand, making it ideal for construction."
  },
  {
    question: "Do you provide ready mix concrete (RMC) in Bangalore?",
    answer: "Yes, SMS Infra provides high-quality ready mix concrete using advanced technology and strict quality control systems for construction projects across Bangalore."
  },
  {
    question: "What types of aggregates do you supply?",
    answer: "We supply aggregates in sizes including 6mm, 12mm, 20mm, and 40mm, suitable for all types of construction work."
  },
  {
    question: "Do you offer excavation and earthmoving services?",
    answer: "Yes, SMS Infra offers excavation, grading, demolition, and hauling services with experience in 50+ projects across Bangalore."
  },
  {
    question: "Do you handle bulk orders for construction materials?",
    answer: "Yes, we handle bulk orders for builders, contractors, and large infrastructure projects with reliable supply and timely delivery."
  },
  {
    question: "Which areas do you serve in Bangalore?",
    answer: "We serve across Bangalore including Electronic City, Sarjapur, HSR Layout, BTM Layout, Whitefield, Marathahalli, and surrounding areas."
  }
];

function FAQ() {
  const [activeItem, setActiveItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(null);

  /* ⭐ CMS STATE — faqData, title, subtitle fall back to original hardcoded values */
  const [faqData, setFaqData] = useState(DEFAULT_FAQ_DATA);
  const [faqTitle, setFaqTitle]       = useState(null);
  const [faqSubtitle, setFaqSubtitle] = useState(null);

  const contentRefs = useRef({});
  const itemRefs = useRef({});

  /* ⭐ FETCH CMS DATA */
  useEffect(() => {
    fetch(`${API}/cms`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.faq?.title)    setFaqTitle(data.faq.title);
        if (data?.faq?.subtitle) setFaqSubtitle(data.faq.subtitle);
        if (Array.isArray(data?.faq?.items) && data.faq.items.length > 0) {
          setFaqData(data.faq.items.map((item) => ({
            question: item.question || "",
            answer:   item.answer   || "",
          })));
        }
      })
      .catch(() => {}); // silently fall back to DEFAULT_FAQ_DATA
  }, []);

  const filteredData = faqData.filter(item =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqData.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": { "@type": "Answer", "text": item.answer }
      }))
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(schema);
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, [faqData]);

  const toggleFAQ = (item) => {
    const isSame = activeItem === item.question;
    setActiveItem(isSame ? null : item.question);
  };

  const handleKeyDown = (e, item) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleFAQ(item);
    }
  };

  const copyToClipboard = (e, text, index) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);

    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const highlightText = (text) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    return text.replace(regex, `<mark>$1</mark>`);
  };

  return (
    <section className="faq-section dark-theme">
      
      <div className="faq-heading">
        {/* ⭐ TAG — CMS faq.title or original hardcoded */}
        <span className="heading-tag">{faqTitle || "Frequently Asked Questions"}</span>
        <h2>Your Questions, Our Expertise.</h2>
        {/* ⭐ SUBTITLE — CMS faq.subtitle or original hardcoded */}
        <p className="faq-subtext">
          {faqSubtitle || "We've compiled answers to the most common questions about our services, materials, and commitment to your construction success."}
        </p>
        
        <div className="faq-search-container">
          <input 
            type="text" 
            placeholder="Search materials (e.g. M-Sand, RMC)..." 
            className="faq-search-input"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="faq-grid-container">
        {filteredData.map((item, index) => {

          const isActive = activeItem === item.question;

          return (
            <div
              key={item.question}
              ref={(el) => (itemRefs.current[item.question] = el)}
              className={`faq-item ${isActive ? "active" : ""}`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => toggleFAQ(item)}
              onKeyDown={(e) => handleKeyDown(e, item)}
              role="button"
              tabIndex="0"
              aria-expanded={isActive}
            >
              <div className="faq-question">
                <h3
                  dangerouslySetInnerHTML={{
                    __html: highlightText(item.question)
                  }}
                ></h3>

                <div className="faq-icon-wrapper">
                  <span className={`faq-chevron ${isActive ? "rotate" : ""}`}></span>
                </div>
              </div>
              
              <div 
                className="faq-answer"
                style={{ 
                  maxHeight: isActive 
                    ? `${contentRefs.current[item.question]?.scrollHeight + 100}px` 
                    : "0px" 
                }}
              >
                <div 
                  ref={(el) => (contentRefs.current[item.question] = el)} 
                  className="faq-answer-inner"
                >
                  <p
                    dangerouslySetInnerHTML={{
                      __html: highlightText(item.answer)
                    }}
                  ></p>

                  {isActive && (
                    <button 
                      className="faq-copy-btn" 
                      onClick={(e) => copyToClipboard(e, item.answer, index)}
                    >
                      {copiedIndex === index ? "Copied ✓" : "Copy Info"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredData.length === 0 && (
        <div className="no-results">
          <p>No matches found for "{searchTerm}"</p>
        </div>
      )}

      <div className="faq-cta-box">
        <h2>Need Materials for Your Project?</h2>
        <p>Our team is ready to provide personalized answers and discuss your specific infra needs.
            
            Fast delivery across Bangalore. Get expert support instantly.
        </p>

        {/* ✅ UPDATED BUTTON */}
        <button
          className="speak-expert-btn"
          onClick={() => window.location.href = "tel:7676590045"}
        >
          Speak with an Expert
        </button>
  {/* 🔥 ADD THIS LINE */}
  <p className="cta-response">
    We respond within 15 minutes
  </p>
      </div>

    </section>
  );
}

export default FAQ;