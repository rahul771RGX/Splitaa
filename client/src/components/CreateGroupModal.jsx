import { useState } from 'react'
import { Modal, Form, Button, InputGroup } from 'react-bootstrap'
import { useTheme } from '../contexts/ThemeContext'
import { createGroup } from '../services/api'
import { useNavigate } from 'react-router-dom'

const styles = {
  modalHeader: {
    borderBottom: '1px solid',
    paddingBottom: '1rem'
  },
  modalTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    margin: '0'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
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
    marginBottom: '0.5rem'
  },
  formControl: {
    borderRadius: '8px',
    border: '1px solid',
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
    backgroundColor: 'transparent',
    borderRadius: '8px',
    marginBottom: '0.5rem',
    border: '1px solid'
  },
  memberName: {
    fontWeight: '500',
    margin: '0'
  },
  memberEmail: {
    fontSize: '0.875rem',
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
    border: '1px dashed',
    borderRadius: '8px',
    padding: '12px 16px',
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
    border: '1px solid',
    borderRadius: '8px',
    padding: '12px 24px',
    fontWeight: '500',
    width: '100%',
    marginRight: '0.5rem',
    transition: 'all 0.2s ease'
  }
}

function CreateGroupModal({ show, onHide }) {
  const { colors } = useTheme()
  const navigate = useNavigate()
  const [groupName, setGroupName] = useState('')
  const [groupDescription, setGroupDescription] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState('')

  const handleCreateGroup = async () => {
    if (groupName.trim()) {
      setIsCreating(true)
      setError('')
      
      try {
        const groupData = {
          name: groupName,
          description: groupDescription,
          members: [] // Empty array - backend will add creator automatically
        }
        
        console.log('Creating group:', groupData)
        
        const result = await createGroup(groupData)
        console.log('✅ Group created successfully:', result)
        
        // Reset form
        setGroupName('')
        setGroupDescription('')
        setIsCreating(false)
        
        // Close modal
        onHide()
        
        // Optionally navigate to groups page or refresh
        // navigate('/groups')
        // Or trigger a refresh of the groups list
        window.location.reload() // Simple way to refresh and show new group
      } catch (err) {
        console.error('❌ Error creating group:', err)
        setError(err.message || 'Failed to create group. Please try again.')
        setIsCreating(false)
      }
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered size="md">
      <div style={{ backgroundColor: colors.bg.card }}>
        <Modal.Header style={{
          ...styles.modalHeader,
          borderBottomColor: colors.border.primary,
          backgroundColor: colors.bg.card
        }} className="d-flex justify-content-between align-items-center">
          <h4 style={{
            ...styles.modalTitle,
            color: colors.text.primary
          }}>Create New Group</h4>
          <button 
            style={{
              ...styles.closeButton,
              color: colors.text.secondary
            }}
            onClick={onHide}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = colors.bg.tertiary
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent'
            }}
          >
            <i className="bi bi-x"></i>
          </button>
        </Modal.Header>
        
        <Modal.Body className="p-4" style={{ backgroundColor: colors.bg.card }}>
          {error && (
            <div style={{
              padding: '12px',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label style={{
                ...styles.formLabel,
                color: colors.text.primary
              }}>Group Name *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter group name (e.g., Weekend Trip)"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                style={{
                  ...styles.formControl,
                  borderColor: colors.border.primary,
                  backgroundColor: colors.bg.tertiary,
                  color: colors.text.primary
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#22C55E'
                  e.target.style.boxShadow = '0 0 0 3px rgba(34, 197, 94, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = colors.border.primary
                  e.target.style.boxShadow = 'none'
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{
                ...styles.formLabel,
                color: colors.text.primary
              }}>Description (Optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Add a description for your group"
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                style={{
                  ...styles.formControl,
                  borderColor: colors.border.primary,
                  backgroundColor: colors.bg.tertiary,
                  color: colors.text.primary
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#22C55E'
                  e.target.style.boxShadow = '0 0 0 3px rgba(34, 197, 94, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = colors.border.primary
                  e.target.style.boxShadow = 'none'
                }}
              />
            </Form.Group>

           
          </Form>
        </Modal.Body>

        <Modal.Footer className="d-flex gap-2 p-4" style={{ backgroundColor: colors.bg.card }}>
          <Button
            style={{
              ...styles.cancelButton,
              backgroundColor: colors.bg.secondary,
              borderColor: colors.border.primary,
              color: colors.text.secondary
            }}
            onClick={onHide}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = colors.bg.tertiary
              e.target.style.borderColor = colors.text.muted
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = colors.bg.secondary
              e.target.style.borderColor = colors.border.primary
            }}
          >
            Cancel
          </Button>
          <Button
            style={styles.createButton}
            onClick={handleCreateGroup}
            disabled={!groupName.trim() || isCreating}
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
            {isCreating ? 'Creating...' : 'Create Group'}
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  )
}

export default CreateGroupModal