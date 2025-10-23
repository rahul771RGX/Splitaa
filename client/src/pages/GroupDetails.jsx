import { Container, Card, Button, Modal, Form, Alert, Badge, ListGroup, Nav } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DesktopNavbar from '../components/Navbar'
import BottomNavigation from '../components/BottomNavigation'
import { useTheme } from '../contexts/ThemeContext'
import { calculateSettlements, formatCurrency } from '../services/calculations'
import { currentUser } from '../data/mockData'
import { 
  getGroupExpenses, 
  getGroupMembers, 
  addGroupMemberByEmail, 
  removeGroupMember,
  createExpense,
  updateExpense,
  deleteExpense,
  getGroup
} from '../services/api'

function GroupDetails() {
  const isMobile = window.innerWidth < 768
  const navigate = useNavigate()
  const { colors } = useTheme()
  
  const searchParams = new URLSearchParams(window.location.search)
  const groupIdFromUrl = searchParams.get('groupId')
  
  console.log('GroupDetails - groupIdFromUrl:', groupIdFromUrl)
  
  const [activeTab, setActiveTab] = useState('expenses')
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [groupMembers, setGroupMembers] = useState([])
  const [groupExpenses, setGroupExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [showAddMemberModal, setShowAddMemberModal] = useState(false)
  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [addMemberError, setAddMemberError] = useState('')
  
  const [showExpenseModal, setShowExpenseModal] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [expenseForm, setExpenseForm] = useState({
    description: '',
    amount: '',
    category: 'food',
    splitType: 'equal',
    paidBy: '',
    splits: []
  })

  useEffect(() => {
    if (groupIdFromUrl) {
      loadGroupData()
    } else {
      navigate('/groups')
    }
  }, [groupIdFromUrl])

  const loadGroupData = async () => {
    try {
      setLoading(true)
      console.log('Loading group data for ID:', groupIdFromUrl)
      
      const groupData = await getGroup(groupIdFromUrl)
      console.log('Group data response:', groupData)
      
      const members = await getGroupMembers(groupIdFromUrl)
      console.log('Members response:', members)
      
      const expenses = await getGroupExpenses(groupIdFromUrl)
      console.log('Expenses response:', expenses)
      
      // Handle different response structures
      const group = groupData?.data || groupData
      const membersList = members?.data || members || []
      const expensesList = expenses?.data || expenses || []
      
      console.log('Setting group:', group)
      setSelectedGroup(group)
      setGroupMembers(membersList)
      setGroupExpenses(expensesList)
      
      if (membersList && membersList.length > 0) {
        const currentMember = membersList.find(m => m.email === currentUser.email)
        if (currentMember) {
          setExpenseForm(prev => ({ ...prev, paidBy: currentMember.user_id || currentMember.id }))
        }
      }
    } catch (error) {
      console.error('Error loading group data:', error)
      console.error('Error details:', error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddMember = async () => {
    if (!newMemberEmail.trim()) {
      setAddMemberError('Please enter an email address')
      return
    }

    try {
      await addGroupMemberByEmail(groupIdFromUrl, newMemberEmail)
      setShowAddMemberModal(false)
      setNewMemberEmail('')
      setAddMemberError('')
      loadGroupData()
    } catch (error) {
      setAddMemberError(error.message || 'Failed to add member')
    }
  }

  const handleRemoveMember = async (memberId) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      try {
        await removeGroupMember(groupIdFromUrl, memberId)
        loadGroupData()
      } catch (error) {
        alert('Failed to remove member')
      }
    }
  }

  const handleOpenExpenseModal = (expense = null) => {
    if (expense) {
      setEditingExpense(expense)
      setExpenseForm({
        description: expense.description,
        amount: expense.amount,
        category: expense.category || 'food',
        splitType: expense.split_type || 'equal',
        paidBy: expense.paid_by,
        splits: expense.splits || []
      })
    } else {
      setEditingExpense(null)
      const currentMember = groupMembers.find(m => m.email === currentUser.email)
      setExpenseForm({
        description: '',
        amount: '',
        category: 'food',
        splitType: 'equal',
        paidBy: currentMember ? (currentMember.user_id || currentMember.id) : '',
        splits: []
      })
    }
    setShowExpenseModal(true)
  }

  const handleSaveExpense = async () => {
    if (!expenseForm.description || !expenseForm.amount || !expenseForm.paidBy) {
      alert('Please fill in all required fields')
      return
    }

    try {
      const expenseData = {
        group_id: parseInt(groupIdFromUrl),
        description: expenseForm.description,
        amount: parseFloat(expenseForm.amount),
        category: expenseForm.category,
        split_type: expenseForm.splitType,
        paid_by: parseInt(expenseForm.paidBy),
        splits: expenseForm.splitType === 'equal' 
          ? groupMembers.map(m => ({
              user_id: m.user_id || m.id,
              amount: parseFloat(expenseForm.amount) / groupMembers.length
            }))
          : expenseForm.splits
      }

      if (editingExpense) {
        await updateExpense(editingExpense.id, expenseData)
      } else {
        await createExpense(expenseData)
      }

      setShowExpenseModal(false)
      loadGroupData()
    } catch (error) {
      console.error('Error saving expense:', error)
      alert('Failed to save expense: ' + (error.message || 'Unknown error'))
    }
  }

  const handleDeleteExpense = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(expenseId)
        loadGroupData()
      } catch (error) {
        alert('Failed to delete expense')
      }
    }
  }

  // Calculate member balances
  const calculateMemberBalances = () => {
    const balances = {}
    
    groupMembers.forEach(member => {
      const userId = member.user_id || member.id
      balances[userId] = {
        member: member,
        balance: 0,
        paid: 0,
        owe: 0
      }
    })

    groupExpenses.forEach(expense => {
      const paidBy = parseInt(expense.paid_by)
      const amount = parseFloat(expense.amount)
      
      if (balances[paidBy]) {
        balances[paidBy].paid += amount
      }
      
      if (expense.splits && expense.splits.length > 0) {
        expense.splits.forEach(split => {
          const userId = parseInt(split.user_id)
          const splitAmount = parseFloat(split.amount)
          if (balances[userId]) {
            balances[userId].owe += splitAmount
          }
        })
      }
    })

    // Calculate net balance (positive = owed to you, negative = you owe)
    Object.keys(balances).forEach(userId => {
      balances[userId].balance = balances[userId].paid - balances[userId].owe
    })

    return Object.values(balances)
  }

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?'
  }

  const getAvatarColor = (name) => {
    const colorList = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899']
    const index = (name?.length || 0) % colorList.length
    return colorList[index]
  }

  const getGroupBannerGradient = (groupId, groupName) => {
    const gradients = [
      { colors: ['#FEF3C7', '#FDE68A'], name: 'yellow' },      // Yellow
      { colors: ['#DBEAFE', '#BFDBFE'], name: 'blue' },        // Blue
      { colors: ['#FCE7F3', '#FBCFE8'], name: 'pink' },        // Pink
      { colors: ['#D1FAE5', '#A7F3D0'], name: 'green' },       // Green
      { colors: ['#E0E7FF', '#C7D2FE'], name: 'indigo' },      // Indigo
      { colors: ['#FED7AA', '#FDBA74'], name: 'orange' },      // Orange
      { colors: ['#E9D5FF', '#D8B4FE'], name: 'purple' },      // Purple
      { colors: ['#FEE2E2', '#FECACA'], name: 'red' },         // Red
    ]
    
    const seed = groupId || groupName?.length || 0
    const index = seed % gradients.length
    const gradient = gradients[index]
    
    return `linear-gradient(135deg, ${gradient.colors[0]} 0%, ${gradient.colors[1]} 100%)`
  }

  const getMemberById = (userId) => {
    return groupMembers.find(m => (m.user_id || m.id) === parseInt(userId))
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: colors.bg.primary }}>
        <DesktopNavbar />
        <Container style={{ paddingTop: '3rem', textAlign: 'center' }}>
          <div style={{ color: colors.text.primary }}>Loading group data...</div>
        </Container>
        <BottomNavigation />
      </div>
    )
  }

  if (!selectedGroup) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: colors.bg.primary }}>
        <DesktopNavbar />
        <Container style={{ paddingTop: '3rem', textAlign: 'center' }}>
          <h4 style={{ color: colors.text.primary }}>Group not found</h4>
          <Button onClick={() => navigate('/groups')} className="mt-3">Go to Groups</Button>
        </Container>
        <BottomNavigation />
      </div>
    )
  }

  const memberBalances = calculateMemberBalances()

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.bg.primary }}>
      <DesktopNavbar />

      <Container style={{
        paddingTop: isMobile ? '1rem' : '2rem',
        paddingBottom: '6rem',
        maxWidth: isMobile ? '100%' : '900px',
        padding: 0
      }}>
        {/* Header with Banner Image */}
        <div style={{
          background: getGroupBannerGradient(selectedGroup?.id, selectedGroup?.name),
          padding: '1.5rem 1.5rem 1rem',
          position: 'relative',
          minHeight: '120px',
          display: 'flex',
          alignItems: 'flex-end'
        }}>
          {/* Back Button */}
          <Button 
            variant="light"
            onClick={() => navigate('/groups')}
            style={{
              position: 'absolute',
              top: '1rem',
              left: '1rem',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255,255,255,0.9)',
              border: 'none'
            }}
          >
            <i className="bi bi-arrow-left" style={{ fontSize: '1.2rem' }}></i>
          </Button>

          {/* Group Name */}
          <h2 style={{
            color: '#1F2937',
            fontWeight: '700',
            fontSize: '1.8rem',
            marginBottom: 0,
            zIndex: 1
          }}>
            {selectedGroup.name}
          </h2>
        </div>

        {/* Tabs Navigation */}
        <Nav variant="tabs" style={{
          backgroundColor: colors.bg.card,
          borderBottom: `2px solid ${colors.border.primary}`,
          padding: '0 1rem'
        }}>
          <Nav.Item>
            <Nav.Link
              active={activeTab === 'expenses'}
              onClick={() => setActiveTab('expenses')}
              style={{
                color: activeTab === 'expenses' ? '#F97316' : colors.text.secondary,
                borderBottom: activeTab === 'expenses' ? '3px solid #F97316' : 'none',
                fontWeight: activeTab === 'expenses' ? '600' : '400',
                backgroundColor: 'transparent',
                border: 'none',
                padding: '1rem 1.5rem'
              }}
            >
              <i className="bi bi-pie-chart me-2"></i>
              Expenses
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              active={activeTab === 'members'}
              onClick={() => setActiveTab('members')}
              style={{
                color: activeTab === 'members' ? '#F97316' : colors.text.secondary,
                borderBottom: activeTab === 'members' ? '3px solid #F97316' : 'none',
                fontWeight: activeTab === 'members' ? '600' : '400',
                backgroundColor: 'transparent',
                border: 'none',
                padding: '1rem 1.5rem'
              }}
            >
              <i className="bi bi-people me-2"></i>
              Members
            </Nav.Link>
          </Nav.Item>
        </Nav>

        {/* Tab Content */}
        <div style={{ padding: '1.5rem' }}>
          {/* EXPENSES TAB */}
          {activeTab === 'expenses' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 style={{ color: colors.text.primary, marginBottom: 0, fontWeight: '600' }}>
                  All Expenses
                </h5>
              </div>

              {groupExpenses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <i className="bi bi-receipt" style={{ fontSize: '4rem', color: colors.text.secondary, marginBottom: '1rem', display: 'block' }}></i>
                  <h5 style={{ color: colors.text.primary, marginBottom: '0.5rem' }}>No expenses yet</h5>
                  <p style={{ color: colors.text.secondary, marginBottom: '1.5rem' }}>
                    Add your first expense to start tracking
                  </p>
                </div>
              ) : (
                <div>
                  {groupExpenses.map((expense) => {
                    const paidByMember = getMemberById(expense.paid_by)
                    return (
                      <Card 
                        key={expense.id}
                        className="mb-3"
                        style={{
                          backgroundColor: colors.bg.card,
                          border: `1px solid ${colors.border.primary}`,
                          borderRadius: '12px'
                        }}
                      >
                        <Card.Body style={{ padding: '1rem' }}>
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <h6 style={{ color: colors.text.primary, fontWeight: '600', marginBottom: '0.5rem' }}>
                                {expense.description}
                              </h6>
                              <div style={{ fontSize: '0.85rem', color: colors.text.secondary }}>
                                <div className="mb-1">
                                  <i className="bi bi-person-circle me-1"></i>
                                  Paid by <strong>{paidByMember?.name || 'Unknown'}</strong>
                                </div>
                                <div className="mb-1">
                                  <i className="bi bi-tag me-1"></i>
                                  {expense.category} · <i className="bi bi-calendar me-1"></i>
                                  {new Date(expense.created_at || expense.date).toLocaleDateString()}
                                </div>
                                <div>
                                  <Badge bg={expense.split_type === 'equal' ? 'success' : 'primary'} style={{ fontSize: '0.75rem' }}>
                                    {expense.split_type === 'equal' ? 'Equal Split' : 'Custom Split'}
                                  </Badge>
                                  {expense.split_type === 'equal' && groupMembers.length > 0 && (
                                    <span className="ms-2" style={{ fontSize: '0.75rem' }}>
                                      {formatCurrency(expense.amount / groupMembers.length)} per person
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="ms-3 text-end">
                              <div style={{ 
                                fontSize: '1.25rem', 
                                fontWeight: '700',
                                color: '#F97316',
                                marginBottom: '0.5rem'
                              }}>
                                {formatCurrency(expense.amount)}
                              </div>
                              <div>
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  className="me-1"
                                  onClick={() => handleOpenExpenseModal(expense)}
                                  style={{ borderRadius: '6px', fontSize: '0.75rem' }}
                                >
                                  <i className="bi bi-pencil"></i>
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => handleDeleteExpense(expense.id)}
                                  style={{ borderRadius: '6px', fontSize: '0.75rem' }}
                                >
                                  <i className="bi bi-trash"></i>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* MEMBERS TAB */}
          {activeTab === 'members' && (
            <div>
              <p style={{ color: colors.text.secondary, marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                Total: {groupMembers.length} {groupMembers.length === 1 ? 'member' : 'members'}
              </p>

              {groupMembers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <i className="bi bi-people" style={{ fontSize: '4rem', color: colors.text.secondary, marginBottom: '1rem', display: 'block' }}></i>
                  <h5 style={{ color: colors.text.primary, marginBottom: '0.5rem' }}>It seems like you're the first one here.</h5>
                  <p style={{ color: colors.text.secondary, marginBottom: '1.5rem' }}>
                    Nice to be with someone.
                  </p>
                </div>
              ) : (
                <div>
                  {memberBalances.map((memberData) => {
                    const balance = memberData.balance
                    const member = memberData.member
                    const memberId = member.user_id || member.id
                    
                    return (
                      <Card
                        key={memberId}
                        className="mb-3"
                        style={{
                          backgroundColor: colors.bg.card,
                          border: `1px solid ${colors.border.primary}`,
                          borderRadius: '12px'
                        }}
                      >
                        <Card.Body style={{ padding: '1rem' }}>
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center flex-grow-1">
                              <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '50%',
                                backgroundColor: getAvatarColor(member.name),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#FFFFFF',
                                fontWeight: '700',
                                fontSize: '1.25rem',
                                marginRight: '1rem',
                                flexShrink: 0
                              }}>
                                {getInitials(member.name)}
                              </div>
                              <div className="flex-grow-1">
                                <h6 style={{ color: colors.text.primary, marginBottom: '0.25rem', fontWeight: '600', fontSize: '1rem' }}>
                                  {member.name}
                                  {member.email === currentUser.email && (
                                    <Badge bg="warning" className="ms-2" style={{ fontSize: '0.7rem' }}>me</Badge>
                                  )}
                                  {member.role === 'admin' && (
                                    <Badge bg="danger" className="ms-2" style={{ fontSize: '0.7rem' }}>Host</Badge>
                                  )}
                                </h6>
                                <p style={{ color: colors.text.secondary, marginBottom: 0, fontSize: '0.85rem' }}>
                                  {member.email}
                                </p>
                                {/* Balance Info */}
                                <div style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                                  {balance > 0 ? (
                                    <span style={{ color: '#22C55E', fontWeight: '600' }}>
                                      <i className="bi bi-arrow-down-circle me-1"></i>
                                      Gets back {formatCurrency(Math.abs(balance))}
                                    </span>
                                  ) : balance < 0 ? (
                                    <span style={{ color: '#EF4444', fontWeight: '600' }}>
                                      <i className="bi bi-arrow-up-circle me-1"></i>
                                      Owes {formatCurrency(Math.abs(balance))}
                                    </span>
                                  ) : (
                                    <span style={{ color: colors.text.secondary }}>
                                      <i className="bi bi-check-circle me-1"></i>
                                      Settled up
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    )
                  })}
                </div>
              )}

              {/* Add Members Button */}
              <div className="d-grid gap-2 mt-4">
                <Button
                  size="lg"
                  style={{
                    backgroundColor: '#F97316',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: '600',
                    padding: '1rem'
                  }}
                  onClick={() => setShowAddMemberModal(true)}
                >
                  <i className="bi bi-person-plus me-2"></i>
                  Add members
                </Button>
                <Button
                  size="lg"
                  variant="light"
                  style={{
                    borderRadius: '12px',
                    fontWeight: '600',
                    padding: '1rem',
                    color: '#F97316',
                    border: `1px solid ${colors.border.primary}`
                  }}
                >
                  <i className="bi bi-share me-2"></i>
                  Share event invitation
                </Button>
              </div>
            </div>
          )}
        </div>
      </Container>

      {/* Floating Action Button */}
      <div style={{
        position: 'fixed',
        bottom: isMobile ? '100px' : '5rem',
        right: '2rem',
        zIndex: 1000
      }}>
        <Button
          onClick={() => handleOpenExpenseModal()}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#F97316',
            border: 'none',
            boxShadow: '0 4px 12px rgba(249, 115, 22, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem'
          }}
        >
          <i className="bi bi-plus"></i>
        </Button>
      </div>

      {/* Add Member Modal */}
      <Modal show={showAddMemberModal} onHide={() => setShowAddMemberModal(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: colors.bg.card, borderBottom: `1px solid ${colors.border.primary}` }}>
          <Modal.Title style={{ color: colors.text.primary }}>
            <i className="bi bi-person-plus me-2"></i>
            Add Member to Group
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: colors.bg.card }}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: colors.text.primary, fontWeight: '600' }}>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter member's email address"
                value={newMemberEmail}
                onChange={(e) => {
                  setNewMemberEmail(e.target.value)
                  setAddMemberError('')
                }}
                isInvalid={!!addMemberError}
                style={{
                  backgroundColor: colors.bg.tertiary,
                  border: `1px solid ${colors.border.primary}`,
                  color: colors.text.primary
                }}
              />
              <Form.Control.Feedback type="invalid">
                {addMemberError}
              </Form.Control.Feedback>
            </Form.Group>
            <Alert variant="info" style={{ backgroundColor: colors.bg.tertiary, border: `1px solid ${colors.border.primary}` }}>
              <small style={{ color: colors.text.primary }}>
                <i className="bi bi-info-circle me-2"></i>
                The member must have an account with this email address
              </small>
            </Alert>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: colors.bg.card, borderTop: `1px solid ${colors.border.primary}` }}>
          <Button variant="secondary" onClick={() => setShowAddMemberModal(false)}>
            Cancel
          </Button>
          <Button 
            style={{
              backgroundColor: '#F97316',
              border: 'none'
            }}
            onClick={handleAddMember}
          >
            <i className="bi bi-person-plus me-2"></i>
            Add Member
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add/Edit Expense Modal */}
      <Modal show={showExpenseModal} onHide={() => setShowExpenseModal(false)} centered size="lg">
        <Modal.Header closeButton style={{ backgroundColor: colors.bg.card, borderBottom: `1px solid ${colors.border.primary}` }}>
          <Modal.Title style={{ color: colors.text.primary }}>
            <i className="bi bi-receipt me-2"></i>
            {editingExpense ? 'Edit Expense' : 'Add New Expense'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: colors.bg.card }}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: colors.text.primary, fontWeight: '600' }}>
                Description <span style={{ color: '#EF4444' }}>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="What's this expense for?"
                value={expenseForm.description}
                onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})}
                style={{
                  backgroundColor: colors.bg.tertiary,
                  border: `1px solid ${colors.border.primary}`,
                  color: colors.text.primary
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: colors.text.primary, fontWeight: '600' }}>
                Amount <span style={{ color: '#EF4444' }}>*</span>
              </Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                placeholder="0.00"
                value={expenseForm.amount}
                onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
                style={{
                  backgroundColor: colors.bg.tertiary,
                  border: `1px solid ${colors.border.primary}`,
                  color: colors.text.primary
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: colors.text.primary, fontWeight: '600' }}>Category</Form.Label>
              <Form.Select
                value={expenseForm.category}
                onChange={(e) => setExpenseForm({...expenseForm, category: e.target.value})}
                style={{
                  backgroundColor: colors.bg.tertiary,
                  border: `1px solid ${colors.border.primary}`,
                  color: colors.text.primary
                }}
              >
                <option value="food">🍽️ Food & Drinks</option>
                <option value="transport">🚗 Transport</option>
                <option value="entertainment">🎬 Entertainment</option>
                <option value="shopping">🛍️ Shopping</option>
                <option value="accommodation">🏨 Accommodation</option>
                <option value="utilities">💡 Utilities</option>
                <option value="other">📦 Other</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: colors.text.primary, fontWeight: '600' }}>
                Paid By <span style={{ color: '#EF4444' }}>*</span>
              </Form.Label>
              <Form.Select
                value={expenseForm.paidBy}
                onChange={(e) => setExpenseForm({...expenseForm, paidBy: e.target.value})}
                style={{
                  backgroundColor: colors.bg.tertiary,
                  border: `1px solid ${colors.border.primary}`,
                  color: colors.text.primary
                }}
              >
                <option value="">Select who paid</option>
                {groupMembers.map(member => (
                  <option key={member.user_id || member.id} value={member.user_id || member.id}>
                    {member.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: colors.text.primary, fontWeight: '600' }}>Split Type</Form.Label>
              <div className="d-flex gap-3">
                <Button
                  variant={expenseForm.splitType === 'equal' ? 'primary' : 'outline-secondary'}
                  className="flex-grow-1"
                  onClick={() => setExpenseForm({...expenseForm, splitType: 'equal'})}
                  style={{
                    backgroundColor: expenseForm.splitType === 'equal' ? '#F97316' : 'transparent',
                    borderColor: expenseForm.splitType === 'equal' ? '#F97316' : colors.border.primary,
                    color: expenseForm.splitType === 'equal' ? '#FFFFFF' : colors.text.primary
                  }}
                >
                  <i className="bi bi-people me-2"></i>
                  Equal Split
                </Button>
                <Button
                  variant={expenseForm.splitType === 'custom' ? 'primary' : 'outline-secondary'}
                  className="flex-grow-1"
                  onClick={() => setExpenseForm({...expenseForm, splitType: 'custom'})}
                  style={{
                    backgroundColor: expenseForm.splitType === 'custom' ? '#F97316' : 'transparent',
                    borderColor: expenseForm.splitType === 'custom' ? '#F97316' : colors.border.primary,
                    color: expenseForm.splitType === 'custom' ? '#FFFFFF' : colors.text.primary
                  }}
                >
                  <i className="bi bi-sliders me-2"></i>
                  Custom Split
                </Button>
              </div>
            </Form.Group>

            {expenseForm.splitType === 'equal' && expenseForm.amount && groupMembers.length > 0 && (
              <Alert variant="info" style={{ backgroundColor: colors.bg.tertiary, border: `1px solid ${colors.border.primary}` }}>
                <small style={{ color: colors.text.primary }}>
                  <i className="bi bi-info-circle me-2"></i>
                  This expense will be split equally among all {groupMembers.length} members
                  <strong className="ms-2">
                    ({formatCurrency(parseFloat(expenseForm.amount) / groupMembers.length)} per person)
                  </strong>
                </small>
              </Alert>
            )}

            {expenseForm.splitType === 'custom' && (
              <Alert variant="warning" style={{ backgroundColor: colors.bg.tertiary, border: `1px solid ${colors.border.primary}` }}>
                <small style={{ color: colors.text.primary }}>
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Custom split feature coming soon! For now, please use equal split.
                </small>
              </Alert>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: colors.bg.card, borderTop: `1px solid ${colors.border.primary}` }}>
          <Button variant="secondary" onClick={() => setShowExpenseModal(false)}>
            Cancel
          </Button>
          <Button 
            style={{
              backgroundColor: '#22C55E',
              border: 'none'
            }}
            onClick={handleSaveExpense}
            disabled={!expenseForm.description || !expenseForm.amount || !expenseForm.paidBy || expenseForm.splitType === 'custom'}
          >
            <i className="bi bi-check-circle me-2"></i>
            {editingExpense ? 'Update Expense' : 'Add Expense'}
          </Button>
        </Modal.Footer>
      </Modal>

      <BottomNavigation />
    </div>
  )
}

export default GroupDetails
