import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn, useUser } from '@clerk/clerk-react'
import { useEffect } from 'react'

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export function ClerkAuthProvider({ children }) {
  if (!clerkPubKey) {
    console.warn('Clerk Publishable Key not found. Clerk authentication is disabled.')
    return <>{children}</>
  }

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      {children}
    </ClerkProvider>
  )
}

export function ClerkUserSync() {
  const { user, isLoaded, isSignedIn } = useUser()

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const syncUser = async () => {
        try {
          const userData = {
            name: user.fullName || `${user.firstName} ${user.lastName}` || 'User',
            email: user.primaryEmailAddress?.emailAddress,
            clerkId: user.id,
            avatar: user.imageUrl
          }
          
          const response = await fetch(`${API_URL}/auth/sync-clerk`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
          })
          
          const result = await response.json()
          
          if (result.success && result.data) {
            localStorage.setItem('current_user', JSON.stringify(result.data.user))
            localStorage.setItem('clerk_user', JSON.stringify(user))
            
            localStorage.setItem('auth_token', result.data.token)
            
            console.log('✅ Clerk user synced with backend:', result.data.user)
            console.log('✅ Backend JWT token created')
            
            if (result.data.is_new) {
              console.log('🎉 New user created in database!')
            }
          } else {
            console.error('❌ Failed to sync with backend:', result.message)
            
            localStorage.setItem('current_user', JSON.stringify(userData))
            localStorage.setItem('clerk_user', JSON.stringify(user))
            localStorage.setItem('auth_token', `clerk_${user.id}`)
          }
        } catch (error) {
          console.error('❌ Error syncing Clerk user with backend:', error)
          
          const userData = {
            name: user.fullName || `${user.firstName} ${user.lastName}` || 'User',
            email: user.primaryEmailAddress?.emailAddress,
            clerkId: user.id,
            avatar: user.imageUrl
          }
          localStorage.setItem('current_user', JSON.stringify(userData))
          localStorage.setItem('clerk_user', JSON.stringify(user))
          localStorage.setItem('auth_token', `clerk_${user.id}`)
        }
      }

      syncUser()
    }
  }, [user, isLoaded, isSignedIn])

  return null
}

export function ProtectedRoute({ children }) {
  if (!clerkPubKey) {
    return <>{children}</>
  }

  return (
    <>
      <SignedIn>
        <ClerkUserSync />
        {children}
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}

export { SignedIn, SignedOut, useUser }
