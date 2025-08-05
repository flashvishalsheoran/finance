import React from 'react';
import { formatCurrency } from '../data/staticData';

const AchievementBadges = ({ activeInvestments }) => {
  const totalInvestments = activeInvestments.length;
  const completedInvestments = activeInvestments.filter(inv => inv.status === 'withdrawn').length;
  const totalInvested = activeInvestments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalReturns = activeInvestments
    .filter(inv => inv.status === 'withdrawn')
    .reduce((sum, inv) => sum + (inv.actualReturn || 0), 0);

  const achievements = [
    {
      id: 'first_investment',
      title: 'First Steps',
      description: 'Made your first investment',
      icon: '🚀',
      unlocked: totalInvestments >= 1,
      requirement: 'Make 1 investment'
    },
    {
      id: 'investor',
      title: 'Regular Investor',
      description: 'Completed 3 investments',
      icon: '💎',
      unlocked: completedInvestments >= 3,
      requirement: 'Complete 3 investments'
    },
    {
      id: 'high_roller',
      title: 'High Roller',
      description: 'Invested over ₹50,000',
      icon: '👑',
      unlocked: totalInvested >= 50000,
      requirement: 'Invest ₹50,000+'
    },
    {
      id: 'profit_maker',
      title: 'Profit Maker',
      description: 'Earned over ₹5,000 in returns',
      icon: '💰',
      unlocked: totalReturns >= 5000,
      requirement: 'Earn ₹5,000+ returns'
    },
    {
      id: 'diversified',
      title: 'Diversified Portfolio',
      description: 'Invested in all 3 schemes',
      icon: '🌟',
      unlocked: new Set(activeInvestments.map(inv => inv.schemeId)).size >= 3,
      requirement: 'Try all schemes'
    },
    {
      id: 'speed_demon',
      title: 'Speed Demon',
      description: 'Completed a 1-hour investment',
      icon: '⚡',
      unlocked: activeInvestments.some(inv => inv.duration === 60 && inv.status === 'withdrawn'),
      requirement: 'Complete 1H scheme'
    }
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="card">
      <h3 className="mb-3">🏆 Achievements ({unlockedCount}/{achievements.length})</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
        {achievements.map(achievement => (
          <div 
            key={achievement.id}
            className={`scheme-stat ${achievement.unlocked ? '' : 'opacity-50'}`}
            style={{ 
              background: achievement.unlocked ? 'var(--accent-bg)' : 'var(--secondary-bg)',
              border: achievement.unlocked ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
              opacity: achievement.unlocked ? 1 : 0.5,
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
              {achievement.icon}
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.25rem' }}>
              {achievement.title}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--secondary-text)', marginBottom: '0.5rem' }}>
              {achievement.description}
            </div>
            {!achievement.unlocked && (
              <div style={{ fontSize: '0.7rem', color: 'var(--muted-text)' }}>
                {achievement.requirement}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementBadges;