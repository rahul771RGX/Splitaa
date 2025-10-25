// Calculate balances for each person
export const calculateBalances = (expenses, friends) => {
  const balances = {};
  
  // Initialize balances for all friends
  friends.forEach(friend => {
    const userId = friend.id || friend.user_id;
    balances[userId] = { name: friend.name, balance: 0, owes: [], owedBy: [] };
  });

  // Calculate what each person owes/is owed
  expenses.forEach(expense => {
    const totalAmount = parseFloat(expense.amount);
    const paidBy = expense.paid_by;
    
    // Person who paid gets credited with the full amount
    if (!balances[paidBy]) {
      balances[paidBy] = { name: expense.paid_by_name || 'Unknown', balance: 0, owes: [], owedBy: [] };
    }
    balances[paidBy].balance += totalAmount;
    
    // Each person in the split gets debited their share
    if (expense.splits && Array.isArray(expense.splits)) {
      expense.splits.forEach(split => {
        const userId = split.user_id;
        const splitAmount = parseFloat(split.amount);
        
        if (!balances[userId]) {
          balances[userId] = { name: split.user_name || 'Unknown', balance: 0, owes: [], owedBy: [] };
        }
        balances[userId].balance -= splitAmount;
      });
    }
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
