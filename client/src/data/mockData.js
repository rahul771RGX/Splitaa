/**
 * Mock Data for Expense Splitter App
 * 
 * This file contains all hardcoded data used throughout the application.
 * When integrating with a real backend API and database:
 * 1. Replace the data in this file with API calls in the services/api.js
 * 2. Update the context to fetch data from API instead of using this mock data
 * 3. Keep this file for testing and development purposes
 */

// Current logged-in user
export const currentUser = {
  id: 1,
  name: 'SNk',
  email: 'snk@example.com',
  avatar: 'https://ui-avatars.com/api/?name=You&background=random',
  createdAt: '2024-01-01T00:00:00.000Z'
};

// Friends/Users in the system
export const mockFriends = [
  {
    id: 2,
    name: 'Rahul Paul',
    email: 'rhl@example.com',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random',
    createdAt: '2024-01-15T00:00:00.000Z'
  },
  {
    id: 3,
    name: 'Saptarshi',
    email: 'sap@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Smith&background=random',
    createdAt: '2024-01-20T00:00:00.000Z'
  },
  {
    id: 4,
    name: 'Soumyajit',
    email: 'bapan@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Mike+Johnson&background=random',
    createdAt: '2024-02-01T00:00:00.000Z'
  }
  
];

// Groups for expense splitting
export const mockGroups = [
  {
    id: 1,
    name: 'Weekend Trip',
    description: 'Our weekend getaway expenses',
    members: [1, 2, 3, 4], // User IDs
    memberNames: ['SNk', 'Rahul Paul', 'Saptarshi', 'Soumyajit'],
    createdBy: 1,
    createdAt: '2024-03-01T00:00:00.000Z',
    avatar: 'https://ui-avatars.com/api/?name=Weekend+Trip&background=4F46E5',
    totalExpenses: 3640.50,
    balance: 250.50,
    type: 'owed'
  }
];

// Expense categories
export const expenseCategories = [
  { value: 'food', label: '🍽️ Food & Dining', icon: 'bi-cup-straw', color: 'primary' },
  { value: 'transport', label: '🚗 Transportation', icon: 'bi-car-front', color: 'success' },
  { value: 'entertainment', label: '🎬 Entertainment', icon: 'bi-film', color: 'warning' },
  { value: 'shopping', label: '🛍️ Shopping', icon: 'bi-bag', color: 'info' },
  { value: 'utilities', label: '⚡ Utilities', icon: 'bi-lightning', color: 'danger' },
  { value: 'travel', label: '✈️ Travel', icon: 'bi-airplane', color: 'secondary' },
  { value: 'other', label: '📋 Other', icon: 'bi-three-dots', color: 'dark' }
];

// Mock expenses
export const mockExpenses = [
  {
    id: 1001,
    description: 'Dinner at Italian Restaurant',
    amount: 450.50,
    category: 'food',
    paidBy: 1, // SNk (Current user)
    splitBetween: [1, 2, 3, 4],
    groupId: 1,
    notes: 'Celebration dinner after our hike',
    date: '2024-03-20T19:30:00.000Z',
    createdAt: '2024-03-20T19:30:00.000Z',
    updatedAt: '2024-03-20T19:30:00.000Z'
  },
  {
    id: 1002,
    description: 'Uber to Hotel',
    amount: 120.00,
    category: 'transport',
    paidBy: 2, // Rahul Paul
    splitBetween: [1, 2, 3, 4],
    groupId: 1,
    notes: '',
    date: '2024-03-20T22:00:00.000Z',
    createdAt: '2024-03-20T22:00:00.000Z',
    updatedAt: '2024-03-20T22:00:00.000Z'
  },
  {
    id: 1003,
    description: 'Hotel Booking',
    amount: 680.00,
    category: 'travel',
    paidBy: 3, // Saptarshi
    splitBetween: [1, 2, 3, 4],
    groupId: 1,
    notes: 'Two rooms for the weekend',
    date: '2024-03-19T14:00:00.000Z',
    createdAt: '2024-03-19T14:00:00.000Z',
    updatedAt: '2024-03-19T14:00:00.000Z'
  },
  {
    id: 1004,
    description: 'Movie Tickets',
    amount: 800.00,
    category: 'entertainment',
    paidBy: 4, // Soumyajit
    splitBetween: [1, 2, 3, 4],
    groupId: 1,
    notes: 'Evening show',
    date: '2024-03-21T13:00:00.000Z',
    createdAt: '2024-03-21T13:00:00.000Z',
    updatedAt: '2024-03-21T13:00:00.000Z'
  },
  {
    id: 1005,
    description: 'Pizza Delivery',
    amount: 320.00,
    category: 'food',
    paidBy: 1, // SNk (Current user)
    splitBetween: [1, 2, 3],
    groupId: 1,
    notes: 'Late night snack',
    date: '2024-03-22T12:30:00.000Z',
    createdAt: '2024-03-22T12:30:00.000Z',
    updatedAt: '2024-03-22T12:30:00.000Z'
  },
  {
    id: 1006,
    description: 'Grocery Shopping',
    amount: 540.00,
    category: 'shopping',
    paidBy: 2, // Rahul Paul
    splitBetween: [1, 2],
    groupId: 1,
    notes: 'Snacks and drinks',
    date: '2024-03-15T10:00:00.000Z',
    createdAt: '2024-03-15T10:00:00.000Z',
    updatedAt: '2024-03-15T10:00:00.000Z'
  },
  {
    id: 1007,
    description: 'Breakfast at Cafe',
    amount: 280.00,
    category: 'food',
    paidBy: 3, // Saptarshi
    splitBetween: [1, 3, 4],
    groupId: 1,
    notes: 'Sunday morning',
    date: '2024-03-16T10:00:00.000Z',
    createdAt: '2024-03-16T10:00:00.000Z',
    updatedAt: '2024-03-16T10:00:00.000Z'
  },
  {
    id: 1008,
    description: 'Fuel',
    amount: 450.00,
    category: 'transport',
    paidBy: 4, // Soumyajit
    splitBetween: [1, 2, 3, 4],
    groupId: 1,
    notes: 'Road trip fuel',
    date: '2024-03-17T18:00:00.000Z',
    createdAt: '2024-03-17T18:00:00.000Z',
    updatedAt: '2024-03-17T18:00:00.000Z'
  }
];

// Mock settlements (payments between users)
export const mockSettlements = [];

// Payment methods
export const paymentMethods = [
  { value: 'cash', label: '💵 Cash', icon: 'bi-cash' },
  { value: 'upi', label: '📱 UPI', icon: 'bi-phone' },
  { value: 'card', label: '💳 Card', icon: 'bi-credit-card' },
  { value: 'bank_transfer', label: '🏦 Bank Transfer', icon: 'bi-bank' },
  { value: 'other', label: '📋 Other', icon: 'bi-three-dots' }
];

// User preferences/settings
export const mockUserSettings = {
  userId: 1,
  currency: 'INR',
  currencySymbol: '₹',
  notifications: {
    email: true,
    push: true,
    expenseAdded: true,
    paymentReceived: true,
    settlementReminder: true
  },
  privacy: {
    profileVisibility: 'friends',
    showEmailToFriends: false
  },
  theme: 'light' // 'light' or 'dark'
};

/**
 * Helper function to get friend by ID
 */
export const getFriendById = (id) => {
  if (id === currentUser.id) return currentUser;
  return mockFriends.find(friend => friend.id === id);
};

/**
 * Helper function to get group by ID
 */
export const getGroupById = (id) => {
  return mockGroups.find(group => group.id === id);
};

/**
 * Helper function to get expenses by group ID
 */
export const getExpensesByGroup = (groupId) => {
  return mockExpenses.filter(expense => expense.groupId === groupId);
};

/**
 * Helper function to get category info
 */
export const getCategoryInfo = (categoryValue) => {
  return expenseCategories.find(cat => cat.value === categoryValue);
};

// Export all data as default for easy importing
export default {
  currentUser,
  mockFriends,
  mockGroups,
  expenseCategories,
  mockExpenses,
  mockSettlements,
  paymentMethods,
  mockUserSettings,
  // Helper functions
  getFriendById,
  getGroupById,
  getExpensesByGroup,
  getCategoryInfo
};
