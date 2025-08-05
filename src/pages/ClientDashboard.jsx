import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { schemes, formatCurrency, formatTime, calculateReturn, calculateTotal } from '../data/staticData';
import InvestmentModal from '../components/InvestmentModal';
import InvestmentCalculator from '../components/InvestmentCalculator';
import AchievementBadges from '../components/AchievementBadges';
import TermsAndConditions from '../components/TermsAndConditions';

const ClientDashboard = () => {
  const { user } = useAuth();
  const [activeInvestments, setActiveInvestments] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load active investments from localStorage on component mount
  useEffect(() => {
    const savedInvestments = localStorage.getItem(`activeInvestments_${user.id}`);
    if (savedInvestments) {
      try {
        const parsed = JSON.parse(savedInvestments);
        setActiveInvestments(parsed);
        console.log('ClientDashboard: Loaded activeInvestments from localStorage:', parsed);
      } catch (error) {
        console.error('Error loading investments:', error);
        setActiveInvestments([]);
      }
    }
  }, [user.id]);

  // Save investments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(`activeInvestments_${user.id}`, JSON.stringify(activeInvestments));
    console.log('ClientDashboard: Saved activeInvestments to localStorage:', activeInvestments);
  }, [activeInvestments, user.id]);

  // Timer effect for all active investments
  useEffect(() => {
    if (activeInvestments.length === 0) return;

    const timer = setInterval(() => {
      setActiveInvestments(prevInvestments => 
        prevInvestments.map(investment => {
          if (investment.status === 'withdrawn') return investment;

          const now = new Date().getTime();
          const startTime = new Date(investment.startTime).getTime();
          const endTime = startTime + (investment.duration * 60 * 1000);
          const remaining = endTime - now;

          if (remaining <= 0) {
            return {
              ...investment,
              timeRemaining: 0,
              canWithdraw: true,
              status: 'ready_to_withdraw'
            };
          } else {
            return {
              ...investment,
              timeRemaining: remaining,
              canWithdraw: false,
              status: 'active'
            };
          }
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [activeInvestments.length]);

  const formatTimeRemaining = (ms) => {
    if (ms <= 0) return "00:00:00";
    
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = (timeRemaining, duration) => {
    if (timeRemaining <= 0) return 100;
    const totalTime = duration * 60 * 1000;
    const elapsed = totalTime - timeRemaining;
    return Math.max(0, Math.min(100, (elapsed / totalTime) * 100));
  };

  const getWaterLevel = (timeRemaining, duration) => {
    if (timeRemaining <= 0) return 0;
    const totalTime = duration * 60 * 1000;
    return Math.max(0, Math.min(100, (timeRemaining / totalTime) * 100));
  };

  const handleApplyForScheme = (scheme) => {
    // Check if user already has this scheme
    const hasScheme = activeInvestments.some(inv => inv.schemeId === scheme.id && inv.status !== 'withdrawn');
    if (hasScheme) {
      alert(`You already have an active investment in "${scheme.name}". Wait for it to complete or withdraw first.`);
      return;
    }

    setSelectedScheme(scheme);
    setIsModalOpen(true);
  };

  const handleConfirmInvestment = (amount) => {
    if (!selectedScheme) return;

    const newInvestment = {
      id: Date.now(),
      schemeId: selectedScheme.id,
      schemeName: selectedScheme.name,
      amount: amount,
      returnRate: selectedScheme.returnRate,
      duration: selectedScheme.duration,
      startTime: new Date().toISOString(),
      appliedAt: new Date().toISOString(),
      status: 'active',
      timeRemaining: selectedScheme.duration * 60 * 1000,
      canWithdraw: false,
      expectedReturn: calculateReturn(amount, selectedScheme.returnRate),
      expectedTotal: calculateTotal(amount, selectedScheme.returnRate)
    };

    setActiveInvestments(prev => [...prev, newInvestment]);

    // Add to scheme's clients (simulation)
    const scheme = schemes.find(s => s.id === selectedScheme.id);
    if (scheme) {
      const newClient = {
        id: Date.now(),
        name: user.name,
        amount: amount,
        status: 'active',
        appliedAt: new Date().toISOString()
      };
      scheme.clients.push(newClient);
    }

    alert(`Successfully started investment in ${selectedScheme.name}! Timer has begun.`);
  };

  const handleWithdraw = (investmentId) => {
    setActiveInvestments(prev => 
      prev.map(inv => {
        if (inv.id === investmentId && inv.canWithdraw) {
          const returnAmount = calculateReturn(inv.amount, inv.returnRate);
          const totalAmount = calculateTotal(inv.amount, inv.returnRate);
          
          alert(`Withdrawal successful! You received ${formatCurrency(totalAmount)} (Original: ${formatCurrency(inv.amount)} + Return: ${formatCurrency(returnAmount)})`);
          
          return {
            ...inv,
            status: 'withdrawn',
            withdrawnAt: new Date().toISOString(),
            withdrawnAmount: totalAmount,
            actualReturn: returnAmount,
            completedAt: new Date().toISOString(),
            walletAddress: user.walletAddress // Add client's wallet address
          };
        }
        return inv;
      })
    );
  };

  const liveSchemes = schemes.filter(s => s.isLive);
  const activeCount = activeInvestments.filter(inv => inv.status === 'active' || inv.status === 'ready_to_withdraw').length;
  const totalInvested = activeInvestments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalReturns = activeInvestments
    .filter(inv => inv.status === 'withdrawn')
    .reduce((sum, inv) => sum + calculateReturn(inv.amount, inv.returnRate), 0);

  console.log('ClientDashboard: activeInvestments before render:', activeInvestments);
  console.log('ClientDashboard: Condition for history table visibility (activeInvestments.some(inv => inv.status === \'withdrawn\')):', activeInvestments.some(inv => inv.status === 'withdrawn'));

  return (
    <div className="section">
      <div className="container">
        <h1 className="mb-4 fade-in">Welcome back, {user.name}! 🎯</h1>

        {/* Dashboard Stats */}
        <div className="card-grid mb-4">
          <div className="card text-center slide-in">
            <h3 style={{ color: 'var(--accent-primary)' }}>{activeCount}</h3>
            <p>Active Investments</p>
          </div>
          <div className="card text-center slide-in">
            <h3 style={{ color: 'var(--success)' }}>{formatCurrency(totalInvested)}</h3>
            <p>Total Invested</p>
          </div>
          <div className="card text-center slide-in">
            <h3 style={{ color: 'var(--warning)' }}>{formatCurrency(totalReturns)}</h3>
            <p>Total Returns</p>
          </div>
          <div className="card text-center slide-in">
            <h3 style={{ color: 'var(--accent-secondary)' }}>{liveSchemes.length}</h3>
            <p>Available Schemes</p>
          </div>
        </div>

        {/* Live Investment Schemes - Prominently Displayed */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="mb-0">🔥 Live Investment Opportunities</h2>
            <div style={{ fontSize: '0.875rem', color: 'var(--success)' }}>
              ✨ {liveSchemes.length} schemes available
            </div>
          </div>
          <div className="card-grid">
            {liveSchemes.map(scheme => {
              const activeInvestment = activeInvestments.find(inv => 
                inv.schemeId === scheme.id && (inv.status === 'active' || inv.status === 'ready_to_withdraw')
              );
              const hasActiveInvestment = !!activeInvestment;
              
              let progressPercentage = 0;
              let waterLevel = 100;
              if (activeInvestment) {
                progressPercentage = getProgressPercentage(activeInvestment.timeRemaining, activeInvestment.duration);
                waterLevel = getWaterLevel(activeInvestment.timeRemaining, activeInvestment.duration);
              }
              
              return (
                <div 
                  key={scheme.id} 
                  className={`scheme-card fade-in ${hasActiveInvestment ? 'scheme-card-active' : ''}`}
                  style={{
                    '--fill-height': hasActiveInvestment ? `${waterLevel}%` : '0%'
                  }}
                >
                  {/* Water fill effect */}
                  {hasActiveInvestment && (
                    <div 
                      className="scheme-card-overlay"
                      style={{
                        background: `linear-gradient(to top, 
                          rgba(0, 255, 136, 0.2) 0%, 
                          rgba(0, 255, 136, 0.1) ${waterLevel}%, 
                          transparent ${waterLevel + 2}%
                        )`
                      }}
                    ></div>
                  )}

                  {/* Lock Symbol for Applied Schemes */}
                  {hasActiveInvestment && (
                    <div className="scheme-card-lock">
                      🔒
                    </div>
                  )}
                  
                  {/* Scheme Badge (LIVE/INVESTED) */}
                  <div className={`scheme-badge ${hasActiveInvestment ? 'scheme-badge-active' : 'scheme-badge-live'}`}>
                    {hasActiveInvestment ? (
                      'INVESTED'
                    ) : (
                      <>
                        LIVE <span className="blinking-dot"></span>
                      </>
                    )}
                  </div>

                  <div className="scheme-card-content">
                    <h3 style={{ marginBottom: '0.5rem' }}>{scheme.name}</h3>
                    <p style={{ color: 'var(--secondary-text)', marginBottom: '1rem' }}>
                      {scheme.description}
                    </p>
                    
                    <div className="scheme-stats">
                      <div className="scheme-stat">
                        <div className="scheme-stat-value">{scheme.returnRate}</div>
                        <div className="scheme-stat-label">Return Rate</div>
                      </div>
                      <div className="scheme-stat">
                        <div className="scheme-stat-value">{formatTime(scheme.duration)}</div>
                        <div className="scheme-stat-label">Duration</div>
                      </div>
                      <div className="scheme-stat">
                        <div className="scheme-stat-value">{scheme.clients.length}</div>
                        <div className="scheme-stat-label">Investors</div>
                      </div>
                      <div className="scheme-stat">
                        <div className="scheme-stat-value">
                          {formatCurrency(scheme.minAmount)} - {formatCurrency(scheme.maxAmount)}
                        </div>
                        <div className="scheme-stat-label">Range</div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: 'auto' }}>
                      {!hasActiveInvestment && (
                        <div style={{ fontSize: '0.875rem', color: 'var(--muted-text)', marginBottom: '1rem' }}>
                          Example: ₹10,000 → <span style={{ color: 'var(--success)' }}>
                            {formatCurrency(calculateTotal(10000, scheme.returnRate))}
                          </span>
                        </div>
                      )}
                      
                      {hasActiveInvestment ? (
                        <button 
                          onClick={() => handleWithdraw(activeInvestment.id)}
                          disabled={!activeInvestment.canWithdraw}
                          className={`btn ${activeInvestment.canWithdraw ? 'btn-success' : 'btn-secondary'} w-full`}
                          style={{ opacity: activeInvestment.canWithdraw ? 1 : 0.6 }}
                        >
                          {activeInvestment.canWithdraw ? '💰 Withdraw Now' : '🔒 Locked - Timer Active'}
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleApplyForScheme(scheme)}
                          className="btn btn-primary w-full"
                        >
                          🚀 Apply Now
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Timer overlay for active investments */}
                  {hasActiveInvestment && (
                    <div className="scheme-card-timer">
                      <div className="scheme-card-timer-value">
                        {formatTimeRemaining(activeInvestment.timeRemaining)}
                      </div>
                      <div className="scheme-card-timer-label">
                        {activeInvestment.canWithdraw ? '🎉 Ready to Withdraw!' : '⏳ Time Draining'}
                      </div>
                      
                      {/* Prominent Returns Display */}
                      <div className="scheme-card-timer-returns">
                        <div className="timer-return-label">Expected Return</div>
                        <div className="timer-return-value">
                          +{formatCurrency(calculateReturn(activeInvestment.amount, activeInvestment.returnRate))}
                        </div>
                        <div className="timer-total-value">
                          Total: {formatCurrency(calculateTotal(activeInvestment.amount, activeInvestment.returnRate))}
                        </div>
                      </div>
                      
                      <div className="scheme-card-timer-progress">
                        {Math.round(progressPercentage)}% Complete • {Math.round(waterLevel)}% Time Left
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted-text)', marginTop: '0.5rem' }}>
                        Principal: {formatCurrency(activeInvestment.amount)}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>



        {/* Section Divider */}
        <div className="section-divider-with-icon">
          <div className="section-divider-icon">📈</div>
        </div>

        {/* Always Visible Investment History */}
        <div className="card mb-4">
          <h3 className="mb-3">📈 Complete Investment History</h3>
          
          {activeInvestments.some(inv => inv.status === 'withdrawn') ? (
            <>
              <div className="table-container" style={{ overflowX: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Scheme</th>
                      <th>Applied</th>
                      <th>Principal</th>
                      <th>Return Rate</th>
                      <th>Actual Return</th>
                      <th>Total Received</th>
                      <th>Withdrawal</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeInvestments
                      .filter(inv => inv.status === 'withdrawn')
                      .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
                      .map(investment => {
                        return (
                          <tr key={investment.id}>
                            <td>
                              <div style={{ fontWeight: '600' }}>{investment.schemeName}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--muted-text)' }}>
                                {formatTime(investment.duration)}
                              </div>
                            </td>
                            <td>
                              <div>{new Date(investment.appliedAt).toLocaleDateString()}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--muted-text)' }}>
                                {new Date(investment.appliedAt).toLocaleTimeString()}
                              </div>
                            </td>
                            <td>{formatCurrency(investment.amount)}</td>
                            <td>
                              <span className="status-badge status-active">
                                {investment.returnRate}
                              </span>
                            </td>
                            <td style={{ color: 'var(--success)' }}>
                              +{formatCurrency(investment.actualReturn || 0)}
                            </td>
                            <td style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>
                              {formatCurrency(investment.withdrawnAmount || 0)}
                            </td>
                            <td>
                              <div>{new Date(investment.withdrawnAt).toLocaleDateString()}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--muted-text)' }}>
                                {new Date(investment.withdrawnAt).toLocaleTimeString()}
                              </div>
                            </td>
                            <td>
                              <span className="status-badge status-withdrawn">
                                ✅ Completed
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
              
              {/* Summary Stats */}
              <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--secondary-bg)', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>📊 Historical Performance</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                  <div className="text-center">
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--success)' }}>
                      {activeInvestments.filter(inv => inv.status === 'withdrawn').length}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--secondary-text)' }}>
                      Completed Investments
                    </div>
                  </div>
                  <div className="text-center">
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--accent-primary)' }}>
                      {formatCurrency(activeInvestments
                        .filter(inv => inv.status === 'withdrawn')
                        .reduce((sum, inv) => sum + inv.amount, 0)
                      )}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--secondary-text)' }}>
                      Total Invested
                    </div>
                  </div>
                  <div className="text-center">
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--success)' }}>
                      {formatCurrency(totalReturns)}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--secondary-text)' }}>
                      Total Returns Earned
                    </div>
                  </div>
                  <div className="text-center">
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--warning)' }}>
                      {totalReturns > 0 ? ((totalReturns / activeInvestments
                        .filter(inv => inv.status === 'withdrawn')
                        .reduce((sum, inv) => sum + inv.amount, 0)) * 100).toFixed(1) : 0}%
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--secondary-text)' }}>
                      Average Return Rate
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Empty State for History */
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.3 }}>📊</div>
              <h4 style={{ color: 'var(--muted-text)', marginBottom: '0.5rem' }}>No Investment History Yet</h4>
              <p style={{ color: 'var(--secondary-text)', marginBottom: '1.5rem' }}>
                Your completed investments will appear here with detailed transaction history, timestamps, and performance analytics.
              </p>
              
              {/* Current Investments Preview */}
              {activeInvestments.length > 0 && (
                <div style={{ 
                  background: 'var(--secondary-bg)', 
                  padding: '1rem', 
                  borderRadius: 'var(--radius-md)', 
                  border: '1px solid var(--border-color)' 
                }}>
                  <h5 style={{ color: 'var(--accent-primary)', marginBottom: '0.75rem' }}>
                    🔄 Current Active Investments: {activeInvestments.filter(inv => inv.status !== 'withdrawn').length}
                  </h5>
                  <p style={{ fontSize: '0.875rem', color: 'var(--secondary-text)', margin: 0 }}>
                    Complete your active investments to see detailed history and performance analytics here.
                  </p>
                </div>
              )}
              
              {activeInvestments.length === 0 && (
                <div style={{ 
                  background: 'var(--accent-bg)', 
                  padding: '1rem', 
                  borderRadius: 'var(--radius-md)', 
                  border: '1px solid var(--accent-primary)' 
                }}>
                  <p style={{ fontSize: '0.875rem', color: 'var(--accent-primary)', margin: 0 }}>
                    🚀 Start your first investment above to begin building your history!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Section Divider */}
        <div className="section-divider-with-icon">
          <div className="section-divider-icon">🧮</div>
        </div>

        {/* Interactive Components */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <InvestmentCalculator />
          <AchievementBadges activeInvestments={activeInvestments} />
        </div>

        {/* Section Divider */}
        <div className="section-divider-with-icon">
          <div className="section-divider-icon">📚</div>
        </div>

        {/* Additional Information */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <TermsAndConditions />
          
          {/* Investment Tips */}
          <div className="card">
            <h3 className="mb-3">💡 Investment Tips</h3>
            <div style={{ fontSize: '0.875rem', lineHeight: '1.6', color: 'var(--secondary-text)' }}>
              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ color: 'var(--accent-primary)' }}>🎯 Diversification Strategy:</strong>
                <p style={{ margin: '0.5rem 0' }}>
                  Try different scheme durations to optimize your returns. Short-term for quick profits, long-term for higher percentages.
                </p>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ color: 'var(--success)' }}>⏰ Timing Tips:</strong>
                <p style={{ margin: '0.5rem 0' }}>
                  Monitor your investments regularly. Withdraw promptly when timers complete to maintain optimal cash flow.
                </p>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ color: 'var(--warning)' }}>📊 Performance Tracking:</strong>
                <p style={{ margin: '0.5rem 0' }}>
                  Use the investment calculator to plan your strategy and track your progress with achievement badges.
                </p>
              </div>

              <div style={{ 
                background: 'var(--accent-bg)', 
                padding: '0.75rem', 
                borderRadius: 'var(--radius-md)', 
                marginTop: '1rem',
                border: '1px solid var(--accent-primary)'
              }}>
                <strong style={{ color: 'var(--accent-primary)' }}>🚀 Pro Tip:</strong> Start with smaller amounts to understand the platform, then scale up your investments as you gain confidence!
              </div>
            </div>
          </div>
        </div>

        {/* Final Section Divider */}
        <div className="section-divider"></div>

        {/* Investment Modal */}
        <InvestmentModal
          scheme={selectedScheme}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedScheme(null);
          }}
          onConfirm={handleConfirmInvestment}
        />
      </div>
    </div>
  );
};

export default ClientDashboard;