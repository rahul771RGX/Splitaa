import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ExpensesProvider } from './context/ExpensesContext';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import Friends from './pages/Friends';
import Expenses from './pages/Expenses';
import AddExpense from './pages/AddExpense';
import SettleUp from './pages/SettleUp';
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  return (
    <ExpensesProvider>
      <Router>
        <div className="app-container">
          <Navigation />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/expenses/add" element={<AddExpense />} />
            <Route path="/settle" element={<SettleUp />} />
          </Routes>
        </div>
      </Router>
    </ExpensesProvider>
  );
}

export default App;
