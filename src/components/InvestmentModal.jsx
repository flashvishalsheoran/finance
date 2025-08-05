import React, { useState } from 'react';
import { formatCurrency, calculateReturn, calculateTotal } from '../data/staticData';

const InvestmentModal = ({ scheme, onClose, onConfirm, isOpen }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !scheme) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const investmentAmount = parseInt(amount);

    if (investmentAmount < scheme.minAmount || investmentAmount > scheme.maxAmount) {
      alert(`Investment amount must be between ${formatCurrency(scheme.minAmount)} and ${formatCurrency(scheme.maxAmount)}.`);
      setLoading(false);
      return;
    }

    // Simulate processing delay
    setTimeout(() => {
      onConfirm(investmentAmount);
      setAmount('');
      setLoading(false);
      onClose();
    }, 1000);
  };

  const investmentAmount = parseInt(amount || 0);
  const returnAmount = calculateReturn(investmentAmount, scheme.returnRate);
  const totalAmount = calculateTotal(investmentAmount, scheme.returnRate);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ margin: 0 }}>🚀 Invest in {scheme.name}</h3>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="scheme-card" style={{ margin: '0 0 1.5rem 0', background: 'var(--accent-bg)' }}>
          <div className="scheme-badge">LIVE</div>
          <h4 style={{ marginBottom: '0.5rem' }}>{scheme.name}</h4>
          <p style={{ color: 'var(--secondary-text)', marginBottom: '1rem' }}>
            {scheme.description}
          </p>
          
          <div className="scheme-stats">
            <div className="scheme-stat">
              <div className="scheme-stat-value">{scheme.returnRate}</div>
              <div className="scheme-stat-label">Return Rate</div>
            </div>
            <div className="scheme-stat">
              <div className="scheme-stat-value">{Math.floor(scheme.duration / 60)}h</div>
              <div className="scheme-stat-label">Duration</div>
            </div>
            <div className="scheme-stat">
              <div className="scheme-stat-value">{formatCurrency(scheme.minAmount)}</div>
              <div className="scheme-stat-label">Min Amount</div>
            </div>
            <div className="scheme-stat">
              <div className="scheme-stat-value">{formatCurrency(scheme.maxAmount)}</div>
              <div className="scheme-stat-label">Max Amount</div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Investment Amount (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="form-input"
              placeholder={`Min: ${formatCurrency(scheme.minAmount)}, Max: ${formatCurrency(scheme.maxAmount)}`}
              min={scheme.minAmount}
              max={scheme.maxAmount}
              required
              style={{ fontSize: '1.1rem', padding: '1rem' }}
            />
          </div>

          {amount && investmentAmount >= scheme.minAmount && (
            <div className="investment-progress fade-in">
              <h4 style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>
                💰 Investment Breakdown
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                    {formatCurrency(investmentAmount)}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--secondary-text)' }}>
                    Principal
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--success)' }}>
                    +{formatCurrency(returnAmount)}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--secondary-text)' }}>
                    Return ({scheme.returnRate})
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--accent-primary)' }}>
                    {formatCurrency(totalAmount)}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--secondary-text)' }}>
                    Total Payout
                  </div>
                </div>
              </div>
              
              <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--card-bg)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <small style={{ color: 'var(--muted-text)' }}>
                  ⏱️ Timer starts immediately after confirmation
                </small>
              </div>
            </div>
          )}

          <div className="flex gap-2 mt-3">
            <button 
              type="button" 
              onClick={onClose}
              className="btn btn-secondary flex-1"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary flex-1"
              disabled={loading || !amount || investmentAmount < scheme.minAmount}
            >
              {loading ? (
                <>
                  <span className="loading"></span>
                  Processing...
                </>
              ) : (
                <>
                  🚀 Start Investment
                </>
              )}
            </button>
          </div>
        </form>

        <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--secondary-bg)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', color: 'var(--muted-text)' }}>
          ℹ️ <strong>Note:</strong> You can invest in multiple schemes simultaneously, but only one investment per scheme is allowed.
        </div>
      </div>
    </div>
  );
};

export default InvestmentModal;