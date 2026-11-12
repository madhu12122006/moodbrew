import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  User,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Instagram,
  Twitter,
  Linkedin,
  Sparkles,
  Info,
} from 'lucide-react';
import './ContactPage.css';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const QUICK_TOPICS = [
  'Flavour Idea',
  'Portfolio Feedback',
  'Concept Collaboration',
  'Just Saying Hi',
];

const SOCIAL_LINKS = [
  {
    name: 'Instagram',
    handle: '@moodbrew.in (Demo)',
    icon: Instagram,
    bg: 'var(--color-cherry-blush)',
  },
  {
    name: 'X / Twitter',
    handle: '@moodbrew_sips (Demo)',
    icon: Twitter,
    bg: 'var(--color-soft-lavender)',
  },
  {
    name: 'LinkedIn',
    handle: 'Madhura Zambare · Creator',
    icon: Linkedin,
    bg: 'var(--color-matcha-mint)',
  },
];

const INITIAL_FORM = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

export default function ContactPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [formErrorBanner, setFormErrorBanner] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const subjectRef = useRef(null);
  const messageRef = useRef(null);
  const submitTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (submitTimerRef.current) {
        window.clearTimeout(submitTimerRef.current);
      }
    };
  }, []);

  const validate = (values) => {
    const nextErrors = {};
    if (!values.name.trim()) {
      nextErrors.name = 'Please share your name.';
    }
    if (!values.email.trim()) {
      nextErrors.email = 'Please enter your email address.';
    } else if (!EMAIL_PATTERN.test(values.email.trim())) {
      nextErrors.email = 'Please enter a valid email address (e.g., you@example.com).';
    }
    if (!values.subject.trim()) {
      nextErrors.subject = 'Please add a short subject.';
    }
    if (!values.message.trim()) {
      nextErrors.message = 'Please write a message before sending.';
    }
    return nextErrors;
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
    if (formErrorBanner) setFormErrorBanner('');
  };

  const focusFirstError = (nextErrors) => {
    if (nextErrors.name) nameRef.current?.focus();
    else if (nextErrors.email) emailRef.current?.focus();
    else if (nextErrors.subject) subjectRef.current?.focus();
    else if (nextErrors.message) messageRef.current?.focus();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate(form);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setFormErrorBanner('Please check the highlighted fields below before sending.');
      focusFirstError(nextErrors);
      return;
    }

    setErrors({});
    setFormErrorBanner('');
    setIsSubmitting(true);

    // Simulated local submission delay (no backend call)
    submitTimerRef.current = window.setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedData({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
      });
      setForm(INITIAL_FORM);
    }, 650);
  };

  const handleReset = () => {
    setSubmittedData(null);
    setErrors({});
    setFormErrorBanner('');
  };

  return (
    <main className="contact-page">
      <section className="container section-pad">
        <motion.div
          className="contact-header"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="contact-eyebrow-row">
            <span className="section-eyebrow contact-eyebrow">
              <Sparkles size={14} aria-hidden="true" />
              <span>Contact MoodBrew</span>
            </span>
            <span className="contact-hand font-hand">always happy to chat</span>
          </div>

          <h1 className="contact-title font-editorial">
            Let&apos;s have a little chat.
          </h1>
          <p className="contact-subtitle">
            Questions, ideas, collaborations or just want to say hi? We&apos;re listening.
          </p>
        </motion.div>

        <div className="contact-grid">
          {/* Contact Form Card */}
          <motion.div
            className="contact-form-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.06 }}
          >
            {submittedData ? (
              <motion.div
                className="contact-success-box"
                role="status"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <span className="contact-success-icon" aria-hidden="true">
                  <CheckCircle2 size={30} />
                </span>
                <span className="contact-success-hand font-hand">
                  thanks for reaching out!
                </span>
                <h2 className="font-editorial">Message logged in demo mode</h2>
                <p>
                  Thanks, <strong>{submittedData.name}</strong>! Your note regarding{' '}
                  <strong>&ldquo;{submittedData.subject}&rdquo;</strong> was validated and
                  simulated locally in your browser (no email was actually transmitted to a
                  server).
                </p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleReset}
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit} noValidate>
                <div className="contact-topics">
                  <span className="contact-topics-label">Quick subject ideas:</span>
                  <div className="contact-topics-list">
                    {QUICK_TOPICS.map((topic) => (
                      <button
                        key={topic}
                        type="button"
                        className={`topic-chip ${
                          form.subject === topic ? 'topic-chip--active' : ''
                        }`}
                        onClick={() => {
                          setForm((prev) => ({ ...prev, subject: topic }));
                          if (errors.subject) {
                            setErrors((prev) => {
                              const copy = { ...prev };
                              delete copy.subject;
                              return copy;
                            });
                          }
                        }}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>

                {formErrorBanner && (
                  <div className="contact-error-banner" role="alert">
                    <AlertCircle size={17} aria-hidden="true" />
                    <span>{formErrorBanner}</span>
                  </div>
                )}

                <div className="contact-form-row">
                  <div className="form-field">
                    <label htmlFor="contact-name">
                      Name <span aria-hidden="true">*</span>
                    </label>
                    <input
                      ref={nameRef}
                      id="contact-name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange('name')}
                      placeholder="Your name"
                      aria-required="true"
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? 'contact-name-error' : undefined}
                      className={errors.name ? 'input-invalid' : ''}
                    />
                    {errors.name && (
                      <span id="contact-name-error" className="field-error">
                        {errors.name}
                      </span>
                    )}
                  </div>

                  <div className="form-field">
                    <label htmlFor="contact-email">
                      Email <span aria-hidden="true">*</span>
                    </label>
                    <input
                      ref={emailRef}
                      id="contact-email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange('email')}
                      placeholder="you@example.com"
                      aria-required="true"
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'contact-email-error' : undefined}
                      className={errors.email ? 'input-invalid' : ''}
                    />
                    {errors.email && (
                      <span id="contact-email-error" className="field-error">
                        {errors.email}
                      </span>
                    )}
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="contact-subject">
                    Subject <span aria-hidden="true">*</span>
                  </label>
                  <input
                    ref={subjectRef}
                    id="contact-subject"
                    name="subject"
                    type="text"
                    value={form.subject}
                    onChange={handleChange('subject')}
                    placeholder="What's on your mind?"
                    aria-required="true"
                    aria-invalid={Boolean(errors.subject)}
                    aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
                    className={errors.subject ? 'input-invalid' : ''}
                  />
                  {errors.subject && (
                    <span id="contact-subject-error" className="field-error">
                      {errors.subject}
                    </span>
                  )}
                </div>

                <div className="form-field">
                  <label htmlFor="contact-message">
                    Message <span aria-hidden="true">*</span>
                  </label>
                  <textarea
                    ref={messageRef}
                    id="contact-message"
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={handleChange('message')}
                    placeholder="Tell us about a mood flavour you'd love to sip..."
                    aria-required="true"
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? 'contact-message-error' : undefined}
                    className={errors.message ? 'input-invalid' : ''}
                  />
                  {errors.message && (
                    <span id="contact-message-error" className="field-error">
                      {errors.message}
                    </span>
                  )}
                </div>

                <div className="contact-submit-row">
                  <button
                    type="submit"
                    className="btn btn-primary contact-submit-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={17} className="spin-icon" aria-hidden="true" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} aria-hidden="true" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                  <span className="contact-demo-hint">
                    Prototype form · Simulated locally
                  </span>
                </div>
              </form>
            )}
          </motion.div>

          {/* Contact Information & Social Links */}
          <motion.aside
            className="contact-info-column"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
          >
            <div className="contact-info-card">
              <div className="contact-info-badge">
                <Info size={14} aria-hidden="true" />
                <span>Creator & Demo Contact Info</span>
              </div>

              <h2 className="font-editorial contact-info-title">
                Reach the creator
              </h2>
              <p className="contact-info-desc">
                MoodBrew is a student-crafted portfolio showcase. Connect directly using
                the contact details below.
              </p>

              <ul className="contact-details-list">
                <li>
                  <span className="contact-detail-icon icon--peach" aria-hidden="true">
                    <User size={17} />
                  </span>
                  <div>
                    <span className="detail-label">Contact Person</span>
                    <strong>Madhura Zambare</strong>
                  </div>
                </li>
                <li>
                  <span className="contact-detail-icon icon--mint" aria-hidden="true">
                    <Phone size={17} />
                  </span>
                  <div>
                    <span className="detail-label">Phone (Demo Placeholder)</span>
                    <strong>+91 00000 00000 (Demo)</strong>
                  </div>
                </li>
                <li>
                  <span className="contact-detail-icon icon--butter" aria-hidden="true">
                    <Mail size={17} />
                  </span>
                  <div>
                    <span className="detail-label">Email (Demo Placeholder)</span>
                    <strong>hello@moodbrew.demo</strong>
                  </div>
                </li>
                <li>
                  <span className="contact-detail-icon icon--lilac" aria-hidden="true">
                    <MapPin size={17} />
                  </span>
                  <div>
                    <span className="detail-label">Studio Concept Base</span>
                    <strong>Mumbai, India (Demo Info)</strong>
                  </div>
                </li>
              </ul>
            </div>

            <div className="contact-social-card">
              <h2 className="font-editorial">Socials (Demo)</h2>
              <p className="contact-social-desc">
                Conceptual brand channels for this student design prototype.
              </p>
              <div className="contact-social-list">
                {SOCIAL_LINKS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.name} className="social-pill-card">
                      <span
                        className="social-pill-icon"
                        style={{ backgroundColor: item.bg }}
                        aria-hidden="true"
                      >
                        <Icon size={17} />
                      </span>
                      <div>
                        <strong>{item.name}</strong>
                        <span>{item.handle}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.aside>
        </div>
      </section>
    </main>
  );
}
