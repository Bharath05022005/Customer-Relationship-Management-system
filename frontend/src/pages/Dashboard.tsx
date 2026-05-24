import React from 'react';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, Admin 👋</h1>
          <p className="subtitle">Here's what's happening with your sales today.</p>
        </div>
        <button className="btn-primary">
          + Add New Lead
        </button>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card glass">
          <div className="stat-title">Total Leads</div>
          <div className="stat-value">2,450</div>
          <div className="stat-change positive">+12.5% from last month</div>
        </div>
        <div className="stat-card glass">
          <div className="stat-title">Active Deals</div>
          <div className="stat-value">145</div>
          <div className="stat-change positive">+5.2% from last month</div>
        </div>
        <div className="stat-card glass">
          <div className="stat-title">Win Rate</div>
          <div className="stat-value">32.8%</div>
          <div className="stat-change negative">-1.2% from last month</div>
        </div>
        <div className="stat-card glass">
          <div className="stat-title">Revenue Forecast</div>
          <div className="stat-value">$124,500</div>
          <div className="stat-change positive">+18.4% from last month</div>
        </div>
      </div>
      
      <div className="dashboard-charts">
        <div className="chart-card glass main-chart">
          <h3>Sales Pipeline Pipeline</h3>
          <div className="placeholder-chart">
            <div className="bar" style={{ height: '80%' }}></div>
            <div className="bar" style={{ height: '60%' }}></div>
            <div className="bar" style={{ height: '40%' }}></div>
            <div className="bar" style={{ height: '70%' }}></div>
            <div className="bar" style={{ height: '90%' }}></div>
            <div className="bar" style={{ height: '50%' }}></div>
            <div className="bar" style={{ height: '75%' }}></div>
          </div>
        </div>
        <div className="chart-card glass side-chart">
          <h3>Recent Activity</h3>
          <ul className="activity-list">
            <li>
              <div className="activity-dot"></div>
              <div className="activity-content">
                <strong>John Doe</strong> moved deal <em>Alpha Project</em> to Negotiation.
                <span className="time">2 hours ago</span>
              </div>
            </li>
            <li>
              <div className="activity-dot"></div>
              <div className="activity-content">
                <strong>Sarah Smith</strong> created a new lead.
                <span className="time">4 hours ago</span>
              </div>
            </li>
            <li>
              <div className="activity-dot"></div>
              <div className="activity-content">
                <strong>Mike Johnson</strong> won the <em>Beta Corp</em> deal!
                <span className="time">5 hours ago</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
