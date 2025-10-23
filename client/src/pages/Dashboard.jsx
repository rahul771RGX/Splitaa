import React from 'react';
import { useExpenses } from '../context/ExpensesContext';
import { calculateBalances } from '../services/calculations';
import { Link } from 'react-router-dom';
import { currentUser } from '../data/mockData';

const Dashboard = () => {
  const { state } = useExpenses();
  const { expenses, friends } = state;

  // Include current user in the friends list for balance calculation
  const allUsers = [currentUser, ...friends];
  const balances = calculateBalances(expenses, allUsers);
  
  // Calculate total amounts you owe and are owed
  const currentUserBalance = balances[currentUser.id] || { balance: 0 };
  const totalOwed = currentUserBalance.balance < 0 ? Math.abs(currentUserBalance.balance) : 0;
  const totalOwedToYou = currentUserBalance.balance > 0 ? currentUserBalance.balance : 0;

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
                <i className="bi bi-arrow-up-circle" style={{ fontSize: '32px' }}></i>
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
                <i className="bi bi-arrow-down-circle" style={{ fontSize: '32px' }}></i>
              </div>
            </div>
          </div>
        </div>

        {/* All Time Link - Removed */}
      </div>

      {/* Empty State */}
      <div className="empty-state">
        <div className="empty-state-container">
          <div className="empty-state-icon">
            <div className="empty-state-icon-inner">
              <i className="bi bi-calendar-event" style={{ fontSize: '48px' }}></i>
            </div>
          </div>
          
          <h3 className="empty-state-title">No event yet</h3>
          <p className="empty-state-description">Create a new event to track and split your group costs</p>
          
          <div className="button-container">
            <p className="empty-state-description">Use Groups to track and split expenses with friends</p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Dashboard;
