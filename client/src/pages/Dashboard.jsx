import React from 'react';
import { useExpenses } from '../context/ExpensesContext';
import { calculateBalances } from '../services/calculations';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Calendar, ChevronRight, Plus, QrCode } from 'lucide-react';

const Dashboard = () => {
  const { state } = useExpenses();
  const { expenses, friends } = state;

  const balances = calculateBalances(expenses, friends);
  
  // Calculate total amounts you owe and are owed
  const totalOwed = Object.values(balances).reduce((sum, data) => {
    return data.balance < 0 ? sum + Math.abs(data.balance) : sum;
  }, 0);
  
  const totalOwedToYou = Object.values(balances).reduce((sum, data) => {
    return data.balance > 0 ? sum + data.balance : sum;
  }, 0);

  return (
    <div className="main-content">
      <div className="dashboard-container">
        {/* Balance Cards */}
        <div className="balance-section">
        <div className="balance-cards-container">
          <div className="balance-card balance-card-dark">
            <div className="balance-card-body">
              <div className="balance-text-content">
                <div className="balance-amount">₹{totalOwed.toFixed(0)}</div>
                <div className="balance-label balance-label-dark">You owe</div>
              </div>
              <div className="balance-icon-container balance-icon-dark">
                <TrendingUp size={32} />
              </div>
            </div>
          </div>
          
          <div className="balance-card balance-card-teal">
            <div className="balance-card-body">
              <div className="balance-text-content">
                <div className="balance-amount">₹{totalOwedToYou.toFixed(0)}</div>
                <div className="balance-label balance-label-teal">You are owed</div>
              </div>
              <div className="balance-icon-container balance-icon-teal">
                <TrendingDown size={32} />
              </div>
            </div>
          </div>
        </div>

        {/* All Time Link */}
        <div className="all-time-container">
          <Link to="/expenses" className="all-time-link">
            <span>All time</span>
            <ChevronRight size={20} />
          </Link>
        </div>
      </div>

      {/* Empty State */}
      <div className="empty-state">
        <div className="empty-state-container">
          <div className="empty-state-icon">
            <div className="empty-state-icon-inner">
              <Calendar size={48} />
            </div>
          </div>
          
          <h3 className="empty-state-title">No event yet</h3>
          <p className="empty-state-description">Create a new event to track and split your group costs</p>
          
          <div className="button-container">
            <Link to="/expenses/add">
              <button className="btn-create-event">
                <Plus size={24} />
                <span>Create new event</span>
              </button>
            </Link>
            
            <p className="qr-divider">Or join events by</p>
            
            <button className="btn-qr">
              <QrCode size={24} />
              <span>Scan event QR</span>
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Dashboard;
