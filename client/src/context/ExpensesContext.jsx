import React, { createContext, useContext, useReducer } from 'react';

const ExpensesContext = createContext();

const initialState = {
  groups: [],
  currentGroup: null,
  expenses: [],
  friends: [],
  settlements: []
};

function expensesReducer(state, action) {
  switch (action.type) {
    case 'ADD_GROUP':
      return {
        ...state,
        groups: [...state.groups, { ...action.payload, id: Date.now() }]
      };
    
    case 'SET_CURRENT_GROUP':
      return {
        ...state,
        currentGroup: action.payload
      };
    
    case 'ADD_FRIEND':
      return {
        ...state,
        friends: [...state.friends, { ...action.payload, id: Date.now() }]
      };
    
    case 'ADD_EXPENSE':
      return {
        ...state,
        expenses: [...state.expenses, { ...action.payload, id: Date.now(), date: new Date() }]
      };
    
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter(expense => expense.id !== action.payload)
      };
    
    case 'ADD_SETTLEMENT':
      return {
        ...state,
        settlements: [...state.settlements, { ...action.payload, id: Date.now(), date: new Date() }]
      };
    
    default:
      return state;
  }
}

export const ExpensesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(expensesReducer, initialState);

  return (
    <ExpensesContext.Provider value={{ state, dispatch }}>
      {children}
    </ExpensesContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpensesContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpensesProvider');
  }
  return context;
};
