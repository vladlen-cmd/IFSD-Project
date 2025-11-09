import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState('');
  const [donationData, setDonationData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    amount: 500,
    message: '',
    category: 'education'
  });
  const [showToast, setShowToast] = useState(null);

  const predefinedAmounts = [100, 250, 500, 1000, 2500, 5000];
  
  const categories = [
    { id: 'education', name: 'Education', icon: '📚' },
    { id: 'healthcare', name: 'Healthcare', icon: '🏥' },
    { id: 'environment', name: 'Environment', icon: '🌱' },
    { id: 'poverty', name: 'Poverty Relief', icon: '🤝' },
    { id: 'disaster', name: 'Disaster Relief', icon: '🆘' },
    { id: 'animal', name: 'Animal Welfare', icon: '🐾' }
  ];

  const stats = [
    { number: '1,250+', label: 'Lives Impacted' },
    { number: '₹42L+', label: 'Funds Raised' },
    { number: '45+', label: 'Active Projects' }
  ];

  const features = [
    {
      icon: '🎯',
      title: 'Targeted Impact',
      description: 'Your donations go directly to verified causes with 100% transparency.'
    },
    {
      icon: '📊',
      title: 'Real-time Tracking',
      description: 'Monitor how your contributions are making a difference with live updates.'
    },
    {
      icon: '🔒',
      title: 'Secure Payments',
      description: 'Bank-grade security with multiple payment options for your peace of mind.'
    },
    {
      icon: '📱',
      title: 'Mobile Friendly',
      description: 'Donate anytime, anywhere with our responsive mobile experience.'
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    setDonationData({ ...donationData, amount });
  };

  const handleCustomAmount = (e) => {
    const value = e.target.value;
    setCustomAmount(value);
    setSelectedAmount(null);
    setDonationData({ ...donationData, amount: parseInt(value) || 0 });
  };

  const handleInputChange = (e) => {
    setDonationData({
      ...donationData,
      [e.target.name]: e.target.value
    });
  };

  const handleDonate = async (e) => {
    e.preventDefault();
    
    try {
      if (!donationData.amount || !donationData.name || !donationData.email) {
        showToastMessage('error', 'Please fill in all required fields');
        return;
      }

      if (donationData.amount < 1) {
        showToastMessage('error', 'Donation amount must be at least ₹1');
        return;
      }

      showToastMessage('info', 'Processing your donation...');

      const { donationAPI } = await import('../services/api.js');
      
      const response = await donationAPI.createDonation(donationData);
      
      if (response.data.success) {
        showToastMessage('success', `Donation successful! Transaction ID: ${response.data.data.transactionId}`);
       
        setDonationData({
          amount: 0,
          category: 'education',
          name: '',
          email: '',
          message: ''
        });
        setSelectedAmount(null);
        setCustomAmount('');
      }
    } catch (error) {
      console.error('Donation error:', error);
      const errorMessage = error.response?.data?.message || 'Donation failed. Please try again.';
      showToastMessage('error', errorMessage);
    }
  };

  const showToastMessage = (type, message) => {
    setShowToast({ type, message });
    setTimeout(() => setShowToast(null), 3000);
  };

  return (
    <div className="home-container">
      {showToast && (
        <div className={`toast ${showToast.type}`}>
          {showToast.message}
        </div>
      )}
      
      <nav className="navbar">
        <div className="nav-content">
          <h1 className="logo">Donation Seva</h1>
          <div className="nav-right">
            <Link to="/dashboard" style={{ 
              color: 'var(--text-secondary)', 
              textDecoration: 'none', 
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Dashboard
            </Link>
            <span className="user-name">Welcome, {user?.name}!</span>
            <button onClick={handleLogout} className="logout-btn">Sign Out</button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section fade-in">
          <h2>Make a Difference Today</h2>
          <p>Your generosity can transform lives across India. Every rupee counts in building a better tomorrow.</p>
        </section>

        {/* Stats Section */}
        <section className="stats-section fade-in">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </section>

        {/* Quick Actions */}
        <section className="quick-actions fade-in">
          <button className="action-btn primary" onClick={() => document.getElementById('donation-form').scrollIntoView({ behavior: 'smooth' })}>
            Quick Donate
          </button>
          <button className="action-btn" onClick={() => showToastMessage('info', 'Monthly giving feature coming soon!')}>
            Monthly Giving
          </button>
          <button className="action-btn" onClick={() => showToastMessage('info', 'Project tracker will be available soon!')}>
            Track Projects
          </button>
          <button className="action-btn" onClick={() => showToastMessage('info', 'Volunteer registration opening soon!')}>
            Volunteer
          </button>
        </section>

        {/* Features Grid */}
        <section className="features-grid fade-in">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h4>{feature.title}</h4>
              <p>{feature.description}</p>
            </div>
          ))}
        </section>

        {/* Enhanced Donation Form */}
        <section className="donation-form-section fade-in" id="donation-form">
          <div className="donation-card">
            <h3>Make a Donation</h3>
            
            <form onSubmit={handleDonate}>
              {/* Amount Selection */}
              <div className="form-group">
                <label>Select Amount (₹)</label>
                <div className="amount-selector">
                  {predefinedAmounts.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      className={`amount-btn ${selectedAmount === amount ? 'selected' : ''}`}
                      onClick={() => handleAmountSelect(amount)}
                    >
                      ₹{amount}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  placeholder="Custom amount"
                  value={customAmount}
                  onChange={handleCustomAmount}
                  min="1"
                  style={{ marginTop: 'var(--spacing-xs)' }}
                />
              </div>

              {/* Category Selection */}
              <div className="form-group">
                <label htmlFor="category">Donation Category</label>
                <select
                  id="category"
                  name="category"
                  value={donationData.category}
                  onChange={handleInputChange}
                  style={{ 
                    padding: 'var(--spacing-sm)', 
                    border: '1px solid var(--border-color)', 
                    borderRadius: '8px',
                    width: '100%',
                    fontSize: '16px'
                  }}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Personal Information */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-sm)' }}>
                <div className="form-group">
                  <label htmlFor="donorName">Full Name</label>
                  <input
                    type="text"
                    id="donorName"
                    name="name"
                    value={donationData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={donationData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message (Optional)</label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={donationData.message}
                  onChange={handleInputChange}
                  placeholder="Share why you're donating... (Optional)"
                ></textarea>
              </div>

              <button type="submit" className="donate-btn">
                Donate ₹{donationData.amount || 0}
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2024 Donation Seva - Making India Better. All rights reserved.</p>
      </footer>
    </div>
  );
};export default Home;
