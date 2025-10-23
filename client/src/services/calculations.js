// Calculate balances for each person
export const calculateBalances = (expenses, friends) => {
  const balances = {};
  
  // Initialize balances
  friends.forEach(friend => {
    balances[friend.id] = { name: friend.name, balance: 0, owes: [], owedBy: [] };
  });

  // Calculate what each person owes/is owed
  expenses.forEach(expense => {
    const totalAmount = parseFloat(expense.amount);
    const splitAmount = totalAmount / expense.splitBetween.length;
    
    // Person who paid gets credited
    if (balances[expense.paidBy]) {
      balances[expense.paidBy].balance += totalAmount;
    }
    
    // Everyone who is part of the split gets debited
    expense.splitBetween.forEach(personId => {
      if (balances[personId]) {
        balances[personId].balance -= splitAmount;
      }
    });
  });

  return balances;
};

// Calculate simplified settlements
export const calculateSettlements = (balances) => {
  const settlements = [];
  const creditors = [];
  const debtors = [];

  // Separate creditors and debtors
  Object.entries(balances).forEach(([id, data]) => {
    const numericId = parseInt(id); // Convert string ID to number
    if (data.balance > 0.01) {
      creditors.push({ id: numericId, name: data.name, amount: data.balance });
    } else if (data.balance < -0.01) {
      debtors.push({ id: numericId, name: data.name, amount: Math.abs(data.balance) });
    }
  });

  // Create settlements
  while (creditors.length > 0 && debtors.length > 0) {
    const creditor = creditors[0];
    const debtor = debtors[0];
    
    const settlementAmount = Math.min(creditor.amount, debtor.amount);
    
    settlements.push({
      from: debtor.name,
      fromId: debtor.id,
      to: creditor.name,
      toId: creditor.id,
      amount: settlementAmount
    });
    
    creditor.amount -= settlementAmount;
    debtor.amount -= settlementAmount;
    
    if (creditor.amount <= 0.01) {
      creditors.shift();
    }
    if (debtor.amount <= 0.01) {
      debtors.shift();
    }
  }

  return settlements;
};

// Format currency for Indian Rupees
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};

// Format date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
