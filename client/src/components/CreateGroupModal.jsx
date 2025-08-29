import { useState } from 'react'
import { Modal, Form, Button, InputGroup } from 'react-bootstrap'

const styles = {
  modalHeader: {
    borderBottom: '1px solid #E5E7EB',
    paddingBottom: '1rem'
  },
  modalTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1F2937',
    margin: '0'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    color: '#6B7280',
    cursor: 'pointer',
    padding: '0',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    transition: 'all 0.2s ease'
  },
  formLabel: {
    fontWeight: '500',
    color: '#374151',
    marginBottom: '0.5rem'
  },
  formControl: {
    borderRadius: '8px',
    border: '1px solid #D1D5DB',
    padding: '12px 16px',
    fontSize: '1rem',
    transition: 'border-color 0.2s ease',
    marginBottom: '1rem'
  },
  memberItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    backgroundColor: '#F9FAFB',
    borderRadius: '8px',
    marginBottom: '0.5rem',
    border: '1px solid #E5E7EB'
  },
  memberName: {
    fontWeight: '500',
    color: '#1F2937',
    margin: '0'
  },
  memberEmail: {
    fontSize: '0.875rem',
    color: '#6B7280',
    margin: '0'
  },
  removeButton: {
    background: 'none',
    border: 'none',
    color: '#EF4444',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    transition: 'background-color 0.2s ease'
  },
  addMemberButton: {
    backgroundColor: '#F3F4F6',
    border: '1px dashed #D1D5DB',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#6B7280',
    fontWeight: '500',
    width: '100%',
    marginBottom: '1rem',
    transition: 'all 0.2s ease'
  },
  createButton: {
    backgroundColor: '#22C55E',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontWeight: '600',
    color: '#FFFFFF',
    width: '100%',
    transition: 'background-color 0.2s ease'
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #D1D5DB',
    borderRadius: '8px',
    padding: '12px 24px',
    fontWeight: '500',
    color: '#6B7280',
    width: '100%',
    marginRight: '0.5rem',
    transition: 'all 0.2s ease'
  }
}

function CreateGroupModal({ show, onHide }) {
  const [groupName, setGroupName] = useState('')
  const [groupDescription, setGroupDescription] = useState('')
  const [members, setMembers] = useState([
    { id: 1, name: 'You', email: 'you@example.com', isOwner: true }
  ])
  const [newMemberName, setNewMemberName] = useState('')
  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [showAddMember, setShowAddMember] = useState(false)

  const handleAddMember = () => {
    if (newMemberName && newMemberEmail) {
      const newMember = {
        id: Date.now(),
        name: newMemberName,
        email: newMemberEmail,
        isOwner: false
      }
      setMembers([...members, newMember])
      setNewMemberName('')
      setNewMemberEmail('')
      setShowAddMember(false)
    }
  }

  const handleRemoveMember = (memberId) => {
    setMembers(members.filter(member => member.id !== memberId))
  }

  const handleCreateGroup = () => {
    if (groupName.trim()) {
      console.log('Creating group:', {
        name: groupName,
        description: groupDescription,
        members: members
      })
      
      setGroupName('')
      setGroupDescription('')
      setMembers([{ id: 1, name: 'You', email: 'you@example.com', isOwner: true }])
      setShowAddMember(false)
      onHide()
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered size="md">
      <Modal.Header style={styles.modalHeader} className="d-flex justify-content-between align-items-center">
        <h4 style={styles.modalTitle}>Create New Group</h4>
        <button 
          style={styles.closeButton}
          onClick={onHide}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#F3F4F6'
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent'
          }}
        >
          <i className="bi bi-x"></i>
        </button>
      </Modal.Header>
      
      <Modal.Body className="p-4">
        <Form>
          <Form.Group className="mb-3">
            <Form.Label style={styles.formLabel}>Group Name *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter group name (e.g., Weekend Trip)"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              style={styles.formControl}
              onFocus={(e) => {
                e.target.style.borderColor = '#22C55E'
                e.target.style.boxShadow = '0 0 0 3px rgba(34, 197, 94, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#D1D5DB'
                e.target.style.boxShadow = 'none'
              }}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label style={styles.formLabel}>Description (Optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Add a description for your group"
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              style={styles.formControl}
              onFocus={(e) => {
                e.target.style.borderColor = '#22C55E'
                e.target.style.boxShadow = '0 0 0 3px rgba(34, 197, 94, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#D1D5DB'
                e.target.style.boxShadow = 'none'
              }}
            />
          </Form.Group>

          <div className="mb-3">
            <Form.Label style={styles.formLabel}>Members ({members.length})</Form.Label>
            
            {members.map(member => (
              <div key={member.id} style={styles.memberItem}>
                <div>
                  <p style={styles.memberName}>
                    {member.name} {member.isOwner && '(You)'}
                  </p>
                  <p style={styles.memberEmail}>{member.email}</p>
                </div>
                {!member.isOwner && (
                  <button
                    style={styles.removeButton}
                    onClick={() => handleRemoveMember(member.id)}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#FEE2E2'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent'
                    }}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                )}
              </div>
            ))}

            {showAddMember ? (
              <div style={{ ...styles.memberItem, flexDirection: 'column', alignItems: 'stretch' }}>
                <Form.Control
                  type="text"
                  placeholder="Member name"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="mb-2"
                  style={{ ...styles.formControl, marginBottom: '0.5rem' }}
                />
                <Form.Control
                  type="email"
                  placeholder="Member email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="mb-2"
                  style={{ ...styles.formControl, marginBottom: '0.5rem' }}
                />
                <div className="d-flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleAddMember}
                    style={{
                      backgroundColor: '#22C55E',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: '500'
                    }}
                  >
                    Add
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={() => {
                      setShowAddMember(false)
                      setNewMemberName('')
                      setNewMemberEmail('')
                    }}
                    style={{
                      borderRadius: '6px',
                      fontWeight: '500'
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <button
                style={styles.addMemberButton}
                onClick={() => setShowAddMember(true)}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#E5E7EB'
                  e.target.style.borderColor = '#22C55E'
                  e.target.style.color = '#22C55E'
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#F3F4F6'
                  e.target.style.borderColor = '#D1D5DB'
                  e.target.style.color = '#6B7280'
                }}
              >
                <i className="bi bi-plus-lg me-2"></i>Add Member
              </button>
            )}
          </div>
        </Form>
      </Modal.Body>

      <Modal.Footer className="d-flex gap-2 p-4">
        <Button
          style={styles.cancelButton}
          onClick={onHide}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#F9FAFB'
            e.target.style.borderColor = '#9CA3AF'
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#FFFFFF'
            e.target.style.borderColor = '#D1D5DB'
          }}
        >
          Cancel
        </Button>
        <Button
          style={styles.createButton}
          onClick={handleCreateGroup}
          disabled={!groupName.trim()}
          onMouseEnter={(e) => {
            if (!e.target.disabled) {
              e.target.style.backgroundColor = '#16A34A'
            }
          }}
          onMouseLeave={(e) => {
            if (!e.target.disabled) {
              e.target.style.backgroundColor = '#22C55E'
            }
          }}
        >
          Create Group
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default CreateGroupModal