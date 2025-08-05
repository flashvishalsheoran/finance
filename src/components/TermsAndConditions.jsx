import React, { useState } from 'react';

const TermsAndConditions = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="card">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ cursor: 'pointer' }}
      >
        <h3 className="mb-0">📋 Terms & Conditions</h3>
        <button className="btn-secondary" style={{ padding: '0.5rem', minHeight: 'auto' }}>
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      {isExpanded && (
        <div className="fade-in" style={{ marginTop: '1rem' }}>
          <div style={{ fontSize: '0.875rem', lineHeight: '1.6', color: 'var(--secondary-text)' }}>
            
            <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.75rem' }}>Investment Terms</h4>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
              <li>All investments are processed instantly upon confirmation</li>
              <li>Returns are calculated at the exact percentage stated for each scheme</li>
              <li>Timer starts immediately after investment confirmation</li>
              <li>Withdrawals are only available after the timer completes</li>
              <li>Users can invest in multiple schemes simultaneously</li>
              <li>Duplicate investments in the same scheme are not permitted</li>
            </ul>

            <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.75rem' }}>Risk Disclosure</h4>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
              <li>This is a <strong>demonstration platform</strong> for UI/UX testing only</li>
              <li>No real money transactions are processed</li>
              <li>All investment amounts and returns are simulated</li>
              <li>Platform is for educational and demo purposes exclusively</li>
            </ul>

            <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.75rem' }}>User Responsibilities</h4>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
              <li>Ensure you understand each scheme before investing</li>
              <li>Monitor your active investments regularly</li>
              <li>Withdraw returns promptly when eligible</li>
              <li>Do not share your login credentials</li>
            </ul>

            <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.75rem' }}>Platform Policies</h4>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
              <li>All data is stored locally in your browser</li>
              <li>No personal financial information is collected</li>
              <li>Platform operates 24/7 with real-time timer updates</li>
              <li>Technical support available for demo-related issues</li>
            </ul>

            <div style={{ 
              background: 'var(--warning)', 
              color: 'var(--primary-bg)', 
              padding: '0.75rem', 
              borderRadius: 'var(--radius-md)', 
              marginTop: '1rem',
              fontWeight: '500'
            }}>
              ⚠️ <strong>Important:</strong> This is a demo investment platform. No real funds are involved. 
              All transactions, returns, and investments are simulated for demonstration purposes only.
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default TermsAndConditions;