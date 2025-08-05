import React, { useState, useEffect } from 'react';
import { schemes, formatCurrency, formatTime, getTotalClients, getTotalInvestmentAmount, clientUsers } from '../data/staticData';
import InvestmentModal from '../components/InvestmentModal'; // Assuming this might be used for editing

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('schemes');
  const [newScheme, setNewScheme] = useState({
    name: '',
    duration: 60,
    returnRate: '1%',
    description: '',
    minAmount: 1000,
    maxAmount: 100000,
    isLive: true
  });
  const [editingScheme, setEditingScheme] = useState(null);
  const [clientInvestments, setClientInvestments] = useState([]); // To store all client active investments
  const [showClientsForScheme, setShowClientsForScheme] = useState(null); // To show clients for a specific scheme
  const [viewingArchivedSchemeId, setViewingArchivedSchemeId] = useState(null); // New state for viewing archived scheme details

  // Load all client investments from localStorage (simulated across all clients)
  useEffect(() => {
    const allInvestments = [];
    // For demo, we iterate through known client users. In real app, this would be a backend call.
    const clientUsernames = clientUsers.map(user => user.username);

    clientUsernames.forEach(username => {
      const savedInvestments = localStorage.getItem(`activeInvestments_${username}`);
      if (savedInvestments) {
        try {
          const parsed = JSON.parse(savedInvestments);
          // Add username to each investment for identification
          allInvestments.push(...parsed.map(inv => ({ ...inv, clientUsername: username })));
        } catch (error) {
          console.error(`Error loading investments for ${username}:`, error);
        }
      }
    });
    setClientInvestments(allInvestments);

    // Set up interval to update time remaining for active investments
    const interval = setInterval(() => {
      setClientInvestments(prevInvestments => 
        prevInvestments.map(inv => {
          if (inv.status === 'withdrawn' || inv.status === 'ready_to_withdraw') return inv; // Don't update completed or ready investments

          const now = new Date().getTime();
          const startTime = new Date(inv.startTime).getTime();
          const endTime = startTime + (inv.duration * 60 * 1000);
          const remaining = endTime - now;

          if (remaining <= 0) {
            return {
              ...inv,
              timeRemaining: 0,
              canWithdraw: true,
              status: 'ready_to_withdraw'
            };
          } else {
            return {
              ...inv,
              timeRemaining: remaining,
              canWithdraw: false,
              status: 'active'
            };
          }
        })
      );
    }, 1000); // Update every second

    return () => clearInterval(interval);

  }, []); // Run once on mount


  const totalClients = getTotalClients();
  const totalInvestment = getTotalInvestmentAmount();
  const activeSchemesCount = schemes.filter(s => s.isLive).length;

  const handleCreateScheme = (e) => {
    e.preventDefault();
    // In a real app, this would make an API call to a backend
    const newId = Math.max(...schemes.map(s => s.id)) + 1;
    const schemeToAdd = {
      ...newScheme,
      id: newId,
      clients: [] // Newly created schemes start with no clients
    };
    
    schemes.push(schemeToAdd); // Directly modify the imported schemes array for demo
    
    // Reset form
    setNewScheme({
      name: '',
      duration: 60,
      returnRate: '1%',
      description: '',
      minAmount: 1000,
      maxAmount: 100000,
      isLive: true
    });
    
    alert('Scheme created successfully!');
  };

  const toggleSchemeStatus = (schemeId) => {
    const scheme = schemes.find(s => s.id === schemeId);
    if (scheme) {
      scheme.isLive = !scheme.isLive; // Directly modify for demo
      // Force re-render
      setClientInvestments([...clientInvestments]);
    }
  };

  const handleEditScheme = (scheme) => {
    setEditingScheme(scheme);
  };

  const handleSaveEditedScheme = (editedScheme) => {
    const index = schemes.findIndex(s => s.id === editedScheme.id);
    if (index !== -1) {
      schemes[index] = editedScheme; // Directly modify for demo
      setEditingScheme(null);
      // Force re-render
      setClientInvestments([...clientInvestments]);
    }
  };

  const handleCancelEdit = () => {
    setEditingScheme(null);
  };

  const handleViewClientsForScheme = (schemeId) => {
    setShowClientsForScheme(schemeId);
    setActiveTab('clients');
  };

  const renderArchivedSchemeDetails = () => {
    const scheme = schemes.find(s => s.id === viewingArchivedSchemeId);
    if (!scheme) {
      return (
        <div className="card mb-4">
          <h3 className="mb-3">Archived Scheme Not Found</h3>
          <p>The selected archived scheme could not be found.</p>
          <button onClick={() => setViewingArchivedSchemeId(null)} className="btn btn-secondary mt-3">
            ← Back to Archived Schemes
          </button>
        </div>
      );
    }

    const totalInvestedInScheme = scheme.clients.reduce((sum, client) => sum + client.amount, 0);

    return (
      <div className="card mb-4">
        <h3 className="mb-3">Details for: {scheme.name}</h3>
        <div className="flex gap-2 mb-4">
          <button onClick={() => setViewingArchivedSchemeId(null)} className="btn btn-secondary">
            ← Back to Archived Schemes
          </button>
          <button onClick={() => toggleSchemeStatus(scheme.id)} className="btn btn-success">
            Restart Scheme
          </button>
        </div>
        
        <div className="scheme-details-grid mb-4">
          <div>
            <p><strong>Description:</strong> {scheme.description}</p>
            <p><strong>Duration:</strong> {formatTime(scheme.duration * 60 * 1000)}</p>
            <p><strong>Return Rate:</strong> {scheme.returnRate}</p>
            <p><strong>Min/Max Amount:</strong> {formatCurrency(scheme.minAmount)} - {formatCurrency(scheme.maxAmount)}</p>
            {scheme.createdAt && <p><strong>Archived Date:</strong> {new Date(scheme.createdAt).toLocaleDateString()}</p>}
          </div>
          <div>
            <p><strong>Total Clients Applied:</strong> {scheme.clients.length}</p>
            <p><strong>Total Amount Invested:</strong> {formatCurrency(totalInvestedInScheme)}</p>
          </div>
        </div>

        <h4>Clients for this Scheme:</h4>
        {scheme.clients.length === 0 ? (
          <p className="text-center" style={{ color: 'var(--muted-text)' }}>
            No clients have applied to this scheme.
          </p>
        ) : (
          <div className="table-container" style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Client Name</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Applied At</th>
                </tr>
              </thead>
              <tbody>
                {scheme.clients.map((client, index) => (
                  <tr key={`${scheme.id}-${client.id || index}`}>
                    <td>{clientUsers.find(u => u.id === client.id)?.name || 'N/A'}</td>
                    <td>{formatCurrency(client.amount)}</td>
                    <td>
                      <span className={`status-badge status-${client.status}`}>
                        {client.status}
                      </span>
                    </td>
                    <td>{new Date(client.appliedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderSchemes = () => {
    // Consolidated Active Schemes: schemes that are live, irrespective of client investments
    const activeSchemes = schemes.filter(scheme => scheme.isLive);
    // Archived Schemes: schemes that are not live
    const archivedSchemes = schemes.filter(scheme => !scheme.isLive);

    return (
      <div>
        <h2 className="mb-4">Admin Dashboard Overview & Scheme Management</h2>
        
        {/* Stats Cards - from old Overview */}
        <div className="card-grid" style={{ marginBottom: '2rem' }}>
          <div className="card text-center">
            <h3 style={{ color: 'var(--accent-primary)' }}>{activeSchemesCount}</h3>
            <p>Active Schemes</p>
          </div>
          <div className="card text-center">
            <h3 style={{ color: 'var(--success)' }}>{totalClients}</h3>
            <p>Total Clients</p>
          </div>
          <div className="card text-center">
            <h3 style={{ color: 'var(--warning)' }}>{formatCurrency(totalInvestment)}</h3>
            <p>Total Investment</p>
          </div>
          <div className="card text-center">
            <h3 style={{ color: 'var(--accent-secondary)' }}>{schemes.length}</h3>
            <p>Total Schemes</p>
          </div>
        </div>

        {/* Active Schemes */}
        {activeSchemes.length > 0 && (
          <div className="card mb-4">
            <h3 className="mb-3">📈 Active Schemes</h3>
            <div className="card-grid">
              {activeSchemes.map(scheme => {
                const schemeClients = clientInvestments.filter(inv => inv.schemeId === scheme.id);
                const totalInvestedInScheme = schemeClients.reduce((sum, inv) => sum + inv.amount, 0);
                const firstActiveInvestment = schemeClients.find(inv => inv.status === 'active' || inv.status === 'ready_to_withdraw');
                
                let timeRemaining = 0;
                if (firstActiveInvestment) {
                  timeRemaining = firstActiveInvestment.timeRemaining; // Use time from the first active investment found
                  // Debugging log for '1 Hour Boost' scheme ID 1
                  if (scheme.id === 1) {
                    console.log(`Admin - 1 Hour Boost (scheme ID 1) - firstActiveInvestment: ${!!firstActiveInvestment}, timeRemaining: ${timeRemaining}, status: ${firstActiveInvestment.status}`);
                  }
                }
                
                return (
                  <div key={scheme.id} className="scheme-card scheme-card-active fade-in">
                    {/* New: Time Left Badge - only for schemes with active investments and time remaining */}
                    {firstActiveInvestment && timeRemaining > 0 && (
                      <div className="scheme-badge scheme-badge-time-left">
                        {formatTime(timeRemaining)} Left
                      </div>
                    )}
                    
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
                          <div className="scheme-stat-value">{formatTime(scheme.duration * 60 * 1000)}</div> {/* Convert duration minutes to milliseconds for formatTime */}
                          <div className="scheme-stat-label">Duration</div>
                        </div>
                        <div className="scheme-stat">
                          <div className="scheme-stat-value">{schemeClients.length}</div>
                          <div className="scheme-stat-label">Clients</div>
                        </div>
                        <div className="scheme-stat">
                          <div className="scheme-stat-value">{formatCurrency(totalInvestedInScheme)}</div>
                          <div className="scheme-stat-label">Total Invested</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'center', marginTop: 'auto' }}>
                        <button 
                          onClick={() => handleEditScheme(scheme)}
                          className="btn btn-secondary w-full"
                          style={{ marginRight: '0.5rem' }}
                        >
                          Edit Scheme
                        </button>
                        <button 
                          onClick={() => handleViewClientsForScheme(scheme.id)}
                          className="btn btn-secondary w-full"
                          style={{ marginTop: '0.5rem' }}
                        >
                          View Clients
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Archived Schemes - Conditional Render */}
        {viewingArchivedSchemeId ? (
          renderArchivedSchemeDetails()
        ) : (
          archivedSchemes.length > 0 && (
            <div className="card mb-4">
              <h3 className="mb-3">📦 Archived Schemes</h3>
              <div className="table-container" style={{ overflowX: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Scheme Name</th>
                      <th>Duration</th>
                      <th>Return Rate</th>
                      <th>Min/Max</th>
                      <th>Clients</th>
                      <th>Total Invested</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {archivedSchemes.map(scheme => {
                      const totalAmount = scheme.clients.reduce((sum, client) => sum + client.amount, 0);
                      return (
                        <tr key={scheme.id}>
                          <td>{scheme.name}</td>
                          <td>{formatTime(scheme.duration * 60 * 1000)}</td> {/* Convert duration minutes to milliseconds for formatTime */}
                          <td>{scheme.returnRate}</td>
                          <td>{formatCurrency(scheme.minAmount)} - {formatCurrency(scheme.maxAmount)}</td>
                          <td>{scheme.clients.length}</td>
                          <td>{formatCurrency(totalAmount)}</td>
                          <td>
                            <button 
                              onClick={() => setViewingArchivedSchemeId(scheme.id)} // View Details Button
                              className="btn btn-secondary btn-sm"
                              style={{ marginRight: '0.5rem' }}
                            >
                              View Details
                            </button>
                            <button 
                              onClick={() => toggleSchemeStatus(scheme.id)}
                              className="btn btn-success btn-sm"
                            >
                              Activate
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}

        {/* Recent Activity - from old Overview */}
        <div className="card mb-4">
          <h3 className="mb-3">Recent Client Activity</h3>
          <div className="table-container" style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Scheme</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Applied At</th>
                </tr>
              </thead>
              <tbody>
                {schemes.flatMap(scheme => 
                  scheme.clients.map(client => ({
                    ...client,
                    schemeName: scheme.name,
                    schemeId: scheme.id
                  }))
                )
                .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
                .slice(0, 10)
                .map(client => (
                  <tr key={`${client.schemeId}-${client.id}`}>
                    <td>{client.name}</td>
                    <td>{client.schemeName}</td>
                    <td>{formatCurrency(client.amount)}</td>
                    <td>
                      <span className={`status-badge status-${client.status}`}>
                        {client.status}
                      </span>
                    </td>
                    <td>{new Date(client.appliedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderClients = () => {
    const clientsToDisplay = showClientsForScheme 
      ? schemes.find(s => s.id === showClientsForScheme)?.clients || []
      : schemes.flatMap(scheme => scheme.clients);

    return (
      <div>
        <h2 className="mb-4">
          {showClientsForScheme 
            ? `Clients for Scheme: ${schemes.find(s => s.id === showClientsForScheme)?.name}` 
            : 'All Clients'}
        </h2>
        {showClientsForScheme && (
          <button onClick={() => setShowClientsForScheme(null)} className="btn btn-secondary mb-3">
            ← Back to All Clients
          </button>
        )}
        
        <div className="card">
          {clientsToDisplay.length === 0 ? (
            <p className="text-center" style={{ color: 'var(--muted-text)' }}>
              {showClientsForScheme 
                ? 'No clients found for this scheme yet.' 
                : 'No clients have applied for any scheme yet.'}
            </p>
          ) : (
            <div className="table-container" style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Client Name</th>
                    <th>Scheme</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Applied At</th>
                  </tr>
                </thead>
                <tbody>
                  {clientsToDisplay.map((client, index) => (
                    <tr key={`${client.schemeId || index}-${client.id}`}>
                      <td>{client.name}</td>
                      <td>{schemes.find(s => s.id === client.schemeId)?.name || 'N/A'}</td>
                      <td>{formatCurrency(client.amount)}</td>
                      <td>
                        <span className={`status-badge status-${client.status}`}>
                          {client.status}
                        </span>
                      </td>
                      <td>{new Date(client.appliedAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCreateScheme = () => (
    <div>
      <h2 className="mb-4">Create New Scheme</h2>
      
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <form onSubmit={handleCreateScheme}>
          <div className="form-group">
            <label className="form-label">Scheme Name</label>
            <input
              type="text"
              value={newScheme.name}
              onChange={(e) => setNewScheme({...newScheme, name: e.target.value})}
              className="form-input"
              placeholder="e.g., 2 Hour Quick"
              required
            />
          </div>

                        <div className="form-group">
                <label className="form-label">Duration (minutes)</label>
                <select
                  value={newScheme.duration}
                  onChange={(e) => setNewScheme({...newScheme, duration: parseInt(e.target.value)})}
                  className="form-select"
                >
                  <option value={60}>⚡ 1 Hour (60 mins) - Quick Return</option>
                  <option value={120}>🚀 2 Hours (120 mins) - Fast Growth</option>
                  <option value={360}>💎 6 Hours (360 mins) - Enhanced</option>
                  <option value={720}>🔥 12 Hours (720 mins) - Premium</option>
                  <option value={1440}>👑 24 Hours (1440 mins) - Ultimate</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Return Rate</label>
                <select
                  value={newScheme.returnRate}
                  onChange={(e) => setNewScheme({...newScheme, returnRate: e.target.value})}
                  className="form-select"
                >
                  <option value="1%">💰 1% - Conservative</option>
                  <option value="2%">📈 2% - Moderate</option>
                  <option value="6%">🔥 6% - Aggressive</option>
                  <option value="12%">💎 12% - Premium</option>
                  <option value="24%">👑 24% - Ultimate</option>
                </select>
              </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <input
              type="text"
              value={newScheme.description}
              onChange={(e) => setNewScheme({...newScheme, description: e.target.value})}
              className="form-input"
              placeholder="Brief description of the scheme"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Minimum Amount (₹)</label>
              <input
                type="number"
                value={newScheme.minAmount}
                onChange={(e) => setNewScheme({...newScheme, minAmount: parseInt(e.target.value)})}
                className="form-input"
                min="100"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Maximum Amount (₹)</label>
              <input
                type="number"
                value={newScheme.maxAmount}
                onChange={(e) => setNewScheme({...newScheme, maxAmount: parseInt(e.target.value)})}
                className="form-input"
                min="1000"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <input
                type="checkbox"
                checked={newScheme.isLive}
                onChange={(e) => setNewScheme({...newScheme, isLive: e.target.checked})}
                style={{ marginRight: '0.5rem' }}
              />
              Make scheme live immediately
            </label>
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Create Scheme
          </button>
        </form>
      </div>
    </div>
  );

  // New: Withdraw Claims Section Component
  const WithdrawClaimsSection = ({ clientUsers }) => {
    const [withdrawals, setWithdrawals] = useState([]);
  
    useEffect(() => {
      const savedClaims = localStorage.getItem('withdrawalClaims');
      if (savedClaims) {
        try {
          setWithdrawals(JSON.parse(savedClaims));
        } catch (error) {
          console.error('Error loading withdrawal claims:', error);
          setWithdrawals([]);
        }
      } else {
        setWithdrawals([]); // Ensure it's an empty array if no data
      }
    }, []); // Run once on mount
  
    const handleUpdateWithdrawalStatus = (claimId, newStatus) => {
      setWithdrawals(prev => {
        const updated = prev.map(claim => {
          if (claim.id === claimId) {
            const updatedClaim = { 
              ...claim, 
              status: newStatus, 
              clearedDate: newStatus === 'cleared' ? new Date().toISOString() : null 
            };
            // Also update the client's active investments if this claim corresponds to one
            const clientInvestmentsKey = `activeInvestments_${clientUsers.find(u => u.id === claim.clientId)?.username}`;
            const clientInvestmentsInLocalStorage = JSON.parse(localStorage.getItem(clientInvestmentsKey)) || [];
            const updatedClientInvestments = clientInvestmentsInLocalStorage.map(inv => 
              inv.id === claimId 
                ? { 
                    ...inv, 
                    status: newStatus === 'cleared' ? 'withdrawn' : inv.status, // Map admin status to client status
                    clearedAt: newStatus === 'cleared' ? new Date().toISOString() : inv.clearedAt 
                  } 
                : inv
            );
            localStorage.setItem(clientInvestmentsKey, JSON.stringify(updatedClientInvestments));
            return updatedClaim;
          }
          return claim;
        });
        localStorage.setItem('withdrawalClaims', JSON.stringify(updated));
        return updated;
      });
    };
  
    const exportToCSV = (data) => {
      const headers = ["Client Name", "Scheme Name", "Amount", "Return Rate", "Expected Return", "Total Payout", "Applied At", "Withdraw Requested At", "Cleared At", "Blockchain Address", "Status"];
      const rows = data.map(item => [
        clientUsers.find(u => u.id === item.clientId)?.name || item.clientName,
        item.schemeName,
        item.amount,
        item.returnRate || 'N/A',
        item.expectedReturn || 'N/A',
        item.expectedTotal || (item.amount + (item.actualReturn || 0)),
        item.appliedAt ? new Date(item.appliedAt).toLocaleString() : 'N/A',
        item.requestDate ? new Date(item.requestDate).toLocaleString() : 'N/A',
        item.clearedDate ? new Date(item.clearedDate).toLocaleString() : 'N/A',
        item.walletAddress || 'N/A',
        item.status === 'cleared' ? 'Cleared' : 'Pending Approval'
      ]);
  
      let csvContent = "data:text/csv;charset=utf-8," + headers.map(h => `\"${h}\"`).join(",") + "\n" + rows.map(e => e.map(cell => `\"${cell}\"`).join(",")).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "withdraw_claims.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    };
  
    const exportToTXT = (data) => {
      const content = data.map(item => 
        `Client: ${clientUsers.find(u => u.id === item.clientId)?.name || item.clientName}, Scheme: ${item.schemeName}, Amount: ${formatCurrency(item.amount)}, Total Payout: ${formatCurrency(item.expectedTotal || (item.amount + (item.actualReturn || 0)))}, Applied: ${item.appliedAt ? new Date(item.appliedAt).toLocaleString() : 'N/A'}, Requested: ${item.requestDate ? new Date(item.requestDate).toLocaleString() : 'N/A'}, Cleared: ${item.clearedDate ? new Date(item.clearedDate).toLocaleString() : 'N/A'}, Wallet: ${item.walletAddress || 'N/A'}, Status: ${item.status === 'cleared' ? 'Cleared' : 'Pending Approval'}`
      ).join('\n\n');
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'withdraw_claims.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };
  
    const exportToPDF = (data) => {
      alert('PDF export is a complex feature and typically requires a server-side library or a dedicated client-side PDF generation library. For this demo, it is simulated.');
      console.log('Simulating PDF export for data:', data);
    };
  
    return (
      <div>
        <h2 className="mb-4">Withdrawal Claims Management</h2>
        <div className="flex gap-2 mb-4">
          <button onClick={() => exportToCSV(withdrawals)} className="btn btn-primary">Export to CSV</button>
          <button onClick={() => exportToTXT(withdrawals)} className="btn btn-secondary">Export to TXT</button>
          <button onClick={() => exportToPDF(withdrawals)} className="btn btn-secondary">Export to PDF (Simulated)</button>
        </div>
  
        <div className="card">
          {withdrawals.length === 0 ? (
            <p className="text-center" style={{ color: 'var(--muted-text)' }}>
              No withdrawal claims to display yet.
            </p>
          ) : (
            <div className="table-container" style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Scheme</th>
                    <th>Amount</th>
                    <th>Total Payout</th>
                    <th>Applied At</th>
                    <th>Withdraw Requested</th>
                    <th>Cleared At</th> {/* New column */}
                    <th>Blockchain Wallet</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.map(claim => (
                    <tr key={claim.id}>
                      <td>{clientUsers.find(u => u.id === claim.clientId)?.name || claim.clientName}</td>
                      <td>{claim.schemeName}</td>
                      <td>{formatCurrency(claim.amount)}</td>
                      <td>{formatCurrency(claim.expectedTotal || (claim.amount + (claim.actualReturn || 0)))}</td>
                      <td>{claim.appliedAt ? new Date(claim.appliedAt).toLocaleString() : 'N/A'}</td>
                      <td>{claim.requestDate ? new Date(claim.requestDate).toLocaleString() : 'N/A'}</td>
                      <td>{claim.clearedDate ? new Date(claim.clearedDate).toLocaleString() : 'N/A'}</td> {/* New cell */}
                      <td>{claim.walletAddress || 'N/A'}</td>
                      <td>
                        <span className={`status-badge status-${claim.status === 'cleared' ? 'withdrawn' : 'pending'}`}>
                          {claim.status === 'cleared' ? 'Cleared' : 'Pending Approval'}
                        </span>
                      </td>
                      <td>
                        {claim.status === 'pending' ? (
                          <button
                            onClick={() => handleUpdateWithdrawalStatus(claim.id, 'cleared')}
                            className="btn btn-success btn-sm"
                          >
                            Approve
                          </button>
                        ) : (
                          <span style={{ color: 'var(--muted-text)', fontSize: '0.8rem' }}>
                            Approved
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="section">
      <div className="container">
        {/* Tab Navigation */}
        <div className="card mb-4">
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('schemes')}
              className={`btn ${activeTab === 'schemes' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Schemes
            </button>
            <button 
              onClick={() => setActiveTab('create')}
              className={`btn ${activeTab === 'create' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Create Scheme
            </button>
            <button 
              onClick={() => setActiveTab('clients')}
              className={`btn ${activeTab === 'clients' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Clients
            </button>
            {/* New: Withdraw Claims Tab */}
            <button
              onClick={() => setActiveTab('withdrawClaims')}
              className={`btn ${activeTab === 'withdrawClaims' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Withdraw Claims
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'schemes' && renderSchemes()}
        {activeTab === 'create' && renderCreateScheme()}
        {activeTab === 'clients' && renderClients()}
        {activeTab === 'withdrawClaims' && <WithdrawClaimsSection clientUsers={clientUsers} />}

        {/* Edit Scheme Modal */}
        {editingScheme && (
          <div className="modal-overlay">
            <div className="modal" style={{ maxWidth: '600px' }}>
              <div className="modal-header">
                <h3 style={{ margin: 0 }}>Edit Scheme: {editingScheme.name}</h3>
                <button className="modal-close" onClick={handleCancelEdit}>×</button>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleSaveEditedScheme(editingScheme);
              }}>
                <div className="form-group">
                  <label className="form-label">Scheme Name</label>
                  <input
                    type="text"
                    value={editingScheme.name}
                    onChange={(e) => setEditingScheme({ ...editingScheme, name: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Duration (minutes)</label>
                  <select
                    value={editingScheme.duration}
                    onChange={(e) => setEditingScheme({ ...editingScheme, duration: parseInt(e.target.value) })}
                    className="form-select"
                  >
                    <option value={60}>⚡ 1 Hour (60 mins) - Quick Return</option>
                    <option value={120}>🚀 2 Hours (120 mins) - Fast Growth</option>
                    <option value={360}>💎 6 Hours (360 mins) - Enhanced</option>
                    <option value={720}>🔥 12 Hours (720 mins) - Premium</option>
                    <option value={1440}>👑 24 Hours (1440 mins) - Ultimate</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Return Rate</label>
                  <select
                    value={editingScheme.returnRate}
                    onChange={(e) => setEditingScheme({ ...editingScheme, returnRate: e.target.value })}
                    className="form-select"
                  >
                    <option value="1%">💰 1% - Conservative</option>
                    <option value="2%">📈 2% - Moderate</option>
                    <option value="6%">🔥 6% - Aggressive</option>
                    <option value="12%">💎 12% - Premium</option>
                    <option value="24%">👑 24% - Ultimate</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <input
                    type="text"
                    value={editingScheme.description}
                    onChange={(e) => setEditingScheme({ ...editingScheme, description: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Minimum Amount (₹)</label>
                    <input
                      type="number"
                      value={editingScheme.minAmount}
                      onChange={(e) => setEditingScheme({ ...editingScheme, minAmount: parseInt(e.target.value) })}
                      className="form-input"
                      min="100"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Maximum Amount (₹)</label>
                    <input
                      type="number"
                      value={editingScheme.maxAmount}
                      onChange={(e) => setEditingScheme({ ...editingScheme, maxAmount: parseInt(e.target.value) })}
                      className="form-input"
                      min="1000"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <input
                      type="checkbox"
                      checked={editingScheme.isLive}
                      onChange={(e) => setEditingScheme({ ...editingScheme, isLive: e.target.checked })}
                      style={{ marginRight: '0.5rem' }}
                    />
                    Make scheme live
                  </label>
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="btn btn-primary flex-1">Save Changes</button>
                  <button type="button" onClick={handleCancelEdit} className="btn btn-secondary flex-1">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;