import { Row, Col, Card } from 'react-bootstrap'
import { useTheme } from '../contexts/ThemeContext'
import { useExpenses } from '../context/ExpensesContext'
import { calculateBalances } from '../services/calculations'
import { useEffect, useState } from 'react'

const styles = {
  balanceCard: {
    borderRadius: '20px',
    border: 'none',
    overflow: 'hidden',
    transition: 'transform 0.3s ease',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
  },
  balanceCardOwe: {
    background: 'linear-gradient(135deg, #374151 0%, #4B5563 100%)'
  },
  balanceCardOwed: {
    background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)'
  },
  balanceAmount: {
    fontSize: '2rem',
    fontWeight: '700',
    margin: '0',
    color: '#FFFFFF'
  },
  balanceLabel: {
    fontSize: '0.9rem',
    opacity: '0.9',
    margin: '0',
    color: '#FFFFFF'
  },
  balanceIcon: {
    fontSize: '1.5rem',
    opacity: '0.7',
    color: '#FFFFFF'
  }
}

function BalanceCards() {
  const isMobile = window.innerWidth < 768
  const { colors } = useTheme()
  const { state } = useExpenses()
  const { expenses, groups, currentUser } = state
  const [allMembers, setAllMembers] = useState([])

  // Collect all unique members from all groups
  useEffect(() => {
    const membersMap = new Map()
    
    // Add current user
    if (currentUser) {
      membersMap.set(currentUser.id, currentUser)
    }
    
    // Add all group members
    groups.forEach(group => {
      if (group.members) {
        group.members.forEach(member => {
          const memberId = member.user_id || member.id
          if (!membersMap.has(memberId)) {
            membersMap.set(memberId, {
              id: memberId,
              name: member.name,
              email: member.email
            })
          }
        })
      }
    })
    
    setAllMembers(Array.from(membersMap.values()))
  }, [groups, currentUser])
  
  // Calculate balances for all members
  const balances = calculateBalances(expenses, allMembers)
  
  // Calculate total amounts you owe and are owed
  const currentUserId = currentUser?.id
  const currentUserBalance = balances[currentUserId] || { balance: 0 }
  
  // If balance is negative, you owe money
  // If balance is positive, you are owed money
  const totalOwed = currentUserBalance.balance < 0 ? Math.abs(currentUserBalance.balance) : 0
  const totalOwedToYou = currentUserBalance.balance > 0 ? currentUserBalance.balance : 0

  return (
    <Row className={`justify-content-center mb-4 ${isMobile ? 'mx-2' : ''}`}>
      <Col xs={6} sm={6} md={5} lg={4} className={isMobile ? "pe-2" : "mb-3"}>
        <Card 
          style={{
            ...styles.balanceCard, 
            background: 'linear-gradient(135deg, #374151 0%, #4B5563 100%)',
            boxShadow: `0 4px 12px ${colors.isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'}`
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          <Card.Body className={`d-flex align-items-center justify-content-between ${isMobile ? 'p-3' : 'p-4'}`}>
            <div>
              <h2 style={{...styles.balanceAmount, fontSize: isMobile ? '1.5rem' : '2rem'}}>
                {totalOwed > 0 ? `-₹${totalOwed.toFixed(2)}` : '₹0.00'}
              </h2>
              <p style={{...styles.balanceLabel, fontSize: isMobile ? '0.8rem' : '0.9rem'}}>You owe</p>
            </div>
            {!isMobile && <div>
              <i className="bi bi-trending-up" style={styles.balanceIcon}></i>
            </div>}
          </Card.Body>
        </Card>
      </Col>
      <Col xs={6} sm={6} md={5} lg={4} className={isMobile ? "ps-2" : "mb-3"}>
        <Card 
          style={{
            ...styles.balanceCard, 
            background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
            boxShadow: `0 4px 12px ${colors.isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'}`
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          <Card.Body className={`d-flex align-items-center justify-content-between ${isMobile ? 'p-3' : 'p-4'}`}>
            <div>
              <h2 style={{...styles.balanceAmount, fontSize: isMobile ? '1.5rem' : '2rem'}}>₹{totalOwedToYou.toFixed(2)}</h2>
              <p style={{...styles.balanceLabel, fontSize: isMobile ? '0.8rem' : '0.9rem'}}>You are owed</p>
            </div>
            {!isMobile && <div>
              <i className="bi bi-trending-down" style={styles.balanceIcon}></i>
            </div>}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

export default BalanceCards