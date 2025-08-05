import React, { useState } from 'react';
import { schemes, formatCurrency, formatTime, calculateReturn, calculateTotal } from '../data/staticData';

const InvestmentCalculator = () => {
  const [selectedScheme, setSelectedScheme] = useState(schemes[0]?.id || '');
  const [amount, setAmount] = useState('10000');

  const scheme = schemes.find(s => s.id === parseInt(selectedScheme));
  const investmentAmount = parseInt(amount) || 0;
  const returnAmount = scheme ? calculateReturn(investmentAmount, scheme.returnRate) : 0;
  const totalAmount = scheme ? calculateTotal(investmentAmount, scheme.returnRate) : 0;

  return (
    <div className="card">
      <h3 className="mb-3">🧮 Investment Calculator</h3>
      <p style={{ color: 'var(--secondary-text)', marginBottom: '1.5rem' }}>
        Calculate potential returns before investing
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="form-group mb-0">
          <label className="form-label">Select Scheme</label>
          <select
            value={selectedScheme}
            onChange={(e) => setSelectedScheme(e.target.value)}
            className="form-select"
          >
            {schemes.filter(s => s.isLive).map(scheme => (
              <option key={scheme.id} value={scheme.id}>
                {scheme.name} - {scheme.returnRate}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group mb-0">
          <label className="form-label">Investment Amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="form-input"
            placeholder="Enter amount"
            min={scheme?.minAmount || 1000}
            max={scheme?.maxAmount || 100000}
          />
        </div>
      </div>

      {scheme && investmentAmount >= (scheme.minAmount || 0) && (
        <div className="investment-progress">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--secondary-text)', marginBottom: '0.5rem' }}>
                Principal
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--primary-text)' }}>
                {formatCurrency(investmentAmount)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--secondary-text)', marginBottom: '0.5rem' }}>
                Return ({scheme.returnRate})
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--success)' }}>
                +{formatCurrency(returnAmount)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--secondary-text)', marginBottom: '0.5rem' }}>
                Total Payout
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--accent-primary)' }}>
                {formatCurrency(totalAmount)}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--secondary-bg)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <small style={{ color: 'var(--muted-text)' }}>
              ⏱️ Duration: {formatTime(scheme.duration)} • 
              Range: {formatCurrency(scheme.minAmount)} - {formatCurrency(scheme.maxAmount)}
            </small>
          </div>
        </div>
      )}

      {scheme && investmentAmount > 0 && (investmentAmount < scheme.minAmount || investmentAmount > scheme.maxAmount) && (
        <div style={{ padding: '0.75rem', background: 'var(--error)', color: 'var(--primary-text)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
          ⚠️ Amount must be between {formatCurrency(scheme.minAmount)} and {formatCurrency(scheme.maxAmount)}
        </div>
      )}
    </div>
  );
};

export default InvestmentCalculator;