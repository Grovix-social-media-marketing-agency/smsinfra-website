import React, { useEffect, useState, useCallback } from 'react';
import {
  MapPin, Mail, Phone, Clock, Send, Building2, User,
  MessageSquare, Briefcase, CheckCircle, ChevronRight,
  ChevronLeft, Save, RefreshCw, Zap, Users, AlertCircle,
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import './contact.css';

// ─── Constants ────────────────────────────────────────────────────────────────

const DRAFT_KEY = 'smsinfra_contact_draft';
const OPEN_HOUR = 9;
const CLOSE_HOUR = 19;
const API = (process.env.REACT_APP_API_URL || 'http://10.145.35.253:5000').replace(/\/api$/, '');

// ⭐ DEFAULT CONTACT PAGE CONTENT — shown while loading or if DB unreachable
const DEFAULT_CONTACT = {
  heroTag:      'CONTACT SMS INFRA',
  heroTitle:    "Let's Build Reliable Infrastructure Together",
  heroSubtitle: 'Connect with SMS Infra for construction materials, earthmoving services, infrastructure support, commercial projects, residential developments, and industrial site solutions across Bangalore.',
  address:       '407/11, SMS ELITE, 3rd Floor, Chandapura, Anekal Taluk, Bengaluru - 560081',
  email1:        'sales@smsinfra.com',
  email2:        'enquiry@smsinfra.com',
  phone1:        '7676590045',
  phone2:        '',
  businessHours: 'Mon – Sat: 9:00 AM – 7:00 PM',
  sundayHours:   'Sunday: Closed',
  responseTime:    'Within 2 hours during business hours',
  responseTimeOff: 'Next business day by 11:00 AM',
  monthlyCount:  '47 businesses contacted us this month',
  tickerMessages: [
    'A contractor from Whitefield just requested a quote 2 min ago',
    'A builder from Electronic City enquired about RMC 5 min ago',
    'A developer from Sarjapur submitted a quotation 8 min ago',
    'A site engineer from Hoodi requested M Sand pricing 12 min ago',
    'A contractor from HSR Layout asked about earthmoving 18 min ago',
    'A developer from Marathahalli enquired about aggregates 22 min ago',
  ],
  formTag:         'REQUEST A QUOTATION',
  formTitle:       'Get Custom Pricing For Your Construction Requirement',
  formDescription: 'Submit your project requirements and our team will provide customised quotations for earthmoving, aggregates, ready mix concrete, M Sand, P Sand, solid blocks, and infrastructure projects.',
  formFeatures: [
    'Commercial & Residential Projects',
    'Infrastructure & Industrial Solutions',
    'Fast Response From Expert Team',
  ],
  services: [
    'Earthmoving Services',
    'Ready Mix Concrete',
    'M Sand Supply',
    'P Sand Supply',
    'Solid Blocks',
    'Aggregates',
    'Infrastructure Projects',
  ],
  mapTag:   'LOCATION',
  mapTitle: 'Visit Our Office',
  mapEmbed: 'https://www.google.com/maps?q=Chandapura+Bangalore&output=embed',
  successTitle:      'Quotation request submitted!',
  successTimeOpen:   '2–3 hours',
  successTimeOff:    'the next business day',
};

// ─── Validation helpers ────────────────────────────────────────────────────────

const validators = {
  fullName:        v => v.trim().length >= 2,
  phone:           v => /^[+\d\s-]{8,15}$/.test(v.trim()),
  email:           v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
  service:         v => v !== '',
  projectLocation: v => v.trim().length >= 2,
  message:         v => v.trim().length >= 20,
};

// ─── Custom hooks ─────────────────────────────────────────────────────────────

function useBusinessStatus() {
  const getStatus = () => {
    const now = new Date();
    const day = now.getDay();
    const totalMin = now.getHours() * 60 + now.getMinutes();
    const isWeekday = day >= 1 && day <= 6;
    const isOpen = isWeekday && totalMin >= OPEN_HOUR * 60 && totalMin < CLOSE_HOUR * 60;
    const minsLeft = CLOSE_HOUR * 60 - totalMin;
    return { isOpen, hoursLeft: Math.floor(minsLeft / 60), minsLeft: minsLeft % 60 };
  };
  const [status, setStatus] = useState(getStatus);
  useEffect(() => {
    const id = setInterval(() => setStatus(getStatus()), 60000);
    return () => clearInterval(id);
  }, []);
  return status;
}

// ⭐ Ticker now driven by CMS data
function useTicker(messages) {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const msgs = messages && messages.length > 0 ? messages : DEFAULT_CONTACT.tickerMessages;
  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setIdx(i => (i + 1) % msgs.length); setVisible(true); }, 350);
    }, 5000);
    return () => clearInterval(id);
  }, [msgs.length]);
  return { message: msgs[idx] || '', visible };
}

function useDraft(formData, setFormData) {
  const [draftStatus, setDraftStatus] = useState('');

  const saveDraft = useCallback((data) => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
      setDraftStatus('saved');
      setTimeout(() => setDraftStatus(''), 2000);
    } catch (_) {}
  }, []);

  useEffect(() => {
    saveDraft(formData);
  }, [formData, saveDraft]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const d = JSON.parse(raw);
      if (d && (d.fullName || d.email)) {
        setFormData(d);
        setDraftStatus('restored');
        setTimeout(() => setDraftStatus(''), 2500);
      }
    } catch (_) {}
  }, [setFormData]);

  const clearDraft = () => { try { localStorage.removeItem(DRAFT_KEY); } catch (_) {} };
  return { draftStatus, clearDraft };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const StepIndicator = ({ step }) => {
  const steps = ['Contact info', 'Project details', 'Review & send'];
  return (
    <div className="step-indicator">
      <div className="step-track">
        {steps.map((label, i) => {
          const num = i + 1;
          const isDone = num < step;
          const isActive = num === step;
          return (
            <React.Fragment key={num}>
              <div className="step-node">
                <div className={`step-circle ${isDone ? 'done' : isActive ? 'active' : 'idle'}`}>
                  {isDone ? <CheckCircle size={14} /> : num}
                </div>
                <span className={`step-label ${isActive ? 'active' : ''}`}>{label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`step-line ${isDone ? 'done' : ''}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${(step / 3) * 100}%` }} />
      </div>
    </div>
  );
};

const FieldGroup = ({ label, error, touched, valid, children }) => (
  <div className={`form-group ${touched && error ? 'has-error' : ''} ${touched && valid ? 'is-valid' : ''}`}>
    <label>{label}</label>
    {children}
    {touched && error && <span className="field-error"><AlertCircle size={12} /> {error}</span>}
  </div>
);

// ⭐ DynamicFields now receives cms-driven services list
const DynamicFields = ({ service, values, onChange }) => {
  // These are static field definitions per service — not editable via CMS
  // (only the service names in the dropdown are CMS-driven)
  const FIELD_DEFS = {
    'Earthmoving Services': [
      { id: 'siteArea', label: 'Site area (sq ft)',  type: 'text',   placeholder: 'e.g. 10,000' },
      { id: 'soilType', label: 'Soil type',           type: 'select', options: ['Black cotton soil', 'Red soil', 'Rocky terrain', 'Mixed'] },
    ],
    'Ready Mix Concrete': [
      { id: 'grade',  label: 'Concrete grade',         type: 'select', options: ['M20', 'M25', 'M30', 'M35', 'M40'] },
      { id: 'volume', label: 'Required volume (cu m)', type: 'text',   placeholder: 'e.g. 50' },
    ],
    'M Sand Supply': [
      { id: 'quantity',     label: 'Quantity required (tonnes)', type: 'text',   placeholder: 'e.g. 100' },
      { id: 'deliveryFreq', label: 'Delivery frequency',         type: 'select', options: ['One-time', 'Weekly', 'Monthly'] },
    ],
    'P Sand Supply': [
      { id: 'quantity',     label: 'Quantity required (tonnes)', type: 'text',   placeholder: 'e.g. 50' },
      { id: 'deliveryFreq', label: 'Delivery frequency',         type: 'select', options: ['One-time', 'Weekly', 'Monthly'] },
    ],
    'Solid Blocks': [
      { id: 'blockQty',  label: 'Number of blocks', type: 'text',   placeholder: 'e.g. 5000' },
      { id: 'blockSize', label: 'Block size',        type: 'select', options: ['4 inch', '6 inch', '8 inch'] },
    ],
    'Aggregates': [
      { id: 'aggSize', label: 'Aggregate size',    type: 'select', options: ['6mm', '10mm', '20mm', '40mm'] },
      { id: 'aggQty',  label: 'Quantity (tonnes)', type: 'text',   placeholder: 'e.g. 200' },
    ],
    'Infrastructure Projects': [
      { id: 'projectType', label: 'Project type',      type: 'select', options: ['Road work', 'Drainage', 'Building foundation', 'Industrial site'] },
      { id: 'timeline',    label: 'Expected timeline', type: 'text',   placeholder: 'e.g. 3 months' },
    ],
  };
  const fields = FIELD_DEFS[service];
  if (!fields) return null;
  return (
    <div className="dynamic-fields-box">
      <div className="dynamic-fields-title">
        <Briefcase size={14} /> Additional details for {service}
      </div>
      <div className="form-grid two-col">
        {fields.map(f => (
          <div className="form-group" key={f.id}>
            <label>{f.label}</label>
            {f.type === 'select' ? (
              <select value={values[f.id] || ''} onChange={e => onChange(f.id, e.target.value)}>
                <option value="">Select {f.label.toLowerCase()}</option>
                {f.options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : (
              <input type="text" value={values[f.id] || ''} onChange={e => onChange(f.id, e.target.value)} placeholder={f.placeholder} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Step 1: Contact Info ─────────────────────────────────────────────────────

const Step1 = ({ formData, errors, touched, onChange, onNext }) => (
  <div className="step-body">
    <div className="step-heading">
      <h2>Your contact information</h2>
      <p>We'll use this to get back to you with a custom quote.</p>
    </div>
    <div className="form-grid two-col">
      <FieldGroup label="Full name" error={errors.fullName} touched={touched.fullName} valid={!errors.fullName}>
        <div className="input-with-icon">
          <User size={16} />
          <input type="text" name="fullName" value={formData.fullName} onChange={onChange} placeholder="Enter your full name" />
        </div>
      </FieldGroup>
      <FieldGroup label={<>Company name <span className="optional">(optional)</span></>}>
        <div className="input-with-icon">
          <Building2 size={16} />
          <input type="text" name="companyName" value={formData.companyName} onChange={onChange} placeholder="Enter company name" />
        </div>
      </FieldGroup>
      <FieldGroup label="Phone number" error={errors.phone} touched={touched.phone} valid={!errors.phone}>
        <div className="input-with-icon">
          <Phone size={16} />
          <input type="tel" name="phone" value={formData.phone} onChange={onChange} placeholder="+91 98765 43210" />
        </div>
      </FieldGroup>
      <FieldGroup label="Email address" error={errors.email} touched={touched.email} valid={!errors.email}>
        <div className="input-with-icon">
          <Mail size={16} />
          <input type="email" name="email" value={formData.email} onChange={onChange} placeholder="you@company.com" />
        </div>
      </FieldGroup>
    </div>
    <div className="form-footer">
      <div />
      <button type="button" className="btn btn-primary" onClick={onNext}>
        Next: project details <ChevronRight size={16} />
      </button>
    </div>
  </div>
);

// ─── Step 2: Project Details ──────────────────────────────────────────────────

// ⭐ services prop now comes from CMS
const Step2 = ({ formData, errors, touched, onChange, onDynChange, onBack, onNext, services }) => (
  <div className="step-body">
    <div className="step-heading">
      <h2>Project details</h2>
      <p>Tell us about your requirements so we can prepare the right quote.</p>
    </div>
    <div className="form-grid two-col">
      <FieldGroup label="Service required" error={errors.service} touched={touched.service} valid={!errors.service}>
        <select name="service" value={formData.service} onChange={onChange}>
          <option value="">Select service</option>
          {services.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </FieldGroup>
      <FieldGroup label="Project location" error={errors.projectLocation} touched={touched.projectLocation} valid={!errors.projectLocation}>
        <div className="input-with-icon">
          <MapPin size={16} />
          <input type="text" name="projectLocation" value={formData.projectLocation} onChange={onChange} placeholder="e.g. Whitefield, Bangalore" />
        </div>
      </FieldGroup>
    </div>

    <DynamicFields service={formData.service} values={formData.dynamicFields} onChange={onDynChange} />

    <FieldGroup label="Project details" error={errors.message} touched={touched.message} valid={!errors.message}>
      <div className="textarea-with-icon">
        <MessageSquare size={16} />
        <textarea name="message" value={formData.message} onChange={onChange} placeholder="Describe your project requirements, timeline, and volume needed..." rows={5} maxLength={500} />
      </div>
      <div className="char-counter">{formData.message.length}/500</div>
    </FieldGroup>

    <div className="form-footer">
      <button type="button" className="btn btn-ghost" onClick={onBack}>
        <ChevronLeft size={16} /> Back
      </button>
      <button type="button" className="btn btn-primary" onClick={onNext}>
        Review & confirm <ChevronRight size={16} />
      </button>
    </div>
  </div>
);

// ─── Step 3: Review ────────────────────────────────────────────────────────────

const ReviewRow = ({ label, value }) => (
  <div className="review-row">
    <span className="review-label">{label}</span>
    <span className="review-value">{value || '—'}</span>
  </div>
);

// ⭐ dynFields lookup uses the same FIELD_DEFS inside DynamicFields — we replicate here for review
const REVIEW_FIELD_DEFS = {
  'Earthmoving Services': [{ id: 'siteArea', label: 'Site area (sq ft)' }, { id: 'soilType', label: 'Soil type' }],
  'Ready Mix Concrete':   [{ id: 'grade',  label: 'Concrete grade' }, { id: 'volume', label: 'Required volume (cu m)' }],
  'M Sand Supply':        [{ id: 'quantity', label: 'Quantity required (tonnes)' }, { id: 'deliveryFreq', label: 'Delivery frequency' }],
  'P Sand Supply':        [{ id: 'quantity', label: 'Quantity required (tonnes)' }, { id: 'deliveryFreq', label: 'Delivery frequency' }],
  'Solid Blocks':         [{ id: 'blockQty', label: 'Number of blocks' }, { id: 'blockSize', label: 'Block size' }],
  'Aggregates':           [{ id: 'aggSize', label: 'Aggregate size' }, { id: 'aggQty', label: 'Quantity (tonnes)' }],
  'Infrastructure Projects': [{ id: 'projectType', label: 'Project type' }, { id: 'timeline', label: 'Expected timeline' }],
};

const Step3 = ({ formData, onBack, onSubmit, loading }) => {
  const dynFields = REVIEW_FIELD_DEFS[formData.service] || [];
  return (
    <div className="step-body">
      <div className="step-heading">
        <h2>Review your request</h2>
        <p>Please confirm your details before submitting.</p>
      </div>
      <div className="review-block">
        <h3 className="review-section-title">Contact information</h3>
        <ReviewRow label="Full name" value={formData.fullName} />
        <ReviewRow label="Company" value={formData.companyName} />
        <ReviewRow label="Phone" value={formData.phone} />
        <ReviewRow label="Email" value={formData.email} />
      </div>
      <div className="review-block">
        <h3 className="review-section-title">Project information</h3>
        <ReviewRow label="Service" value={formData.service} />
        <ReviewRow label="Location" value={formData.projectLocation} />
        {dynFields.map(f => (
          formData.dynamicFields[f.id]
            ? <ReviewRow key={f.id} label={f.label} value={formData.dynamicFields[f.id]} />
            : null
        ))}
        <ReviewRow label="Details" value={formData.message} />
      </div>
      <div className="form-footer">
        <button type="button" className="btn btn-ghost" onClick={onBack}>
          <ChevronLeft size={16} /> Back
        </button>
        <button type="button" className="btn btn-primary" onClick={onSubmit} disabled={loading}>
          {loading ? <><RefreshCw size={15} className="spin" /> Submitting...</> : <><Send size={15} /> Submit request</>}
        </button>
      </div>
    </div>
  );
};

// ─── Success screen ────────────────────────────────────────────────────────────

// ⭐ title and timeText now CMS-driven
const SuccessScreen = ({ email, isOpen, onReset, cms }) => (
  <div className="success-screen">
    <div className="success-icon-wrap">
      <CheckCircle size={40} />
    </div>
    <h2>{cms.successTitle || DEFAULT_CONTACT.successTitle}</h2>
    <p>
      Our team will review your requirements and contact you within{' '}
      <strong>{isOpen ? (cms.successTimeOpen || DEFAULT_CONTACT.successTimeOpen) : (cms.successTimeOff || DEFAULT_CONTACT.successTimeOff)}</strong>.
      A confirmation has been sent to <strong>{email}</strong>.
    </p>
    <button type="button" className="btn btn-ghost" onClick={onReset}>
      <RefreshCw size={15} /> Submit another request
    </button>
  </div>
);

// ─── Main component ────────────────────────────────────────────────────────────

const EMPTY_FORM = {
  fullName: '', companyName: '', phone: '', email: '',
  service: '', projectLocation: '', message: '',
  dynamicFields: {},
};

const Contact = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  // ⭐ NEW: show error message if submit fails
  const [submitError, setSubmitError] = useState('');

  // ⭐ CMS content state — defaults shown while loading
  const [cms, setCms] = useState(DEFAULT_CONTACT);
  const [cmsLoaded, setCmsLoaded] = useState(false);

  const { isOpen, hoursLeft, minsLeft } = useBusinessStatus();
  const ticker = useTicker(cms.tickerMessages);
  const { draftStatus, clearDraft } = useDraft(formData, setFormData);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  // ⭐ Fetch contact page CMS on mount
  useEffect(() => {
    fetch(`${API}/api/cms/contactpage`)
      .then(r => r.json())
      .then(data => {
        if (data && typeof data === 'object' && !data.error) {
          // Merge with defaults so missing fields always have a value
          setCms(prev => ({ ...prev, ...data }));
        }
        setCmsLoaded(true);
      })
      .catch(() => setCmsLoaded(true)); // fall back to defaults silently
  }, []);

  const services = (cms.services && cms.services.length > 0) ? cms.services : DEFAULT_CONTACT.services;

  const errors = {
    fullName:        !validators.fullName(formData.fullName)               ? 'Please enter your full name.' : '',
    phone:           !validators.phone(formData.phone)                     ? 'Please enter a valid phone number.' : '',
    email:           !validators.email(formData.email)                     ? 'Please enter a valid email address.' : '',
    service:         !validators.service(formData.service)                 ? 'Please select a service.' : '',
    projectLocation: !validators.projectLocation(formData.projectLocation) ? 'Please enter a project location.' : '',
    message:         !validators.message(formData.message)                 ? 'Please describe your project (min 20 characters).' : '',
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleDynChange = (fieldId, value) => {
    setFormData(prev => ({ ...prev, dynamicFields: { ...prev.dynamicFields, [fieldId]: value } }));
  };

  const touchStep1Fields = () => setTouched(t => ({ ...t, fullName: true, phone: true, email: true }));
  const touchStep2Fields = () => setTouched(t => ({ ...t, service: true, projectLocation: true, message: true }));

  const handleNext1 = () => {
    touchStep1Fields();
    if (!errors.fullName && !errors.phone && !errors.email) setStep(2);
  };
  const handleNext2 = () => {
    touchStep2Fields();
    if (!errors.service && !errors.projectLocation && !errors.message) setStep(3);
  };

  // ⭐ FIXED: only show success when API actually returns 200
  const handleSubmit = async () => {
    setLoading(true);
    setSubmitError('');
    try {
      const response = await fetch(`${API}/api/contact/quotation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName:        formData.fullName,
          companyName:     formData.companyName,
          phone:           formData.phone,
          email:           formData.email,
          service:         formData.service,
          projectLocation: formData.projectLocation,
          message:         formData.message,
          dynamicFields:   formData.dynamicFields || {},
        }),
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        console.error('Quotation submit failed:', response.status, errData);
        setSubmitError('Something went wrong. Please try again or call us directly.');
        return;
      }
      // ⭐ Only reach here on actual success
      clearDraft();
      setStep(4);
    } catch (err) {
      console.error('Quotation submit error:', err);
      setSubmitError('Unable to connect. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(EMPTY_FORM);
    setTouched({});
    setSubmitError('');
    setStep(1);
  };

  return (
    <div className="contact-page">
      <Helmet>
        <title>Contact SMS Infra | Construction & Infrastructure Company Bangalore</title>
        <meta name="description" content="Contact SMS Infra for earthmoving, M Sand, P Sand, RMC, solid blocks, aggregates, and infrastructure project requirements in Bangalore." />
        <meta name="keywords" content="SMS Infra contact, construction company Bangalore, earthmoving contractor Bangalore, RMC supplier Bangalore, M Sand supplier Bangalore" />
        <link rel="canonical" href="https://www.smsinfra.com/contact" />
      </Helmet>

      {/* ── HERO ── */}
      <section className="contact-hero">
        <div className="contact-overlay" />
        <div className="contact-container">
          <div className="contact-hero-content">
            <span className="contact-mini-title">{cms.heroTag || DEFAULT_CONTACT.heroTag}</span>
            <h1>{cms.heroTitle || DEFAULT_CONTACT.heroTitle}</h1>
            <p>{cms.heroSubtitle || DEFAULT_CONTACT.heroSubtitle}</p>
          </div>
        </div>
      </section>

      {/* ── INFO CARDS ── */}
      <section className="contact-info-section">
        <div className="contact-container">
          <div className="contact-info-grid">

            <div className="contact-info-card">
              <div className="contact-icon"><MapPin size={26} /></div>
              <h3>Office Address</h3>
              <p>{cms.address || DEFAULT_CONTACT.address}</p>
            </div>

            <div className="contact-info-card">
              <div className="contact-icon"><Mail size={26} /></div>
              <h3>Email Address</h3>
              <p>{cms.email1 || DEFAULT_CONTACT.email1}</p>
              {(cms.email2 || DEFAULT_CONTACT.email2) && <p>{cms.email2 || DEFAULT_CONTACT.email2}</p>}
            </div>

            <div className="contact-info-card">
              <div className="contact-icon"><Clock size={26} /></div>
              <h3>Business Hours</h3>
              <p>{cms.businessHours || DEFAULT_CONTACT.businessHours}</p>
              <p>{cms.sundayHours || DEFAULT_CONTACT.sundayHours}</p>
              <span className={`hours-badge ${isOpen ? 'open' : 'closed'}`}>
                {isOpen
                  ? `Open now · closes in ${hoursLeft}h ${minsLeft}m`
                  : 'Closed now · opens 9 AM Mon'}
              </span>
            </div>

            <div className="contact-info-card">
              <div className="contact-icon"><Zap size={26} /></div>
              <h3>Response Time</h3>
              <p>{isOpen ? (cms.responseTime || DEFAULT_CONTACT.responseTime) : (cms.responseTimeOff || DEFAULT_CONTACT.responseTimeOff)}</p>
              <span className={`hours-badge ${isOpen ? 'open' : 'closed'}`}>
                {isOpen ? 'Fast response today' : 'Reply next business day'}
              </span>
              <p className="counter-note">
                <Users size={12} /> {cms.monthlyCount || DEFAULT_CONTACT.monthlyCount}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <section className="contact-ticker-section">
        <div className="contact-container">
          <div className="ticker-bar">
            <span className="ticker-dot" />
            <span className={`ticker-message ${ticker.visible ? 'visible' : 'hidden'}`}>
              {ticker.message}
            </span>
          </div>
        </div>
      </section>

      {/* ── QUOTATION FORM ── */}
      <section className="quotation-section">
        <div className="contact-container">
          <div className="quotation-wrapper">

            {/* LEFT */}
            <div className="quotation-left">
              <span className="contact-mini-title">{cms.formTag || DEFAULT_CONTACT.formTag}</span>
              <h2>{cms.formTitle || DEFAULT_CONTACT.formTitle}</h2>
              <p>{cms.formDescription || DEFAULT_CONTACT.formDescription}</p>
              <div className="quotation-features">
                {(cms.formFeatures && cms.formFeatures.length > 0 ? cms.formFeatures : DEFAULT_CONTACT.formFeatures).map((feat, i) => {
                  const icons = [<Building2 size={18} />, <Briefcase size={18} />, <Send size={18} />];
                  return (
                    <div className="quotation-feature-item" key={i}>
                      {icons[i % icons.length]}
                      <span>{feat}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT — multi-step form */}
            <div className="quotation-right">
              <div className="form-card">

                {/* Header */}
                <div className="form-card-header">
                  <div className="form-card-header-top">
                    <span className="form-card-title">Quotation request</span>
                    {draftStatus && (
                      <span className="draft-status">
                        <Save size={13} />
                        {draftStatus === 'saved' ? ' Draft saved' : ' Draft restored'}
                      </span>
                    )}
                  </div>
                  {step <= 3 && <StepIndicator step={step} />}
                </div>

                {/* ⭐ Submit error banner — shown above step 3 if API fails */}
                {submitError && step === 3 && (
                  <div style={{
                    background: 'rgba(255,80,80,0.08)',
                    border: '1px solid rgba(255,80,80,0.25)',
                    borderRadius: 8,
                    padding: '10px 14px',
                    margin: '0 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 13,
                    color: '#e05252',
                  }}>
                    <AlertCircle size={15} />
                    {submitError}
                  </div>
                )}

                {/* Steps */}
                {step === 1 && (
                  <Step1 formData={formData} errors={errors} touched={touched} onChange={handleChange} onNext={handleNext1} />
                )}
                {step === 2 && (
                  <Step2
                    formData={formData}
                    errors={errors}
                    touched={touched}
                    onChange={handleChange}
                    onDynChange={handleDynChange}
                    onBack={() => setStep(1)}
                    onNext={handleNext2}
                    services={services}
                  />
                )}
                {step === 3 && (
                  <Step3 formData={formData} onBack={() => setStep(2)} onSubmit={handleSubmit} loading={loading} />
                )}
                {step === 4 && (
                  <SuccessScreen email={formData.email} isOpen={isOpen} onReset={handleReset} cms={cms} />
                )}

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAP ── */}
      <section className="contact-map-section">
        <div className="contact-container">
          <div className="map-header">
            <span className="contact-mini-title">{cms.mapTag || DEFAULT_CONTACT.mapTag}</span>
            <h2>{cms.mapTitle || DEFAULT_CONTACT.mapTitle}</h2>
          </div>
          <div className="map-wrapper">
            <iframe
              title="SMS Infra Location"
              src={cms.mapEmbed || DEFAULT_CONTACT.mapEmbed}
              loading="lazy"
              allowFullScreen
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
