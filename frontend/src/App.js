import { useState, useEffect, useRef } from "react";
import "@/App.css";
import axios from "axios";
import { Phone, Upload, ArrowRight, CheckCircle, Zap, Shield, RefreshCw, Wrench, Flame, Gauge, HardHat, Settings, Cog } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// UTM Parameter Capture
function getUTMParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
    utm_content: params.get('utm_content') || '',
    utm_term: params.get('utm_term') || ''
  };
}

// Trade data
const trades = [
  {
    name: "Pipefitters",
    description: "Pipe installation, maintenance, and repair",
    certification: "NSTC card required",
    icon: Wrench
  },
  {
    name: "Welders",
    description: "Structural and pipeline welding",
    certification: "NSTC card + CWB/AWS cert",
    icon: Flame
  },
  {
    name: "Heavy Equipment Operators",
    description: "Excavators, dozers, cranes",
    certification: "NSTC card + equipment tickets",
    icon: Gauge
  },
  {
    name: "Instrumentation Techs",
    description: "Instrumentation and controls",
    certification: "NSTC card required",
    icon: Settings
  },
  {
    name: "Roustabouts",
    description: "General rig labor and support",
    certification: "NSTC card required",
    icon: HardHat
  },
  {
    name: "Heavy Duty Mechanics",
    description: "Diesel and heavy equipment repair",
    certification: "NSTC card + trade ticket",
    icon: Cog
  }
];

// Blog placeholder data
const blogPosts = [
  {
    tag: "Project Update",
    title: "Willow Project: What the 2025 Construction Phase Means for Labor Demand",
    excerpt: "ConocoPhillips' Willow Project is entering its most labor-intensive phase. Here's what tradesmen need to know."
  },
  {
    tag: "Certification Guide",
    title: "NSTC Certification: The Complete Guide for Lower 48 Workers",
    excerpt: "Everything you need to know about getting your North Slope Training Cooperative card before your first rotation."
  },
  {
    tag: "Industry",
    title: "FIFO Rotations Explained: What to Expect on Your First North Slope Assignment",
    excerpt: "Fly-in fly-out work is different from anything else in the trades. Here's an honest look at what the schedule actually looks like."
  }
];

// Header Component
const Header = () => (
  <header className="header" data-testid="header">
    <div className="logo" data-testid="logo">
      North <span>Slope</span> Trades
    </div>
    <a href="tel:+1XXXXXXXXXX" className="header-phone" data-testid="header-phone">
      <Phone size={18} />
      <span>+1 (XXX) XXX-XXXX</span>
    </a>
  </header>
);

// Hero Section
const HeroSection = ({ scrollToWorkerForm, scrollToClientForm }) => (
  <section className="hero-section" data-testid="hero-section">
    <div className="hero-bg" />
    <Header />
    <div className="hero-content">
      <h1 
        className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black uppercase tracking-tighter leading-none mb-6 animate-fade-in-up"
        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        data-testid="hero-title"
      >
        North Slope Ready.<br />
        <span className="text-[#38BDF8]">Deployed in 72 Hours.</span>
      </h1>
      <p 
        className="text-base sm:text-lg text-slate-300 max-w-xl mb-8 leading-relaxed animate-fade-in-up animation-delay-100"
        data-testid="hero-subtitle"
      >
        Pre-vetted, FIFO-ready tradesmen for Alaska's most demanding energy operations.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-200">
        <button
          onClick={scrollToWorkerForm}
          className="btn-primary"
          data-testid="hero-join-roster-btn"
        >
          Join the Deployment Roster
        </button>
        <button
          onClick={scrollToClientForm}
          className="btn-outline"
          data-testid="hero-request-workers-btn"
        >
          Request Workers
        </button>
      </div>
      <div className="trust-bar animate-fade-in-up animation-delay-300">
        <p data-testid="trust-bar-text">
          Deploying certified tradesmen to North Slope operations including Prudhoe Bay, Deadhorse, and the Willow Project corridor
        </p>
      </div>
    </div>
  </section>
);

// Specializations Section
const SpecializationsSection = () => (
  <section className="section" data-testid="specializations-section">
    <h2 className="section-title" data-testid="specializations-title">
      The North Slope Workforce, Ready to Deploy
    </h2>
    <p className="section-subtitle" data-testid="specializations-subtitle">
      Certified tradesmen across all critical oil & gas disciplines. NSTC-verified and rotation-ready.
    </p>
    <div className="trade-grid" data-testid="trade-grid">
      {trades.map((trade, index) => {
        const IconComponent = trade.icon;
        return (
          <div key={index} className="trade-card" data-testid={`trade-card-${index}`}>
            <IconComponent className="trade-icon" />
            <h3 className="trade-name">{trade.name}</h3>
            <p className="trade-desc">{trade.description}</p>
            <span className="trade-cert">{trade.certification}</span>
          </div>
        );
      })}
    </div>
  </section>
);

// How It Works Section
const HowItWorksSection = () => (
  <section className="hiw-section section" data-testid="how-it-works-section">
    <div className="hiw-bg" />
    <div className="hiw-content">
      <h2 className="section-title" data-testid="hiw-title">
        How the Deployment Roster Works
      </h2>
      <div className="hiw-steps">
        <div className="hiw-step" data-testid="hiw-step-1">
          <div className="hiw-step-number">1</div>
          <h3 className="hiw-step-title">Submit Your Profile</h3>
          <p className="hiw-step-desc">
            Fill out the form below with your trade, certifications, and availability
          </p>
        </div>
        <div className="hiw-step" data-testid="hiw-step-2">
          <div className="hiw-step-number">2</div>
          <h3 className="hiw-step-title">We Verify Your Tickets</h3>
          <p className="hiw-step-desc">
            Our team confirms your NSTC card and deployment readiness
          </p>
        </div>
        <div className="hiw-step" data-testid="hiw-step-3">
          <div className="hiw-step-number">3</div>
          <h3 className="hiw-step-title">Get Matched to a Rotation</h3>
          <p className="hiw-step-desc">
            When an operator needs your trade, we reach out with a real opportunity
          </p>
        </div>
      </div>
    </div>
  </section>
);

// Worker Form Section
const WorkerFormSection = ({ formRef }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    primary_trade: '',
    years_experience: '',
    nstc_card: '',
    anchorage_travel: '',
    availability: '',
    resume_filename: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showKnockout, setShowKnockout] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Check knockout conditions
    if (name === 'nstc_card' || name === 'anchorage_travel') {
      const newData = { ...formData, [name]: value };
      if (newData.nstc_card === 'no' && newData.anchorage_travel === 'no') {
        setShowKnockout(true);
      } else {
        setShowKnockout(false);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
      setFormData(prev => ({ ...prev, resume_filename: e.target.files[0].name }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Knockout check
    if (formData.nstc_card === 'no' && formData.anchorage_travel === 'no') {
      setShowKnockout(true);
      // Fire GA4 knockout event
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'worker_knockout', {
          'event_category': 'Lead Capture',
          'event_label': 'Disqualified — Missing NSTC or Travel'
        });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const utmParams = getUTMParams();
      const payload = { ...formData, ...utmParams };
      
      await axios.post(`${API}/worker-submission`, payload);
      
      // Fire GA4 success event
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'worker_form_submit', {
          'event_category': 'Lead Capture',
          'event_label': 'Worker Intake Form'
        });
      }
      // Fire Facebook Pixel event
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'Lead', { content_name: 'Worker Intake Form' });
      }
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Form submission error:', error);
      alert('There was an error submitting your form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section ref={formRef} className="form-section section" id="worker-form-section" data-testid="worker-form-section">
        <div className="form-success" data-testid="worker-form-success">
          <CheckCircle className="form-success-icon" />
          <h3 className="form-success-title">You're on the list</h3>
          <p className="form-success-text">
            We'll be in touch when a North Slope match opens up. In the meantime, make sure your NSTC card is current.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section ref={formRef} className="form-section section" id="worker-form-section" data-testid="worker-form-section">
      <h2 className="section-title" data-testid="worker-form-title">
        Get on the North Slope Deployment List
      </h2>
      <p className="section-subtitle" data-testid="worker-form-subtitle">
        High-paying FIFO rotations for certified tradesmen. Submit your profile and we'll reach out when a match opens.
      </p>
      
      <form id="worker-form" className="form-container" onSubmit={handleSubmit} data-testid="worker-form">
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Full Name <span>*</span></label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              className="form-input"
              required
              data-testid="worker-full-name"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Email <span>*</span></label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
              required
              data-testid="worker-email"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Phone <span>*</span></label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="form-input"
              required
              data-testid="worker-phone"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Primary Trade <span>*</span></label>
            <select
              name="primary_trade"
              value={formData.primary_trade}
              onChange={handleInputChange}
              className="form-select"
              required
              data-testid="worker-trade"
            >
              <option value="">Select your trade</option>
              <option value="pipefitter">Pipefitter</option>
              <option value="welder">Welder</option>
              <option value="instrumentation_tech">Instrumentation Tech</option>
              <option value="heavy_equipment_operator">Heavy Equipment Operator</option>
              <option value="heavy_duty_mechanic">Heavy Duty Mechanic</option>
              <option value="roustabout">Roustabout</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Years of Experience <span>*</span></label>
            <select
              name="years_experience"
              value={formData.years_experience}
              onChange={handleInputChange}
              className="form-select"
              required
              data-testid="worker-experience"
            >
              <option value="">Select experience</option>
              <option value="1-3">1–3 years</option>
              <option value="3-5">3–5 years</option>
              <option value="5-10">5–10 years</option>
              <option value="10+">10+ years</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Availability <span>*</span></label>
            <select
              name="availability"
              value={formData.availability}
              onChange={handleInputChange}
              className="form-select"
              required
              data-testid="worker-availability"
            >
              <option value="">Select availability</option>
              <option value="immediately">Immediately</option>
              <option value="2_weeks">Within 2 weeks</option>
              <option value="1_month">Within 1 month</option>
              <option value="1_month_plus">1 month+</option>
            </select>
          </div>
          
          <div className="form-group full-width">
            <label className="form-label">Do you hold a current, valid NSTC card? <span>*</span></label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="nstc_card"
                  value="yes"
                  checked={formData.nstc_card === 'yes'}
                  onChange={handleInputChange}
                  className="radio-input"
                  required
                  data-testid="worker-nstc-yes"
                />
                Yes
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="nstc_card"
                  value="no"
                  checked={formData.nstc_card === 'no'}
                  onChange={handleInputChange}
                  className="radio-input"
                  data-testid="worker-nstc-no"
                />
                No
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="nstc_card"
                  value="in_progress"
                  checked={formData.nstc_card === 'in_progress'}
                  onChange={handleInputChange}
                  className="radio-input"
                  data-testid="worker-nstc-progress"
                />
                In Progress
              </label>
            </div>
          </div>
          
          <div className="form-group full-width">
            <label className="form-label">Are you willing to fund your own travel to Anchorage as Point of Hire? <span>*</span></label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="anchorage_travel"
                  value="yes"
                  checked={formData.anchorage_travel === 'yes'}
                  onChange={handleInputChange}
                  className="radio-input"
                  required
                  data-testid="worker-travel-yes"
                />
                Yes
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="anchorage_travel"
                  value="no"
                  checked={formData.anchorage_travel === 'no'}
                  onChange={handleInputChange}
                  className="radio-input"
                  data-testid="worker-travel-no"
                />
                No
              </label>
            </div>
          </div>
          
          <div className="form-group full-width">
            <label className="form-label">Resume / Certifications (optional)</label>
            <div className="file-upload">
              <input
                type="file"
                onChange={handleFileChange}
                className="file-upload-input"
                accept=".pdf,.doc,.docx"
                data-testid="worker-resume"
              />
              <div className="file-upload-label">
                <Upload size={20} />
                {fileName || 'Upload Resume & Tickets'}
              </div>
            </div>
          </div>
        </div>
        
        {showKnockout && (
          <div className="knockout-message" data-testid="knockout-message">
            <p>
              These roles require a valid NSTC card and travel to Anchorage as Point of Hire. We'd encourage you to get certified and apply again — we'd love to have you on the roster.
            </p>
          </div>
        )}
        
        <div className="form-submit">
          <button
            type="submit"
            id="worker-submit"
            className="btn-primary w-full"
            disabled={isSubmitting || showKnockout}
            data-testid="worker-submit-btn"
          >
            {isSubmitting ? <span className="spinner" /> : 'Submit My Profile'}
          </button>
          <p className="form-privacy" data-testid="worker-form-privacy">
            Your information is never shared without your consent. No spam calls.
          </p>
        </div>
      </form>
    </section>
  );
};

// Client Form Section
const ClientFormSection = ({ formRef }) => {
  const [formData, setFormData] = useState({
    company_name: '',
    contact_name: '',
    role_title: '',
    trades_needed: [],
    workers_required: '',
    project_location: '',
    start_date: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTradeChange = (trade) => {
    setFormData(prev => {
      const trades = prev.trades_needed.includes(trade)
        ? prev.trades_needed.filter(t => t !== trade)
        : [...prev.trades_needed, trade];
      return { ...prev, trades_needed: trades };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const utmParams = getUTMParams();
      const payload = { 
        ...formData, 
        workers_required: parseInt(formData.workers_required) || 0,
        ...utmParams 
      };
      
      await axios.post(`${API}/client-submission`, payload);
      
      // Fire GA4 success event
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'client_form_submit', {
          'event_category': 'Lead Capture',
          'event_label': 'Client Request Form'
        });
      }
      // Fire Facebook Pixel event
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'Lead', { content_name: 'Client Request Form' });
      }
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Form submission error:', error);
      alert('There was an error submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const tradeOptions = [
    'Pipefitter',
    'Welder',
    'Instrumentation Tech',
    'Heavy Equipment Operator',
    'Heavy Duty Mechanic',
    'Roustabout'
  ];

  if (isSubmitted) {
    return (
      <section ref={formRef} className="client-section section" id="client-form-section" data-testid="client-form-section">
        <div className="form-success" data-testid="client-form-success">
          <CheckCircle className="form-success-icon" />
          <h3 className="form-success-title">Request Received</h3>
          <p className="form-success-text">
            We'll review your requirements and be in touch within 24 hours.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section ref={formRef} className="client-section section" id="client-form-section" data-testid="client-form-section">
      <h2 className="section-title" data-testid="client-form-title">
        Need Certified Crew on the Slope — Fast?
      </h2>
      <p className="section-subtitle" data-testid="client-form-subtitle">
        We maintain a pre-screened bench of NSTC-certified, FIFO-ready tradesmen. No HR bottlenecks. No wasted interviews. Just deployment-ready people.
      </p>
      <p className="bench-signal" data-testid="bench-signal">
        <CheckCircle size={16} /> Bench currently active — last worker placement: <span>recently</span>
      </p>
      
      <div className="client-values" data-testid="client-values">
        <div className="client-value">
          <Zap className="client-value-icon" />
          <div>
            <h4 className="client-value-title">24–72 Hour Mobilization</h4>
            <p className="client-value-desc">Deployment-ready candidates, not database entries</p>
          </div>
        </div>
        <div className="client-value">
          <Shield className="client-value-icon" />
          <div>
            <h4 className="client-value-title">Pre-Screened & Certified</h4>
            <p className="client-value-desc">NSTC verified before we ever pitch a name</p>
          </div>
        </div>
        <div className="client-value">
          <RefreshCw className="client-value-icon" />
          <div>
            <h4 className="client-value-title">FIFO-Ready</h4>
            <p className="client-value-desc">Candidates familiar with rotational schedules and remote sites</p>
          </div>
        </div>
      </div>
      
      <form id="client-form" className="form-container" onSubmit={handleSubmit} data-testid="client-form">
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Company Name <span>*</span></label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleInputChange}
              className="form-input"
              required
              data-testid="client-company"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Your Name <span>*</span></label>
            <input
              type="text"
              name="contact_name"
              value={formData.contact_name}
              onChange={handleInputChange}
              className="form-input"
              required
              data-testid="client-name"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Your Role / Title <span>*</span></label>
            <input
              type="text"
              name="role_title"
              value={formData.role_title}
              onChange={handleInputChange}
              className="form-input"
              required
              data-testid="client-role"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Number of Workers Required</label>
            <input
              type="number"
              name="workers_required"
              value={formData.workers_required}
              onChange={handleInputChange}
              className="form-input"
              min="1"
              data-testid="client-workers"
            />
          </div>
          
          <div className="form-group full-width">
            <label className="form-label">Trade(s) Needed <span>*</span></label>
            <div className="checkbox-group">
              {tradeOptions.map((trade, index) => (
                <label key={index} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.trades_needed.includes(trade)}
                    onChange={() => handleTradeChange(trade)}
                    className="checkbox-input"
                    data-testid={`client-trade-${index}`}
                  />
                  {trade}
                </label>
              ))}
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Project / Site Location</label>
            <input
              type="text"
              name="project_location"
              value={formData.project_location}
              onChange={handleInputChange}
              className="form-input"
              placeholder="e.g. Prudhoe Bay, Deadhorse, Willow"
              data-testid="client-location"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Estimated Start Date</label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleInputChange}
              className="form-input"
              data-testid="client-start-date"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Email <span>*</span></label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
              required
              data-testid="client-email"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Phone <span>*</span></label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="form-input"
              required
              data-testid="client-phone"
            />
          </div>
        </div>
        
        <div className="form-submit">
          <button
            type="submit"
            id="client-submit"
            className="btn-outline w-full"
            disabled={isSubmitting}
            data-testid="client-submit-btn"
          >
            {isSubmitting ? <span className="spinner" /> : 'Submit a Crew Request'}
          </button>
        </div>
      </form>
    </section>
  );
};

// Blog Section
const BlogSection = () => (
  <section className="blog-section section" data-testid="blog-section">
    <h2 className="section-title" data-testid="blog-title">
      North Slope Intelligence
    </h2>
    <p className="section-subtitle" data-testid="blog-subtitle">
      Project updates, certification guides, and workforce news for Alaska energy operations.
    </p>
    {/* Blog cards — replace with CMS or dynamic content when ready */}
    <div className="blog-grid" data-testid="blog-grid">
      {blogPosts.map((post, index) => (
        <article key={index} className="blog-card" data-testid={`blog-card-${index}`}>
          <div className="blog-card-content">
            <span className="blog-tag">{post.tag}</span>
            <h3 className="blog-title">{post.title}</h3>
            <p className="blog-excerpt">{post.excerpt}</p>
            <a href="#" className="blog-link">
              Read More <ArrowRight size={16} />
            </a>
          </div>
        </article>
      ))}
    </div>
  </section>
);

// Footer Component
const Footer = () => (
  <footer className="footer" data-testid="footer">
    <div className="footer-content">
      <div className="footer-top">
        <div className="footer-brand">
          <div className="footer-logo">
            North <span>Slope</span> Trades
          </div>
          <p className="footer-tagline">
            Rapid labor deployment for Alaska's North Slope energy sector.
          </p>
        </div>
        <div className="footer-contact">
          <a href="mailto:hello@northslopetrades.com" className="footer-email" data-testid="footer-email">
            hello@northslopetrades.com
          </a>
          <div className="footer-links">
            <a href="#" className="footer-link" data-testid="footer-privacy">Privacy Policy</a>
            <a href="#" className="footer-link" data-testid="footer-terms">Terms of Service</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p className="footer-copyright" data-testid="footer-copyright">
          © 2025 North Slope Trades. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

// Mobile CTA Component
const MobileCTA = ({ scrollToWorkerForm, scrollToClientForm, isHidden }) => (
  <div className={`mobile-cta ${isHidden ? 'hidden' : ''}`} data-testid="mobile-cta">
    <button onClick={scrollToWorkerForm} className="btn-primary" data-testid="mobile-join-btn">
      Join Roster
    </button>
    <button onClick={scrollToClientForm} className="btn-outline" data-testid="mobile-request-btn">
      Request Workers
    </button>
  </div>
);

// Main App Component
function App() {
  const workerFormRef = useRef(null);
  const clientFormRef = useRef(null);
  const [hideMobileCTA, setHideMobileCTA] = useState(false);

  const scrollToWorkerForm = () => {
    workerFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToClientForm = () => {
    clientFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!workerFormRef.current || !clientFormRef.current) return;
      
      const workerRect = workerFormRef.current.getBoundingClientRect();
      const clientRect = clientFormRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Hide mobile CTA when either form section is in view
      const workerInView = workerRect.top < windowHeight && workerRect.bottom > 0;
      const clientInView = clientRect.top < windowHeight && clientRect.bottom > 0;
      
      setHideMobileCTA(workerInView || clientInView);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="App" data-testid="app">
      <HeroSection 
        scrollToWorkerForm={scrollToWorkerForm} 
        scrollToClientForm={scrollToClientForm} 
      />
      <SpecializationsSection />
      <HowItWorksSection />
      <WorkerFormSection formRef={workerFormRef} />
      <ClientFormSection formRef={clientFormRef} />
      <BlogSection />
      <Footer />
      <MobileCTA 
        scrollToWorkerForm={scrollToWorkerForm}
        scrollToClientForm={scrollToClientForm}
        isHidden={hideMobileCTA}
      />
    </div>
  );
}

export default App;
