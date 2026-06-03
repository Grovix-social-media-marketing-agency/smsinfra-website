import { useEffect, useState, useRef } from "react";
import "./admin.css";

import {
  FaTruck, FaCubes, FaIndustry, FaCog, FaTools, FaBuilding,
  FaHome, FaWrench, FaBolt, FaLeaf, FaWater, FaFire,
  FaStar, FaHammer, FaCity, FaMountain, FaRoad, FaWarehouse,
  FaInstagram, FaLinkedinIn, FaFacebook, FaYoutube,
} from "react-icons/fa";

import AdminServicePages from "./AdminServicePages";
import AdminProjects from "./AdminProjects";
import AdminServiceHub from "./AdminServiceHub";
import AdminLeads from "./AdminLeads";

const ADMIN_PASSWORD = "123456";
const API = "https://smsinfra-website.onrender.com/api";

const DEFAULT_TICKER_ITEMS = [
  "Earthmovers","Ready Mix Concrete","Solid Blocks","Aggregates","M Sand & P Sand","Infrastructure Projects",
];

const DEFAULT_HOME_CONTENT = {
  title: "Top Construction Company in Bangalore",
  tagline1: "Turning Dreams Into Reality",
  tagline2: "Integrated Infrastructure & Construction Solutions",
  description: `SMS Infra is a leading construction and infrastructure company based in Chandapura, Bangalore, with over 30 years of experience in delivering high-quality engineering and material solutions.\n\nWe specialize in earthmoving services, ready mix concrete (RMC), concrete block manufacturing, aggregates, M Sand, and P Sand supply for residential, commercial, and large-scale infrastructure projects across Bangalore.\n\nOperating within a 30 km service radius from Chandapura, we serve key areas including Electronic City, Sarjapur, HSR Layout, BTM Layout, Whitefield, and Marathahalli.\n\nWith advanced machinery, in-house production units, and a strong focus on quality, safety, and timely execution, SMS Infra is a trusted partner for builders, developers, and contractors across Bangalore.`,
  yearsTarget: 30,
  projectsTarget: 500,
  clientsTarget: 100,
};

const DEFAULT_SERVICES_CONTENT = {
  heading: "OUR SERVICES",
  title: "Construction & Concrete Product Services in Bangalore",
  subtitle: "At SMS Infra, we offer a wide range of construction and material supply services in Bangalore, ensuring quality, reliability, and timely delivery for every residential, commercial, and infrastructure project.",
  cards: [
    { name: "Ready Mix Concrete (RMC)",           icon: "FaTruck",    link: "/services/rmc" },
    { name: "M Sand & P Sand",                    icon: "FaCubes",    link: "/services/msand" },
    { name: "Concrete Blocks",                    icon: "FaIndustry", link: "/services/solid-blocks" },
    { name: "Aggregates",                         icon: "FaCog",      link: "/services/aggregates" },
    { name: "Earthmovers & Excavation",           icon: "FaTools",    link: "/services/earthmovers" },
    { name: "Infrastructure / Builders Projects", icon: "FaBuilding", link: "/services/builders" },
  ],
};

const DEFAULT_AREAS_CONTENT = {
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

const DEFAULT_STATIC_GALLERY_IMAGES = [
  { url: "/residential-1.jpg",        publicId: "static-res-1",   caption: "Residential Projects",        isStatic: true },
  { url: "/commercial.png",           publicId: "static-com-1",   caption: "Commercial",                  isStatic: true },
  { url: "/construction Site-1.jpg",  publicId: "static-con-1",   caption: "Construction Sites",          isStatic: true },
  { url: "/construction Site-2.jpg",  publicId: "static-con-2",   caption: "Construction Sites",          isStatic: true },
  { url: "/construction.png",         publicId: "static-con-3",   caption: "Construction Sites",          isStatic: true },
  { url: "/construction-mobile.png",  publicId: "static-con-4",   caption: "Construction Sites",          isStatic: true },
  { url: "/Machinery1.jpg",           publicId: "static-mach-1",  caption: "Machinery & Infrastructure",  isStatic: true },
  { url: "/Machinery-2.jpg",          publicId: "static-mach-2",  caption: "Machinery & Infrastructure",  isStatic: true },
  { url: "/Machinery-3.png",          publicId: "static-mach-3",  caption: "Machinery & Infrastructure",  isStatic: true },
  { url: "/Machinery-5.jpg",          publicId: "static-mach-4",  caption: "Machinery & Infrastructure",  isStatic: true },
  { url: "/Machinery-6.png",          publicId: "static-mach-5",  caption: "Machinery & Infrastructure",  isStatic: true },
  { url: "/Production Units-1.png",   publicId: "static-mat-1",   caption: "Material Production Units",   isStatic: true },
  { url: "/Production Units-2.jpg",   publicId: "static-mat-2",   caption: "Material Production Units",   isStatic: true },
  { url: "/Production Units-3.JPG",   publicId: "static-mat-3",   caption: "Material Production Units",   isStatic: true },
  { url: "/Production Units-4.png",   publicId: "static-mat-4",   caption: "Material Production Units",   isStatic: true },
  { url: "/Production Units-5.JPG",   publicId: "static-mat-5",   caption: "Material Production Units",   isStatic: true },
  { url: "/Production Units-6.png",   publicId: "static-mat-6",   caption: "Material Production Units",   isStatic: true },
  { url: "/Production Units-7.png",   publicId: "static-mat-7",   caption: "Material Production Units",   isStatic: true },
];

const DEFAULT_GALLERY_META = {
  title: "Our <span>Projects</span>",
  subtitle: "SMS Infra construction company in Bangalore specializing in residential, commercial, infrastructure, machinery, and material production projects.",
};

const DEFAULT_WHYCHOOSE_CONTENT = {
  title:    "Why Choose SMS Infra?",
  subtitle: "WHY CHOOSE US",
  points: [
    { heading: "Advanced Equipment",  text: "Modern machinery ensuring precision & efficiency." },
    { heading: "Skilled Workforce",   text: "Highly trained professionals delivering quality work." },
    { heading: "Timely Execution",    text: "Projects completed on schedule without compromise." },
    { heading: "Cost Effective",      text: "Smart solutions that save cost without reducing quality." },
  ],
};

const DEFAULT_TESTIMONIALS_CONTENT = {
  title:    "What Our Clients Say About SMS Infra",
  subtitle: "Trusted by builders and homeowners across Bangalore",
  items: [
    { name: "Lokesh Reddy Ramareddy", role: "Contractor",   date: "1 year ago",   text: "We have been working with SMS Infra for over 9 years. The quality of concrete blocks and aggregates along with timely delivery has always been excellent." },
    { name: "Keshav Reddy",           role: "Client",       date: "5 months ago", text: "Top-notch products. Highly reliable construction material supplier in Bangalore." },
    { name: "Suhas",                  role: "Local Guide",  date: "1 year ago",   text: "Blocks are well cured and properly sized. Good quality for the price." },
    { name: "Naveen PV",              role: "Client",       date: "9 months ago", text: "Good quality concrete blocks with very good finish." },
  ],
};

const DEFAULT_FAQ_CONTENT = {
  title:    "Frequently Asked Questions",
  subtitle: "We've compiled answers to the most common questions about our services, materials, and commitment to your construction success.",
  items: [
    { question: "What construction materials does SMS Infra supply in Bangalore?", answer: "SMS Infra supplies concrete solid blocks, ready mix concrete (RMC), aggregates, M-Sand, and P-Sand for residential and commercial construction projects across Bangalore." },
    { question: "What is P-Sand and where is it used?", answer: "P-Sand (Plastering Sand) is used for wall plastering and finishing. It improves workability, reduces cement consumption, and provides a smooth surface finish." },
    { question: "What is M-Sand and why is it better than river sand?", answer: "M-Sand is manufactured using advanced crushers and offers better strength, durability, and consistency compared to river sand, making it ideal for construction." },
    { question: "Do you provide ready mix concrete (RMC) in Bangalore?", answer: "Yes, SMS Infra provides high-quality ready mix concrete using advanced technology and strict quality control systems for construction projects across Bangalore." },
    { question: "What types of aggregates do you supply?", answer: "We supply aggregates in sizes including 6mm, 12mm, 20mm, and 40mm, suitable for all types of construction work." },
    { question: "Do you offer excavation and earthmoving services?", answer: "Yes, SMS Infra offers excavation, grading, demolition, and hauling services with experience in 50+ projects across Bangalore." },
    { question: "Do you handle bulk orders for construction materials?", answer: "Yes, we handle bulk orders for builders, contractors, and large infrastructure projects with reliable supply and timely delivery." },
    { question: "Which areas do you serve in Bangalore?", answer: "We serve across Bangalore including Electronic City, Sarjapur, HSR Layout, BTM Layout, Whitefield, Marathahalli, and surrounding areas." },
  ],
};

const DEFAULT_FOOTER_CONTENT = {
  tagline:    "Turning Dreams Into Reality",
  subtext:    "Reliable Construction & Material Supply in Bangalore",
  phone:      "7676590045",
  phone2:     "9513355502/20/37/40/48/64/72",
  email:      "sales@smsinfra.com",
  email2:     "enquiry@smsinfra.com",
  address:    "407/11, SMS ELITE, 3rd Floor, Chandapura, Anekal Taluk, Bengaluru - 560081",
  instagram:  "https://www.instagram.com/smsinfra",
  linkedin:   "https://www.linkedin.com/company/sms-builders-and-infra-projects/",
  facebook:   "",
  youtube:    "",
};

const DEFAULT_CONTACT_PAGE = {
  heroTag: "CONTACT SMS INFRA",
  heroTitle: "Let's Build Reliable Infrastructure Together",
  heroSubtitle: "Connect with SMS Infra for construction materials, earthmoving services, infrastructure support, commercial projects, residential developments, and industrial site solutions across Bangalore.",
  address: "407/11, SMS ELITE, 3rd Floor, Chandapura, Anekal Taluk, Bengaluru - 560081",
  email1: "sales@smsinfra.com",
  email2: "enquiry@smsinfra.com",
  phone1: "7676590045",
  phone2: "",
  businessHours: "Mon – Sat: 9:00 AM – 7:00 PM",
  sundayHours: "Sunday: Closed",
  responseTime: "Within 2 hours during business hours",
  responseTimeOff: "Next business day by 11:00 AM",
  monthlyCount: "47 businesses contacted us this month",
  tickerMessages: [
    "A contractor from Whitefield just requested a quote 2 min ago",
    "A builder from Electronic City enquired about RMC 5 min ago",
    "A developer from Sarjapur submitted a quotation 8 min ago",
    "A site engineer from Hoodi requested M Sand pricing 12 min ago",
    "A contractor from HSR Layout asked about earthmoving 18 min ago",
    "A developer from Marathahalli enquired about aggregates 22 min ago",
  ],
  formTag: "REQUEST A QUOTATION",
  formTitle: "Get Custom Pricing For Your Construction Requirement",
  formDescription: "Submit your project requirements and our team will provide customised quotations for earthmoving, aggregates, ready mix concrete, M Sand, P Sand, solid blocks, and infrastructure projects.",
  formFeatures: [
    "Commercial & Residential Projects",
    "Infrastructure & Industrial Solutions",
    "Fast Response From Expert Team",
  ],
  services: [
    "Earthmoving Services","Ready Mix Concrete","M Sand Supply","P Sand Supply",
    "Solid Blocks","Aggregates","Infrastructure Projects",
  ],
  mapTag: "LOCATION",
  mapTitle: "Visit Our Office",
  mapEmbed: "https://www.google.com/maps?q=Chandapura+Bangalore&output=embed",
  successTitle: "Quotation request submitted!",
  successTimeOpen: "2–3 hours",
  successTimeOff: "the next business day",
};

const DEFAULT_ABOUT = {
  heroH1: "ABOUT US",
  heroH2a: "Top Construction Company in Bangalore",
  heroH2b: "Turning Dreams Into Reality",
  heroSubtitle: "Integrated Infrastructure & Construction Solutions",
  heroDesc: "SMS Infra is a trusted construction and infrastructure company in Bangalore, specializing in earthmoving, ready mix concrete (RMC), aggregates, M Sand, and P Sand supply. With over 30 years of experience, we deliver reliable, high-quality solutions for residential, commercial, and large-scale infrastructure projects.",
  heroBgDesktop: "/about-bg.png",
  heroBgMobile: "/about-mobile-bg.png",
  introTitle: "About SMS Infra",
  introPara1: "SMS Infra is a leading construction and infrastructure company based in Chandapura, Bangalore, with over 30 years of experience in delivering high-quality engineering and material solutions. We specialize in earthmoving services, ready mix concrete (RMC), concrete block manufacturing, aggregates, M Sand, and P Sand supply for residential, commercial, and large-scale infrastructure projects across Bangalore.",
  introPara2: "Operating within a 30 km service radius from Chandapura, we serve key areas including Electronic City, Sarjapur, HSR Layout, BTM Layout, Whitefield, and Marathahalli. With advanced machinery, in-house production units, and a strong focus on quality, safety, and timely execution, SMS Infra is a trusted partner for builders, developers, and contractors across Bangalore.",
  statsYearsVal: "30+", statsYearsLabel: "Years of Excellence",
  statsProjectsVal: "500+", statsProjectsLabel: "Projects Delivered",
  statsClientsVal: "100+", statsClientsLabel: "Trusted Clients",
  journeyTitle: "Our Journey",
  journeyItems: [
    { year: "1996", text: "Established concrete solid block manufacturing unit, laying the foundation of SMS Infra." },
    { year: "2008", text: "Expanded into earthwork and excavation services with modern heavy machinery." },
    { year: "2017", text: "Commissioned a stone crusher unit for in-house aggregate production." },
    { year: "2023", text: "Launched M Sand washing unit, enabling eco-friendly manufactured sand supply." },
    { year: "2024", text: "Underwent major renovation and modernisation of the concrete block manufacturing unit." },
    { year: "2026", text: "Launched Ready Mix Concrete (RMC) plant, completing our full-spectrum construction solutions offering." },
  ],
  whyTitle: "Why Choose Us",
  whyCards: ["30+ Years Experience", "Advanced Machinery", "In-house Production", "On-time Delivery"],
  expertiseTitle: "Our Expertise",
  expertiseDesc: "We offer end-to-end construction and material supply services tailored for residential, commercial, and infrastructure development projects.",
  servicesBannerTitle: "Complete Construction Solutions",
  servicesBannerText: "SMS Infra delivers integrated construction services including earthmoving, ready mix concrete, aggregates, M Sand, P Sand, and concrete blocks.",
  servicesBannerBullets: ["High-quality materials", "Advanced machinery & technology", "Experienced team", "Reliable & on-time execution"],
  servicesBannerImage: "/services-banner.png",
  serviceCards: [
    { title: "Earthmoving", desc: "Excavation and site preparation." },
    { title: "Concrete Blocks", desc: "High strength blocks manufacturing." },
    { title: "Ready Mix Concrete", desc: "Quality tested RMC solutions." },
    { title: "Aggregates & Sand", desc: "Premium construction materials supply." },
  ],
  processTitle: "Our Process",
  processDesc: "Our structured approach ensures every project is delivered with precision, efficiency, and high-quality standards.",
  processSteps: ["Planning", "Design", "Execution", "Delivery"],
  equipmentTitle: "Equipment",
  equipmentDesc: "Our advanced machinery and in-house production units enable us to handle projects of any scale with efficiency and reliability.",
  equipmentItems: ["Earthmovers", "RMC Plants", "Crusher Units", "Block Units"],
  fleetItems: ["JCB Excavators", "Tipper Trucks", "Transit Mixers", "Cranes & Loaders", "Stone Crushers", "Water Tankers"],
  safetyTitle: "Safety & Sustainability",
  safetyText: "At SMS Infra, safety and sustainability are at the core of our operations. We follow strict safety protocols, use environmentally responsible materials, and ensure compliance with industry standards in every project.",
  missionTitle: "Our Mission",
  missionText: "Deliver high-quality infrastructure solutions with innovation and reliability.",
  visionTitle: "Our Vision",
  visionText: "To be Bangalore's most trusted construction partner.",
  qualityTitle: "Quality & Standards",
  qualityItems: ["ISO Standard Processes", "Regular Cube Testing", "Third-party Verification", "In-house Laboratory", "Strict Safety Compliance"],
  valuesItems: ["Quality First", "Timely Delivery", "Customer Commitment", "Innovation", "Sustainability"],
  projectsTitle: "Our Projects",
  projectsPara1: "Residential, commercial, and infrastructure projects delivered with precision, on-time execution, and complete EPC solutions.",
  projectsPara2: "From residential buildings to large-scale infrastructure developments, our projects reflect quality, durability, and timely execution.",
  areasTitle: "Service Areas",
  areasItems: ["Electronic City", "Sarjapur", "HSR Layout", "BTM Layout", "Whitefield", "Marathahalli"],
  ctaTitle: "Let's Build Something Great Together",
  ctaText: "Looking for a reliable construction partner in Bangalore? Get in touch with SMS Infra today for high-quality and cost-effective solutions.",
  ctaBtnText: "Contact Us",
};

const ICON_MAP = {
  FaTruck, FaCubes, FaIndustry, FaCog, FaTools, FaBuilding,
  FaHome, FaWrench, FaBolt, FaLeaf, FaWater, FaFire,
  FaStar, FaHammer, FaCity, FaMountain, FaRoad, FaWarehouse,
};

function DynamicIcon({ name, style }) {
  const Icon = ICON_MAP[name];
  if (!Icon) return <span style={{ fontSize: 18, ...style }}>?</span>;
  return <Icon style={style} />;
}

function AdminDashboard() {
  const [cms, setCms] = useState(null);
  const [activeTab, setActiveTab] = useState("hero");
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState("");

  const [annMessage, setAnnMessage] = useState("");
  const [annType, setAnnType] = useState("info");
  const [annHandle, setAnnHandle] = useState("");
  const [annInstagramUrl, setAnnInstagramUrl] = useState("");
  const [annSaving, setAnnSaving] = useState(false);
  const [annToast, setAnnToast] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const [annLoading, setAnnLoading] = useState(false);

  const [heroFiles, setHeroFiles] = useState({ desktopImage: null, mobileImage: null, video: null });
  const [heroUploadStatus, setHeroUploadStatus] = useState("");
  const [heroMedia, setHeroMedia] = useState(null);

  const [heroTagline, setHeroTagline] = useState("");
  const [saveTextStatus, setSaveTextStatus] = useState("");

  const [tickerList, setTickerList] = useState([]);
  const [newTickerItem, setNewTickerItem] = useState("");
  const [heroLoaded, setHeroLoaded] = useState(false);

  const heroTicker = tickerList.join(",");

  const [homeContent, setHomeContent] = useState(DEFAULT_HOME_CONTENT);
  const [savedHomeContent, setSavedHomeContent] = useState(null);
  const [homeLoading, setHomeLoading] = useState(true);
  const [homeSaveStatus, setHomeSaveStatus] = useState("");

  const [clientLogos, setClientLogos] = useState([]);
  const [savedLogosOrder, setSavedLogosOrder] = useState([]);
  const [orderChanged, setOrderChanged] = useState(false);
  const [orderSaveStatus, setOrderSaveStatus] = useState("");
  const [logosLoading, setLogosLoading] = useState(true);
  const [newLogoFile, setNewLogoFile] = useState(null);
  const [logoSaveStatus, setLogoSaveStatus] = useState("");

  const dragIndex = useRef(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const [servicesContent, setServicesContent] = useState(DEFAULT_SERVICES_CONTENT);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesSaveStatus, setServicesSaveStatus] = useState("");
  const [newCard, setNewCard] = useState({ name: "", icon: "FaTruck", link: "" });
  const [showIconPicker, setShowIconPicker] = useState(null);

  const [areasContent, setAreasContent] = useState(DEFAULT_AREAS_CONTENT);
  const [areasLoading, setAreasLoading] = useState(true);
  const [areasSaveStatus, setAreasSaveStatus] = useState("");
  const [newArea, setNewArea] = useState({ label: "", slug: "" });

  const [galleryMeta, setGalleryMeta] = useState({ title: "Our <span>Projects</span>", subtitle: "SMS Infra construction company in Bangalore specializing in residential, commercial, infrastructure, machinery, and material production projects." });
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [galleryMetaSaveStatus, setGalleryMetaSaveStatus] = useState("");
  const [galleryImageFile, setGalleryImageFile] = useState(null);
  const [galleryImageCaption, setGalleryImageCaption] = useState("");
  const [galleryUploadStatus, setGalleryUploadStatus] = useState("");

  const [whyContent, setWhyContent] = useState(DEFAULT_WHYCHOOSE_CONTENT);
  const [whyLoading, setWhyLoading] = useState(true);
  const [whySaveStatus, setWhySaveStatus] = useState("");
  const [newPoint, setNewPoint] = useState({ heading: "", text: "" });

  const [testimonialsContent, setTestimonialsContent] = useState(DEFAULT_TESTIMONIALS_CONTENT);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);
  const [testimonialsSaveStatus, setTestimonialsSaveStatus] = useState("");
  const [newReview, setNewReview] = useState({ name: "", role: "", date: "", text: "" });

  const [faqContent, setFaqContent] = useState(DEFAULT_FAQ_CONTENT);
  const [faqLoading, setFaqLoading] = useState(true);
  const [faqSaveStatus, setFaqSaveStatus] = useState("");
  const [newFaqItem, setNewFaqItem] = useState({ question: "", answer: "" });

  const [footerContent, setFooterContent] = useState(DEFAULT_FOOTER_CONTENT);
  const [footerLoading, setFooterLoading] = useState(true);
  const [footerSaveStatus, setFooterSaveStatus] = useState("");

  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [newJob, setNewJob] = useState({ title: "", location: "", experience: "", salary: "", type: "Full Time", description: "", status: "active" });
  const [jobSaveStatus, setJobSaveStatus] = useState("");
  const [editingJob, setEditingJob] = useState(null);

  const [applications, setApplications] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);

  const [quotations, setQuotations] = useState([]);
  const [quotationsLoading, setQuotationsLoading] = useState(false);

  const [navbarContent, setNavbarContent] = useState({
    ctaText:   "Get Quote",
    ctaLink:   "/contact",
    instagram: "https://www.instagram.com/smsinfra",
    linkedin:  "https://www.linkedin.com/company/sms-builders-and-infra-projects/",
    facebook:  "",
    youtube:   "",
  });
  const [navbarLoading, setNavbarLoading] = useState(true);
  const [navbarSaveStatus, setNavbarSaveStatus] = useState("");

  const [contactPage, setContactPage] = useState(null);
  const [contactPageLoading, setContactPageLoading] = useState(false);
  const [contactPageSaveStatus, setContactPageSaveStatus] = useState("");
  const [newTickerMsg, setNewTickerMsg] = useState("");
  const [newService, setNewService] = useState("");
  const [newFeature, setNewFeature] = useState("");

  // ── ABOUT STATE ──
  const [aboutData, setAboutData] = useState({ ...DEFAULT_ABOUT });
  const [aboutLoading, setAboutLoading] = useState(false);
  const [aboutSaveStatus, setAboutSaveStatus] = useState("");
  const [aboutImgStatus, setAboutImgStatus] = useState("");

  // ── LEADS UNREAD BADGE ──
  const [leadsUnread, setLeadsUnread] = useState(0);

  useEffect(() => {
    // Fetch unread leads count for sidebar badge
    fetch(`${API}/leads/unread-count`)
      .then(r => r.json())
      .then(d => setLeadsUnread(d.count || 0))
      .catch(() => {});
  }, []);

  // Refresh unread count when leads tab is opened
  useEffect(() => {
    if (activeTab === "leads") {
      fetch(`${API}/leads/unread-count`)
        .then(r => r.json())
        .then(d => setLeadsUnread(d.count || 0))
        .catch(() => {});
    }
  }, [activeTab]);

  useEffect(() => {
    fetch(`${API}/hero`)
      .then((r) => r.json())
      .then((data) => {
        setHeroMedia(data);
        if (data?.tagline) setHeroTagline(data.tagline);
        if (data?.ticker && data.ticker.trim().length > 0) {
          setTickerList(data.ticker.split(",").map((s) => s.trim()).filter(Boolean));
        } else {
          setTickerList(DEFAULT_TICKER_ITEMS);
        }
        setHeroLoaded(true);
      })
      .catch(() => {
        setTickerList(DEFAULT_TICKER_ITEMS);
        setHeroLoaded(true);
      });
  }, []);

  useEffect(() => {
    fetch(`${API}/cms`)
      .then((res) => res.json())
      .then((data) => {
        setCms(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (activeTab === "announcements") fetchAnnouncements();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "homepage") {
      setHomeLoading(true);
      fetch(`${API}/cms`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.overview) { setHomeContent(data.overview); setSavedHomeContent(data.overview); }
          if (Array.isArray(data?.clientLogos)) { setClientLogos(data.clientLogos); setSavedLogosOrder(data.clientLogos); }
          setOrderChanged(false);
          setHomeLoading(false);
          setLogosLoading(false);
        })
        .catch(() => { setHomeLoading(false); setLogosLoading(false); });
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "services") {
      setServicesLoading(true);
      fetch(`${API}/cms`).then((res) => res.json()).then((data) => {
        if (data?.serviceCards?.cards?.length > 0) setServicesContent(data.serviceCards);
        else setServicesContent(DEFAULT_SERVICES_CONTENT);
        setServicesLoading(false);
      }).catch(() => setServicesLoading(false));
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "areas") {
      setAreasLoading(true);
      fetch(`${API}/cms`).then((res) => res.json()).then((data) => {
        if (data?.areasSection?.areas?.length > 0) setAreasContent(data.areasSection);
        else setAreasContent(DEFAULT_AREAS_CONTENT);
        setAreasLoading(false);
      }).catch(() => setAreasLoading(false));
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "whychoose") {
      setWhyLoading(true);
      fetch(`${API}/cms`).then((res) => res.json()).then((data) => {
        if (data?.whyChoose) {
          setWhyContent({
            title:    data.whyChoose.title    || DEFAULT_WHYCHOOSE_CONTENT.title,
            subtitle: data.whyChoose.subtitle || DEFAULT_WHYCHOOSE_CONTENT.subtitle,
            points:   Array.isArray(data.whyChoose.points) && data.whyChoose.points.length > 0 ? data.whyChoose.points : DEFAULT_WHYCHOOSE_CONTENT.points,
          });
        }
        setWhyLoading(false);
      }).catch(() => setWhyLoading(false));
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "testimonials") {
      setTestimonialsLoading(true);
      fetch(`${API}/cms`).then((res) => res.json()).then((data) => {
        if (data?.testimonials) {
          setTestimonialsContent({
            title:    data.testimonials.title    || DEFAULT_TESTIMONIALS_CONTENT.title,
            subtitle: data.testimonials.subtitle || DEFAULT_TESTIMONIALS_CONTENT.subtitle,
            items:    Array.isArray(data.testimonials.items) && data.testimonials.items.length > 0 ? data.testimonials.items : DEFAULT_TESTIMONIALS_CONTENT.items,
          });
        }
        setTestimonialsLoading(false);
      }).catch(() => setTestimonialsLoading(false));
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "faq") {
      setFaqLoading(true);
      fetch(`${API}/cms`).then((res) => res.json()).then((data) => {
        if (data?.faq) {
          setFaqContent({
            title:    data.faq.title    || DEFAULT_FAQ_CONTENT.title,
            subtitle: data.faq.subtitle || DEFAULT_FAQ_CONTENT.subtitle,
            items:    Array.isArray(data.faq.items) && data.faq.items.length > 0 ? data.faq.items : DEFAULT_FAQ_CONTENT.items,
          });
        }
        setFaqLoading(false);
      }).catch(() => setFaqLoading(false));
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "footer") {
      setFooterLoading(true);
      fetch(`${API}/cms`).then((res) => res.json()).then((data) => {
        setFooterContent({
          tagline:   data?.overview?.tagline1   || DEFAULT_FOOTER_CONTENT.tagline,
          subtext:   data?.overview?.tagline2   || DEFAULT_FOOTER_CONTENT.subtext,
          phone:     data?.contact?.phone       || DEFAULT_FOOTER_CONTENT.phone,
          phone2:    data?.contact?.phone2      ?? DEFAULT_FOOTER_CONTENT.phone2,
          email:     data?.contact?.email       || DEFAULT_FOOTER_CONTENT.email,
          email2:    data?.contact?.email2      ?? DEFAULT_FOOTER_CONTENT.email2,
          address:   data?.contact?.address     || DEFAULT_FOOTER_CONTENT.address,
          instagram: data?.social?.instagram    ?? DEFAULT_FOOTER_CONTENT.instagram,
          linkedin:  data?.social?.linkedin     ?? DEFAULT_FOOTER_CONTENT.linkedin,
          facebook:  data?.social?.facebook     ?? DEFAULT_FOOTER_CONTENT.facebook,
          youtube:   data?.social?.youtube      ?? DEFAULT_FOOTER_CONTENT.youtube,
        });
        setFooterLoading(false);
      }).catch(() => setFooterLoading(false));
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "careers") {
      setJobsLoading(true);
      fetch(`${API}/careers/jobs/all`).then(r => r.json()).then(data => { setJobs(Array.isArray(data) ? data : []); setJobsLoading(false); }).catch(() => setJobsLoading(false));
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "applications") {
      setAppsLoading(true);
      fetch(`${API}/careers/applications`).then(r => r.json()).then(data => { setApplications(Array.isArray(data) ? data : []); setAppsLoading(false); }).catch(() => setAppsLoading(false));
    }
  }, [activeTab]);

  const fetchQuotations = () => {
    setQuotationsLoading(true);
    fetch(`${API}/contact/quotations?t=${Date.now()}`).then(r => r.json()).then(data => { setQuotations(Array.isArray(data) ? data : []); setQuotationsLoading(false); }).catch(() => setQuotationsLoading(false));
  };

  useEffect(() => {
    if (activeTab === "quotations") fetchQuotations();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "navbar") {
      setNavbarLoading(true);
      fetch(`${API}/cms`).then((res) => res.json()).then((data) => {
        setNavbarContent({
          ctaText:   data?.navbar?.ctaText         || "Get Quote",
          ctaLink:   data?.navbar?.ctaLink         || "/contact",
          instagram: data?.navbarSocial?.instagram ?? "https://www.instagram.com/smsinfra",
          linkedin:  data?.navbarSocial?.linkedin  ?? "https://www.linkedin.com/company/sms-builders-and-infra-projects/",
          facebook:  data?.navbarSocial?.facebook  ?? "",
          youtube:   data?.navbarSocial?.youtube   ?? "",
        });
        setNavbarLoading(false);
      }).catch(() => setNavbarLoading(false));
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "gallery") {
      setGalleryLoading(true);
      fetch(`${API}/cms`).then((res) => res.json()).then((data) => {
        if (data?.gallery?.title) setGalleryMeta((p) => ({ ...p, title: data.gallery.title }));
        if (data?.gallery?.subtitle) setGalleryMeta((p) => ({ ...p, subtitle: data.gallery.subtitle }));
        if (Array.isArray(data?.gallery?.images) && data.gallery.images.length > 0) setGalleryImages(data.gallery.images);
        else setGalleryImages(DEFAULT_STATIC_GALLERY_IMAGES);
        setGalleryLoading(false);
      }).catch(() => { setGalleryImages(DEFAULT_STATIC_GALLERY_IMAGES); setGalleryLoading(false); });
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "contactpage") {
      setContactPageLoading(true);
      fetch(`${API}/cms/contactpage`).then(r => r.json()).then(data => {
        setContactPage(data && !data.error ? { ...DEFAULT_CONTACT_PAGE, ...data } : { ...DEFAULT_CONTACT_PAGE });
        setContactPageLoading(false);
      }).catch(() => { setContactPage({ ...DEFAULT_CONTACT_PAGE }); setContactPageLoading(false); });
    }
  }, [activeTab]);

  // ── ABOUT useEffect ──
  useEffect(() => {
    if (activeTab === "about") {
      setAboutLoading(true);
      fetch(`${API}/cms/about`)
        .then(r => r.json())
        .then(data => {
          if (data && !data.error) setAboutData({ ...DEFAULT_ABOUT, ...data });
          else setAboutData({ ...DEFAULT_ABOUT });
          setAboutLoading(false);
        })
        .catch(() => { setAboutData({ ...DEFAULT_ABOUT }); setAboutLoading(false); });
    }
  }, [activeTab]);

  const fetchAnnouncements = async () => {
    setAnnLoading(true);
    try {
      const res = await fetch(`${API}/announcements/all`, { headers: { "x-admin-password": ADMIN_PASSWORD } });
      const data = await res.json();
      setAnnouncements(Array.isArray(data) ? data : []);
    } catch { setAnnouncements([]); }
    setAnnLoading(false);
  };

  const handleHeroFileChange = (field, file) => { setHeroFiles((prev) => ({ ...prev, [field]: file })); };

  const handleHeroUpload = async (isUpdate = false) => {
    const { desktopImage, mobileImage, video } = heroFiles;
    if (!isUpdate && (!desktopImage || !mobileImage || !video)) { setHeroUploadStatus("error_missing"); setTimeout(() => setHeroUploadStatus(""), 3000); return; }
    if (isUpdate && !desktopImage && !mobileImage && !video) { setHeroUploadStatus("error_missing"); setTimeout(() => setHeroUploadStatus(""), 3000); return; }
    setHeroUploadStatus("uploading");
    const formData = new FormData();
    if (desktopImage) formData.append("desktopImage", desktopImage);
    if (mobileImage) formData.append("mobileImage", mobileImage);
    if (video) formData.append("video", video);
    if (heroTagline.trim()) formData.append("tagline", heroTagline.trim());
    formData.append("ticker", heroTicker);
    try {
      const res = await fetch(`${API}/hero`, { method: isUpdate ? "PATCH" : "POST", body: formData });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setHeroMedia(data);
      if (data?.tagline) setHeroTagline(data.tagline);
      if (data?.ticker !== undefined) setTickerList(data.ticker ? data.ticker.split(",").map((s) => s.trim()).filter(Boolean) : DEFAULT_TICKER_ITEMS);
      setHeroFiles({ desktopImage: null, mobileImage: null, video: null });
      setHeroUploadStatus("success");
      setTimeout(() => setHeroUploadStatus(""), 4000);
    } catch { setHeroUploadStatus("error"); setTimeout(() => setHeroUploadStatus(""), 3000); }
  };

  const handleSaveText = async () => {
    setSaveTextStatus("saving");
    const formData = new FormData();
    formData.append("tagline", heroTagline.trim());
    formData.append("ticker", heroTicker);
    try {
      const res = await fetch(`${API}/hero`, { method: "PATCH", body: formData });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setHeroMedia(data);
      if (data?.tagline !== undefined) setHeroTagline(data.tagline ?? "");
      if (data?.ticker !== undefined) setTickerList(data.ticker ? data.ticker.split(",").map((s) => s.trim()).filter(Boolean) : DEFAULT_TICKER_ITEMS);
      setSaveTextStatus("saved");
      setTimeout(() => setSaveTextStatus(""), 3000);
    } catch { setSaveTextStatus("error"); setTimeout(() => setSaveTextStatus(""), 3000); }
  };

  const handleAddTickerItem = () => {
    const val = newTickerItem.trim();
    if (!val) return;
    if (tickerList.some((t) => t.toLowerCase() === val.toLowerCase())) { setNewTickerItem(""); return; }
    setTickerList((prev) => [...prev, val]);
    setNewTickerItem("");
  };

  const handleRemoveTickerItem = (idx) => { setTickerList((prev) => prev.filter((_, i) => i !== idx)); };

  const handleHeroDelete = async () => {
    if (!window.confirm("Delete all hero media from Cloudinary? This cannot be undone.")) return;
    try {
      await fetch(`${API}/hero`, { method: "DELETE" });
      setHeroMedia(null); setHeroTagline(""); setTickerList(DEFAULT_TICKER_ITEMS);
      showAnnToast("✅ Hero media deleted.");
    } catch { showAnnToast("❌ Delete failed."); }
  };

  const handlePublish = async () => {
    if (!annMessage.trim()) return showAnnToast("⚠️ Please enter a message.");
    setAnnSaving(true);
    try {
      const res = await fetch(`${API}/announcements`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-password": ADMIN_PASSWORD },
        body: JSON.stringify({ message: annMessage, type: annType, handle: annHandle.trim() || undefined, instagramUrl: annInstagramUrl.trim() || undefined }),
      });
      if (res.ok) {
        setAnnMessage(""); setAnnType("info"); setAnnHandle(""); setAnnInstagramUrl("");
        showAnnToast("✅ Announcement published!");
        fetchAnnouncements();
      } else { showAnnToast("❌ Failed to publish."); }
    } catch { showAnnToast("❌ Server error."); }
    setAnnSaving(false);
  };

  const handleToggle = async (id) => {
    await fetch(`${API}/announcements/${id}/toggle`, { method: "PATCH", headers: { "x-admin-password": ADMIN_PASSWORD } });
    fetchAnnouncements();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this announcement?")) return;
    await fetch(`${API}/announcements/${id}`, { method: "DELETE", headers: { "x-admin-password": ADMIN_PASSWORD } });
    fetchAnnouncements();
  };

  const handleDeactivateAll = async () => {
    const active = announcements.filter((a) => a.isActive);
    if (active.length === 0) return showAnnToast("ℹ️ No active announcements.");
    if (!window.confirm(`Deactivate all ${active.length} active announcement(s)?`)) return;
    await Promise.all(active.map((a) => fetch(`${API}/announcements/${a._id}/toggle`, { method: "PATCH", headers: { "x-admin-password": ADMIN_PASSWORD } })));
    showAnnToast("✅ All announcements deactivated.");
    fetchAnnouncements();
  };

  const showAnnToast = (msg) => { setAnnToast(msg); setTimeout(() => setAnnToast(""), 3000); };

  const handleChange = (section, field, value) => {
    setCms((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  // eslint-disable-next-line no-unused-vars
  const handleArrayChange = (section, field, value) => {
    setCms((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value.split(",").map((v) => v.trim()) } }));
  };

  const handleSave = async () => {
    setSaveStatus("saving");
    try {
      const res = await fetch(`${API}/cms`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(cms) });
      if (!res.ok) throw new Error();
      setSaveStatus("saved"); setTimeout(() => setSaveStatus(""), 3000);
    } catch { setSaveStatus("error"); setTimeout(() => setSaveStatus(""), 3000); }
  };

  const handleHomeSave = async () => {
    setHomeSaveStatus("saving");
    try {
      const res = await fetch(`${API}/cms/overview`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(homeContent) });
      if (!res.ok) throw new Error();
      setSavedHomeContent(homeContent); setHomeSaveStatus("saved"); setTimeout(() => setHomeSaveStatus(""), 3000);
    } catch { setHomeSaveStatus("error"); setTimeout(() => setHomeSaveStatus(""), 3000); }
  };
  const handleHomeUndo = () => { if (savedHomeContent) { setHomeContent(savedHomeContent); showAnnToast("↩️ Changes undone — restored to last saved version."); } };
  const handleHomeReset = () => { if (!window.confirm("Reset all fields to original default values? This won't save until you click Save.")) return; setHomeContent(DEFAULT_HOME_CONTENT); showAnnToast("🔄 Fields reset to defaults — click Save to apply."); };

  const handleAddLogo = async () => {
    if (!newLogoFile) return;
    setLogoSaveStatus("saving");
    try {
      const formData = new FormData();
      formData.append("logo", newLogoFile);
      const res = await fetch(`${API}/cms/logos`, { method: "POST", body: formData });
      if (!res.ok) throw new Error();
      const updatedLogos = await res.json();
      setClientLogos(updatedLogos); setSavedLogosOrder(updatedLogos); setOrderChanged(false); setNewLogoFile(null);
      setLogoSaveStatus("saved"); setTimeout(() => setLogoSaveStatus(""), 3000);
    } catch { setLogoSaveStatus("error"); setTimeout(() => setLogoSaveStatus(""), 3000); }
  };

  const handleDeleteLogo = async (publicId) => {
    if (!publicId) { showAnnToast("⚠️ This logo has no ID — use 🧹 Remove Broken Logos."); return; }
    const isLocal = publicId.startsWith("local-");
    if (!window.confirm(isLocal ? "Remove this logo from the list?" : "Delete this logo from Cloudinary? This cannot be undone.")) return;
    try {
      const res = await fetch(`${API}/cms/logos/delete?pid=${encodeURIComponent(publicId)}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      const updatedLogos = await res.json();
      setClientLogos(updatedLogos); setSavedLogosOrder(updatedLogos); setOrderChanged(false);
      showAnnToast("✅ Logo removed.");
    } catch { showAnnToast("❌ Delete failed. Try again."); }
  };

  const handleDragStart = (idx) => { dragIndex.current = idx; };
  const handleDragOver = (e, idx) => { e.preventDefault(); setDragOverIndex(idx); };
  const handleDrop = (idx) => {
    const from = dragIndex.current;
    if (from === null || from === idx) { setDragOverIndex(null); return; }
    const reordered = [...clientLogos];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(idx, 0, moved);
    setClientLogos(reordered); setOrderChanged(true); dragIndex.current = null; setDragOverIndex(null);
  };
  const handleDragEnd = () => { dragIndex.current = null; setDragOverIndex(null); };

  const handleSaveOrder = async () => {
    setOrderSaveStatus("saving");
    try {
      const res = await fetch(`${API}/cms/logos/reorder`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ logos: clientLogos }) });
      if (!res.ok) throw new Error();
      const updatedLogos = await res.json();
      setClientLogos(updatedLogos); setSavedLogosOrder(updatedLogos); setOrderChanged(false);
      setOrderSaveStatus("saved"); setTimeout(() => setOrderSaveStatus(""), 3000);
    } catch { setOrderSaveStatus("error"); setTimeout(() => setOrderSaveStatus(""), 3000); }
  };
  const handleResetOrder = () => { setClientLogos([...savedLogosOrder]); setOrderChanged(false); showAnnToast("↩️ Logo order reset to last saved arrangement."); };

  const handleCleanupOrphanLogos = async () => {
    if (!window.confirm("Remove all logos that have no ID (broken/old entries)? Cannot be undone.")) return;
    const cleaned = clientLogos.filter((l) => l.publicId);
    try {
      const res = await fetch(`${API}/cms/logos/reorder`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ logos: cleaned }) });
      if (!res.ok) throw new Error();
      const updatedLogos = await res.json();
      setClientLogos(updatedLogos); setSavedLogosOrder(updatedLogos); setOrderChanged(false);
      showAnnToast(`✅ Cleaned up. ${clientLogos.length - cleaned.length} broken logo(s) removed.`);
    } catch { showAnnToast("❌ Cleanup failed."); }
  };

  const handleServicesSave = async () => {
    setServicesSaveStatus("saving");
    try {
      const res = await fetch(`${API}/cms/servicecards`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(servicesContent) });
      if (!res.ok) throw new Error();
      setServicesSaveStatus("saved"); setTimeout(() => setServicesSaveStatus(""), 3000);
    } catch { setServicesSaveStatus("error"); setTimeout(() => setServicesSaveStatus(""), 3000); }
  };
  const handleServicesReset = () => { if (!window.confirm("Reset services to original defaults? This won't save until you click Save.")) return; setServicesContent(DEFAULT_SERVICES_CONTENT); showAnnToast("🔄 Services reset to defaults — click Save to apply."); };
  const handleCardChange = (idx, field, value) => { setServicesContent((prev) => { const cards = [...prev.cards]; cards[idx] = { ...cards[idx], [field]: value }; return { ...prev, cards }; }); };
  const handleDeleteCard = (idx) => { if (!window.confirm("Remove this service card?")) return; setServicesContent((prev) => ({ ...prev, cards: prev.cards.filter((_, i) => i !== idx) })); };
  const handleAddCard = () => {
    if (!newCard.name.trim() || !newCard.link.trim()) { showAnnToast("⚠️ Name and link are required."); return; }
    setServicesContent((prev) => ({ ...prev, cards: [...prev.cards, { ...newCard }] }));
    setNewCard({ name: "", icon: "FaTruck", link: "" });
    showAnnToast("✅ Card added — click Save to apply.");
  };

  const handleAreasSave = async () => {
    setAreasSaveStatus("saving");
    try {
      const res = await fetch(`${API}/cms/areas`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(areasContent) });
      if (!res.ok) throw new Error();
      setAreasSaveStatus("saved"); setTimeout(() => setAreasSaveStatus(""), 3000);
    } catch { setAreasSaveStatus("error"); setTimeout(() => setAreasSaveStatus(""), 3000); }
  };
  const handleAreasReset = () => { if (!window.confirm("Reset areas to original defaults? This won't save until you click Save.")) return; setAreasContent(DEFAULT_AREAS_CONTENT); showAnnToast("🔄 Areas reset to defaults — click Save to apply."); };
  const handleAreaChange = (idx, field, value) => { setAreasContent((prev) => { const areas = [...prev.areas]; areas[idx] = { ...areas[idx], [field]: value }; return { ...prev, areas }; }); };
  const handleDeleteArea = (idx) => { if (!window.confirm("Remove this area?")) return; setAreasContent((prev) => ({ ...prev, areas: prev.areas.filter((_, i) => i !== idx) })); };
  const handleAddArea = () => {
    if (!newArea.label.trim() || !newArea.slug.trim()) { showAnnToast("⚠️ Label and slug are required."); return; }
    setAreasContent((prev) => ({ ...prev, areas: [...prev.areas, { ...newArea }] }));
    setNewArea({ label: "", slug: "" });
    showAnnToast("✅ Area added — click Save to apply.");
  };

  const handleGalleryMetaSave = async () => {
    setGalleryMetaSaveStatus("saving");
    try {
      const res = await fetch(`${API}/cms/gallery/meta`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: galleryMeta.title, subtitle: galleryMeta.subtitle }) });
      if (!res.ok) throw new Error();
      setGalleryMetaSaveStatus("saved"); setTimeout(() => setGalleryMetaSaveStatus(""), 3000);
    } catch { setGalleryMetaSaveStatus("error"); setTimeout(() => setGalleryMetaSaveStatus(""), 3000); }
  };
  const handleGalleryUpload = async () => {
    if (!galleryImageFile) return;
    setGalleryUploadStatus("uploading");
    try {
      const formData = new FormData();
      formData.append("image", galleryImageFile);
      if (galleryImageCaption.trim()) formData.append("caption", galleryImageCaption.trim());
      const res = await fetch(`${API}/cms/gallery`, { method: "POST", body: formData });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setGalleryImages(data.images || []); setGalleryImageFile(null); setGalleryImageCaption("");
      setGalleryUploadStatus("success"); setTimeout(() => setGalleryUploadStatus(""), 3000);
    } catch { setGalleryUploadStatus("error"); setTimeout(() => setGalleryUploadStatus(""), 3000); }
  };
  // eslint-disable-next-line no-unused-vars
  const handleGalleryDelete = async (publicId) => {
    if (!window.confirm("Delete this image from Cloudinary? Cannot be undone.")) return;
    try {
      const res = await fetch(`${API}/cms/gallery/${encodeURIComponent(publicId)}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setGalleryImages(data.images || []); showAnnToast("✅ Gallery image deleted.");
    } catch { showAnnToast("❌ Delete failed."); }
  };
  const handleGalleryCaptionUpdate = async (publicId, caption) => {
    try {
      const res = await fetch(`${API}/cms/gallery/caption/${encodeURIComponent(publicId)}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ caption }) });
      if (!res.ok) throw new Error();
      showAnnToast("✅ Caption updated.");
    } catch { showAnnToast("❌ Failed to update caption."); }
  };
  const handleGalleryResetMeta = async () => {
    if (!window.confirm("Reset title & subtitle to original defaults?")) return;
    try {
      const res = await fetch(`${API}/cms/gallery/meta`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: DEFAULT_GALLERY_META.title, subtitle: DEFAULT_GALLERY_META.subtitle }) });
      if (!res.ok) throw new Error();
      setGalleryMeta({ ...DEFAULT_GALLERY_META }); showAnnToast("🔄 Title & subtitle reset to defaults.");
    } catch { showAnnToast("❌ Reset failed."); }
  };
  const handleGalleryResetImages = async () => {
    if (!window.confirm("Reset all gallery images to the original 18 static project images? All uploaded Cloudinary images will be removed.")) return;
    try {
      const res = await fetch(`${API}/cms/gallery/reset`, { method: "PATCH" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setGalleryImages(data.images || DEFAULT_STATIC_GALLERY_IMAGES); showAnnToast("🔄 Gallery reset to original 18 project images.");
    } catch { showAnnToast("❌ Reset failed."); }
  };
  const handleGalleryImageDelete = async (publicId, isStatic) => {
    const msg = isStatic ? "Remove this static project image from the gallery?" : "Delete this image from Cloudinary? Cannot be undone.";
    if (!window.confirm(msg)) return;
    try {
      const res = await fetch(`${API}/cms/gallery/delete?pid=${encodeURIComponent(publicId)}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setGalleryImages(data.images || []); showAnnToast("✅ Image removed.");
    } catch { showAnnToast("❌ Delete failed."); }
  };

  const handleWhySave = async () => {
    setWhySaveStatus("saving");
    try {
      const res = await fetch(`${API}/cms/whychoose`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(whyContent) });
      if (!res.ok) throw new Error();
      setWhySaveStatus("saved"); setTimeout(() => setWhySaveStatus(""), 3000);
    } catch { setWhySaveStatus("error"); setTimeout(() => setWhySaveStatus(""), 3000); }
  };
  const handleWhyReset = () => { if (!window.confirm("Reset Why Choose section to original defaults? This won't save until you click Save.")) return; setWhyContent(DEFAULT_WHYCHOOSE_CONTENT); showAnnToast("🔄 Why Choose reset to defaults — click Save to apply."); };
  const handlePointChange = (idx, field, value) => { setWhyContent((prev) => { const points = [...prev.points]; points[idx] = { ...points[idx], [field]: value }; return { ...prev, points }; }); };
  const handleDeletePoint = (idx) => { if (!window.confirm("Remove this point?")) return; setWhyContent((prev) => ({ ...prev, points: prev.points.filter((_, i) => i !== idx) })); };
  const handleAddPoint = () => {
    if (!newPoint.heading.trim() || !newPoint.text.trim()) { showAnnToast("⚠️ Heading and description are required."); return; }
    setWhyContent((prev) => ({ ...prev, points: [...prev.points, { ...newPoint }] }));
    setNewPoint({ heading: "", text: "" }); showAnnToast("✅ Point added — click Save to apply.");
  };

  const handleTestimonialsSave = async () => {
    setTestimonialsSaveStatus("saving");
    try {
      const res = await fetch(`${API}/cms/testimonials`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(testimonialsContent) });
      if (!res.ok) throw new Error();
      setTestimonialsSaveStatus("saved"); setTimeout(() => setTestimonialsSaveStatus(""), 3000);
    } catch { setTestimonialsSaveStatus("error"); setTimeout(() => setTestimonialsSaveStatus(""), 3000); }
  };
  const handleTestimonialsReset = () => { if (!window.confirm("Reset testimonials to original defaults? This won't save until you click Save.")) return; setTestimonialsContent(DEFAULT_TESTIMONIALS_CONTENT); showAnnToast("🔄 Testimonials reset to defaults — click Save to apply."); };
  const handleReviewChange = (idx, field, value) => { setTestimonialsContent((prev) => { const items = [...prev.items]; items[idx] = { ...items[idx], [field]: value }; return { ...prev, items }; }); };
  const handleDeleteReview = (idx) => { if (!window.confirm("Remove this review?")) return; setTestimonialsContent((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== idx) })); };
  const handleAddReview = () => {
    if (!newReview.name.trim() || !newReview.text.trim()) { showAnnToast("⚠️ Name and review text are required."); return; }
    setTestimonialsContent((prev) => ({ ...prev, items: [...prev.items, { ...newReview }] }));
    setNewReview({ name: "", role: "", date: "", text: "" }); showAnnToast("✅ Review added — click Save to apply.");
  };

  const handleFaqSave = async () => {
    setFaqSaveStatus("saving");
    try {
      const res = await fetch(`${API}/cms/faq`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(faqContent) });
      if (!res.ok) throw new Error();
      setFaqSaveStatus("saved"); setTimeout(() => setFaqSaveStatus(""), 3000);
    } catch { setFaqSaveStatus("error"); setTimeout(() => setFaqSaveStatus(""), 3000); }
  };
  const handleFaqReset = () => { if (!window.confirm("Reset FAQ to original defaults? This won't save until you click Save.")) return; setFaqContent(DEFAULT_FAQ_CONTENT); showAnnToast("🔄 FAQ reset to defaults — click Save to apply."); };
  const handleFaqItemChange = (idx, field, value) => { setFaqContent((prev) => { const items = [...prev.items]; items[idx] = { ...items[idx], [field]: value }; return { ...prev, items }; }); };
  const handleDeleteFaqItem = (idx) => { if (!window.confirm("Remove this FAQ item?")) return; setFaqContent((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== idx) })); };
  const handleAddFaqItem = () => {
    if (!newFaqItem.question.trim() || !newFaqItem.answer.trim()) { showAnnToast("⚠️ Question and answer are required."); return; }
    setFaqContent((prev) => ({ ...prev, items: [...prev.items, { ...newFaqItem }] }));
    setNewFaqItem({ question: "", answer: "" }); showAnnToast("✅ FAQ item added — click Save to apply.");
  };

  const handleFooterSave = async () => {
    setFooterSaveStatus("saving");
    try {
      await fetch(`${API}/cms/overview`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tagline1: footerContent.tagline, tagline2: footerContent.subtext }) });
      await fetch(`${API}/cms`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contact: { phone: footerContent.phone, phone2: footerContent.phone2, email: footerContent.email, email2: footerContent.email2, address: footerContent.address }, social: { instagram: footerContent.instagram, linkedin: footerContent.linkedin, facebook: footerContent.facebook, youtube: footerContent.youtube } }) });
      setFooterSaveStatus("saved"); setTimeout(() => setFooterSaveStatus(""), 3000);
    } catch { setFooterSaveStatus("error"); setTimeout(() => setFooterSaveStatus(""), 3000); }
  };
  const handleFooterReset = () => { if (!window.confirm("Reset footer to original defaults? This won't save until you click Save.")) return; setFooterContent(DEFAULT_FOOTER_CONTENT); showAnnToast("🔄 Footer reset to defaults — click Save to apply."); };

  const handleJobSave = async () => {
    setJobSaveStatus("saving");
    try {
      const url = editingJob ? `${API}/careers/jobs/${editingJob._id}` : `${API}/careers/jobs`;
      const method = editingJob ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editingJob || newJob) });
      if (!res.ok) throw new Error();
      const saved = await res.json();
      if (editingJob) { setJobs(prev => prev.map(j => j._id === saved._id ? saved : j)); setEditingJob(null); }
      else { setJobs(prev => [saved, ...prev]); setNewJob({ title: "", location: "", experience: "", salary: "", type: "Full Time", description: "", status: "active" }); }
      setJobSaveStatus("saved"); setTimeout(() => setJobSaveStatus(""), 3000);
    } catch { setJobSaveStatus("error"); setTimeout(() => setJobSaveStatus(""), 3000); }
  };
  const handleJobDelete = async (id) => { if (!window.confirm("Delete this job listing?")) return; await fetch(`${API}/careers/jobs/${id}`, { method: "DELETE" }); setJobs(prev => prev.filter(j => j._id !== id)); showAnnToast("✅ Job deleted."); };
  const handleJobToggleStatus = async (job) => {
    const newStatus = job.status === "active" ? "inactive" : "active";
    const res = await fetch(`${API}/careers/jobs/${job._id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: newStatus }) });
    const updated = await res.json();
    setJobs(prev => prev.map(j => j._id === updated._id ? updated : j));
  };
  const handleAppStatusUpdate = async (id, status) => {
    const res = await fetch(`${API}/careers/applications/${id}/status`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    const updated = await res.json();
    setApplications(prev => prev.map(a => a._id === updated._id ? updated : a));
  };
  const handleAppDelete = async (id) => { if (!window.confirm("Delete this application?")) return; await fetch(`${API}/careers/applications/${id}`, { method: "DELETE" }); setApplications(prev => prev.filter(a => a._id !== id)); showAnnToast("✅ Application deleted."); };
  const handleQuotationStatusUpdate = async (id, status) => {
    const res = await fetch(`${API}/contact/quotations/${id}/status`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    const updated = await res.json();
    setQuotations(prev => prev.map(q => q._id === updated._id ? updated : q));
  };
  const handleQuotationDelete = async (id) => { if (!window.confirm("Delete this quotation?")) return; await fetch(`${API}/contact/quotations/${id}`, { method: "DELETE" }); setQuotations(prev => prev.filter(q => q._id !== id)); showAnnToast("✅ Quotation deleted."); };

  const handleNavbarSave = async () => {
    setNavbarSaveStatus("saving");
    try {
      const res = await fetch(`${API}/cms/navbar`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ctaText: navbarContent.ctaText, ctaLink: navbarContent.ctaLink, instagram: navbarContent.instagram, linkedin: navbarContent.linkedin, facebook: navbarContent.facebook, youtube: navbarContent.youtube }) });
      if (!res.ok) throw new Error();
      setNavbarSaveStatus("saved"); setTimeout(() => setNavbarSaveStatus(""), 3000);
    } catch { setNavbarSaveStatus("error"); setTimeout(() => setNavbarSaveStatus(""), 3000); }
  };
  const handleNavbarReset = () => {
    if (!window.confirm("Reset navbar to original defaults? This won't save until you click Save.")) return;
    setNavbarContent({ ctaText: "Get Quote", ctaLink: "/contact", instagram: "https://www.instagram.com/smsinfra", linkedin: "https://www.linkedin.com/company/sms-builders-and-infra-projects/", facebook: "", youtube: "" });
    showAnnToast("🔄 Navbar reset to defaults — click Save to apply.");
  };

  const handleContactPageSave = async () => {
    setContactPageSaveStatus("saving");
    try {
      const res = await fetch(`${API}/cms/contactpage`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(contactPage) });
      if (!res.ok) throw new Error();
      setContactPageSaveStatus("saved"); setTimeout(() => setContactPageSaveStatus(""), 3000);
    } catch { setContactPageSaveStatus("error"); setTimeout(() => setContactPageSaveStatus(""), 3000); }
  };
  const cpSet = (key, val) => setContactPage(prev => ({ ...prev, [key]: val }));

  // ── ABOUT HANDLERS ──
  const handleAboutSave = async () => {
    setAboutSaveStatus("saving");
    try {
      const res = await fetch(`${API}/cms/about`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(aboutData) });
      if (!res.ok) throw new Error();
      setAboutSaveStatus("saved"); setTimeout(() => setAboutSaveStatus(""), 3000);
    } catch { setAboutSaveStatus("error"); setTimeout(() => setAboutSaveStatus(""), 3000); }
  };
  const handleAboutReset = () => {
    if (!window.confirm("Reset About page to original defaults? This won't save until you click Save.")) return;
    setAboutData({ ...DEFAULT_ABOUT });
    showAnnToast("🔄 About page reset to defaults — click Save to apply.");
  };
  const aSet = (field, value) => setAboutData(prev => ({ ...prev, [field]: value }));
  const aVal = field => aboutData[field] ?? DEFAULT_ABOUT[field] ?? "";
  const handleAboutImageUpload = async (field, file) => {
    setAboutImgStatus(field + "_uploading");
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("folder", "about");
      const res = await fetch(`${API}/cms/upload-image`, { method: "POST", body: formData });
      if (!res.ok) throw new Error();
      const data = await res.json();
      aSet(field, data.url);
      setAboutImgStatus(field + "_done");
      setTimeout(() => setAboutImgStatus(""), 3000);
    } catch { setAboutImgStatus(field + "_error"); setTimeout(() => setAboutImgStatus(""), 3000); }
  };

  const activeCount = announcements.filter((a) => a.isActive).length;
  const orphanCount = clientLogos.filter((l) => !l.publicId).length;

  if (loading) return <h2 className="admin-loading">Loading...</h2>;
  if (!cms) return <h2>No Data</h2>;

  const canSaveText = heroLoaded && (heroTagline.trim().length > 0 || tickerList.length > 0);
  const hasUnsavedChanges = savedHomeContent && JSON.stringify(homeContent) !== JSON.stringify(savedHomeContent);

  // Style helpers for About tab
  const fb = { background: "rgba(255,255,255,0.04)", border: "1px dashed #444", borderRadius: 10, padding: "14px 16px", marginBottom: 12 };
  const fl = { fontSize: 11, color: "#888", fontWeight: 600, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 };
  const fi = { width: "100%", boxSizing: "border-box" };
  const sec = { color: "#e0e0ff", fontSize: 14, marginBottom: 12, borderBottom: "1px solid #2a2a2a", paddingBottom: 8, marginTop: 20 };

  // ── AboutImgField helper ──
  const AboutImgField = ({ field, label, placeholder }) => (
    <div style={fb}>
      <span style={fl}>{label}</span>
      <input type="text" value={aVal(field)} onChange={e => aSet(field, e.target.value)} style={{ ...fi, marginBottom: 8 }} placeholder={placeholder} />
      {aVal(field) && <img src={aVal(field)} alt="" style={{ maxWidth: 200, maxHeight: 80, objectFit: "cover", borderRadius: 6, display: "block", marginBottom: 8 }} onError={e => e.target.style.display = "none"} />}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => { if (e.target.files[0]) handleAboutImageUpload(field, e.target.files[0]); }} style={{ fontSize: 12 }} />
        {aboutImgStatus === field + "_uploading" && <span style={{ color: "#f5a623", fontSize: 12 }}>⏳ Uploading...</span>}
        {aboutImgStatus === field + "_done"      && <span style={{ color: "#6ee7b7", fontSize: 12 }}>✅ Uploaded!</span>}
        {aboutImgStatus === field + "_error"     && <span style={{ color: "#fca5a5", fontSize: 12 }}>❌ Failed</span>}
      </div>
      <p style={{ fontSize: 11, color: "#555", marginTop: 6 }}>Enter a path/URL above, or upload a new image to Cloudinary.</p>
    </div>
  );

  const IconPickerPanel = ({ onSelect, onClose }) => (
    <div style={{ position: "absolute", top: "100%", left: 0, zIndex: 100, background: "#1a1a2e", border: "1px solid #333", borderRadius: 10, padding: 12, display: "flex", flexWrap: "wrap", gap: 8, width: 280, boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
      {Object.keys(ICON_MAP).map((iconName) => {
        const Icon = ICON_MAP[iconName];
        return (
          <button key={iconName} onClick={() => { onSelect(iconName); onClose(); }} title={iconName}
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid #333", borderRadius: 6, padding: "6px 8px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, color: "#6ee7b7", minWidth: 52 }}>
            <Icon style={{ fontSize: 18 }} />
            <span style={{ fontSize: 9, color: "#666" }}>{iconName.replace("Fa", "")}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <h2>Admin Panel</h2>
        <button onClick={() => setActiveTab("navbar")}>🧭 Navbar</button>
        <button onClick={() => setActiveTab("hero")}>Hero</button>
        <button onClick={() => setActiveTab("services")}>Services</button>
        <button onClick={() => setActiveTab("areas")}>📍 Areas</button>
        <button onClick={() => setActiveTab("gallery")}>🖼 Gallery</button>
        <button onClick={() => setActiveTab("whychoose")}>✅ Why Choose</button>
        <button onClick={() => setActiveTab("testimonials")}>💬 Testimonials</button>
        <button onClick={() => setActiveTab("faq")}>❓ FAQ</button>
        <button onClick={() => setActiveTab("footer")}>🦶 Footer</button>
        <button onClick={() => setActiveTab("about")}>📄 About Page</button>
        <button onClick={() => setActiveTab("contact")}>Contact</button>
        <button onClick={() => setActiveTab("contactpage")}>📞 Contact Page</button>
        <button onClick={() => setActiveTab("announcements")}>📢 Announcements</button>
        <button onClick={() => setActiveTab("careers")}>💼 Jobs</button>
        <button onClick={() => setActiveTab("applications")}>📄 Applications</button>
        <button onClick={() => setActiveTab("quotations")}>📋 Quotations</button>
        <button onClick={() => setActiveTab("homepage")}>🏠 Home Page</button>
        <button onClick={() => setActiveTab("servicePages")}>🛠 Service Pages</button>
        <button onClick={() => setActiveTab("adminProjects")}>📁 Projects</button>
        <button onClick={() => setActiveTab("serviceHub")}>🌐 Service Hub</button>
        {/* ── LEADS BUTTON WITH UNREAD BADGE ── */}
        <button onClick={() => { setActiveTab("leads"); setLeadsUnread(0); }} style={{ position: "relative" }}>
          🔔 Leads
          {leadsUnread > 0 && (
            <span style={{
              position: "absolute", top: 6, right: 8,
              background: "#f59e0b", color: "#000",
              borderRadius: "50%", width: 18, height: 18,
              fontSize: 10, fontWeight: 800,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{leadsUnread}</span>
          )}
        </button>
      </div>

      <div className="admin-content">

        {activeTab === "servicePages" && <AdminServicePages />}
        {activeTab === "adminProjects" && <AdminProjects />}
        {activeTab === "serviceHub" && <AdminServiceHub />}
        {activeTab === "leads" && <AdminLeads />}


        {activeTab==="navbar"&&(
          <div className="admin-section">
            <h2>🧭 Navbar Settings</h2>
            <p style={{fontSize:12,color:"#666",marginBottom:20}}>Edit the navbar CTA button and social media links shown in the mobile menu. These are separate from the Footer social icons.</p>
            {navbarLoading?<p style={{color:"#888"}}>⏳ Loading from DB...</p>:(
              <>
                <div style={{borderBottom:"1px solid #2a2a2a",paddingBottom:20,marginBottom:20}}>
                  <h3 style={{color:"#e0e0ff",fontSize:14,marginBottom:14}}>🔘 CTA Button</h3>
                  <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:12}}><span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>Button Text</span><input type="text" value={navbarContent.ctaText||""} onChange={e=>setNavbarContent(p=>({...p,ctaText:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}} placeholder="Get Quote"/><p style={{fontSize:11,color:"#555",marginTop:6}}>Shown on the button at the end of the navbar (desktop) and mobile menu.</p></div>
                  <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px"}}><span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>Button Link</span><input type="text" value={navbarContent.ctaLink||""} onChange={e=>setNavbarContent(p=>({...p,ctaLink:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}} placeholder="/contact"/><p style={{fontSize:11,color:"#555",marginTop:6}}>Page the button navigates to e.g. <span style={{color:"#6ee7b7"}}>/contact</span></p></div>
                </div>
                <div style={{marginBottom:20}}>
                  <h3 style={{color:"#e0e0ff",fontSize:14,marginBottom:6}}>📱 Social Media Links</h3>
                  <p style={{fontSize:12,color:"#666",marginBottom:14}}>These links appear in the mobile menu and the footer. Instagram & LinkedIn always show with fallback. Facebook & YouTube only appear if set.</p>
                  <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:12}}><span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}><FaInstagram style={{color:"#e1306c",fontSize:14,verticalAlign:"middle",marginRight:5}}/> Instagram URL</span><input type="text" value={navbarContent.instagram??""} onChange={e=>setNavbarContent(p=>({...p,instagram:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}} placeholder="https://www.instagram.com/smsinfra"/></div>
                  <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:12}}><span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}><FaLinkedinIn style={{color:"#0077b5",fontSize:14,verticalAlign:"middle",marginRight:5}}/> LinkedIn URL</span><input type="text" value={navbarContent.linkedin??""} onChange={e=>setNavbarContent(p=>({...p,linkedin:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}} placeholder="https://www.linkedin.com/company/sms-builders-and-infra-projects/"/></div>
                  <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:12}}><span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}><FaFacebook style={{color:"#1877f2",fontSize:14,verticalAlign:"middle",marginRight:5}}/> Facebook URL <span style={{fontSize:10,color:"#555",fontWeight:400}}>(leave blank to hide)</span></span><input type="text" value={navbarContent.facebook??""} onChange={e=>setNavbarContent(p=>({...p,facebook:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}} placeholder="https://www.facebook.com/smsinfra"/></div>
                  <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:20}}><span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}><FaYoutube style={{color:"#ff0000",fontSize:14,verticalAlign:"middle",marginRight:5}}/> YouTube URL <span style={{fontSize:10,color:"#555",fontWeight:400}}>(leave blank to hide)</span></span><input type="text" value={navbarContent.youtube??""} onChange={e=>setNavbarContent(p=>({...p,youtube:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}} placeholder="https://www.youtube.com/@smsinfra"/></div>
                </div>
                <div style={{background:"rgba(110,231,183,0.05)",border:"1px solid rgba(110,231,183,0.15)",borderRadius:8,padding:"10px 14px",marginBottom:20}}><p style={{fontSize:12,color:"#6ee7b7",margin:0}}>ℹ️ These social links appear only in the <strong>mobile menu</strong> and are stored separately from the Footer social icons. Update the <strong>🦶 Footer</strong> tab to change footer icons independently. The brand name <strong>"SMS INFRA"</strong> is hardcoded in the navbar component.</p></div>
                <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                  <button className="save-btn" onClick={handleNavbarSave} disabled={navbarSaveStatus==="saving"} style={{flex:1,background:"rgba(110,231,183,0.12)",border:"1px solid rgba(110,231,183,0.3)"}}>{navbarSaveStatus==="saving"&&"⏳ Saving..."}{navbarSaveStatus==="saved"&&"✅ Saved! Navbar & social links are live."}{navbarSaveStatus==="error"&&"❌ Save failed. Try again."}{navbarSaveStatus===""&&"💾 Save Navbar"}</button>
                  <button onClick={handleNavbarReset} style={{padding:"10px 16px",borderRadius:8,border:"1px solid #444",background:"rgba(255,255,255,0.04)",color:"#888",cursor:"pointer",fontSize:13,fontWeight:600,whiteSpace:"nowrap"}}>🔄 Reset to Defaults</button>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab==="hero"&&(
          <div className="admin-section">
            <h2>Hero Section</h2>
            <h3 style={{color:"#e0e0ff",marginBottom:4,fontSize:15}}>🎬 Hero Media Upload</h3>
            <p style={{fontSize:12,color:"#666",marginBottom:16}}>Upload files directly to Cloudinary. Replaces the current hero media on the live site.</p>
            {heroMedia?(<div style={{background:"rgba(110,231,183,0.06)",border:"1px solid rgba(110,231,183,0.2)",borderRadius:8,padding:"10px 14px",marginBottom:16,fontSize:12}}><p style={{color:"#6ee7b7",fontWeight:700,margin:"0 0 6px"}}>✅ Media currently live on Cloudinary</p><p style={{fontSize:11,color:"#555",margin:"2px 0",wordBreak:"break-all"}}>🖥 Desktop: {heroMedia.desktopImage?.url}</p><p style={{fontSize:11,color:"#555",margin:"2px 0",wordBreak:"break-all"}}>📱 Mobile: {heroMedia.mobileImage?.url}</p><p style={{fontSize:11,color:"#555",margin:"2px 0",wordBreak:"break-all"}}>🎥 Video: {heroMedia.video?.url}</p>{heroMedia.tagline&&<p style={{fontSize:11,color:"#555",margin:"2px 0"}}>💬 Tagline: {heroMedia.tagline}</p>}{heroMedia.ticker&&<p style={{fontSize:11,color:"#555",margin:"2px 0"}}>📜 Ticker ({heroMedia.ticker.split(",").filter(Boolean).length} items): {heroMedia.ticker}</p>}</div>):(<div style={{background:"rgba(255,165,0,0.06)",border:"1px solid rgba(255,165,0,0.2)",borderRadius:8,padding:"10px 14px",marginBottom:16,fontSize:12,color:"#f5a623"}}>⚠️ No media uploaded yet — site is using local fallback files</div>)}
            <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:12}}><span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>💬 Hero Tagline</span>{heroMedia?.tagline&&<p style={{fontSize:11,color:"#555",margin:"0 0 6px",fontStyle:"italic"}}>Currently saved: <span style={{color:"#6ee7b7"}}>{heroMedia.tagline}</span></p>}<input type="text" placeholder={heroMedia?.tagline||"Turning Dreams Into Reality"} value={heroTagline} onChange={e=>setHeroTagline(e.target.value)} style={{width:"100%",boxSizing:"border-box"}}/><p style={{fontSize:11,color:"#555",margin:"6px 0 0"}}>Shown on the hero glass card.</p></div>
            <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:12}}>
              <span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>📜 Services Ticker</span>
              {!heroLoaded?<p style={{fontSize:12,color:"#555",fontStyle:"italic",margin:"8px 0"}}>⏳ Loading current list from DB...</p>:(
                <>
                  <p style={{fontSize:11,color:"#555",margin:"0 0 10px"}}>{tickerList.length} item{tickerList.length!==1?"s":""} — all will scroll in the hero ticker.{" "}{heroMedia?.ticker?<span style={{color:"#6ee7b7"}}>✅ Loaded from DB.</span>:<span style={{color:"#f5a623"}}>⚠️ DB empty — showing defaults. Save to push to live site.</span>}</p>
                  <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:12,minHeight:32}}>{tickerList.length===0&&<span style={{fontSize:12,color:"#555",fontStyle:"italic"}}>No items yet — add some below.</span>}{tickerList.map((item,idx)=><div key={idx} style={{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(110,231,183,0.1)",border:"1px solid rgba(110,231,183,0.25)",borderRadius:20,padding:"4px 10px 4px 12px",fontSize:12,color:"#6ee7b7"}}><span>{item}</span><button onClick={()=>handleRemoveTickerItem(idx)} style={{background:"none",border:"none",cursor:"pointer",color:"#fca5a5",fontSize:16,lineHeight:1,padding:"0 2px",display:"flex",alignItems:"center"}}>×</button></div>)}</div>
                  <div style={{display:"flex",gap:8}}><input type="text" placeholder="e.g. Ready Mix Concrete" value={newTickerItem} onChange={e=>setNewTickerItem(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")handleAddTickerItem();}} style={{flex:1,boxSizing:"border-box"}}/><button className="save-btn" onClick={handleAddTickerItem} style={{padding:"0 16px",whiteSpace:"nowrap"}}>+ Add</button></div>
                  <p style={{fontSize:11,color:"#555",margin:"8px 0 0"}}>Press Enter or click + Add. Click × on a tag to remove it. <strong style={{color:"#666"}}>Click "Save Tagline & Ticker" below to apply changes to the live site.</strong></p>
                </>
              )}
            </div>
            <div style={{marginBottom:20}}><button className="save-btn" onClick={handleSaveText} disabled={saveTextStatus==="saving"||!canSaveText} style={{width:"100%",background:"rgba(110,231,183,0.12)",border:"1px solid rgba(110,231,183,0.3)"}}>{saveTextStatus==="saving"&&"⏳ Saving..."}{saveTextStatus==="saved"&&`✅ Saved! ${tickerList.length} ticker items + tagline are live.`}{saveTextStatus==="error"&&"❌ Save failed. Try again."}{saveTextStatus===""&&`💾 Save Tagline & Ticker (${tickerList.length} items)`}</button><p style={{fontSize:11,color:"#555",marginTop:6}}>Saves text only — no need to re-upload any media files.</p></div>
            <div style={{borderTop:"1px solid #2a2a2a",paddingTop:20,marginBottom:12}}><p style={{fontSize:12,color:"#666",marginBottom:16}}>To replace images or video, pick files below and click Upload / Update.</p></div>
            <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:12}}><span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>🖥 Desktop Background Image</span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>handleHeroFileChange("desktopImage",e.target.files[0])}/>{heroFiles.desktopImage&&<p style={{fontSize:12,color:"#6ee7b7",marginTop:6}}>✓ {heroFiles.desktopImage.name}</p>}</div>
            <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:12}}><span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>📱 Mobile Background Image</span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>handleHeroFileChange("mobileImage",e.target.files[0])}/>{heroFiles.mobileImage&&<p style={{fontSize:12,color:"#6ee7b7",marginTop:6}}>✓ {heroFiles.mobileImage.name}</p>}</div>
            <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:12}}><span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>🎥 Hero Video</span><input type="file" accept="video/mp4,video/mov,video/webm" onChange={e=>handleHeroFileChange("video",e.target.files[0])}/>{heroFiles.video&&<p style={{fontSize:12,color:"#6ee7b7",marginTop:6}}>✓ {heroFiles.video.name}</p>}</div>
            {heroUploadStatus==="uploading"&&<p style={{color:"#f5a623",fontSize:13,margin:"10px 0"}}>⏳ Uploading to Cloudinary... please wait</p>}
            {heroUploadStatus==="success"&&<p style={{color:"#6ee7b7",fontSize:13,margin:"10px 0"}}>✅ Media uploaded! Hero is now live.</p>}
            {heroUploadStatus==="error"&&<p style={{color:"#fca5a5",fontSize:13,margin:"10px 0"}}>❌ Upload failed. Check Cloudinary config.</p>}
            {heroUploadStatus==="error_missing"&&<p style={{color:"#fca5a5",fontSize:13,margin:"10px 0"}}>⚠️ Select at least one file to upload.</p>}
            <div style={{display:"flex",gap:10,marginTop:14,flexWrap:"wrap"}}>
              <button className="save-btn" onClick={()=>handleHeroUpload(false)} disabled={heroUploadStatus==="uploading"} style={{flex:1,minWidth:160}}>{heroUploadStatus==="uploading"?"Uploading...":"🚀 Upload All 3 Files"}</button>
              {heroMedia&&<button className="save-btn" onClick={()=>handleHeroUpload(true)} disabled={heroUploadStatus==="uploading"} style={{flex:1,minWidth:160,background:"rgba(255,255,255,0.06)",border:"1px solid #444"}}>✏️ Update Selected Files</button>}
              {heroMedia&&<button onClick={handleHeroDelete} style={{padding:"10px 16px",borderRadius:8,border:"1px solid #5a1a1a",background:"rgba(255,0,0,0.08)",color:"#fca5a5",cursor:"pointer",fontSize:13,fontWeight:600}}>🗑 Delete All</button>}
            </div>
            <p style={{fontSize:11,color:"#555",marginTop:10}}><b style={{color:"#666"}}>Upload All 3 Files</b> — replaces everything. &nbsp;<b style={{color:"#666"}}>Update Selected</b> — only replaces files you picked.</p>
          </div>
        )}

        {activeTab==="services"&&(
          <div className="admin-section">
            <h2>🛠 Services Section</h2>
            {servicesLoading?<p style={{color:"#888"}}>⏳ Loading from DB...</p>:(
              <>
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:12}}><span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>🏷 Section Tag</span><input type="text" value={servicesContent.heading||""} onChange={e=>setServicesContent(p=>({...p,heading:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}} placeholder="OUR SERVICES"/></div>
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:12}}><span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>📌 Main Title (H2)</span><input type="text" value={servicesContent.title||""} onChange={e=>setServicesContent(p=>({...p,title:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}} placeholder="Construction & Concrete Product Services in Bangalore"/></div>
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:20}}><span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>📝 Subtitle / Description</span><textarea rows={3} value={servicesContent.subtitle||""} onChange={e=>setServicesContent(p=>({...p,subtitle:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}} placeholder="At SMS Infra, we offer..."/></div>
                <div style={{borderTop:"1px solid #2a2a2a",paddingTop:20,marginBottom:16}}>
                  <h3 style={{color:"#e0e0ff",fontSize:14,marginBottom:12}}>🃏 Service Cards ({servicesContent.cards?.length||0})</h3>
                  {(servicesContent.cards||[]).map((card,idx)=>(
                    <div key={idx} style={{background:"rgba(255,255,255,0.04)",border:"1px solid #333",borderRadius:10,padding:"14px 16px",marginBottom:10,display:"flex",gap:10,alignItems:"flex-start",flexWrap:"wrap"}}>
                      <div style={{position:"relative"}}><button onClick={()=>setShowIconPicker(showIconPicker===idx?null:idx)} style={{background:"rgba(110,231,183,0.1)",border:"1px solid rgba(110,231,183,0.25)",borderRadius:8,padding:"8px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:6,color:"#6ee7b7",fontSize:13}}><DynamicIcon name={card.icon} style={{fontSize:18}}/><span style={{fontSize:10,color:"#888"}}>{card.icon}</span><span style={{fontSize:10,color:"#555"}}>▼</span></button>{showIconPicker===idx&&<IconPickerPanel onSelect={iconName=>handleCardChange(idx,"icon",iconName)} onClose={()=>setShowIconPicker(null)}/>}</div>
                      <div style={{flex:1,minWidth:200,display:"flex",flexDirection:"column",gap:6}}><input type="text" placeholder="Card name" value={card.name} onChange={e=>handleCardChange(idx,"name",e.target.value)} style={{width:"100%",boxSizing:"border-box"}}/><input type="text" placeholder="Route link e.g. /services/rmc" value={card.link} onChange={e=>handleCardChange(idx,"link",e.target.value)} style={{width:"100%",boxSizing:"border-box"}}/></div>
                      <button onClick={()=>handleDeleteCard(idx)} style={{background:"rgba(255,0,0,0.1)",border:"none",borderRadius:6,color:"#fca5a5",cursor:"pointer",fontSize:16,padding:"6px 10px",alignSelf:"center"}}>🗑</button>
                    </div>
                  ))}
                </div>
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:20}}>
                  <span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>➕ Add New Service Card</span>
                  <div style={{display:"flex",gap:10,alignItems:"flex-start",flexWrap:"wrap"}}>
                    <div style={{position:"relative"}}><button onClick={()=>setShowIconPicker(showIconPicker==="new"?null:"new")} style={{background:"rgba(110,231,183,0.1)",border:"1px solid rgba(110,231,183,0.25)",borderRadius:8,padding:"8px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:6,color:"#6ee7b7",fontSize:13}}><DynamicIcon name={newCard.icon} style={{fontSize:18}}/><span style={{fontSize:10,color:"#888"}}>{newCard.icon}</span><span style={{fontSize:10,color:"#555"}}>▼</span></button>{showIconPicker==="new"&&<IconPickerPanel onSelect={iconName=>setNewCard(p=>({...p,icon:iconName}))} onClose={()=>setShowIconPicker(null)}/>}</div>
                    <div style={{flex:1,minWidth:200,display:"flex",flexDirection:"column",gap:6}}><input type="text" placeholder="Card name e.g. Concrete Blocks" value={newCard.name} onChange={e=>setNewCard(p=>({...p,name:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}}/><input type="text" placeholder="Route link e.g. /services/solid-blocks" value={newCard.link} onChange={e=>setNewCard(p=>({...p,link:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}}/></div>
                    <button className="save-btn" onClick={handleAddCard} style={{alignSelf:"center",padding:"10px 18px",whiteSpace:"nowrap"}}>➕ Add Card</button>
                  </div>
                </div>
                <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                  <button className="save-btn" onClick={handleServicesSave} disabled={servicesSaveStatus==="saving"} style={{flex:1,background:"rgba(110,231,183,0.12)",border:"1px solid rgba(110,231,183,0.3)"}}>{servicesSaveStatus==="saving"&&"⏳ Saving..."}{servicesSaveStatus==="saved"&&"✅ Saved! Services section is live."}{servicesSaveStatus==="error"&&"❌ Save failed. Try again."}{servicesSaveStatus===""&&"💾 Save Services"}</button>
                  <button onClick={handleServicesReset} style={{padding:"10px 16px",borderRadius:8,border:"1px solid #444",background:"rgba(255,255,255,0.04)",color:"#888",cursor:"pointer",fontSize:13,fontWeight:600,whiteSpace:"nowrap"}}>🔄 Reset to Defaults</button>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab==="areas"&&(
          <div className="admin-section">
            <h2>📍 Areas Section</h2>
            {areasLoading?<p style={{color:"#888"}}>⏳ Loading from DB...</p>:(
              <>
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:12}}><span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>🏷 Section Tag</span><input type="text" value={areasContent.heading||""} onChange={e=>setAreasContent(p=>({...p,heading:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}} placeholder="OUR SERVICE AREAS"/></div>
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:12}}><span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>📌 Main Title (H2)</span><input type="text" value={areasContent.title||""} onChange={e=>setAreasContent(p=>({...p,title:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}} placeholder="Our Service Areas in Bangalore"/></div>
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:12}}><span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>📝 Subtitle</span><textarea rows={3} value={areasContent.subtitle||""} onChange={e=>setAreasContent(p=>({...p,subtitle:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}} placeholder="Based in Chandapura, SMS Infra provides..."/></div>
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:20}}><span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>📍 Badge Text</span><input type="text" value={areasContent.badge||""} onChange={e=>setAreasContent(p=>({...p,badge:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}} placeholder="📍 Serving within 30km radius from Chandapura, Bangalore"/></div>
                <div style={{borderTop:"1px solid #2a2a2a",paddingTop:20,marginBottom:16}}>
                  <h3 style={{color:"#e0e0ff",fontSize:14,marginBottom:12}}>📌 Area Cards ({areasContent.areas?.length||0})</h3>
                  {(areasContent.areas||[]).map((area,idx)=>(
                    <div key={idx} style={{background:"rgba(255,255,255,0.04)",border:"1px solid #333",borderRadius:10,padding:"12px 14px",marginBottom:8,display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
                      <div style={{flex:1,minWidth:200,display:"flex",gap:8,flexWrap:"wrap"}}><input type="text" placeholder="Label e.g. Electronic City" value={area.label} onChange={e=>handleAreaChange(idx,"label",e.target.value)} style={{flex:1,minWidth:140,boxSizing:"border-box"}}/><input type="text" placeholder="Slug e.g. electronic-city" value={area.slug} onChange={e=>handleAreaChange(idx,"slug",e.target.value)} style={{flex:1,minWidth:140,boxSizing:"border-box"}}/></div>
                      <button onClick={()=>handleDeleteArea(idx)} style={{background:"rgba(255,0,0,0.1)",border:"none",borderRadius:6,color:"#fca5a5",cursor:"pointer",fontSize:16,padding:"6px 10px"}}>🗑</button>
                    </div>
                  ))}
                </div>
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:20}}>
                  <span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>➕ Add New Area</span>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}><input type="text" placeholder="Label e.g. Bommasandra" value={newArea.label} onChange={e=>setNewArea(p=>({...p,label:e.target.value}))} style={{flex:1,minWidth:140,boxSizing:"border-box"}}/><input type="text" placeholder="Slug e.g. bommasandra" value={newArea.slug} onChange={e=>setNewArea(p=>({...p,slug:e.target.value}))} style={{flex:1,minWidth:140,boxSizing:"border-box"}}/><button className="save-btn" onClick={handleAddArea} style={{padding:"10px 18px",whiteSpace:"nowrap"}}>➕ Add Area</button></div>
                  <p style={{fontSize:11,color:"#555",marginTop:8}}>Slug is used in the URL: <span style={{color:"#6ee7b7"}}>/construction-services-{newArea.slug||"your-slug"}</span></p>
                </div>
                <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                  <button className="save-btn" onClick={handleAreasSave} disabled={areasSaveStatus==="saving"} style={{flex:1,background:"rgba(110,231,183,0.12)",border:"1px solid rgba(110,231,183,0.3)"}}>{areasSaveStatus==="saving"&&"⏳ Saving..."}{areasSaveStatus==="saved"&&"✅ Saved! Areas section is live."}{areasSaveStatus==="error"&&"❌ Save failed. Try again."}{areasSaveStatus===""&&"💾 Save Areas"}</button>
                  <button onClick={handleAreasReset} style={{padding:"10px 16px",borderRadius:8,border:"1px solid #444",background:"rgba(255,255,255,0.04)",color:"#888",cursor:"pointer",fontSize:13,fontWeight:600,whiteSpace:"nowrap"}}>🔄 Reset to Defaults</button>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab==="gallery"&&(
          <div className="admin-section">
            <h2>🖼 Gallery / Projects Section</h2>
            {galleryLoading?<p style={{color:"#888"}}>⏳ Loading from DB...</p>:(
              <>
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:12}}><span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>📌 Section Title (H1)</span><input type="text" value={galleryMeta.title||""} onChange={e=>setGalleryMeta(p=>({...p,title:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}} placeholder='Our <span>Projects</span>'/><p style={{fontSize:11,color:"#555",marginTop:6}}>You can use HTML like <code style={{color:"#6ee7b7"}}>{`<span>Projects</span>`}</code> for colored text.</p></div>
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:20}}><span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>📝 Subtitle</span><textarea rows={3} value={galleryMeta.subtitle||""} onChange={e=>setGalleryMeta(p=>({...p,subtitle:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}} placeholder="SMS Infra construction company in Bangalore..."/></div>
                <div style={{display:"flex",gap:10,marginBottom:24,flexWrap:"wrap"}}>
                  <button className="save-btn" onClick={handleGalleryMetaSave} disabled={galleryMetaSaveStatus==="saving"} style={{flex:1,background:"rgba(110,231,183,0.12)",border:"1px solid rgba(110,231,183,0.3)"}}>{galleryMetaSaveStatus==="saving"&&"⏳ Saving..."}{galleryMetaSaveStatus==="saved"&&"✅ Saved! Title & subtitle are live."}{galleryMetaSaveStatus==="error"&&"❌ Save failed. Try again."}{galleryMetaSaveStatus===""&&"💾 Save Title & Subtitle"}</button>
                  <button onClick={handleGalleryResetMeta} style={{padding:"10px 16px",borderRadius:8,border:"1px solid #444",background:"rgba(255,255,255,0.04)",color:"#888",cursor:"pointer",fontSize:13,fontWeight:600,whiteSpace:"nowrap"}}>🔄 Reset to Defaults</button>
                </div>
                <div style={{borderTop:"1px solid #2a2a2a",paddingTop:20,marginBottom:16}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4,flexWrap:"wrap",gap:8}}><h3 style={{color:"#e0e0ff",fontSize:14,margin:0}}>📸 Project Images ({galleryImages.length})</h3><button onClick={handleGalleryResetImages} style={{padding:"6px 14px",borderRadius:6,border:"1px solid #444",background:"rgba(255,255,255,0.04)",color:"#888",cursor:"pointer",fontSize:12,fontWeight:600,whiteSpace:"nowrap"}}>🔄 Reset to Original 18</button></div>
                  <p style={{fontSize:12,color:"#666",marginBottom:14}}>All images that appear in the gallery carousel. <span style={{color:"#555"}}>📁 Static = local file. Click 🗑 to remove any image.</span></p>
                  {galleryImages.length===0?<p style={{color:"#555",fontStyle:"italic",marginBottom:16}}>No images. Click "🔄 Reset to Original 18" to restore defaults.</p>:(
                    <div style={{display:"flex",flexWrap:"wrap",gap:10,marginBottom:20}}>
                      {galleryImages.map((img,idx)=>(
                        <div key={img.publicId||idx} style={{background:"rgba(255,255,255,0.04)",border:img.isStatic?"1px solid rgba(110,231,183,0.2)":"1px solid #333",borderRadius:10,padding:10,width:200}}>
                          {img.isStatic&&<span style={{fontSize:9,color:"#6ee7b7",fontWeight:700,display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>📁 Static</span>}
                          <img src={img.url} alt={img.caption||"gallery"} style={{width:"100%",height:110,objectFit:"cover",borderRadius:6,marginBottom:8}} onError={e=>{e.target.style.display="none";}}/>
                          {!img.isStatic&&<input type="text" defaultValue={img.caption||""} placeholder="Caption (optional)" onBlur={e=>handleGalleryCaptionUpdate(img.publicId,e.target.value)} style={{width:"100%",boxSizing:"border-box",marginBottom:6,fontSize:11}}/>}
                          {img.isStatic&&<p style={{margin:"0 0 6px",fontSize:10,color:"#555"}}>{img.caption}</p>}
                          <button onClick={()=>handleGalleryImageDelete(img.publicId,img.isStatic)} style={{width:"100%",background:"rgba(255,0,0,0.1)",border:"none",borderRadius:6,color:"#fca5a5",cursor:"pointer",fontSize:12,padding:"5px 0"}}>🗑 Remove</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px"}}>
                  <span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>➕ Upload New Gallery Image</span>
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>setGalleryImageFile(e.target.files[0])} style={{width:"100%",boxSizing:"border-box",marginBottom:8}}/>
                  {galleryImageFile&&<p style={{fontSize:12,color:"#6ee7b7",marginBottom:8}}>✓ {galleryImageFile.name}</p>}
                  <input type="text" placeholder="Caption (optional) e.g. Residential Project, Whitefield" value={galleryImageCaption} onChange={e=>setGalleryImageCaption(e.target.value)} style={{width:"100%",boxSizing:"border-box",marginBottom:10}}/>
                  <button className="save-btn" onClick={handleGalleryUpload} disabled={galleryUploadStatus==="uploading"||!galleryImageFile} style={{width:"100%"}}>{galleryUploadStatus==="uploading"&&"⏳ Uploading to Cloudinary..."}{galleryUploadStatus==="success"&&"✅ Image uploaded!"}{galleryUploadStatus==="error"&&"❌ Upload failed. Try again."}{galleryUploadStatus===""&&"➕ Upload to Cloudinary"}</button>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab==="whychoose"&&(
          <div className="admin-section">
            <h2>✅ Why Choose Section</h2>
            {whyLoading?<p style={{color:"#888"}}>⏳ Loading from DB...</p>:(
              <>
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:12}}><span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>🏷 Section Tag</span><input type="text" value={whyContent.subtitle||""} onChange={e=>setWhyContent(p=>({...p,subtitle:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}} placeholder="WHY CHOOSE US"/></div>
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:20}}><span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>📌 Main Title (H2)</span><input type="text" value={whyContent.title||""} onChange={e=>setWhyContent(p=>({...p,title:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}} placeholder="Why Choose SMS Infra?"/></div>
                <div style={{borderTop:"1px solid #2a2a2a",paddingTop:20,marginBottom:16}}>
                  <h3 style={{color:"#e0e0ff",fontSize:14,marginBottom:12}}>🃏 Feature Cards ({whyContent.points?.length||0})</h3>
                  <p style={{fontSize:12,color:"#666",marginBottom:14}}>These are the flip cards shown on the right side of the section.</p>
                  {(whyContent.points||[]).map((point,idx)=>(
                    <div key={idx} style={{background:"rgba(255,255,255,0.04)",border:"1px solid #333",borderRadius:10,padding:"14px 16px",marginBottom:10,display:"flex",gap:10,alignItems:"flex-start",flexWrap:"wrap"}}>
                      <div style={{flex:1,minWidth:200,display:"flex",flexDirection:"column",gap:6}}><input type="text" placeholder="Card title" value={point.heading||""} onChange={e=>handlePointChange(idx,"heading",e.target.value)} style={{width:"100%",boxSizing:"border-box"}}/><textarea rows={2} placeholder="Card description" value={point.text||""} onChange={e=>handlePointChange(idx,"text",e.target.value)} style={{width:"100%",boxSizing:"border-box"}}/></div>
                      <button onClick={()=>handleDeletePoint(idx)} style={{background:"rgba(255,0,0,0.1)",border:"none",borderRadius:6,color:"#fca5a5",cursor:"pointer",fontSize:16,padding:"6px 10px",alignSelf:"center"}}>🗑</button>
                    </div>
                  ))}
                </div>
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:20}}>
                  <span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>➕ Add New Feature Card</span>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}><input type="text" placeholder="Card title e.g. Cost Effective" value={newPoint.heading} onChange={e=>setNewPoint(p=>({...p,heading:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}}/><textarea rows={2} placeholder="Card description" value={newPoint.text} onChange={e=>setNewPoint(p=>({...p,text:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}}/><button className="save-btn" onClick={handleAddPoint} style={{alignSelf:"flex-start",padding:"10px 18px",whiteSpace:"nowrap"}}>➕ Add Card</button></div>
                </div>
                <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                  <button className="save-btn" onClick={handleWhySave} disabled={whySaveStatus==="saving"} style={{flex:1,background:"rgba(110,231,183,0.12)",border:"1px solid rgba(110,231,183,0.3)"}}>{whySaveStatus==="saving"&&"⏳ Saving..."}{whySaveStatus==="saved"&&"✅ Saved! Why Choose section is live."}{whySaveStatus==="error"&&"❌ Save failed. Try again."}{whySaveStatus===""&&"💾 Save Why Choose"}</button>
                  <button onClick={handleWhyReset} style={{padding:"10px 16px",borderRadius:8,border:"1px solid #444",background:"rgba(255,255,255,0.04)",color:"#888",cursor:"pointer",fontSize:13,fontWeight:600,whiteSpace:"nowrap"}}>🔄 Reset to Defaults</button>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab==="testimonials"&&(
          <div className="admin-section">
            <h2>💬 Testimonials Section</h2>
            {testimonialsLoading?<p style={{color:"#888"}}>⏳ Loading from DB...</p>:(
              <>
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:12}}><span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>📌 Section Title (H2)</span><input type="text" value={testimonialsContent.title||""} onChange={e=>setTestimonialsContent(p=>({...p,title:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}} placeholder="What Our Clients Say About SMS Infra"/></div>
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:20}}><span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>📝 Subtitle</span><input type="text" value={testimonialsContent.subtitle||""} onChange={e=>setTestimonialsContent(p=>({...p,subtitle:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}} placeholder="Trusted by builders and homeowners across Bangalore"/></div>
                <div style={{borderTop:"1px solid #2a2a2a",paddingTop:20,marginBottom:16}}>
                  <h3 style={{color:"#e0e0ff",fontSize:14,marginBottom:12}}>⭐ Reviews ({testimonialsContent.items?.length||0})</h3>
                  {(testimonialsContent.items||[]).map((review,idx)=>(
                    <div key={idx} style={{background:"rgba(255,255,255,0.04)",border:"1px solid #333",borderRadius:10,padding:"14px 16px",marginBottom:10}}>
                      <div style={{display:"flex",gap:8,marginBottom:8,flexWrap:"wrap"}}><input type="text" placeholder="Name" value={review.name||""} onChange={e=>handleReviewChange(idx,"name",e.target.value)} style={{flex:2,minWidth:140,boxSizing:"border-box"}}/><input type="text" placeholder="Role e.g. Contractor" value={review.role||""} onChange={e=>handleReviewChange(idx,"role",e.target.value)} style={{flex:1,minWidth:100,boxSizing:"border-box"}}/><input type="text" placeholder="Date e.g. 1 year ago" value={review.date||""} onChange={e=>handleReviewChange(idx,"date",e.target.value)} style={{flex:1,minWidth:100,boxSizing:"border-box"}}/></div>
                      <div style={{display:"flex",gap:8,alignItems:"flex-start"}}><textarea rows={3} placeholder="Review text..." value={review.text||""} onChange={e=>handleReviewChange(idx,"text",e.target.value)} style={{flex:1,boxSizing:"border-box"}}/><button onClick={()=>handleDeleteReview(idx)} style={{background:"rgba(255,0,0,0.1)",border:"none",borderRadius:6,color:"#fca5a5",cursor:"pointer",fontSize:16,padding:"6px 10px",alignSelf:"center",whiteSpace:"nowrap"}}>🗑</button></div>
                    </div>
                  ))}
                </div>
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:20}}>
                  <span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>➕ Add New Review</span>
                  <div style={{display:"flex",gap:8,marginBottom:8,flexWrap:"wrap"}}><input type="text" placeholder="Name" value={newReview.name} onChange={e=>setNewReview(p=>({...p,name:e.target.value}))} style={{flex:2,minWidth:140,boxSizing:"border-box"}}/><input type="text" placeholder="Role" value={newReview.role} onChange={e=>setNewReview(p=>({...p,role:e.target.value}))} style={{flex:1,minWidth:100,boxSizing:"border-box"}}/><input type="text" placeholder="Date" value={newReview.date} onChange={e=>setNewReview(p=>({...p,date:e.target.value}))} style={{flex:1,minWidth:100,boxSizing:"border-box"}}/></div>
                  <textarea rows={3} placeholder="Review text..." value={newReview.text} onChange={e=>setNewReview(p=>({...p,text:e.target.value}))} style={{width:"100%",boxSizing:"border-box",marginBottom:10}}/>
                  <button className="save-btn" onClick={handleAddReview} style={{alignSelf:"flex-start",padding:"10px 18px",whiteSpace:"nowrap"}}>➕ Add Review</button>
                </div>
                <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                  <button className="save-btn" onClick={handleTestimonialsSave} disabled={testimonialsSaveStatus==="saving"} style={{flex:1,background:"rgba(110,231,183,0.12)",border:"1px solid rgba(110,231,183,0.3)"}}>{testimonialsSaveStatus==="saving"&&"⏳ Saving..."}{testimonialsSaveStatus==="saved"&&"✅ Saved! Testimonials section is live."}{testimonialsSaveStatus==="error"&&"❌ Save failed. Try again."}{testimonialsSaveStatus===""&&"💾 Save Testimonials"}</button>
                  <button onClick={handleTestimonialsReset} style={{padding:"10px 16px",borderRadius:8,border:"1px solid #444",background:"rgba(255,255,255,0.04)",color:"#888",cursor:"pointer",fontSize:13,fontWeight:600,whiteSpace:"nowrap"}}>🔄 Reset to Defaults</button>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab==="faq"&&(
          <div className="admin-section">
            <h2>❓ FAQ Section</h2>
            {faqLoading?<p style={{color:"#888"}}>⏳ Loading from DB...</p>:(
              <>
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:12}}><span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>🏷 Section Tag</span><input type="text" value={faqContent.title||""} onChange={e=>setFaqContent(p=>({...p,title:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}} placeholder="Frequently Asked Questions"/></div>
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:20}}><span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>📝 Subtitle</span><textarea rows={2} value={faqContent.subtitle||""} onChange={e=>setFaqContent(p=>({...p,subtitle:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}} placeholder="We've compiled answers to the most common questions..."/></div>
                <div style={{borderTop:"1px solid #2a2a2a",paddingTop:20,marginBottom:16}}>
                  <h3 style={{color:"#e0e0ff",fontSize:14,marginBottom:12}}>❓ FAQ Items ({faqContent.items?.length||0})</h3>
                  {(faqContent.items||[]).map((item,idx)=>(
                    <div key={idx} style={{background:"rgba(255,255,255,0.04)",border:"1px solid #333",borderRadius:10,padding:"14px 16px",marginBottom:10}}>
                      <input type="text" placeholder="Question" value={item.question||""} onChange={e=>handleFaqItemChange(idx,"question",e.target.value)} style={{width:"100%",boxSizing:"border-box",marginBottom:8}}/>
                      <div style={{display:"flex",gap:8,alignItems:"flex-start"}}><textarea rows={3} placeholder="Answer..." value={item.answer||""} onChange={e=>handleFaqItemChange(idx,"answer",e.target.value)} style={{flex:1,boxSizing:"border-box"}}/><button onClick={()=>handleDeleteFaqItem(idx)} style={{background:"rgba(255,0,0,0.1)",border:"none",borderRadius:6,color:"#fca5a5",cursor:"pointer",fontSize:16,padding:"6px 10px",alignSelf:"center"}}>🗑</button></div>
                    </div>
                  ))}
                </div>
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:20}}>
                  <span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>➕ Add New FAQ Item</span>
                  <input type="text" placeholder="Question" value={newFaqItem.question} onChange={e=>setNewFaqItem(p=>({...p,question:e.target.value}))} style={{width:"100%",boxSizing:"border-box",marginBottom:8}}/>
                  <textarea rows={3} placeholder="Answer..." value={newFaqItem.answer} onChange={e=>setNewFaqItem(p=>({...p,answer:e.target.value}))} style={{width:"100%",boxSizing:"border-box",marginBottom:10}}/>
                  <button className="save-btn" onClick={handleAddFaqItem} style={{padding:"10px 18px",whiteSpace:"nowrap"}}>➕ Add FAQ Item</button>
                </div>
                <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                  <button className="save-btn" onClick={handleFaqSave} disabled={faqSaveStatus==="saving"} style={{flex:1,background:"rgba(110,231,183,0.12)",border:"1px solid rgba(110,231,183,0.3)"}}>{faqSaveStatus==="saving"&&"⏳ Saving..."}{faqSaveStatus==="saved"&&"✅ Saved! FAQ section is live."}{faqSaveStatus==="error"&&"❌ Save failed. Try again."}{faqSaveStatus===""&&"💾 Save FAQ"}</button>
                  <button onClick={handleFaqReset} style={{padding:"10px 16px",borderRadius:8,border:"1px solid #444",background:"rgba(255,255,255,0.04)",color:"#888",cursor:"pointer",fontSize:13,fontWeight:600,whiteSpace:"nowrap"}}>🔄 Reset to Defaults</button>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab==="footer"&&(
          <div className="admin-section">
            <h2>🦶 Footer Section</h2>
            <p style={{fontSize:12,color:"#666",marginBottom:20}}>Edit the footer tagline, subtext, contact details shown at the bottom of every page. Service Areas are managed in the <strong style={{color:"#6ee7b7"}}>📍 Areas</strong> tab.</p>
            {footerLoading?<p style={{color:"#888"}}>⏳ Loading from DB...</p>:(
              <>
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:12}}><span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>💬 Brand Tagline</span><input type="text" value={footerContent.tagline||""} onChange={e=>setFooterContent(p=>({...p,tagline:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}} placeholder="Turning Dreams Into Reality"/><p style={{fontSize:11,color:"#555",marginTop:6}}>Shown below the logo in the footer.</p></div>
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:20}}><span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>📝 Subtext</span><input type="text" value={footerContent.subtext||""} onChange={e=>setFooterContent(p=>({...p,subtext:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}} placeholder="Reliable Construction & Material Supply in Bangalore"/><p style={{fontSize:11,color:"#555",marginTop:6}}>Small line shown below the tagline.</p></div>
                <div style={{borderTop:"1px solid #2a2a2a",paddingTop:20,marginBottom:20}}>
                  <h3 style={{color:"#e0e0ff",fontSize:14,marginBottom:14}}>📞 Contact Details</h3>
                  <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:12}}><span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>📞 Phone Number</span><input type="text" value={footerContent.phone||""} onChange={e=>setFooterContent(p=>({...p,phone:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}} placeholder="7676590045"/></div>
                  <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:12}}><span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>📞 Phone Number 2 <span style={{fontSize:10,color:"#555",fontWeight:400}}>(leave blank to hide)</span></span><input type="text" value={footerContent.phone2??""} onChange={e=>setFooterContent(p=>({...p,phone2:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}} placeholder="9513355502/20/37..."/></div>
                  <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:12}}><span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>✉️ Email Address</span><input type="text" value={footerContent.email||""} onChange={e=>setFooterContent(p=>({...p,email:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}} placeholder="sales@smsinfra.com"/></div>
                  <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:12}}><span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>✉️ Email Address 2 <span style={{fontSize:10,color:"#555",fontWeight:400}}>(leave blank to hide)</span></span><input type="text" value={footerContent.email2??""} onChange={e=>setFooterContent(p=>({...p,email2:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}} placeholder="enquiry@smsinfra.com"/></div>
                  <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:20}}><span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>📍 Office Address</span><textarea rows={3} value={footerContent.address||""} onChange={e=>setFooterContent(p=>({...p,address:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}} placeholder="407/11, SMS ELITE, 3rd Floor, Chandapura..."/></div>
                </div>
                <div style={{background:"rgba(110,231,183,0.05)",border:"1px solid rgba(110,231,183,0.15)",borderRadius:8,padding:"10px 14px",marginBottom:20}}><p style={{fontSize:12,color:"#6ee7b7",margin:0}}>ℹ️ <strong>Service Areas</strong> in the footer are controlled by the <strong>📍 Areas</strong> tab.</p></div>
                <div style={{borderTop:"1px solid #2a2a2a",paddingTop:20,marginBottom:20}}>
                  <h3 style={{color:"#e0e0ff",fontSize:14,marginBottom:6}}>📱 Social Media Links</h3>
                  <p style={{fontSize:12,color:"#666",marginBottom:14}}>Instagram & LinkedIn always show. Facebook & YouTube only appear if you enter a URL.</p>
                  <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:12}}><span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}><FaInstagram style={{color:"#e1306c",fontSize:14,verticalAlign:"middle",marginRight:5}}/> Instagram URL</span><input type="text" value={footerContent.instagram??""} onChange={e=>setFooterContent(p=>({...p,instagram:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}} placeholder="https://www.instagram.com/smsinfra"/></div>
                  <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:12}}><span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}><FaLinkedinIn style={{color:"#0077b5",fontSize:14,verticalAlign:"middle",marginRight:5}}/> LinkedIn URL</span><input type="text" value={footerContent.linkedin??""} onChange={e=>setFooterContent(p=>({...p,linkedin:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}} placeholder="https://www.linkedin.com/company/sms-builders-and-infra-projects/"/></div>
                  <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:12}}><span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}><FaFacebook style={{color:"#1877f2",fontSize:14,verticalAlign:"middle",marginRight:5}}/> Facebook URL <span style={{fontSize:10,color:"#555",fontWeight:400}}>(leave blank to hide)</span></span><input type="text" value={footerContent.facebook??""} onChange={e=>setFooterContent(p=>({...p,facebook:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}} placeholder="https://www.facebook.com/smsinfra"/></div>
                  <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:12}}><span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}><FaYoutube style={{color:"#ff0000",fontSize:14,verticalAlign:"middle",marginRight:5}}/> YouTube URL <span style={{fontSize:10,color:"#555",fontWeight:400}}>(leave blank to hide)</span></span><input type="text" value={footerContent.youtube??""} onChange={e=>setFooterContent(p=>({...p,youtube:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}} placeholder="https://www.youtube.com/@smsinfra"/></div>
                </div>
                <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                  <button className="save-btn" onClick={handleFooterSave} disabled={footerSaveStatus==="saving"} style={{flex:1,background:"rgba(110,231,183,0.12)",border:"1px solid rgba(110,231,183,0.3)"}}>{footerSaveStatus==="saving"&&"⏳ Saving..."}{footerSaveStatus==="saved"&&"✅ Saved! Footer is live."}{footerSaveStatus==="error"&&"❌ Save failed. Try again."}{footerSaveStatus===""&&"💾 Save Footer"}</button>
                  <button onClick={handleFooterReset} style={{padding:"10px 16px",borderRadius:8,border:"1px solid #444",background:"rgba(255,255,255,0.04)",color:"#888",cursor:"pointer",fontSize:13,fontWeight:600,whiteSpace:"nowrap"}}>🔄 Reset to Defaults</button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── ABOUT PAGE CMS — FULL EDIT OF EVERY SECTION ── */}
        {activeTab==="about"&&(
          <div className="admin-section">
            <h2>📄 About Page CMS</h2>
            <p style={{fontSize:12,color:"#666",marginBottom:20}}>Edit every section of the /about page. Images can be uploaded to Cloudinary or entered as a URL/path.</p>
            {aboutLoading?<p style={{color:"#888"}}>⏳ Loading...</p>:(
              <>
                <h3 style={sec}>🦸 Hero Section</h3>
                <div style={fb}><span style={fl}>H1 Title</span><input type="text" value={aVal("heroH1")} onChange={e=>aSet("heroH1",e.target.value)} style={fi} placeholder="ABOUT US"/></div>
                <div style={fb}><span style={fl}>H2 Line 1</span><input type="text" value={aVal("heroH2a")} onChange={e=>aSet("heroH2a",e.target.value)} style={fi} placeholder="Top Construction Company in Bangalore"/></div>
                <div style={fb}><span style={fl}>H2 Line 2</span><input type="text" value={aVal("heroH2b")} onChange={e=>aSet("heroH2b",e.target.value)} style={fi} placeholder="Turning Dreams Into Reality"/></div>
                <div style={fb}><span style={fl}>Subtitle (paragraph below H2)</span><input type="text" value={aVal("heroSubtitle")} onChange={e=>aSet("heroSubtitle",e.target.value)} style={fi} placeholder="Integrated Infrastructure & Construction Solutions"/></div>
                <div style={fb}><span style={fl}>Hero Description Paragraph</span><textarea rows={4} value={aVal("heroDesc")} onChange={e=>aSet("heroDesc",e.target.value)} style={fi} placeholder="SMS Infra is a trusted construction..."/></div>
                <AboutImgField field="heroBgDesktop" label="🖥 Desktop Background Image" placeholder="/about-bg.png or Cloudinary URL"/>
                <AboutImgField field="heroBgMobile" label="📱 Mobile Background Image" placeholder="/about-mobile-bg.png or Cloudinary URL"/>
                <h3 style={sec}>📖 Intro / About Section</h3>
                <div style={fb}><span style={fl}>Section Title (h2)</span><input type="text" value={aVal("introTitle")} onChange={e=>aSet("introTitle",e.target.value)} style={fi} placeholder="About SMS Infra"/></div>
                <div style={fb}><span style={fl}>Paragraph 1</span><textarea rows={5} value={aVal("introPara1")} onChange={e=>aSet("introPara1",e.target.value)} style={fi} placeholder="SMS Infra is a leading construction..."/></div>
                <div style={fb}><span style={fl}>Paragraph 2</span><textarea rows={5} value={aVal("introPara2")} onChange={e=>aSet("introPara2",e.target.value)} style={fi} placeholder="Operating within a 30 km service radius..."/></div>
                <h3 style={sec}>📊 Stats Strip</h3>
                <p style={{fontSize:12,color:"#666",marginBottom:10}}>The three animated counter cards (Years, Projects, Clients).</p>
                <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
                  <div style={{flex:1,minWidth:160,...fb,marginBottom:0}}><span style={fl}>Years — Value</span><input type="text" value={aVal("statsYearsVal")} onChange={e=>aSet("statsYearsVal",e.target.value)} style={fi} placeholder="30+"/></div>
                  <div style={{flex:2,minWidth:200,...fb,marginBottom:0}}><span style={fl}>Years — Label</span><input type="text" value={aVal("statsYearsLabel")} onChange={e=>aSet("statsYearsLabel",e.target.value)} style={fi} placeholder="Years of Excellence"/></div>
                </div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
                  <div style={{flex:1,minWidth:160,...fb,marginBottom:0}}><span style={fl}>Projects — Value</span><input type="text" value={aVal("statsProjectsVal")} onChange={e=>aSet("statsProjectsVal",e.target.value)} style={fi} placeholder="500+"/></div>
                  <div style={{flex:2,minWidth:200,...fb,marginBottom:0}}><span style={fl}>Projects — Label</span><input type="text" value={aVal("statsProjectsLabel")} onChange={e=>aSet("statsProjectsLabel",e.target.value)} style={fi} placeholder="Projects Delivered"/></div>
                </div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
                  <div style={{flex:1,minWidth:160,...fb,marginBottom:0}}><span style={fl}>Clients — Value</span><input type="text" value={aVal("statsClientsVal")} onChange={e=>aSet("statsClientsVal",e.target.value)} style={fi} placeholder="100+"/></div>
                  <div style={{flex:2,minWidth:200,...fb,marginBottom:0}}><span style={fl}>Clients — Label</span><input type="text" value={aVal("statsClientsLabel")} onChange={e=>aSet("statsClientsLabel",e.target.value)} style={fi} placeholder="Trusted Clients"/></div>
                </div>
                <h3 style={sec}>📅 Our Journey / Timeline</h3>
                <div style={fb}><span style={fl}>Section Title</span><input type="text" value={aVal("journeyTitle")} onChange={e=>aSet("journeyTitle",e.target.value)} style={fi} placeholder="Our Journey"/></div>
                <p style={{fontSize:12,color:"#666",marginBottom:8}}>Timeline items — each has a year and description text.</p>
                {(aboutData.journeyItems||[]).map((item,i)=>(
                  <div key={i} style={{background:"rgba(255,255,255,0.04)",border:"1px solid #333",borderRadius:10,padding:"12px 14px",marginBottom:8,display:"flex",gap:8,alignItems:"flex-start",flexWrap:"wrap"}}>
                    <input type="text" placeholder="Year e.g. 1996" value={item.year||""} onChange={e=>{const arr=[...aboutData.journeyItems];arr[i]={...arr[i],year:e.target.value};aSet("journeyItems",arr);}} style={{width:90,boxSizing:"border-box",flexShrink:0}}/>
                    <textarea rows={2} placeholder="Description..." value={item.text||""} onChange={e=>{const arr=[...aboutData.journeyItems];arr[i]={...arr[i],text:e.target.value};aSet("journeyItems",arr);}} style={{flex:1,minWidth:200,boxSizing:"border-box"}}/>
                    <button onClick={()=>aSet("journeyItems",(aboutData.journeyItems||[]).filter((_,x)=>x!==i))} style={{background:"rgba(255,0,0,0.1)",border:"none",borderRadius:6,color:"#fca5a5",cursor:"pointer",fontSize:14,padding:"6px 10px",flexShrink:0}}>🗑</button>
                  </div>
                ))}
                <button onClick={()=>aSet("journeyItems",[...(aboutData.journeyItems||[]),{year:"",text:""}])} style={{padding:"8px 18px",background:"rgba(110,231,183,0.1)",border:"1px solid rgba(110,231,183,0.3)",borderRadius:8,color:"#6ee7b7",cursor:"pointer",fontSize:13,fontWeight:600,marginBottom:4}}>+ Add Timeline Item</button>
                <h3 style={sec}>✅ Why Choose Us</h3>
                <div style={fb}><span style={fl}>Section Title</span><input type="text" value={aVal("whyTitle")} onChange={e=>aSet("whyTitle",e.target.value)} style={fi} placeholder="Why Choose Us"/></div>
                <p style={{fontSize:12,color:"#666",marginBottom:8}}>Grid cards (each is a short label like "30+ Years Experience").</p>
                {(aboutData.whyCards||[]).map((card,i)=>(
                  <div key={i} style={{display:"flex",gap:8,marginBottom:8,alignItems:"center"}}>
                    <input type="text" value={card||""} onChange={e=>{const arr=[...aboutData.whyCards];arr[i]=e.target.value;aSet("whyCards",arr);}} style={{flex:1,boxSizing:"border-box"}} placeholder="e.g. Advanced Machinery"/>
                    <button onClick={()=>aSet("whyCards",(aboutData.whyCards||[]).filter((_,x)=>x!==i))} style={{background:"rgba(255,0,0,0.1)",border:"none",borderRadius:6,color:"#fca5a5",cursor:"pointer",fontSize:14,padding:"6px 10px"}}>🗑</button>
                  </div>
                ))}
                <button onClick={()=>aSet("whyCards",[...(aboutData.whyCards||[]),""])} style={{padding:"8px 18px",background:"rgba(110,231,183,0.1)",border:"1px solid rgba(110,231,183,0.3)",borderRadius:8,color:"#6ee7b7",cursor:"pointer",fontSize:13,fontWeight:600,marginBottom:4}}>+ Add Card</button>
                <h3 style={sec}>🛠 Our Expertise Section</h3>
                <div style={fb}><span style={fl}>Section Title (h2)</span><input type="text" value={aVal("expertiseTitle")} onChange={e=>aSet("expertiseTitle",e.target.value)} style={fi} placeholder="Our Expertise"/></div>
                <div style={fb}><span style={fl}>Section Description</span><textarea rows={3} value={aVal("expertiseDesc")} onChange={e=>aSet("expertiseDesc",e.target.value)} style={fi} placeholder="We offer end-to-end construction..."/></div>
                <p style={{fontSize:12,color:"#888",marginBottom:6,fontWeight:600,textTransform:"uppercase",letterSpacing:1}}>Banner (Left Image + Right Text)</p>
                <div style={fb}><span style={fl}>Banner Title (h3)</span><input type="text" value={aVal("servicesBannerTitle")} onChange={e=>aSet("servicesBannerTitle",e.target.value)} style={fi} placeholder="Complete Construction Solutions"/></div>
                <div style={fb}><span style={fl}>Banner Description Paragraph</span><textarea rows={3} value={aVal("servicesBannerText")} onChange={e=>aSet("servicesBannerText",e.target.value)} style={fi} placeholder="SMS Infra delivers integrated construction services..."/></div>
                <div style={fb}>
                  <span style={fl}>Banner Bullet Points (one per line)</span>
                  <textarea rows={5} value={(aboutData.servicesBannerBullets||[]).join("\n")} onChange={e=>aSet("servicesBannerBullets",e.target.value.split("\n"))} style={fi} placeholder={"High-quality materials\nAdvanced machinery & technology\nExperienced team\nReliable & on-time execution"}/>
                  <p style={{fontSize:11,color:"#555",marginTop:4}}>One bullet per line — shown with ✔ prefix in the banner.</p>
                </div>
                <AboutImgField field="servicesBannerImage" label="🖼 Banner Image (left side)" placeholder="/services-banner.png or Cloudinary URL"/>
                <p style={{fontSize:12,color:"#888",marginBottom:6,fontWeight:600,textTransform:"uppercase",letterSpacing:1,marginTop:8}}>Service Grid Cards</p>
                {(aboutData.serviceCards||[]).map((card,i)=>(
                  <div key={i} style={{background:"rgba(255,255,255,0.04)",border:"1px solid #333",borderRadius:10,padding:"12px 14px",marginBottom:8,display:"flex",gap:8,alignItems:"flex-start",flexWrap:"wrap"}}>
                    <div style={{flex:1,minWidth:200,display:"flex",flexDirection:"column",gap:6}}>
                      <input type="text" placeholder="Card title e.g. Earthmoving" value={card.title||""} onChange={e=>{const arr=[...aboutData.serviceCards];arr[i]={...arr[i],title:e.target.value};aSet("serviceCards",arr);}} style={{width:"100%",boxSizing:"border-box"}}/>
                      <input type="text" placeholder="Card description e.g. Excavation and site preparation." value={card.desc||""} onChange={e=>{const arr=[...aboutData.serviceCards];arr[i]={...arr[i],desc:e.target.value};aSet("serviceCards",arr);}} style={{width:"100%",boxSizing:"border-box"}}/>
                    </div>
                    <button onClick={()=>aSet("serviceCards",(aboutData.serviceCards||[]).filter((_,x)=>x!==i))} style={{background:"rgba(255,0,0,0.1)",border:"none",borderRadius:6,color:"#fca5a5",cursor:"pointer",fontSize:14,padding:"6px 10px",flexShrink:0}}>🗑</button>
                  </div>
                ))}
                <button onClick={()=>aSet("serviceCards",[...(aboutData.serviceCards||[]),{title:"",desc:""}])} style={{padding:"8px 18px",background:"rgba(110,231,183,0.1)",border:"1px solid rgba(110,231,183,0.3)",borderRadius:8,color:"#6ee7b7",cursor:"pointer",fontSize:13,fontWeight:600,marginBottom:4}}>+ Add Service Card</button>
                <h3 style={sec}>⚙️ Our Process</h3>
                <div style={fb}><span style={fl}>Section Title</span><input type="text" value={aVal("processTitle")} onChange={e=>aSet("processTitle",e.target.value)} style={fi} placeholder="Our Process"/></div>
                <div style={fb}><span style={fl}>Section Description</span><textarea rows={3} value={aVal("processDesc")} onChange={e=>aSet("processDesc",e.target.value)} style={fi} placeholder="Our structured approach ensures..."/></div>
                <div style={fb}>
                  <span style={fl}>Process Steps (one per line)</span>
                  <textarea rows={4} value={(aboutData.processSteps||[]).join("\n")} onChange={e=>aSet("processSteps",e.target.value.split("\n"))} style={fi} placeholder={"Planning\nDesign\nExecution\nDelivery"}/>
                  <p style={{fontSize:11,color:"#555",marginTop:4}}>One step per line — displayed as grid cards.</p>
                </div>
                <h3 style={sec}>🏗 Equipment</h3>
                <div style={fb}><span style={fl}>Section Title</span><input type="text" value={aVal("equipmentTitle")} onChange={e=>aSet("equipmentTitle",e.target.value)} style={fi} placeholder="Equipment"/></div>
                <div style={fb}><span style={fl}>Section Description</span><textarea rows={3} value={aVal("equipmentDesc")} onChange={e=>aSet("equipmentDesc",e.target.value)} style={fi} placeholder="Our advanced machinery..."/></div>
                <div style={fb}>
                  <span style={fl}>Equipment Items (one per line)</span>
                  <textarea rows={4} value={(aboutData.equipmentItems||[]).join("\n")} onChange={e=>aSet("equipmentItems",e.target.value.split("\n"))} style={fi} placeholder={"Earthmovers\nRMC Plants\nCrusher Units\nBlock Units"}/>
                </div>
                <div style={fb}>
                  <span style={fl}>Fleet Items (one per line — shown in hover card)</span>
                  <textarea rows={6} value={(aboutData.fleetItems||[]).join("\n")} onChange={e=>aSet("fleetItems",e.target.value.split("\n"))} style={fi} placeholder={"JCB Excavators\nTipper Trucks\nTransit Mixers\nCranes & Loaders\nStone Crushers\nWater Tankers"}/>
                </div>
                <h3 style={sec}>🦺 Safety & Sustainability</h3>
                <div style={fb}><span style={fl}>Section Title</span><input type="text" value={aVal("safetyTitle")} onChange={e=>aSet("safetyTitle",e.target.value)} style={fi} placeholder="Safety & Sustainability"/></div>
                <div style={fb}><span style={fl}>Description Paragraph</span><textarea rows={4} value={aVal("safetyText")} onChange={e=>aSet("safetyText",e.target.value)} style={fi} placeholder="At SMS Infra, safety and sustainability are at the core..."/></div>
                <h3 style={sec}>🎯 Mission & Vision</h3>
                <div style={fb}><span style={fl}>Mission Card — Title</span><input type="text" value={aVal("missionTitle")} onChange={e=>aSet("missionTitle",e.target.value)} style={fi} placeholder="Our Mission"/></div>
                <div style={fb}><span style={fl}>Mission Card — Text</span><textarea rows={3} value={aVal("missionText")} onChange={e=>aSet("missionText",e.target.value)} style={fi} placeholder="Deliver high-quality infrastructure solutions..."/></div>
                <div style={fb}><span style={fl}>Vision Card — Title</span><input type="text" value={aVal("visionTitle")} onChange={e=>aSet("visionTitle",e.target.value)} style={fi} placeholder="Our Vision"/></div>
                <div style={fb}><span style={fl}>Vision Card — Text</span><textarea rows={3} value={aVal("visionText")} onChange={e=>aSet("visionText",e.target.value)} style={fi} placeholder="To be Bangalore's most trusted construction partner."/></div>
                <h3 style={sec}>🏆 Quality & Standards</h3>
                <div style={fb}><span style={fl}>Section Title</span><input type="text" value={aVal("qualityTitle")} onChange={e=>aSet("qualityTitle",e.target.value)} style={fi} placeholder="Quality & Standards"/></div>
                <div style={fb}>
                  <span style={fl}>Quality Items (one per line)</span>
                  <textarea rows={5} value={(aboutData.qualityItems||[]).join("\n")} onChange={e=>aSet("qualityItems",e.target.value.split("\n"))} style={fi} placeholder={"ISO Standard Processes\nRegular Cube Testing\nThird-party Verification\nIn-house Laboratory\nStrict Safety Compliance"}/>
                </div>
                <h3 style={sec}>💎 Core Values</h3>
                <div style={fb}>
                  <span style={fl}>Values (one per line)</span>
                  <textarea rows={5} value={(aboutData.valuesItems||[]).join("\n")} onChange={e=>aSet("valuesItems",e.target.value.split("\n"))} style={fi} placeholder={"Quality First\nTimely Delivery\nCustomer Commitment\nInnovation\nSustainability"}/>
                </div>
                <h3 style={sec}>📁 Our Projects</h3>
                <div style={fb}><span style={fl}>Section Title</span><input type="text" value={aVal("projectsTitle")} onChange={e=>aSet("projectsTitle",e.target.value)} style={fi} placeholder="Our Projects"/></div>
                <div style={fb}><span style={fl}>Paragraph 1</span><textarea rows={3} value={aVal("projectsPara1")} onChange={e=>aSet("projectsPara1",e.target.value)} style={fi} placeholder="Residential, commercial, and infrastructure projects..."/></div>
                <div style={fb}><span style={fl}>Paragraph 2</span><textarea rows={3} value={aVal("projectsPara2")} onChange={e=>aSet("projectsPara2",e.target.value)} style={fi} placeholder="From residential buildings to large-scale infrastructure..."/></div>
                <h3 style={sec}>📍 Service Areas</h3>
                <div style={fb}><span style={fl}>Section Title</span><input type="text" value={aVal("areasTitle")} onChange={e=>aSet("areasTitle",e.target.value)} style={fi} placeholder="Service Areas"/></div>
                <div style={fb}>
                  <span style={fl}>Area Names (one per line)</span>
                  <textarea rows={6} value={(aboutData.areasItems||[]).join("\n")} onChange={e=>aSet("areasItems",e.target.value.split("\n"))} style={fi} placeholder={"Electronic City\nSarjapur\nHSR Layout\nBTM Layout\nWhitefield\nMarathahalli"}/>
                </div>
                <h3 style={sec}>📣 CTA Section</h3>
                <div style={fb}><span style={fl}>CTA Title (h2)</span><input type="text" value={aVal("ctaTitle")} onChange={e=>aSet("ctaTitle",e.target.value)} style={fi} placeholder="Let's Build Something Great Together"/></div>
                <div style={fb}><span style={fl}>CTA Description</span><textarea rows={3} value={aVal("ctaText")} onChange={e=>aSet("ctaText",e.target.value)} style={fi} placeholder="Looking for a reliable construction partner in Bangalore?"/></div>
                <div style={fb}><span style={fl}>Button Text</span><input type="text" value={aVal("ctaBtnText")} onChange={e=>aSet("ctaBtnText",e.target.value)} style={fi} placeholder="Contact Us"/></div>
                <div style={{background:"rgba(110,231,183,0.05)",border:"1px solid rgba(110,231,183,0.15)",borderRadius:8,padding:"10px 14px",marginTop:20,marginBottom:16}}>
                  <p style={{fontSize:12,color:"#6ee7b7",margin:0}}>ℹ️ All fields save to <code>PATCH /api/cms/about</code>. Make sure your backend has this endpoint. Your About.js component must read from the corresponding fields for changes to appear live.</p>
                </div>
                <div style={{display:"flex",gap:10,marginTop:8,flexWrap:"wrap"}}>
                  <button className="save-btn" onClick={handleAboutSave} disabled={aboutSaveStatus==="saving"} style={{flex:1,background:"rgba(245,159,11,0.15)",border:"1px solid rgba(245,159,11,0.4)",color:"#fbbf24"}}>
                    {aboutSaveStatus==="saving"&&"⏳ Saving..."}
                    {aboutSaveStatus==="saved"&&"✅ Saved! About page is live."}
                    {aboutSaveStatus==="error"&&"❌ Save failed. Try again."}
                    {aboutSaveStatus===""&&"💾 Save About Page"}
                  </button>
                  <button onClick={handleAboutReset} style={{padding:"10px 16px",borderRadius:8,border:"1px solid #444",background:"rgba(255,255,255,0.04)",color:"#888",cursor:"pointer",fontSize:13,fontWeight:600,whiteSpace:"nowrap"}}>🔄 Reset to Defaults</button>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab==="contact"&&(
          <div className="admin-section">
            <h2>Contact Section</h2>
            <input placeholder="Phone" value={cms.contact?.phone||""} onChange={e=>handleChange("contact","phone",e.target.value)}/>
            <input placeholder="Email" value={cms.contact?.email||""} onChange={e=>handleChange("contact","email",e.target.value)}/>
            <input placeholder="Address" value={cms.contact?.address||""} onChange={e=>handleChange("contact","address",e.target.value)}/>
          </div>
        )}

        {activeTab==="announcements"&&(
          <div className="admin-section">
            <h2>📢 Announcements</h2>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:18,flexWrap:"wrap"}}>
              <span style={{background:activeCount>0?"rgba(255,165,0,0.15)":"rgba(255,255,255,0.06)",border:activeCount>0?"1px solid orange":"1px solid #333",color:activeCount>0?"orange":"#666",borderRadius:20,padding:"4px 14px",fontSize:12,fontWeight:700}}>🟢 {activeCount} Live {activeCount===1?"Announcement":"Announcements"} showing in banner</span>
              {activeCount>0&&<button onClick={handleDeactivateAll} style={{padding:"5px 14px",borderRadius:6,border:"1px solid #5a1a1a",background:"rgba(255,0,0,0.08)",color:"#fca5a5",cursor:"pointer",fontSize:12,fontWeight:600}}>⏹ Deactivate All</button>}
            </div>
            {annToast&&<p style={{color:"#6ee7b7",fontWeight:600,marginBottom:12}}>{annToast}</p>}
            <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap"}}>{["info","success","warning","urgent"].map(t=><button key={t} onClick={()=>setAnnType(t)} style={{padding:"8px 16px",borderRadius:8,border:annType===t?"2px solid orange":"2px solid #444",background:annType===t?"rgba(255,165,0,0.15)":"transparent",color:annType===t?"orange":"#aaa",cursor:"pointer",fontWeight:600,fontSize:13}}>{{info:"📢 Info",success:"✅ Notice",warning:"⚠️ Warning",urgent:"🔴 Urgent"}[t]}</button>)}</div>
            <textarea placeholder="Type your announcement here..." value={annMessage} onChange={e=>setAnnMessage(e.target.value)} maxLength={200} rows={3} style={{width:"100%",marginBottom:6}}/>
            <p style={{fontSize:12,color:"#888",marginBottom:14,textAlign:"right"}}>{annMessage.length}/200</p>
            <div style={{display:"flex",gap:10,marginBottom:18,flexWrap:"wrap"}}>
              <div style={{flex:1,minWidth:180}}><label style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:5}}>Instagram Handle (optional)</label><input placeholder="@smsinfra" value={annHandle} onChange={e=>setAnnHandle(e.target.value)} style={{width:"100%",boxSizing:"border-box"}}/></div>
              <div style={{flex:1,minWidth:180}}><label style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:5}}>Instagram URL (optional)</label><input placeholder="https://www.instagram.com/smsinfra/" value={annInstagramUrl} onChange={e=>setAnnInstagramUrl(e.target.value)} style={{width:"100%",boxSizing:"border-box"}}/></div>
            </div>
            <button className="save-btn" onClick={handlePublish} disabled={annSaving}>{annSaving?"Publishing...":"🚀 Publish Now"}</button>
            <p style={{fontSize:12,color:"#888",marginTop:8,marginBottom:24}}>Multiple announcements can be live at the same time — users will see them with prev/next navigation.</p>
            <h3 style={{marginBottom:12,color:"#ccc"}}>History</h3>
            {annLoading?<p style={{color:"#888"}}>Loading...</p>:announcements.length===0?<p style={{color:"#888",fontStyle:"italic"}}>No announcements yet.</p>:(
              announcements.map(a=>(
                <div key={a._id} style={{background:"rgba(255,255,255,0.05)",border:a.isActive?"1px solid orange":"1px solid #333",borderRadius:10,padding:"14px 16px",marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}>
                  <div style={{flex:1}}><p style={{margin:"0 0 4px",color:"#e0e0ff",fontSize:14}}>{a.message}</p>{(a.handle||a.instagramUrl)&&<p style={{margin:"0 0 4px",fontSize:12,color:"#f5c518"}}>{a.handle&&<span style={{marginRight:10}}>📸 {a.handle}</span>}{a.instagramUrl&&<a href={a.instagramUrl} target="_blank" rel="noopener noreferrer" style={{color:"#f5c518",fontSize:11}}>🔗 {a.instagramUrl}</a>}</p>}<p style={{margin:0,fontSize:11,color:"#888"}}>{new Date(a.createdAt).toLocaleString("en-IN",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}{" · "}<span style={{color:"#666",textTransform:"uppercase",fontSize:10}}>{a.type}</span></p></div>
                  <div style={{display:"flex",gap:8}}><button onClick={()=>handleToggle(a._id)} style={{padding:"6px 12px",borderRadius:6,border:"none",background:a.isActive?"rgba(255,165,0,0.2)":"rgba(255,255,255,0.08)",color:a.isActive?"orange":"#888",cursor:"pointer",fontWeight:600,fontSize:12}}>{a.isActive?"🟢 Live":"⚫ Hidden"}</button><button onClick={()=>handleDelete(a._id)} style={{padding:"6px 10px",borderRadius:6,border:"none",background:"rgba(255,0,0,0.1)",color:"#fca5a5",cursor:"pointer",fontSize:14}}>🗑</button></div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab==="homepage"&&(
          <div className="admin-section">
            <h2>🏠 Home Page Content</h2>
            {homeLoading?<p style={{color:"#888"}}>⏳ Loading from DB...</p>:(
              <>
                {hasUnsavedChanges&&(<div style={{background:"rgba(255,165,0,0.1)",border:"1px solid rgba(255,165,0,0.3)",borderRadius:8,padding:"10px 14px",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,flexWrap:"wrap"}}><span style={{fontSize:12,color:"#f5a623",fontWeight:600}}>⚠️ You have unsaved changes</span><button onClick={handleHomeUndo} style={{padding:"5px 12px",borderRadius:6,border:"1px solid rgba(255,165,0,0.4)",background:"transparent",color:"#f5a623",cursor:"pointer",fontSize:12,fontWeight:600}}>↩️ Undo Changes</button></div>)}
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:12}}><span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>🏷 Hero Title (H1)</span><input type="text" value={homeContent.title||""} onChange={e=>setHomeContent(prev=>({...prev,title:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}} placeholder="Top Construction Company in Bangalore"/></div>
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:12}}><span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>💬 Tagline 1 (H2)</span><input type="text" value={homeContent.tagline1||""} onChange={e=>setHomeContent(prev=>({...prev,tagline1:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}} placeholder="Turning Dreams Into Reality"/></div>
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:12}}><span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>💬 Tagline 2 (H3 — animated word by word)</span><input type="text" value={homeContent.tagline2||""} onChange={e=>setHomeContent(prev=>({...prev,tagline2:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}} placeholder="Integrated Infrastructure & Construction Solutions"/></div>
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:12}}><span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>📝 Hero Description Paragraph</span><textarea rows={7} value={homeContent.description||""} onChange={e=>setHomeContent(prev=>({...prev,description:e.target.value}))} style={{width:"100%",boxSizing:"border-box"}} placeholder="SMS Infra is a leading construction..."/></div>
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:20}}>
                  <span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>📊 Stats Counter</span>
                  <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                    <div style={{flex:1,minWidth:120}}><label style={{fontSize:11,color:"#666",display:"block",marginBottom:4}}>Years of Experience</label><input type="number" value={homeContent.yearsTarget||0} onChange={e=>setHomeContent(prev=>({...prev,yearsTarget:Number(e.target.value)}))} style={{width:"100%",boxSizing:"border-box"}}/></div>
                    <div style={{flex:1,minWidth:120}}><label style={{fontSize:11,color:"#666",display:"block",marginBottom:4}}>Projects Delivered</label><input type="number" value={homeContent.projectsTarget||0} onChange={e=>setHomeContent(prev=>({...prev,projectsTarget:Number(e.target.value)}))} style={{width:"100%",boxSizing:"border-box"}}/></div>
                    <div style={{flex:1,minWidth:120}}><label style={{fontSize:11,color:"#666",display:"block",marginBottom:4}}>Trusted Clients</label><input type="number" value={homeContent.clientsTarget||0} onChange={e=>setHomeContent(prev=>({...prev,clientsTarget:Number(e.target.value)}))} style={{width:"100%",boxSizing:"border-box"}}/></div>
                  </div>
                </div>
                <div style={{display:"flex",gap:10,marginBottom:30,flexWrap:"wrap"}}>
                  <button className="save-btn" onClick={handleHomeSave} disabled={homeSaveStatus==="saving"} style={{flex:1,background:"rgba(110,231,183,0.12)",border:"1px solid rgba(110,231,183,0.3)"}}>{homeSaveStatus==="saving"&&"⏳ Saving..."}{homeSaveStatus==="saved"&&"✅ Saved! Home page content is live."}{homeSaveStatus==="error"&&"❌ Save failed. Try again."}{homeSaveStatus===""&&"💾 Save Home Content"}</button>
                  <button onClick={handleHomeReset} style={{padding:"10px 16px",borderRadius:8,border:"1px solid #444",background:"rgba(255,255,255,0.04)",color:"#888",cursor:"pointer",fontSize:13,fontWeight:600,whiteSpace:"nowrap"}}>🔄 Reset to Defaults</button>
                </div>
                <div style={{borderTop:"1px solid #2a2a2a",paddingTop:24}}>
                  <h3 style={{color:"#e0e0ff",marginBottom:4,fontSize:15}}>🖼 Client Logos</h3>
                  <p style={{fontSize:12,color:"#666",marginBottom:16}}>All logos that scroll in the "Trusted By Leading Clients" section on Home and ServicesHub pages.<br/><span style={{color:"#555"}}>Drag ⠿ to reorder. Click 🗑 to remove. Upload new logos below.</span></p>
                  {orphanCount>0&&(<div style={{background:"rgba(255,165,0,0.08)",border:"1px solid rgba(255,165,0,0.25)",borderRadius:8,padding:"10px 14px",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,flexWrap:"wrap"}}><span style={{fontSize:12,color:"#f5a623"}}>⚠️ {orphanCount} logo(s) have no ID. They cannot be deleted individually.</span><button onClick={handleCleanupOrphanLogos} style={{padding:"5px 12px",borderRadius:6,border:"1px solid rgba(255,165,0,0.4)",background:"transparent",color:"#f5a623",cursor:"pointer",fontSize:12,fontWeight:600,whiteSpace:"nowrap"}}>🧹 Remove Broken Logos</button></div>)}
                  {orderChanged&&(<div style={{background:"rgba(110,231,183,0.06)",border:"1px solid rgba(110,231,183,0.2)",borderRadius:8,padding:"10px 14px",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,flexWrap:"wrap"}}><span style={{fontSize:12,color:"#6ee7b7",fontWeight:600}}>↕️ Order changed — save or reset</span><div style={{display:"flex",gap:8}}><button onClick={handleSaveOrder} disabled={orderSaveStatus==="saving"} style={{padding:"5px 14px",borderRadius:6,border:"1px solid rgba(110,231,183,0.4)",background:"rgba(110,231,183,0.1)",color:"#6ee7b7",cursor:"pointer",fontSize:12,fontWeight:600,whiteSpace:"nowrap"}}>{orderSaveStatus==="saving"&&"⏳ Saving..."}{orderSaveStatus==="saved"&&"✅ Saved!"}{orderSaveStatus==="error"&&"❌ Failed"}{orderSaveStatus===""&&"💾 Save Order"}</button><button onClick={handleResetOrder} style={{padding:"5px 14px",borderRadius:6,border:"1px solid #444",background:"transparent",color:"#888",cursor:"pointer",fontSize:12,fontWeight:600,whiteSpace:"nowrap"}}>↩️ Reset Order</button></div></div>)}
                  {logosLoading?<p style={{color:"#888"}}>⏳ Loading logos...</p>:clientLogos.length===0?<p style={{color:"#888",fontStyle:"italic",marginBottom:16}}>No logos saved yet.</p>:(
                    <div style={{display:"flex",flexWrap:"wrap",gap:10,marginBottom:20}}>
                      {clientLogos.map((logo,idx)=>(
                        <div key={logo.publicId||idx} draggable onDragStart={()=>handleDragStart(idx)} onDragOver={e=>handleDragOver(e,idx)} onDrop={()=>handleDrop(idx)} onDragEnd={handleDragEnd} style={{background:dragOverIndex===idx?"rgba(110,231,183,0.1)":"rgba(255,255,255,0.05)",border:dragOverIndex===idx?"1px solid rgba(110,231,183,0.4)":!logo.publicId?"1px solid rgba(255,165,0,0.3)":"1px solid #333",borderRadius:10,padding:"10px 14px",display:"flex",alignItems:"center",gap:10,maxWidth:320,cursor:"grab",transition:"border 0.15s, background 0.15s"}}>
                          <span style={{color:"#555",fontSize:16,cursor:"grab",userSelect:"none"}}>⠿</span>
                          <img src={logo.url} alt="client logo" style={{width:48,height:48,objectFit:"contain",borderRadius:6,background:"#fff"}} onError={e=>{e.target.style.display="none";}}/>
                          <div style={{flex:1,overflow:"hidden"}}><p style={{margin:0,fontSize:10,color:"#555",wordBreak:"break-all"}}>{logo.url}</p>{!logo.publicId&&<p style={{margin:"2px 0 0",fontSize:10,color:"#f5a623"}}>⚠️ No ID — use 🧹 to remove</p>}</div>
                          <button onClick={()=>logo.publicId?handleDeleteLogo(logo.publicId):showAnnToast("⚠️ Use '🧹 Remove Broken Logos' to remove this entry.")} style={{background:logo.publicId?"rgba(255,0,0,0.1)":"rgba(255,255,255,0.04)",border:"none",borderRadius:6,color:logo.publicId?"#fca5a5":"#555",cursor:logo.publicId?"pointer":"not-allowed",fontSize:16,padding:"4px 8px"}}>🗑</button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:12}}>
                    <span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>➕ Add New Logo</span>
                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>setNewLogoFile(e.target.files[0])} style={{width:"100%",boxSizing:"border-box",marginBottom:10}}/>
                    {newLogoFile&&<p style={{fontSize:12,color:"#6ee7b7",marginBottom:10}}>✓ {newLogoFile.name}</p>}
                    <button className="save-btn" onClick={handleAddLogo} disabled={logoSaveStatus==="saving"||!newLogoFile} style={{width:"100%"}}>{logoSaveStatus==="saving"&&"⏳ Uploading..."}{logoSaveStatus==="saved"&&"✅ Logo uploaded!"}{logoSaveStatus==="error"&&"❌ Failed. Try again."}{logoSaveStatus===""&&"➕ Upload Logo to Cloudinary"}</button>
                    <p style={{fontSize:11,color:"#555",marginTop:6}}>Uploaded to Cloudinary automatically. Reflects on both Home and ServicesHub pages instantly.</p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab==="careers"&&(
          <div className="admin-section">
            <h2>💼 Job Listings</h2>
            {jobsLoading?<p style={{color:"#888"}}>⏳ Loading...</p>:(
              <>
                <div style={{marginBottom:24}}>
                  <h3 style={{color:"#e0e0ff",fontSize:14,marginBottom:12}}>📋 Current Listings ({jobs.length})</h3>
                  {jobs.length===0&&<p style={{color:"#555",fontStyle:"italic"}}>No jobs yet — add one below.</p>}
                  {jobs.map(job=>(
                    <div key={job._id} style={{background:"rgba(255,255,255,0.04)",border:"1px solid #333",borderRadius:10,padding:"14px 16px",marginBottom:10}}>
                      {editingJob?._id===job._id?(
                        <div style={{display:"flex",flexDirection:"column",gap:8}}>
                          <input value={editingJob.title} onChange={e=>setEditingJob(p=>({...p,title:e.target.value}))} placeholder="Job title" style={{boxSizing:"border-box",width:"100%"}}/>
                          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}><input value={editingJob.location} onChange={e=>setEditingJob(p=>({...p,location:e.target.value}))} placeholder="Location" style={{flex:1,minWidth:120,boxSizing:"border-box"}}/><input value={editingJob.experience} onChange={e=>setEditingJob(p=>({...p,experience:e.target.value}))} placeholder="Experience e.g. 2+ Years" style={{flex:1,minWidth:120,boxSizing:"border-box"}}/><input value={editingJob.salary} onChange={e=>setEditingJob(p=>({...p,salary:e.target.value}))} placeholder="Salary e.g. 4-6 LPA" style={{flex:1,minWidth:120,boxSizing:"border-box"}}/><select value={editingJob.type} onChange={e=>setEditingJob(p=>({...p,type:e.target.value}))} style={{flex:1,minWidth:120}}>{["Full Time","Part Time","Contract","Internship"].map(t=><option key={t}>{t}</option>)}</select></div>
                          <textarea rows={3} value={editingJob.description} onChange={e=>setEditingJob(p=>({...p,description:e.target.value}))} placeholder="Job description" style={{width:"100%",boxSizing:"border-box"}}/>
                          <div style={{display:"flex",gap:8}}><button className="save-btn" onClick={handleJobSave} style={{flex:1}}>{jobSaveStatus==="saving"?"⏳ Saving...":jobSaveStatus==="saved"?"✅ Saved!":"💾 Save"}</button><button onClick={()=>setEditingJob(null)} style={{padding:"8px 16px",borderRadius:8,border:"1px solid #444",background:"transparent",color:"#888",cursor:"pointer"}}>Cancel</button></div>
                        </div>
                      ):(
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10,flexWrap:"wrap"}}>
                          <div style={{flex:1}}><p style={{margin:"0 0 4px",color:"#e0e0ff",fontWeight:600}}>{job.title}</p><p style={{margin:"0 0 4px",fontSize:12,color:"#888"}}>{job.location} · {job.experience} · {job.salary} · {job.type}</p><p style={{margin:0,fontSize:12,color:"#555"}}>{job.description?.substring(0,100)}...</p></div>
                          <div style={{display:"flex",gap:8,alignItems:"center"}}><button onClick={()=>handleJobToggleStatus(job)} style={{padding:"5px 12px",borderRadius:6,border:"none",background:job.status==="active"?"rgba(110,231,183,0.15)":"rgba(255,255,255,0.06)",color:job.status==="active"?"#6ee7b7":"#666",cursor:"pointer",fontSize:12,fontWeight:600}}>{job.status==="active"?"🟢 Active":"⚫ Inactive"}</button><button onClick={()=>setEditingJob({...job})} style={{padding:"5px 12px",borderRadius:6,border:"1px solid #444",background:"transparent",color:"#aaa",cursor:"pointer",fontSize:12}}>✏️ Edit</button><button onClick={()=>handleJobDelete(job._id)} style={{padding:"5px 10px",borderRadius:6,border:"none",background:"rgba(255,0,0,0.1)",color:"#fca5a5",cursor:"pointer",fontSize:14}}>🗑</button></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"16px"}}>
                  <h3 style={{color:"#e0e0ff",fontSize:14,marginBottom:12}}>➕ Add New Job</h3>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    <input value={newJob.title} onChange={e=>setNewJob(p=>({...p,title:e.target.value}))} placeholder="Job title e.g. Site Engineer" style={{width:"100%",boxSizing:"border-box"}}/>
                    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}><input value={newJob.location} onChange={e=>setNewJob(p=>({...p,location:e.target.value}))} placeholder="Location e.g. Bangalore" style={{flex:1,minWidth:120,boxSizing:"border-box"}}/><input value={newJob.experience} onChange={e=>setNewJob(p=>({...p,experience:e.target.value}))} placeholder="Experience e.g. 2+ Years" style={{flex:1,minWidth:120,boxSizing:"border-box"}}/><input value={newJob.salary} onChange={e=>setNewJob(p=>({...p,salary:e.target.value}))} placeholder="Salary e.g. 4-6 LPA" style={{flex:1,minWidth:120,boxSizing:"border-box"}}/><select value={newJob.type} onChange={e=>setNewJob(p=>({...p,type:e.target.value}))} style={{flex:1,minWidth:120}}>{["Full Time","Part Time","Contract","Internship"].map(t=><option key={t}>{t}</option>)}</select></div>
                    <textarea rows={3} value={newJob.description} onChange={e=>setNewJob(p=>({...p,description:e.target.value}))} placeholder="Job description..." style={{width:"100%",boxSizing:"border-box"}}/>
                    <button className="save-btn" onClick={handleJobSave} disabled={!newJob.title||jobSaveStatus==="saving"} style={{background:"rgba(110,231,183,0.12)",border:"1px solid rgba(110,231,183,0.3)"}}>{jobSaveStatus==="saving"?"⏳ Saving...":jobSaveStatus==="saved"?"✅ Job Added!":jobSaveStatus==="error"?"❌ Failed":"➕ Add Job"}</button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab==="applications"&&(
          <div className="admin-section">
            <h2>📄 Job Applications</h2>
            {appsLoading?<p style={{color:"#888"}}>⏳ Loading...</p>:applications.length===0?<p style={{color:"#555",fontStyle:"italic"}}>No applications yet.</p>:(
              applications.map(app=>(
                <div key={app._id} style={{background:"rgba(255,255,255,0.04)",border:"1px solid #333",borderRadius:10,padding:"14px 16px",marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
                    <div style={{flex:1}}><p style={{margin:"0 0 4px",color:"#e0e0ff",fontWeight:600}}>{app.fullName} <span style={{fontSize:12,color:"#888",fontWeight:400}}>— {app.position}</span></p><p style={{margin:"0 0 4px",fontSize:12,color:"#888"}}>📞 {app.phone} · ✉️ {app.email}</p><p style={{margin:"0 0 4px",fontSize:12,color:"#666"}}>📍 {app.location} · 💼 {app.experience} · 💰 {app.expectedSalary||"Not specified"}</p>{app.message&&<p style={{margin:"4px 0 0",fontSize:12,color:"#555"}}>{app.message?.substring(0,120)}...</p>}{app.resumeUrl&&<a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" style={{fontSize:12,color:"#6ee7b7",display:"block",marginTop:4}}>📎 View Resume</a>}<p style={{margin:"4px 0 0",fontSize:11,color:"#444"}}>{new Date(app.createdAt).toLocaleString("en-IN")}</p></div>
                    <div style={{display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end"}}><select value={app.status} onChange={e=>handleAppStatusUpdate(app._id,e.target.value)} style={{padding:"5px 10px",borderRadius:6,border:"1px solid #444",background:"#1a1a2e",color:app.status==="new"?"#f5a623":app.status==="shortlisted"?"#6ee7b7":app.status==="rejected"?"#fca5a5":"#aaa",fontSize:12,cursor:"pointer"}}><option value="new">🆕 New</option><option value="reviewed">👁 Reviewed</option><option value="shortlisted">✅ Shortlisted</option><option value="rejected">❌ Rejected</option></select><button onClick={()=>handleAppDelete(app._id)} style={{padding:"5px 10px",borderRadius:6,border:"none",background:"rgba(255,0,0,0.1)",color:"#fca5a5",cursor:"pointer",fontSize:12}}>🗑 Delete</button></div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab==="quotations"&&(
          <div className="admin-section">
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:10}}><h2 style={{margin:0}}>📋 Quotation Requests</h2><button onClick={fetchQuotations} disabled={quotationsLoading} style={{padding:"7px 16px",borderRadius:8,border:"1px solid rgba(110,231,183,0.3)",background:"rgba(110,231,183,0.08)",color:"#6ee7b7",cursor:quotationsLoading?"not-allowed":"pointer",fontSize:13,fontWeight:600}}>{quotationsLoading?"⏳ Loading...":"🔄 Refresh"}</button></div>
            {quotationsLoading?<p style={{color:"#888"}}>⏳ Loading...</p>:quotations.length===0?<p style={{color:"#555",fontStyle:"italic"}}>No quotation requests yet.</p>:(
              quotations.map(q=>(
                <div key={q._id} style={{background:"rgba(255,255,255,0.04)",border:"1px solid #333",borderRadius:10,padding:"14px 16px",marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
                    <div style={{flex:1}}><p style={{margin:"0 0 4px",color:"#e0e0ff",fontWeight:600}}>{q.fullName} <span style={{fontSize:12,color:"#888",fontWeight:400}}>— {q.service}</span></p>{q.companyName&&<p style={{margin:"0 0 2px",fontSize:12,color:"#777"}}>🏢 {q.companyName}</p>}<p style={{margin:"0 0 4px",fontSize:12,color:"#888"}}>📞 <a href={`tel:${q.phone}`} style={{color:"#6ee7b7"}}>{q.phone}</a> · ✉️ <a href={`mailto:${q.email}`} style={{color:"#6ee7b7"}}>{q.email}</a></p><p style={{margin:"0 0 4px",fontSize:12,color:"#666"}}>📍 {q.projectLocation}</p><p style={{margin:"0 0 4px",fontSize:12,color:"#555"}}>{q.message?.substring(0,120)}...</p><p style={{margin:"4px 0 0",fontSize:11,color:"#444"}}>{new Date(q.createdAt).toLocaleString("en-IN")}</p></div>
                    <div style={{display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end"}}><select value={q.status} onChange={e=>handleQuotationStatusUpdate(q._id,e.target.value)} style={{padding:"5px 10px",borderRadius:6,border:"1px solid #444",background:"#1a1a2e",color:q.status==="new"?"#f5a623":q.status==="contacted"?"#6ee7b7":q.status==="converted"?"#a78bfa":"#aaa",fontSize:12,cursor:"pointer"}}><option value="new">🆕 New</option><option value="contacted">📞 Contacted</option><option value="converted">✅ Converted</option><option value="closed">🔒 Closed</option></select><button onClick={()=>handleQuotationDelete(q._id)} style={{padding:"5px 10px",borderRadius:6,border:"none",background:"rgba(255,0,0,0.1)",color:"#fca5a5",cursor:"pointer",fontSize:12}}>🗑 Delete</button></div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab==="contactpage"&&(
          <div className="admin-section">
            <h2>📞 Contact Page</h2>
            <p style={{fontSize:12,color:"#666",marginBottom:20}}>Edit every piece of text on the /contact page — hero, info cards, ticker, form, map, and success screen.</p>
            {contactPageLoading||!contactPage?<p style={{color:"#888"}}>⏳ Loading from DB...</p>:(
              <>
                <h3 style={{color:"#e0e0ff",fontSize:14,marginBottom:12,borderBottom:"1px solid #2a2a2a",paddingBottom:8}}>🦸 Hero Section</h3>
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:12}}><span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>🏷 Mini Tag</span><input type="text" value={contactPage.heroTag||""} onChange={e=>cpSet("heroTag",e.target.value)} style={{width:"100%",boxSizing:"border-box"}} placeholder="CONTACT SMS INFRA"/></div>
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:12}}><span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>📌 H1 Title</span><input type="text" value={contactPage.heroTitle||""} onChange={e=>cpSet("heroTitle",e.target.value)} style={{width:"100%",boxSizing:"border-box"}} placeholder="Let's Build Reliable Infrastructure Together"/></div>
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:20}}><span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>📝 Hero Subtitle</span><textarea rows={3} value={contactPage.heroSubtitle||""} onChange={e=>cpSet("heroSubtitle",e.target.value)} style={{width:"100%",boxSizing:"border-box"}} placeholder="Connect with SMS Infra for..."/></div>
                <h3 style={{color:"#e0e0ff",fontSize:14,marginBottom:12,borderBottom:"1px solid #2a2a2a",paddingBottom:8}}>📋 Info Cards</h3>
                {[{key:"address",label:"📍 Office Address",placeholder:"407/11, SMS ELITE..."},{key:"email1",label:"✉️ Email 1",placeholder:"sales@smsinfra.com"},{key:"email2",label:"✉️ Email 2 (optional)",placeholder:"enquiry@smsinfra.com"},{key:"phone1",label:"📞 Phone 1",placeholder:"7676590045"},{key:"phone2",label:"📞 Phone 2 (optional)",placeholder:""},{key:"businessHours",label:"🕐 Business Hours",placeholder:"Mon – Sat: 9:00 AM – 7:00 PM"},{key:"sundayHours",label:"🕐 Sunday Hours",placeholder:"Sunday: Closed"},{key:"responseTime",label:"⚡ Response Time (open hours)",placeholder:"Within 2 hours during business hours"},{key:"responseTimeOff",label:"⚡ Response Time (after hours)",placeholder:"Next business day by 11:00 AM"},{key:"monthlyCount",label:"👥 Monthly Counter Text",placeholder:"47 businesses contacted us this month"}].map(({key,label,placeholder})=>(
                  <div key={key} style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:10}}><span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>{label}</span><input type="text" value={contactPage[key]||""} onChange={e=>cpSet(key,e.target.value)} style={{width:"100%",boxSizing:"border-box"}} placeholder={placeholder}/></div>
                ))}
                <h3 style={{color:"#e0e0ff",fontSize:14,marginBottom:12,borderBottom:"1px solid #2a2a2a",paddingBottom:8,marginTop:20}}>📜 Ticker Messages</h3>
                <p style={{fontSize:12,color:"#666",marginBottom:12}}>The scrolling activity messages shown below the info cards.</p>
                {(contactPage.tickerMessages||[]).map((msg,idx)=><div key={idx} style={{display:"flex",gap:8,marginBottom:8,alignItems:"center"}}><input type="text" value={msg} onChange={e=>{const arr=[...(contactPage.tickerMessages||[])];arr[idx]=e.target.value;cpSet("tickerMessages",arr);}} style={{flex:1,boxSizing:"border-box"}}/><button onClick={()=>cpSet("tickerMessages",(contactPage.tickerMessages||[]).filter((_,i)=>i!==idx))} style={{background:"rgba(255,0,0,0.1)",border:"none",borderRadius:6,color:"#fca5a5",cursor:"pointer",fontSize:14,padding:"6px 10px"}}>🗑</button></div>)}
                <div style={{display:"flex",gap:8,marginBottom:20}}><input type="text" placeholder="e.g. A builder from Koramangala enquired about RMC 3 min ago" value={newTickerMsg} onChange={e=>setNewTickerMsg(e.target.value)} style={{flex:1,boxSizing:"border-box"}}/><button className="save-btn" onClick={()=>{if(!newTickerMsg.trim())return;cpSet("tickerMessages",[...(contactPage.tickerMessages||[]),newTickerMsg.trim()]);setNewTickerMsg("");}} style={{padding:"0 16px",whiteSpace:"nowrap"}}>+ Add</button></div>
                <h3 style={{color:"#e0e0ff",fontSize:14,marginBottom:12,borderBottom:"1px solid #2a2a2a",paddingBottom:8}}>📝 Form Left Panel</h3>
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:12}}><span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>🏷 Mini Tag</span><input type="text" value={contactPage.formTag||""} onChange={e=>cpSet("formTag",e.target.value)} style={{width:"100%",boxSizing:"border-box"}} placeholder="REQUEST A QUOTATION"/></div>
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:12}}><span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>📌 H2 Title</span><input type="text" value={contactPage.formTitle||""} onChange={e=>cpSet("formTitle",e.target.value)} style={{width:"100%",boxSizing:"border-box"}} placeholder="Get Custom Pricing For Your Construction Requirement"/></div>
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:12}}><span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>📝 Form Description</span><textarea rows={3} value={contactPage.formDescription||""} onChange={e=>cpSet("formDescription",e.target.value)} style={{width:"100%",boxSizing:"border-box"}} placeholder="Submit your project requirements..."/></div>
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:20}}>
                  <span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>✅ Feature Items (bullet points)</span>
                  {(contactPage.formFeatures||[]).map((feat,idx)=><div key={idx} style={{display:"flex",gap:8,marginBottom:8}}><input type="text" value={feat} onChange={e=>{const arr=[...(contactPage.formFeatures||[])];arr[idx]=e.target.value;cpSet("formFeatures",arr);}} style={{flex:1,boxSizing:"border-box"}}/><button onClick={()=>cpSet("formFeatures",(contactPage.formFeatures||[]).filter((_,i)=>i!==idx))} style={{background:"rgba(255,0,0,0.1)",border:"none",borderRadius:6,color:"#fca5a5",cursor:"pointer",fontSize:14,padding:"6px 10px"}}>🗑</button></div>)}
                  <div style={{display:"flex",gap:8}}><input type="text" placeholder="e.g. On-time delivery guaranteed" value={newFeature} onChange={e=>setNewFeature(e.target.value)} style={{flex:1,boxSizing:"border-box"}}/><button className="save-btn" onClick={()=>{if(!newFeature.trim())return;cpSet("formFeatures",[...(contactPage.formFeatures||[]),newFeature.trim()]);setNewFeature("");}} style={{padding:"0 16px",whiteSpace:"nowrap"}}>+ Add</button></div>
                </div>
                <h3 style={{color:"#e0e0ff",fontSize:14,marginBottom:12,borderBottom:"1px solid #2a2a2a",paddingBottom:8}}>🛠 Services Dropdown</h3>
                {(contactPage.services||[]).map((svc,idx)=><div key={idx} style={{display:"flex",gap:8,marginBottom:8}}><input type="text" value={svc} onChange={e=>{const arr=[...(contactPage.services||[])];arr[idx]=e.target.value;cpSet("services",arr);}} style={{flex:1,boxSizing:"border-box"}}/><button onClick={()=>cpSet("services",(contactPage.services||[]).filter((_,i)=>i!==idx))} style={{background:"rgba(255,0,0,0.1)",border:"none",borderRadius:6,color:"#fca5a5",cursor:"pointer",fontSize:14,padding:"6px 10px"}}>🗑</button></div>)}
                <div style={{display:"flex",gap:8,marginBottom:20}}><input type="text" placeholder="e.g. Concrete Blocks Supply" value={newService} onChange={e=>setNewService(e.target.value)} style={{flex:1,boxSizing:"border-box"}}/><button className="save-btn" onClick={()=>{if(!newService.trim())return;cpSet("services",[...(contactPage.services||[]),newService.trim()]);setNewService("");}} style={{padding:"0 16px",whiteSpace:"nowrap"}}>+ Add</button></div>
                <h3 style={{color:"#e0e0ff",fontSize:14,marginBottom:12,borderBottom:"1px solid #2a2a2a",paddingBottom:8}}>🗺 Map Section</h3>
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:12}}><span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>🏷 Mini Tag</span><input type="text" value={contactPage.mapTag||""} onChange={e=>cpSet("mapTag",e.target.value)} style={{width:"100%",boxSizing:"border-box"}} placeholder="LOCATION"/></div>
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:12}}><span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>📌 H2 Title</span><input type="text" value={contactPage.mapTitle||""} onChange={e=>cpSet("mapTitle",e.target.value)} style={{width:"100%",boxSizing:"border-box"}} placeholder="Visit Our Office"/></div>
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:12}}><span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>🔗 Google Maps Embed URL</span><input type="text" value={contactPage.mapEmbed||""} onChange={e=>cpSet("mapEmbed",e.target.value)} style={{width:"100%",boxSizing:"border-box"}} placeholder="https://www.google.com/maps?q=Chandapura+Bangalore&output=embed"/></div>
                <p style={{fontSize:11,color:"#555",marginBottom:20}}>To get a Maps embed URL: Google Maps → search your location → Share → Embed a map → copy the <code style={{color:"#6ee7b7"}}>src="..."</code> value.</p>
                <h3 style={{color:"#e0e0ff",fontSize:14,marginBottom:12,borderBottom:"1px solid #2a2a2a",paddingBottom:8}}>✅ Success Screen</h3>
                {[{key:"successTitle",label:"📌 Title",placeholder:"Quotation request submitted!"},{key:"successTimeOpen",label:"⏱ Response time (open hours)",placeholder:"2–3 hours"},{key:"successTimeOff",label:"⏱ Response time (after hours)",placeholder:"the next business day"}].map(({key,label,placeholder})=>(
                  <div key={key} style={{background:"rgba(255,255,255,0.04)",border:"1px dashed #444",borderRadius:10,padding:"14px 16px",marginBottom:12}}><span style={{fontSize:11,color:"#888",fontWeight:600,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>{label}</span><input type="text" value={contactPage[key]||""} onChange={e=>cpSet(key,e.target.value)} style={{width:"100%",boxSizing:"border-box"}} placeholder={placeholder}/></div>
                ))}
                <div style={{display:"flex",gap:10,marginTop:24,flexWrap:"wrap"}}>
                  <button className="save-btn" onClick={handleContactPageSave} disabled={contactPageSaveStatus==="saving"} style={{flex:1,background:"rgba(110,231,183,0.12)",border:"1px solid rgba(110,231,183,0.3)"}}>{contactPageSaveStatus==="saving"&&"⏳ Saving..."}{contactPageSaveStatus==="saved"&&"✅ Saved! Contact page is live."}{contactPageSaveStatus==="error"&&"❌ Save failed. Try again."}{contactPageSaveStatus===""&&"💾 Save Contact Page"}</button>
                </div>
                <div style={{background:"rgba(110,231,183,0.05)",border:"1px solid rgba(110,231,183,0.12)",borderRadius:8,padding:"10px 14px",marginTop:16}}><p style={{fontSize:12,color:"#6ee7b7",margin:0}}>ℹ️ Changes here only affect the <strong>/contact</strong> page text. Phone/email in the <strong>🦶 Footer</strong> tab are separate.</p></div>
              </>
            )}
          </div>
        )}

        {activeTab!=="announcements"&&activeTab!=="hero"&&activeTab!=="homepage"&&activeTab!=="services"&&activeTab!=="areas"&&activeTab!=="gallery"&&activeTab!=="whychoose"&&activeTab!=="testimonials"&&activeTab!=="faq"&&activeTab!=="footer"&&activeTab!=="navbar"&&activeTab!=="careers"&&activeTab!=="applications"&&activeTab!=="quotations"&&activeTab!=="contactpage"&&activeTab!=="servicePages"&&activeTab!=="adminProjects"&&activeTab!=="serviceHub"&&activeTab!=="about"&&activeTab!=="leads"&&(
          <button className="save-btn" onClick={handleSave} disabled={saveStatus==="saving"}>
            {saveStatus==="saving"&&"⏳ Saving..."}
            {saveStatus==="saved"&&"✅ Saved! Changes are live."}
            {saveStatus==="error"&&"❌ Save failed. Try again."}
            {saveStatus===""&&"Save Changes"}
          </button>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;