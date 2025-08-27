import { Button } from 'react-bootstrap'
import CreateGroupModal from './CreateGroupModal'
import { useState } from 'react'

const styles = {
  noEventsSection: {
    maxWidth: '400px',
    margin: '0 auto',
    textAlign: 'center'
  },
  emptyStateIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#DCFCE7',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem auto'
  },
  emptyStateIconMobile: {
    width: '60px',
    height: '60px'
  },
  calendarIcon: {
    fontSize: '2rem',
    color: '#22C55E'
  },
  calendarIconMobile: {
    fontSize: '1.5rem'
  },
  noEventsTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1F2937',
    margin: '0 0 1rem 0'
  },
  noEventsTitleMobile: {
    fontSize: '1.25rem'
  },
  noEventsSubtitle: {
    color: '#6B7280',
    fontSize: '1rem',
    margin: '0 0 1.5rem 0'
  },
  btnCreateEvent: {
    backgroundColor: '#22C55E',
    border: 'none',
    borderRadius: '50px',
    padding: '12px 32px',
    fontWeight: '600',
    color: '#FFFFFF',
    transition: 'all 0.3s ease',
    fontSize: '1rem',
    marginBottom: '1.5rem'
  },
  joinEventsText: {
    color: '#6B7280',
    fontSize: '0.9rem',
    margin: '0 0 1rem 0'
  },
  btnScanQr: {
    border: '1px solid #E5E7EB',
    color: '#6B7280',
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '10px 20px',
    fontWeight: '500',
    transition: 'all 0.3s ease'
  }
}

function EmptyState() {
  const isMobile = window.innerWidth < 768
  const [showCreateModal, setShowCreateModal] = useState(false)

  return (
    <>
      <div style={{...styles.noEventsSection, padding: isMobile ? '2rem 1rem' : '3rem 1rem'}}>
        <div style={{
          ...styles.emptyStateIcon,
          ...(isMobile ? styles.emptyStateIconMobile : {})
        }}>
          <i 
            className="bi bi-calendar-event" 
            style={{
              ...styles.calendarIcon,
              ...(isMobile ? styles.calendarIconMobile : {})
            }}
          ></i>
        </div>
        <h3 style={{
          ...styles.noEventsTitle,
          ...(isMobile ? styles.noEventsTitleMobile : {})
        }}>
          No event yet
        </h3>
        <p style={styles.noEventsSubtitle}>
          Create a new event to track and split your group costs
        </p>
        
        <Button 
          style={styles.btnCreateEvent}
          className={isMobile ? "mb-3" : ""}
          onClick={() => setShowCreateModal(true)}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#16A34A'
            e.target.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#22C55E'
            e.target.style.transform = 'translateY(0)'
          }}
        >
          <i className="bi bi-plus-lg me-2"></i>Create new event
        </Button>
        
        <div>
          <p style={{...styles.joinEventsText, fontSize: isMobile ? '0.85rem' : '0.9rem'}}>Or join events by</p>
          <Button 
            variant="outline-secondary" 
            style={{...styles.btnScanQr, padding: isMobile ? '8px 16px' : '10px 20px', fontSize: isMobile ? '0.85rem' : '1rem'}}
            onClick={() => alert('QR Scanner functionality coming soon!')}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#DCFCE7'
              e.target.style.borderColor = '#22C55E'
              e.target.style.color = '#22C55E'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#FFFFFF'
              e.target.style.borderColor = '#E5E7EB'
              e.target.style.color = '#6B7280'
            }}
          >
            <i className="bi bi-qr-code me-2"></i>Scan event QR
          </Button>
        </div>
      </div>

      <CreateGroupModal 
        show={showCreateModal} 
        onHide={() => setShowCreateModal(false)} 
      />
    </>
  )
}

export default EmptyState