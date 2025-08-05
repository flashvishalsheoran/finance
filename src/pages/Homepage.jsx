import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../data/staticData';

const Homepage = () => {
  const exampleInvestment = 10000;
  const exampleReturn = exampleInvestment * 0.01;
  const exampleTotal = exampleInvestment + exampleReturn;

  return (
    <div>
      {/* Hero Section */}
      <section className="full-screen-section hero-section" style={{
        backgroundImage: 'url(https://picsum.photos/1920/1080?random=1)',
      }}>
        <div className="dynamic-hero-content container text-center">
          <h1 className="mb-3 fade-in">
            Welcome to <span style={{ color: 'var(--accent-primary)' }}>PrimeYield Capital</span>
          </h1>
          <p className="hero-subtitle" style={{ fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto 2rem' }}>
            Your Trusted Partner in High-Yield Investments for Over 20 Years
            <br />
            At PrimeYield Capital, we specialize in delivering consistent, high-yield returns through secure crypto-based investments. Based in the USA and serving investors worldwide since 2005, we offer a fully automated system that pays profits every hour, every day.
          </p>
          <Link to="/login?role=client" className="btn btn-primary btn-lg" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
            Start Your Investment Now
          </Link>
          <div className="app-download-section mt-4">
            <p className="text-muted">Invest with confidence:</p>
            <div className="flex justify-center gap-3 mt-2">
              {/* Placeholder for crypto icons, will be added later if needed */}
              <span className="app-badge-link" style={{ fontSize: '1rem', gap: '0.25rem' }}>
                <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=026" alt="Bitcoin" className="app-badge" /> BTC
              </span>
              <span className="app-badge-link" style={{ fontSize: '1rem', gap: '0.25rem' }}>
                <img src="https://cryptologos.cc/logos/tether-usdt-logo.svg?v=026" alt="USDT" className="app-badge" /> USDT (TRC20)
              </span>
              <span className="app-badge-link" style={{ fontSize: '1rem', gap: '0.25rem' }}>
                <img src="https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=026" alt="Ethereum" className="app-badge" /> ETH
              </span>
              <span className="app-badge-link" style={{ fontSize: '1rem', gap: '0.25rem' }}>
                <img src="https://cryptologos.cc/logos/xrp-xrp-logo.svg?v=026" alt="XRP" className="app-badge" /> XRP
              </span>
            </div>
            <p className="text-muted mt-2">Trusted by investors globally for secure crypto investments.</p>
          </div>
        </div>
      </section>

      {/* New Fullscreen Section 1: Innovation */}
      <section className="full-screen-section" style={{ backgroundImage: 'url(https://picsum.photos/1920/1080?random=2)' }}>
        <div className="dynamic-hero-content container text-center">
          <h2 className="fade-in mb-3" style={{ fontSize: '3rem', fontWeight: '700', color: 'var(--primary-text)' }}>
            Innovation at <span style={{ color: 'var(--accent-primary)' }}>Its Core</span>
          </h2>
          <p className="fade-in" style={{ fontSize: '1.5rem', maxWidth: '700px', margin: '0 auto 2rem', color: 'var(--secondary-text)' }}>
            We leverage cutting-edge technology to ensure secure, efficient, and reliable investment opportunities.
          </p>
          <Link to="/login?role=client" className="btn btn-primary btn-lg fade-in" style={{ fontSize: '1.2rem', padding: '1rem 2.5rem' }}>
            Discover Our Tech
          </Link>
        </div>
      </section>

      {/* Why Choose PrimeYield? */}
      <section className="section" style={{ background: 'var(--secondary-bg)' }}>
        <div className="container">
          <h2 className="text-center mb-4">Why Choose PrimeYield?</h2>
          <div className="card-grid">
            <div className="card">
              <h3>✅ Hourly Payouts</h3>
              <p>Enjoy automated profit distributions every hour, starting just 1 hour after your deposit.</p>
            </div>
            <div className="card">
              <h3>✅ 20+ Years of Experience</h3>
              <p>A reliable and time-tested platform with a two-decade track record in the investment space.</p>
            </div>
            <div className="card">
              <h3>✅ Crypto-Only Deposits</h3>
              <p>We accept only trusted digital assets — BTC, USDT (TRC20), ETH, XRP — for fast and borderless investing.</p>
            </div>
            <div className="card">
              <h3>✅ Global Access, 24/7</h3>
              <p>Join from anywhere, anytime. Our platform is designed for global investors seeking steady passive income.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section">
        <div className="container">
          <h2 className="text-center mb-4">How It Works</h2>
          <div className="card-grid">
            <div className="card text-center">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💰</div>
              <h3>Deposit Crypto</h3>
              <p>Fund your account with BTC, USDT, ETH, or XRP. Quick and secure deposits.</p>
            </div>
            <div className="card text-center">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏱️</div>
              <h3>Automated Hourly Profits</h3>
              <p>Your investment automatically starts earning profits every hour.</p>
            </div>
            <div className="card text-center">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}> withdrawals</div>
              <h3>Instant Withdrawals</h3>
              <p>Withdraw your principal and profits anytime, directly to your crypto wallet.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section">
        <div className="container">
          <h2 className="text-center mb-4">Frequently Asked Questions</h2>
          <div className="faq-item">
            <input type="checkbox" id="faq1" className="faq-toggle" />
            <label htmlFor="faq1" className="faq-title">What are bonds?</label>
            <div className="faq-content">
              <p>Bonds are debt instruments issued by corporations or governments to raise capital. When you buy a bond, you're essentially lending money to the issuer, who promises to pay you back the principal amount plus interest over a specified period.</p>
            </div>
          </div>
          <div className="faq-item">
            <input type="checkbox" id="faq2" className="faq-toggle" />
            <label htmlFor="faq2" className="faq-title">How does the debt market work exactly?</label>
            <div className="faq-content">
              <p>The debt market is where companies and governments borrow money by issuing debt instruments like bonds. Investors purchase these bonds, providing capital to the issuers. In return, investors receive regular interest payments and the repayment of their principal at maturity.</p>
            </div>
          </div>
          <div className="faq-item">
            <input type="checkbox" id="faq3" className="faq-toggle" />
            <label htmlFor="faq3" className="faq-title">What is the minimum amount required to invest?</label>
            <div className="faq-content">
              <p>On our platform, you can start investing in bonds with as little as ₹1,000.</p>
            </div>
          </div>
          <div className="faq-item">
            <input type="checkbox" id="faq4" className="faq-toggle" />
            <label htmlFor="faq4" className="faq-title">Why should I invest in bonds?</label>
            <div className="faq-content">
              <p>Bonds can add stability to your portfolio by providing fixed, predictable returns, diversifying risk, and offering a steady income stream, especially when compared to more volatile assets like equities.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action / Contact Section */}
      <section className="section contact-banner" style={{ background: 'var(--accent-bg)' }}>
        <div className="container text-center">
          <h2 className="mb-3">Want to learn more? Connect with us now!</h2>
          <p className="mb-4">Our support team will help you within 2 hours. (Simulated)</p>
          <div className="flex justify-center gap-3">
            <a href="#" className="btn btn-primary">WhatsApp Us</a>
            <a href="#" className="btn btn-secondary">Email us</a>
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="section">
        <div className="container">
          <div className="card" style={{ background: 'var(--accent-bg)', border: '1px solid var(--warning)' }}>
            <h3>⚠️ Important Disclaimer</h3>
            <p>
              This is a <strong>demo platform</strong> for product validation purposes. 
              All investment schemes, transactions, and returns shown are <strong>simulated</strong> and for demonstration only. 
              No real money is processed, and no actual investments are made. 
              This platform showcases the user experience and functionality of a crypto-based investment system.
            </p>
            <p style={{ marginBottom: 0 }}>
              <strong>For demo purposes only.</strong> Do not use real financial information.
            </p>
          </div>
        </div>
      </section>

      {/* New Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-logo">
              <span className="logo">PrimeYield Capital</span>
            </div>
            <div className="footer-links">
              <div>
                <h4>Products</h4>
                <ul>
                  <li><a href="#">Crypto Investments (Simulated)</a></li>
                </ul>
              </div>
              <div>
                <h4>About</h4>
                <ul>
                  <li><a href="#">Our Story (Simulated)</a></li>
                  <li><a href="#">Contact Us (Simulated)</a></li>
                  <li><a href="#">Blogs (Simulated)</a></li>
                </ul>
              </div>
              <div>
                <h4>Important Links</h4>
                <ul>
                  <li><Link to="/terms-and-conditions">Terms and Conditions</Link></li>
                  <li><a href="#">Privacy Policy (Simulated)</a></li>
                  <li><a href="#">Risk Disclosures (Simulated)</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="copyright-text">© 2005 - 2024 PrimeYield Capital. All rights reserved. (Simulated)</p>
            <p className="disclaimer-text">
              <small>
                Disclaimer: This is a simulated demonstration platform for educational and testing purposes only. No real financial transactions occur. Investments in crypto assets are subject to market risks, including the loss of principal. Past performance is not indicative of future results. (Simulated)
              </small>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;