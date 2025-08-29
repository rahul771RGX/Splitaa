import { Container, Card, Button, Badge, Row, Col } from 'react-bootstrap'
import DesktopNavbar from '../components/Navbar'
import BottomNavigation from '../components/BottomNavigation'
import CreateGroupModal from '../components/CreateGroupModal'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

const styles = {
  groupsPage: {
    minHeight: '100vh',
    backgroundColor: '#F8FAFC'
  },
  mainContent: {
    paddingTop: '2rem',
    paddingBottom: '6rem'
  },
  mainContentDesktop: {
    paddingTop: '3rem',
    paddingBottom: '3rem',
    maxWidth: '800px'
  },
  mainContentMobile: {
    paddingTop: '2.5rem',
    paddingBottom: '6rem',
    paddingLeft: '1rem',
    paddingRight: '1rem'
  },
  pageTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: '1.5rem'
  },
  groupCard: {
    borderRadius: '16px',
    border: 'none',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    marginBottom: '1rem',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
  },
  groupHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '0.5rem'
  },
  groupName: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1F2937',
    margin: '0'
  },
  groupMembers: {
    fontSize: '0.85rem',
    color: '#6B7280',
    margin: '0'
  },
  balanceSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '1rem'
  },
  balanceAmount: {
    fontSize: '1rem',
    fontWeight: '600'
  },
  positiveBalance: {
    color: '#22C55E'
  },
  negativeBalance: {
    color: '#EF4444'
  },
  neutralBalance: {
    color: '#6B7280'
  },
  settleButton: {
    backgroundColor: '#22C55E',
    border: 'none',
    borderRadius: '8px',
    padding: '6px 12px',
    fontSize: '0.85rem',
    fontWeight: '500',
    color: '#FFFFFF'
  },
  createGroupButton: {
    backgroundColor: '#22C55E',
    border: 'none',
    borderRadius: '12px',
    padding: '12px 24px',
    fontWeight: '600',
    color: '#FFFFFF',
    width: '100%',
    marginBottom: '2rem'
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem 1rem'
  },
  emptyIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#DCFCE7',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem'
  },
  groupIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#DCFCE7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '1rem'
  }
}

function Groups() {
  const isMobile = window.innerWidth < 768
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    if (searchParams.get('create') === 'true') {
      setShowCreateModal(true)
      searchParams.delete('create')
      setSearchParams(searchParams)
    }
  }, [searchParams, setSearchParams])

  const groups = [
    {
      id: 1,
      name: 'Weekend Trip',
      members: ['You', 'John', 'Sarah', 'Mike'],
      balance: 250.50,
      type: 'owed' 
    },
    {
      id: 2,
      name: 'Office Lunch',
      members: ['You', 'Alice', 'Bob', 'Carol', 'David'],
      balance: -120.25,
      type: 'owe' 
    },
    {
      id: 3,
      name: 'Roommate Expenses',
      members: ['You', 'Alex'],
      balance: 0,
      type: 'settled'
    },
    {
      id: 4,
      name: 'Birthday Party',
      members: ['You', 'Emma', 'James', 'Lisa'],
      balance: 75.00,
      type: 'owed'
    }
  ]

  const getBalanceColor = (balance, type) => {
    if (balance === 0) return styles.neutralBalance
    if (type === 'owed') return styles.positiveBalance
    return styles.negativeBalance
  }

  const getBalanceText = (balance, type) => {
    if (balance === 0) return 'Settled up'
    if (type === 'owed') return `You are owed ₹${balance.toFixed(2)}`
    return `You owe ₹${Math.abs(balance).toFixed(2)}`
  }

  return (
    <div style={styles.groupsPage}>
      <DesktopNavbar />

      <Container style={{
        ...styles.mainContent,
        ...(isMobile ? styles.mainContentMobile : styles.mainContentDesktop)
      }}>
        <h2 style={styles.pageTitle}>Your Groups</h2>

        <Button 
          style={styles.createGroupButton}
          onClick={() => setShowCreateModal(true)}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#16A34A'
            e.target.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#22C55E'
            e.target.style.transform = 'translateY(0)'
          }}
        >
          <i className="bi bi-plus-lg me-2"></i>Create New Group
        </Button>

        {groups.length > 0 ? (
          <div>
            {groups.map(group => (
              <Card 
                key={group.id}
                style={styles.groupCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.12)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)'
                }}
              >
                <Card.Body className="p-4">
                  <div style={styles.groupHeader}>
                    <div className="d-flex align-items-center">
                      <div style={styles.groupIcon}>
                        <i className="bi bi-people" style={{ color: '#22C55E', fontSize: '1.2rem' }}></i>
                      </div>
                      <div>
                        <h5 style={styles.groupName}>{group.name}</h5>
                        <p style={styles.groupMembers}>
                          {group.members.length} members: {group.members.join(', ')}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div style={styles.balanceSection}>
                    <div>
                      <span 
                        style={{
                          ...styles.balanceAmount,
                          ...getBalanceColor(group.balance, group.type)
                        }}
                      >
                        {getBalanceText(group.balance, group.type)}
                      </span>
                    </div>
                    {group.balance !== 0 && (
                      <Button 
                        size="sm" 
                        style={styles.settleButton}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#16A34A'
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#22C55E'
                        }}
                      >
                        Settle Up
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              <i className="bi bi-people" style={{ fontSize: '2rem', color: '#22C55E' }}></i>
            </div>
            <h4>No groups yet</h4>
            <p style={{ color: '#6B7280' }}>Create a group to start splitting expenses with friends</p>
          </div>
        )}
      </Container>

      <CreateGroupModal 
        show={showCreateModal} 
        onHide={() => setShowCreateModal(false)} 
      />

      <BottomNavigation />
    </div>
  )
}

export default Groups