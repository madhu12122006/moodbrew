import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Sparkles, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import './FooterSection.css';

const NEWSLETTER_KEY = 'moodbrew_newsletter_emails_v1';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function loadSubscribedEmails() {
  try {
    const raw = window.localStorage.getItem(NEWSLETTER_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((entry) => typeof entry === 'string')
      .map((entry) => entry.trim().toLowerCase())
      .filter(Boolean);
  } catch {
    return [];
  }
}

export default function FooterSection() {
  const [email, setEmail] = useState('');
  const [subscribedEmails, setSubscribedEmails] = useState(loadSubscribedEmails);
  const [feedback, setFeedback] = useState({ type: 'idle', message: '' });

  useEffect(() => {
    try {
      window.localStorage.setItem(
        NEWSLETTER_KEY,
        JSON.stringify(subscribedEmails)
      );
    } catch {
      // Ignore storage quota / privacy mode errors
    }
  }, [subscribedEmails]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const normalized = email.trim().toLowerCase();

    if (!normalized) {
      setFeedback({
        type: 'error',
        message: 'Please enter your email address.',
      });
      return;
    }

    if (!EMAIL_PATTERN.test(normalized)) {
      setFeedback({
        type: 'error',
        message: 'Please enter a valid email address (e.g., name@example.com).',
      });
      return;
    }

    if (subscribedEmails.includes(normalized)) {
      setFeedback({
        type: 'duplicate',
        message:
          'You are already subscribed with this email! Good vibes are already saved.',
      });
      return;
    }

    setSubscribedEmails((prev) => [...prev, normalized]);
    setFeedback({
      type: 'subscribed',
      message:
        'Subscribed! (Demo confirmation saved locally—no real emails are sent.)',
    });
    setEmail('');
  };

  return (
    <footer className="site-footer">
      <div className="container">
        <motion.div
          className="newsletter-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55 }}
        >
          <div className="newsletter-copy">
            <span className="section-eyebrow">
              <Mail size={14} aria-hidden="true" />
              <span>MoodList Newsletter</span>
            </span>
            <h2 className="newsletter-title font-editorial">
              A little mood boost in your inbox.
            </h2>
            <p className="newsletter-desc">
              New sips, fresh drops and good vibes. No boring emails.
            </p>
          </div>

          <form className="newsletter-form" onSubmit={handleSubmit} noValidate>
            <div className="newsletter-input-row">
              <label htmlFor="moodlist-email" className="sr-only">
                Email address for MoodBrew newsletter
              </label>
              <input
                id="moodlist-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (feedback.type !== 'idle') {
                    setFeedback({ type: 'idle', message: '' });
                  }
                }}
                placeholder="you@example.com"
                aria-invalid={feedback.type === 'error'}
                className="newsletter-input"
              />
              <button type="submit" className="btn btn-primary newsletter-btn">
                <span>Subscribe</span>
                <ArrowRight size={16} />
              </button>
            </div>

            {feedback.type !== 'idle' && (
              <p
                role="status"
                className={`newsletter-feedback newsletter-feedback--${feedback.type}`}
              >
                {feedback.type === 'subscribed' ? (
                  <CheckCircle2 size={15} aria-hidden="true" />
                ) : (
                  <AlertCircle size={15} aria-hidden="true" />
                )}
                <span>{feedback.message}</span>
              </p>
            )}
          </form>
        </motion.div>

        <div className="footer-bottom-grid">
          <div className="footer-brand">
            <div className="footer-logo-row">
              <span className="footer-logo-mark" aria-hidden="true">
                <Sparkles size={15} />
              </span>
              <span className="font-editorial footer-logo-text">MoodBrew</span>
            </div>
            <p className="footer-tagline">Sip Your Mood.</p>
            <p className="footer-note">
              An Indian Gen-Z mood-based personalised beverage discovery concept.
              MoodBrew × 7-Eleven is an independent student concept project, not
              affiliated with or endorsed by 7-Eleven.
            </p>
          </div>

          <div className="footer-col">
            <h3>Explore</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/discover">Discover</Link></li>
              <li><Link to="/menu">Menu</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/collaboration">Collaboration</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>Signature Pours</h3>
            <ul>
              <li><Link to="/menu">Tropical Sunshine</Link></li>
              <li><Link to="/menu">Lavender Fizz</Link></li>
              <li><Link to="/menu">Citrus Mint Cooler</Link></li>
              <li><Link to="/menu">Strawberry Rose</Link></li>
              <li><Link to="/menu">Mocha Boost</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>Portfolio Demo</h3>
            <ul>
              <li>Madhura Zambare</li>
              <li>+91 00000 00000 (Demo)</li>
              <li>hello@moodbrew.demo (Demo)</li>
              <li><Link to="/contact">Send a message</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-legal">
          <span>© 2026 MoodBrew Portfolio Concept. Crafted in India.</span>
          <span>All prices shown in INR (₹).</span>
        </div>
      </div>
    </footer>
  );
}
