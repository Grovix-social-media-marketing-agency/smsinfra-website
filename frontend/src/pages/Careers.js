import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";

import {
  Briefcase,
  MapPin,
  Clock3,
  IndianRupee,
  ArrowRight,
  Upload,
  CheckCircle2,
  ChevronDown,
  Building2,
  Hammer,
  ShieldCheck,
  Users,
  Search,
  X,
  FileText,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Loader2,
  Star,
  Heart,
  Zap,
  Gift,
} from "lucide-react";

import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import "./careers.css";

// ⭐ Default jobs — shown when DB is empty, admin can replace via dashboard
const DEFAULT_JOBS = [
  {
    _id: "1",
    title: "Site Engineer",
    location: "Bangalore",
    experience: "2+ Years",
    salary: "4 - 6 LPA",
    type: "Full Time",
    status: "active",
    description: "Supervise construction activities, coordinate site execution, monitor quality standards, and ensure project timelines are maintained.",
  },
  {
    _id: "2",
    title: "Civil Engineer",
    location: "Bangalore",
    experience: "3+ Years",
    salary: "5 - 8 LPA",
    type: "Full Time",
    status: "active",
    description: "Plan, design, and manage infrastructure and construction projects while ensuring engineering quality and compliance.",
  },
  {
    _id: "3",
    title: "Machine Operator",
    location: "Karnataka",
    experience: "2+ Years",
    salary: "3 - 5 LPA",
    type: "Contract",
    status: "active",
    description: "Operate heavy machinery and construction equipment while maintaining operational safety standards.",
  },
  {
    _id: "4",
    title: "Equipment Driver",
    location: "Bangalore",
    experience: "1+ Years",
    salary: "2 - 4 LPA",
    type: "Full Time",
    status: "active",
    description: "Handle transportation and movement of construction materials and equipment across project sites.",
  },
  {
    _id: "5",
    title: "Office Staff",
    location: "Bangalore",
    experience: "1+ Years",
    salary: "2 - 3 LPA",
    type: "Full Time",
    status: "active",
    description: "Support project coordination, documentation, administration, and office management operations.",
  },
];

/* ─── TOAST SYSTEM ──────────────────────────────────────── */
const ToastContext = React.createContext(null);

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = (id) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="toast-container">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              className={`toast toast-${toast.type}`}
              initial={{ opacity: 0, y: 40, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.92 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="toast-icon">
                {toast.type === "success" && <CheckCircle size={18} />}
                {toast.type === "error" && <AlertCircle size={18} />}
                {toast.type === "info" && <Zap size={18} />}
              </span>
              <span>{toast.message}</span>
              <button
                className="toast-close"
                onClick={() => removeToast(toast.id)}
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

const useToast = () => React.useContext(ToastContext);

/* ─── SKELETON LOADER ───────────────────────────────────── */
const JobCardSkeleton = () => (
  <div className="job-card skeleton-card">
    <div className="skeleton skeleton-badge" />
    <div className="skeleton skeleton-icon" />
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-line" />
    <div className="skeleton skeleton-line short" />
    <div className="skeleton-meta">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="skeleton skeleton-pill" />
      ))}
    </div>
    <div className="skeleton skeleton-btn" />
  </div>
);

/* ─── HIRING PROCESS SECTION ────────────────────────────── */
const hiringSteps = [
  {
    icon: <FileText size={28} />,
    step: "01",
    title: "Apply Online",
    desc: "Submit your application and resume through our careers portal.",
  },
  {
    icon: <Users size={28} />,
    step: "02",
    title: "HR Screening",
    desc: "Our HR team reviews your profile and schedules an initial call.",
  },
  {
    icon: <Briefcase size={28} />,
    step: "03",
    title: "Technical Interview",
    desc: "Meet the team lead for a technical and role-specific discussion.",
  },
  {
    icon: <CheckCircle size={28} />,
    step: "04",
    title: "Offer & Onboarding",
    desc: "Receive your offer letter and get onboarded to the team.",
  },
];

const HiringProcess = () => (
  <section className="hiring-process-section">
    <div className="section-header center">
      <span>How It Works</span>
      <h2>Our Hiring Process</h2>
    </div>
    <div className="hiring-steps">
      {hiringSteps.map((s, i) => (
        <motion.div
          key={i}
          className="hiring-step"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: i * 0.12 }}
          viewport={{ once: true }}
        >
          <div className="hiring-step-number">{s.step}</div>
          <div className="hiring-step-icon">{s.icon}</div>
          <h3>{s.title}</h3>
          <p>{s.desc}</p>
          {i < hiringSteps.length - 1 && (
            <div className="hiring-connector">
              <ChevronRight size={20} />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  </section>
);

/* ─── FIELD COMPONENT (outside MultiStepForm to prevent focus loss) ── */
const Field = ({ name, type = "text", placeholder, required, formData, handleChange, errors }) => (
  <div className={`form-field ${errors[name] ? "field-error" : ""}`}>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={formData[name]}
      onChange={handleChange}
      required={required}
      autoComplete="off"
    />
    <AnimatePresence>
      {errors[name] && (
        <motion.span
          className="field-error-msg"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
        >
          <AlertCircle size={12} /> {errors[name]}
        </motion.span>
      )}
    </AnimatePresence>
  </div>
);

/* ─── SUCCESS SCREEN ────────────────────────────────────── */
const SuccessScreen = ({ submittedData, onReset }) => (
  <motion.div
    className="success-screen"
    initial={{ opacity: 0, scale: 0.92 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
  >
    <div className="success-icon-wrap">
      <motion.div
        className="success-icon-circle"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 200 }}
      >
        <CheckCircle size={48} />
      </motion.div>
    </div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <h3 className="success-title">Application Submitted!</h3>
      <p className="success-subtitle">
        Thank you, <strong>{submittedData.fullName}</strong>! Your application for{" "}
        <strong>{submittedData.position}</strong> has been received.
      </p>

      <div className="success-details">
        <div className="success-detail-row">
          <span>📧 Confirmation sent to</span>
          <strong>{submittedData.email}</strong>
        </div>
        <div className="success-detail-row">
          <span>📍 Location</span>
          <strong>{submittedData.location}</strong>
        </div>
        <div className="success-detail-row">
          <span>💼 Experience</span>
          <strong>{submittedData.experience}</strong>
        </div>
      </div>

      <p className="success-note">
        Our HR team will review your profile and reach out to shortlisted candidates
        within <strong>3–5 business days</strong>. Please check your inbox at{" "}
        <a href={`mailto:${submittedData.email}`}>{submittedData.email}</a>.
      </p>

      <button className="btn-apply-again" onClick={onReset}>
        Apply for Another Position <ArrowRight size={16} />
      </button>
    </motion.div>
  </motion.div>
);

/* ─── MULTI-STEP FORM ───────────────────────────────────── */
const STEPS = ["Personal", "Experience", "Upload & Submit"];

const MultiStepForm = ({ selectedJob, onSuccess }) => {
  const addToast = useToast();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [errors, setErrors] = useState({});
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    position: selectedJob?.title || "",
    experience: "",
    location: "",
    expectedSalary: "",
    dob: "",
    joiningDate: "",
    message: "",
    resume: null,
  });

  useEffect(() => {
    if (selectedJob) {
      setFormData((prev) => ({ ...prev, position: selectedJob.title }));
    }
  }, [selectedJob]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleResumeUpload = (file) => {
    if (!file) return;
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowed.includes(file.type)) {
      addToast("Only PDF, DOC, DOCX files are accepted.", "error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      addToast("File must be under 5MB.", "error");
      return;
    }
    setFormData((prev) => ({ ...prev, resume: file }));
    setErrors((prev) => ({ ...prev, resume: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (step === 0) {
      if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
      if (!/^[6-9]\d{9}$/.test(formData.phone))
        newErrors.phone = "Enter a valid 10-digit Indian mobile number";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        newErrors.email = "Enter a valid email address";
      if (!formData.position.trim()) newErrors.position = "Position is required";
    }
    if (step === 1) {
      if (!formData.experience.trim()) newErrors.experience = "Experience is required";
      if (!formData.location.trim()) newErrors.location = "Current location is required";
    }
    if (step === 2) {
      if (!formData.resume) newErrors.resume = "Please upload your resume";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validate()) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const snapshot = { ...formData };

    try {
      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) submitData.append(key, formData[key]);
      });

      const response = await fetch(`${process.env.REACT_APP_API_URL || "http://10.145.35.253:5000/api"}/careers/apply`, { // ⭐ env-ready
        method: "POST",
        body: submitData,
      });
      const data = await response.json();
      addToast(data.message || "Application submitted successfully!", "success");
    } catch {
      const subject = encodeURIComponent(
        `Job Application – ${formData.position} | ${formData.fullName}`
      );
      const body = encodeURIComponent(
        `Dear HR Team,\n\nI would like to apply for the position of ${formData.position}.\n\n` +
          `Full Name: ${formData.fullName}\n` +
          `Phone: ${formData.phone}\n` +
          `Email: ${formData.email}\n` +
          `Date of Birth: ${formData.dob || "Not provided"}\n` +
          `Experience: ${formData.experience}\n` +
          `Current Location: ${formData.location}\n` +
          `Expected Salary: ${formData.expectedSalary || "Open to discussion"}\n` +
          `Available From: ${formData.joiningDate || "Immediately"}\n\n` +
          `Message:\n${formData.message || "Please find my resume attached."}\n\n` +
          `Note: Please attach your resume (${formData.resume?.name || "resume"}) to this email before sending.\n\nRegards,\n${formData.fullName}`
      );
      window.location.href = `mailto:Info@smsinfra.com?subject=${subject}&body=${body}`;
      addToast("Opening email client… please attach your resume and send.", "info");
    } finally {
      setSubmitting(false);
      setSubmittedData(snapshot);
      setSubmitted(true);
      setFormData({
        fullName: "", phone: "", email: "", position: "",
        experience: "", location: "", expectedSalary: "",
        dob: "", joiningDate: "", message: "", resume: null,
      });
      setStep(0);
      onSuccess && onSuccess();
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setSubmittedData(null);
  };

  if (submitted && submittedData) {
    return <SuccessScreen submittedData={submittedData} onReset={handleReset} />;
  }

  return (
    <div className="multistep-form-wrapper">
      {/* Progress Bar */}
      <div className="form-steps-header">
        {STEPS.map((label, i) => (
          <div
            key={i}
            className={`form-step-tab ${i === step ? "active" : ""} ${i < step ? "done" : ""}`}
          >
            <div className="step-circle">
              {i < step ? <CheckCircle size={14} /> : <span>{i + 1}</span>}
            </div>
            <span className="step-label">{label}</span>
            {i < STEPS.length - 1 && <div className="step-line" />}
          </div>
        ))}
      </div>

      <div className="form-progress-bar">
        <motion.div
          className="form-progress-fill"
          animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <form className="career-form" onSubmit={handleSubmit} noValidate>
        <AnimatePresence mode="wait">

          {/* STEP 1 — Personal */}
          {step === 0 && (
            <motion.div
              key="step0"
              className="form-step-content"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <div className="form-grid">
                <Field name="fullName" placeholder="Full Name *" required formData={formData} handleChange={handleChange} errors={errors} />
                <Field name="phone" type="tel" placeholder="Phone Number *" required formData={formData} handleChange={handleChange} errors={errors} />
                <Field name="email" type="email" placeholder="Email Address *" required formData={formData} handleChange={handleChange} errors={errors} />
                <Field name="position" placeholder="Position Applying For *" required formData={formData} handleChange={handleChange} errors={errors} />
              </div>
            </motion.div>
          )}

          {/* STEP 2 — Experience */}
          {step === 1 && (
            <motion.div
              key="step1"
              className="form-step-content"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <div className="form-grid">
                <Field name="experience" placeholder="Years of Experience *" required formData={formData} handleChange={handleChange} errors={errors} />
                <Field name="location" placeholder="Current Location *" required formData={formData} handleChange={handleChange} errors={errors} />
                <Field name="expectedSalary" placeholder="Expected Salary (e.g. 5 LPA)" formData={formData} handleChange={handleChange} errors={errors} />
                <div className="form-field">
                  <label className="date-field-label">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split("T")[0]}
                    title="Date of Birth (must be 18+)"
                  />
                </div>
                <div className="form-field">
                  <label className="date-field-label">
                    Available From (Joining Date)
                  </label>
                  <input
                    type="date"
                    name="joiningDate"
                    value={formData.joiningDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    title="Earliest date you can join"
                  />
                </div>
              </div>
              <div className="form-field full-width">
                <textarea
                  name="message"
                  placeholder="Tell us about yourself or why you're a great fit…"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>
            </motion.div>
          )}

          {/* STEP 3 — Upload */}
          {step === 2 && (
            <motion.div
              key="step2"
              className="form-step-content"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className={`resume-dropzone ${dragOver ? "drag-active" : ""} ${formData.resume ? "has-file" : ""} ${errors.resume ? "field-error" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  handleResumeUpload(e.dataTransfer.files[0]);
                }}
                onClick={() => fileRef.current?.click()}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  hidden
                  onChange={(e) => handleResumeUpload(e.target.files[0])}
                />
                {formData.resume ? (
                  <div className="resume-file-preview">
                    <FileText size={32} />
                    <div>
                      <strong>{formData.resume.name}</strong>
                      <span>{(formData.resume.size / 1024).toFixed(1)} KB</span>
                    </div>
                    <button
                      type="button"
                      className="remove-resume"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData((prev) => ({ ...prev, resume: null }));
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload size={36} />
                    <p><strong>Drag & drop</strong> your resume here</p>
                    <span>or click to browse — PDF, DOC, DOCX · Max 5MB</span>
                  </>
                )}
              </div>
              {errors.resume && (
                <span className="field-error-msg standalone">
                  <AlertCircle size={12} /> {errors.resume}
                </span>
              )}

              <div className="application-summary">
                <h4>Application Summary</h4>
                <div className="summary-grid">
                  {[
                    ["Name", formData.fullName],
                    ["Phone", formData.phone],
                    ["Email", formData.email],
                    ["Position", formData.position],
                    ["Experience", formData.experience],
                    ["Location", formData.location],
                  ].map(([label, val]) => (
                    <div key={label} className="summary-row">
                      <span>{label}</span>
                      <strong>{val || "—"}</strong>
                    </div>
                  ))}
                </div>
                <p className="summary-email-note">
                  Your application will be sent to{" "}
                  <a href="mailto:Info@smsinfra.com">Info@smsinfra.com</a>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="form-nav-buttons">
          {step > 0 && (
            <button type="button" className="btn-prev" onClick={prevStep}>
              ← Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button type="button" className="btn-next" onClick={nextStep}>
              Continue <ChevronRight size={16} />
            </button>
          ) : (
            <button type="submit" className="btn-submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 size={18} className="spin" /> Submitting…
                </>
              ) : (
                <>
                  Submit Application <ArrowRight size={18} />
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   MAIN CAREERS COMPONENT
═══════════════════════════════════════════════════════════ */
const Careers = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [savedJobs, setSavedJobs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("savedJobs") || "[]");
    } catch {
      return [];
    }
  });
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || "http://10.145.35.253:5000/api"}/careers/jobs`); // ⭐ env-ready
      const data = await response.json();
      // ⭐ If DB has jobs use them, otherwise show defaults so page is never blank
      setJobs(Array.isArray(data) && data.length > 0 ? data : DEFAULT_JOBS);
    } catch {
      // ⭐ Network error — show defaults
      setJobs(DEFAULT_JOBS);
    } finally {
      setLoading(false);
    }
  };

  /* ── Save / Unsave job ── */
  const toggleSaveJob = (jobId) => {
    setSavedJobs((prev) => {
      const updated = prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId];
      localStorage.setItem("savedJobs", JSON.stringify(updated));
      return updated;
    });
  };

  /* ── Search + Filter logic ── */
  const jobTypes = ["All", ...Array.from(new Set(jobs.map((j) => j.type)))];

  const filteredJobs = jobs
    .filter((job) => job.status === "active")
    .filter((job) => {
      const q = searchQuery.toLowerCase();
      return (
        job.title.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q) ||
        job.description.toLowerCase().includes(q)
      );
    })
    .filter((job) => filterType === "All" || job.type === filterType);

  const displayJobs = showSaved
    ? filteredJobs.filter((j) => savedJobs.includes(j._id))
    : filteredJobs;

  /* ── Apply Now ── */
  const handleApplyNow = (job) => {
    setSelectedJob(job);
    setTimeout(() => {
      document
        .getElementById("career-application-form")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const faqs = [
    {
      question: "How can I apply for a job?",
      answer:
        "You can apply directly through our careers portal by filling out the multi-step application form above and uploading your resume. Once submitted, our HR team will review your profile and contact shortlisted candidates within 3–5 business days.",
    },
    {
      question: "What resume formats are accepted?",
      answer:
        "We accept PDF, DOC, and DOCX resume formats. Please ensure your file is under 5MB. We recommend PDF format for the best compatibility and to preserve your formatting.",
    },
    {
      question: "Do you hire freshers?",
      answer:
        "Selected fresher opportunities and internships may be available depending on current project requirements. We encourage freshers to apply — relevant academic projects, certifications, or internship experience will be considered.",
    },
    {
      question: "Where are the job locations?",
      answer:
        "Most of our opportunities are based in Bangalore and across Karnataka project sites. For site-based roles such as Site Engineer and Machine Operator, candidates should be willing to work at project locations across the state.",
    },
    {
      question: "How long does the hiring process take?",
      answer:
        "Typically 1–2 weeks from application to offer, depending on the role and candidate availability. The process includes an HR screening call, a technical or role-specific interview, and then an offer discussion.",
    },
    {
      question: "Can I apply for multiple positions?",
      answer:
        "Yes, you may apply for multiple roles. We recommend submitting a separate application for each position and tailoring your message to highlight why you are a good fit for that specific role.",
    },
  ];

  /* ── Perks — uses Star, Heart, Gift ── */
  const perks = [
    {
      icon: <Star size={40} />,
      title: "Performance Recognition",
      desc: "Top performers are recognised every quarter with awards and accelerated career growth paths.",
      delay: 0,
    },
    {
      icon: <Heart size={40} />,
      title: "Employee Well-being",
      desc: "Health coverage, mental wellness support, and a people-first work environment.",
      delay: 0.1,
    },
    {
      icon: <Gift size={40} />,
      title: "Referral & Joining Bonus",
      desc: "Earn referral bonuses when you bring great talent, and enjoy a welcome joining bonus.",
      delay: 0.2,
    },
  ];

  return (
    <ToastProvider>
      <Helmet>
        <title>Careers | Construction & Infrastructure Jobs in Bangalore</title>
        <meta
          name="description"
          content="Apply for construction, civil engineering, EPC, and infrastructure jobs in Bangalore. Join our growing infrastructure development team."
        />
        <meta
          name="keywords"
          content="construction jobs Bangalore, civil engineer jobs Bangalore, infrastructure company careers, EPC jobs"
        />
        <meta property="og:title" content="Careers | Infrastructure Jobs" />
        <meta
          property="og:description"
          content="Apply for premium construction and infrastructure career opportunities."
        />
        <meta property="og:image" content="/careers/careers-og.jpg" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
          })}
        </script>
      </Helmet>

      <div className="careers-page">
        {/* ── HERO ─────────────────────────────────────────── */}
        <section className="careers-hero">
          <img
            src="/careers/careers-hero.jpg"
            alt="Construction Careers"
            className="careers-hero-image"
          />
          <div className="careers-overlay" />
          <div className="careers-grid" />

          <motion.div
            className="careers-hero-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="hero-tag">Careers & Opportunities</span>
            <h1>Build Your Career With Us</h1>
            <p>
              Join our growing infrastructure and construction team and become
              part of future-ready residential, commercial, and EPC development
              projects across Bangalore and Karnataka.
            </p>

            <div className="hero-buttons">
              <button
                onClick={() =>
                  document
                    .querySelector(".job-openings-section")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Explore Opportunities
                <ArrowRight size={18} />
              </button>
            </div>

            <div className="career-mini-stats">
              <div>
                <h3>Engineering</h3>
                <span>Careers</span>
              </div>
              <div>
                <h3>Infrastructure</h3>
                <span>Projects</span>
              </div>
              <div>
                <h3>Professional</h3>
                <span>Growth</span>
              </div>
              <div>
                <h3>Future</h3>
                <span>Opportunities</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── WHY WORK WITH US ─────────────────────────────── */}
        <section className="why-careers-section">
          <div className="section-header center">
            <span>Why Work With Us</span>
            <h2>Grow With A Future-Ready Infrastructure Company</h2>
          </div>

          <div className="career-benefits-grid">
            {[
              {
                icon: <Building2 size={40} />,
                title: "Modern Infrastructure Projects",
                desc: "Work on large-scale residential, commercial, and EPC developments.",
                delay: 0,
              },
              {
                icon: <CheckCircle2 size={40} />,
                title: "Professional Growth",
                desc: "Continuous learning, technical exposure, and career advancement.",
                delay: 0.1,
              },
              {
                icon: <Users size={40} />,
                title: "Skilled Team Environment",
                desc: "Collaborative engineering and execution culture.",
                delay: 0.2,
              },
              {
                icon: <ShieldCheck size={40} />,
                title: "Safety & Quality Focus",
                desc: "Strong commitment to engineering quality and professional standards.",
                delay: 0.3,
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                className="benefit-card"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: card.delay }}
                viewport={{ once: true }}
              >
                {card.icon}
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── PERKS & BENEFITS — Star · Heart · Gift ───────── */}
        <section className="perks-section">
          <div className="section-header center">
            <span>Perks & Benefits</span>
            <h2>What We Offer Beyond the Salary</h2>
          </div>

          <div className="career-benefits-grid">
            {perks.map((perk, i) => (
              <motion.div
                key={i}
                className="benefit-card"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: perk.delay }}
                viewport={{ once: true }}
              >
                {perk.icon}
                <h3>{perk.title}</h3>
                <p>{perk.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── HIRING PROCESS ───────────────────────────────── */}
        <HiringProcess />

        {/* ── JOB OPENINGS ─────────────────────────────────── */}
        <section className="job-openings-section">
          <div className="section-header center">
            <span>Current Openings</span>
            <h2>Explore Career Opportunities</h2>
          </div>

          {/* Search & Filter Bar */}
          <div className="jobs-toolbar">
            <div className="search-box">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search by title, location…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")}>
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="filter-tabs">
              {jobTypes.map((type) => (
                <button
                  key={type}
                  className={`filter-tab ${filterType === type ? "active" : ""}`}
                  onClick={() => setFilterType(type)}
                >
                  {type}
                </button>
              ))}
            </div>

            <button
              className={`saved-toggle ${showSaved ? "active" : ""}`}
              onClick={() => setShowSaved((v) => !v)}
              title="Saved jobs"
            >
              <BookmarkCheck size={16} />
              Saved ({savedJobs.length})
            </button>
          </div>

          {/* Results count */}
          {!loading && (
            <p className="jobs-count">
              Showing <strong>{displayJobs.length}</strong> of{" "}
              {filteredJobs.length} openings
            </p>
          )}

          {loading ? (
            <div className="jobs-grid">
              {[1, 2, 3].map((i) => (
                <JobCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {displayJobs.length > 0 ? (
                <div className="jobs-grid">
                  {displayJobs.map((job, index) => (
                    <motion.div
                      className="job-card"
                      key={job._id}
                      layout
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.5, delay: index * 0.08 }}
                      viewport={{ once: true }}
                    >
                      <div className="job-status">Now Hiring</div>

                      <button
                        className={`save-job-btn ${savedJobs.includes(job._id) ? "saved" : ""}`}
                        onClick={() => toggleSaveJob(job._id)}
                        title={savedJobs.includes(job._id) ? "Unsave" : "Save job"}
                      >
                        {savedJobs.includes(job._id) ? (
                          <BookmarkCheck size={16} />
                        ) : (
                          <Bookmark size={16} />
                        )}
                      </button>

                      <div className="job-icon">
                        <Hammer size={28} />
                      </div>

                      <h3>{job.title}</h3>
                      <p>{job.description}</p>

                      <div className="job-meta">
                        <div>
                          <MapPin size={16} />
                          {job.location}
                        </div>
                        <div>
                          <Briefcase size={16} />
                          {job.experience}
                        </div>
                        <div>
                          <IndianRupee size={16} />
                          {job.salary}
                        </div>
                        <div>
                          <Clock3 size={16} />
                          {job.type}
                        </div>
                      </div>

                      <button onClick={() => handleApplyNow(job)}>
                        Apply Now
                        <ArrowRight size={18} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  className="no-jobs-found"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Search size={40} />
                  <h3>No roles found</h3>
                  <p>Try a different keyword or clear your filters.</p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setFilterType("All");
                      setShowSaved(false);
                    }}
                  >
                    Clear Filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </section>

        {/* ── APPLICATION FORM ─────────────────────────────── */}
        <section className="application-section" id="career-application-form">
          <div className="application-wrapper">
            <motion.div
              className="application-left"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <span>Online Application</span>
              <h2>Apply For Your Desired Position</h2>
              <p>
                Submit your application directly through our careers portal. Our
                HR team will review your profile and contact shortlisted
                candidates.
              </p>

              <div className="contact-email-card">
                <div className="contact-email-icon">
                  <FileText size={20} />
                </div>
                <div>
                  <small>Applications sent to</small>
                  <a href="mailto:Info@smsinfra.com">Info@smsinfra.com</a>
                </div>
              </div>

              {selectedJob && (
                <div className="selected-job-box">
                  <h4>Selected Position</h4>
                  <p>{selectedJob.title}</p>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <MultiStepForm
                selectedJob={selectedJob}
                onSuccess={() => setSelectedJob(null)}
              />
            </motion.div>
          </div>
        </section>

        {/* ── FAQ — plain toggle, no animation ────────────── */}
        <section className="careers-faq-section">
          <div className="section-header center">
            <span>FAQs</span>
            <h2>Frequently Asked Questions</h2>
          </div>

          <div className="faq-container">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className={`faq-item ${isOpen ? "faq-active" : ""}`}
                >
                  <button
                    className="faq-question"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      size={18}
                      style={{
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.25s ease",
                        flexShrink: 0,
                      }}
                    />
                  </button>

                  {/* Plain conditional render — no motion, no AnimatePresence */}
                  {isOpen && (
                    <div className="faq-answer">
                      <div className="faq-answer-inner">
                        <p>{faq.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </ToastProvider>
  );
};

export default Careers;