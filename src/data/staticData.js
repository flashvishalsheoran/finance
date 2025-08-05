// Static data for demo - no backend required

export const schemes = [
  {
    id: 1,
    name: "1 Hour Boost",
    duration: 60, // in minutes
    returnRate: "1%",
    isLive: true,
    description: "Quick 1% return in just 60 minutes",
    minAmount: 1000,
    maxAmount: 100000,
    clients: [
      { id: 1, name: "Alice Johnson", amount: 10000, status: "withdrawn", appliedAt: "2024-01-15T10:00:00Z" },
      { id: 2, name: "Bob Smith", amount: 5000, status: "pending", appliedAt: "2024-01-15T11:30:00Z" },
      { id: 3, name: "Carol Davis", amount: 15000, status: "active", appliedAt: "2024-01-15T12:15:00Z" }
    ]
  },
  {
    id: 2,
    name: "6 Hour Growth",
    duration: 360, // 6 hours in minutes
    returnRate: "6%",
    isLive: false, // Changed to false for archiving demo
    description: "Enhanced 6% return over 6 hours",
    minAmount: 5000,
    maxAmount: 500000,
    createdAt: "2023-10-01T09:00:00Z", // Dummy creation date
    clients: [
      { id: 4, name: "David Wilson", amount: 25000, status: "active", appliedAt: "2024-01-15T08:00:00Z" },
      { id: 5, name: "Eva Martinez", amount: 50000, status: "pending", appliedAt: "2024-01-15T09:45:00Z" }
    ]
  },
  {
    id: 3,
    name: "1 Hour Premium",
    duration: 60, // 1 hour in minutes  
    returnRate: "24%",
    isLive: true,
    description: "Premium 24% return over 1 hour",
    minAmount: 10000,
    maxAmount: 1000000,
    clients: [
      { id: 6, name: "Frank Brown", amount: 100000, status: "withdrawn", appliedAt: "2024-01-14T12:00:00Z" }
    ]
  }
];

export const adminUsers = [
  {
    id: 1,
    username: "admin",
    password: "admin123",
    name: "Admin User",
    role: "admin"
  }
];

export const clientUsers = [
  {
    id: 1,
    username: "vishal",
    password: "vishal123", 
    name: "Vishal Sheoran",
    role: "client",
    appliedScheme: null,
    totalEarnings: 2400,
    totalInvestments: 3,
    walletAddress: "0xABC123DEF4567890ABC123DEF4567890"
  },
  {
    id: 2,
    username: "demo",
    password: "demo123",
    name: "Demo User", 
    role: "client",
    appliedScheme: null,
    totalEarnings: 0,
    totalInvestments: 0,
    walletAddress: "0xFEDCBA9876543210FEDCBA9876543210"
  }
];

// Helper to initialize dummy withdrawal data for a client in localStorage for testing
// This function should be called once, e.g., in App.jsx or a development script.
export const initializeDummyWithdrawalData = () => {
  const vishalInvestments = [
    {
      id: 101,
      schemeId: 1,
      schemeName: "1 Hour Boost", // Changed to match scheme ID 1 name
      amount: 1000,
      duration: 60, // minutes (Changed to 60 for 1 Hour Boost)
      returnRate: "1%",
      expectedReturn: 10,
      expectedTotal: 1010,
      startTime: new Date(Date.now() - 10 * 1000).toISOString(), // 10 seconds ago
      appliedAt: new Date(Date.now() - 10 * 1000).toISOString(),
      timeRemaining: (60 * 60 * 1000) - (10 * 1000), // 60 minutes - 10 seconds
      canWithdraw: false,
      status: "active",
      walletAddress: "0xABC123DEF4567890ABC123DEF4567890"
    },
    {
      id: 102,
      schemeId: 2,
      schemeName: "6 Hours Enhanced",
      amount: 5000,
      duration: 360, // minutes
      returnRate: "6%",
      expectedReturn: 300,
      expectedTotal: 5300,
      startTime: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(), // 7 hours ago
      appliedAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
      timeRemaining: 0,
      canWithdraw: true,
      status: "withdrawn", // Already cleared
      withdrawnAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
      clearedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
      actualReturn: 300,
      walletAddress: "0xABC123DEF4567890ABC123DEF4567890"
    },
    {
      id: 103,
      schemeId: 3,
      schemeName: "1 Hour Premium",
      amount: 2000,
      duration: 60, // minutes
      returnRate: "24%",
      expectedReturn: 480,
      expectedTotal: 2480,
      startTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago (making it ready now)
      appliedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      timeRemaining: 0, // Should be 0 after 1 hour
      canWithdraw: true,
      status: "ready_to_withdraw",
      walletAddress: "0xABC123DEF4567890ABC123DEF4567890"
    }
  ];

  // Only set if not already present, to avoid resetting user's actual investments
  localStorage.setItem('activeInvestments_vishal', JSON.stringify(vishalInvestments));
  console.log('Dummy withdrawal data initialized for vishal in localStorage.');

  // Also setting for admin side to view claims
  const adminWithdrawalClaims = [
    {
      id: "claim_001",
      clientId: 1,
      clientName: "Vishal Sheoran",
      schemeName: "1 Hour Premium",
      amount: 2480, // Total of principal + return
      walletAddress: "0xABC123DEF4567890ABC123DEF4567890",
      requestDate: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 mins ago
      status: "pending"
    },
    {
      id: "claim_002",
      clientId: 1,
      clientName: "Vishal Sheoran",
      schemeName: "6 Hours Enhanced",
      amount: 5300,
      walletAddress: "0xABC123DEF4567890ABC123DEF4567890",
      requestDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      status: "cleared",
      clearedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
    }
  ];
  localStorage.setItem('withdrawalClaims', JSON.stringify(adminWithdrawalClaims));
  console.log('Dummy admin withdrawal claims initialized in localStorage.');
};

// Helper functions for data management
export const getSchemeById = (id) => {
  return schemes.find(scheme => scheme.id === parseInt(id));
};

export const getLiveSchemes = () => {
  return schemes.filter(scheme => scheme.isLive);
};

export const getTotalClients = () => {
  return schemes.reduce((total, scheme) => total + scheme.clients.length, 0);
};

export const getTotalInvestmentAmount = () => {
  return schemes.reduce((total, scheme) => {
    return total + scheme.clients.reduce((schemeTotal, client) => schemeTotal + client.amount, 0);
  }, 0);
};

export const getClientsByScheme = (schemeId) => {
  const scheme = getSchemeById(schemeId);
  return scheme ? scheme.clients : [];
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatTime = (milliseconds) => {
  if (milliseconds <= 0) return "00h 00m 00s";

  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (num) => num.toString().padStart(2, '0');

  return `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
};

export const calculateReturn = (amount, returnRate) => {
  const rate = parseFloat(returnRate.replace('%', '')) / 100;
  return Math.floor(amount * rate);
};

export const calculateTotal = (amount, returnRate) => {
  return amount + calculateReturn(amount, returnRate);
};