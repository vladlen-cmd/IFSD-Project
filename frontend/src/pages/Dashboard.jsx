import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [donations, setDonations] = useState([]);
  const [donationStats, setDonationStats] = useState({
    total: { totalAmount: 0, totalDonations: 0 },
    categories: [],
    monthly: [],
    favoriteCause: 'education'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const { donationAPI } = await import('../services/api.js');
      
      const [statsResponse, donationsResponse] = await Promise.all([
        donationAPI.getDonationStats(),
        donationAPI.getUserDonations(1, 10)
      ]);
      
      if (statsResponse.data.success) {
        setDonationStats(statsResponse.data.data);
      }
      
      if (donationsResponse.data.success) {
        setDonations(donationsResponse.data.data.donations);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalDonated = donationStats.total.totalAmount;
  const totalDonations = donationStats.total.totalDonations;

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'donations', name: 'My Donations', icon: '💝' },
    { id: 'impact', name: 'Impact Report', icon: '🎯' },
    { id: 'settings', name: 'Settings', icon: '⚙️' }
  ];

  const renderOverview = () => (
    <div className="dashboard-content">
      <div className="welcome-section">
        <h2>Welcome back, {user?.name}! 👋</h2>
        <p>Thank you for being part of our mission to make India better.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <div className="stat-number">₹{totalDonated}</div>
            <div className="stat-label">Total Donated</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎁</div>
          <div className="stat-info">
            <div className="stat-number">{totalDonations}</div>
            <div className="stat-label">Donations Made</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🌟</div>
          <div className="stat-info">
            <div className="stat-number">{donationStats.favoriteCause.charAt(0).toUpperCase() + donationStats.favoriteCause.slice(1)}</div>
            <div className="stat-label">Favorite Cause</div>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <button className="action-card">
            <span className="action-icon">🚀</span>
            <span>Quick Donate</span>
          </button>
          <button className="action-card">
            <span className="action-icon">📅</span>
            <span>Monthly Setup</span>
          </button>
          <button className="action-card">
            <span className="action-icon">📋</span>
            <span>View Reports</span>
          </button>
          <button className="action-card">
            <span className="action-icon">🔔</span>
            <span>Notifications</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderDonations = () => (
    <div className="dashboard-content">
      <h2>My Donations</h2>
      {loading ? (
        <div className="loading">Loading your donation history...</div>
      ) : donations.length === 0 ? (
        <div className="empty-state">
          <h3>No donations yet</h3>
          <p>Start making a difference by creating your first donation!</p>
        </div>
      ) : (
        <div className="donations-list">
          {donations.map((donation) => (
            <div key={donation._id} className="donation-item">
              <div className="donation-info">
                <div className="donation-header">
                  <h4>{donation.category.charAt(0).toUpperCase() + donation.category.slice(1)} Donation</h4>
                  <span className={`status ${donation.status}`}>
                    {donation.status === 'completed' ? '✅ Completed' : 
                     donation.status === 'pending' ? '⏳ Pending' : '❌ Failed'}
                  </span>
                </div>
                <div className="donation-details">
                  <span className="amount">₹{donation.amount}</span>
                  <span className="category">{donation.category}</span>
                  <span className="date">{new Date(donation.createdAt).toLocaleDateString()}</span>
                  <span className="transaction-id">ID: {donation.transactionId}</span>
                </div>
                {donation.message && (
                  <div className="donation-message">
                    <em>"{donation.message}"</em>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderImpact = () => (
    <div className="dashboard-content">
      <h2>Your Impact Report</h2>
      <div className="impact-summary">
        {donationStats.categories.length === 0 ? (
          <div className="empty-state">
            <h3>No impact data yet</h3>
            <p>Make your first donation to see your impact!</p>
          </div>
        ) : (
          donationStats.categories.map((category) => (
            <div key={category._id} className="impact-card">
              <h3>{category._id.charAt(0).toUpperCase() + category._id.slice(1)} Impact</h3>
              <div className="impact-stat">
                <span className="impact-number">₹{category.amount}</span>
                <span className="impact-label">{category.count} Donations</span>
              </div>
            </div>
          ))
        )}
      </div>
      
      {donationStats.monthly.length > 0 && (
        <div className="monthly-trends">
          <h3>Monthly Donation Trends</h3>
          <div className="trends-list">
            {donationStats.monthly.map((month, index) => (
              <div key={index} className="trend-item">
                <span className="trend-month">
                  {new Date(month._id.year, month._id.month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <span className="trend-amount">₹{month.amount}</span>
                <span className="trend-count">{month.count} donations</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="dashboard-content">
      <h2>Account Settings</h2>
      <div className="settings-grid">
        <div className="setting-item">
          <h4>Profile Information</h4>
          <p>Name: {user?.name}</p>
          <p>Email: {user?.email}</p>
          <button className="setting-btn">Edit Profile</button>
        </div>
        <div className="setting-item">
          <h4>Notification Preferences</h4>
          <label className="toggle">
            <input type="checkbox" defaultChecked />
            <span>Email notifications</span>
          </label>
          <label className="toggle">
            <input type="checkbox" defaultChecked />
            <span>Impact updates</span>
          </label>
        </div>
        <div className="setting-item">
          <h4>Privacy</h4>
          <label className="toggle">
            <input type="checkbox" />
            <span>Public donation history</span>
          </label>
          <button className="setting-btn danger">Delete Account</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <div className="user-info">
          <div className="avatar">{user?.name?.charAt(0)}</div>
          <div>
            <h3>{user?.name}</h3>
            <p>{user?.email}</p>
          </div>
        </div>
        
        <nav className="dashboard-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="nav-icon">{tab.icon}</span>
              <span className="nav-label">{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="dashboard-main">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'donations' && renderDonations()}
        {activeTab === 'impact' && renderImpact()}
        {activeTab === 'settings' && renderSettings()}
      </div>
    </div>
  );
};

export default Dashboard;