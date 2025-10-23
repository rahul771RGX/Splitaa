import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn, useUser } from '@clerk/clerk-react'
import { useEffect } from 'react'

// Get Clerk Publishable Key from environment variable
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

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

// Component to sync Clerk user with our backend
export function ClerkUserSync() {
  const { user, isLoaded, isSignedIn } = useUser()

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      // Sync Clerk user with backend
      const syncUser = async () => {
        try {
          const userData = {
            name: user.fullName || `${user.firstName} ${user.lastName}` || 'User',
            email: user.primaryEmailAddress?.emailAddress,
            clerkId: user.id,
            avatar: user.imageUrl
          }
          
          // Call backend to sync Clerk user and get real JWT token
          const response = await fetch('http://localhost:8000/api/auth/sync-clerk', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
          })
          
          const result = await response.json()
          
          if (result.success && result.data) {
            // Store user data in localStorage
            localStorage.setItem('current_user', JSON.stringify(result.data.user))
            localStorage.setItem('clerk_user', JSON.stringify(user))
            
            // Use the real JWT token from backend
            localStorage.setItem('auth_token', result.data.token)
            
            console.log('✅ Clerk user synced with backend:', result.data.user)
            console.log('✅ Backend JWT token created')
            
            if (result.data.is_new) {
              console.log('🎉 New user created in database!')
            }
          } else {
            console.error('❌ Failed to sync with backend:', result.message)
            
            // Fallback to client-only storage
            localStorage.setItem('current_user', JSON.stringify(userData))
            localStorage.setItem('clerk_user', JSON.stringify(user))
            localStorage.setItem('auth_token', `clerk_${user.id}`)
          }
        } catch (error) {
          console.error('❌ Error syncing Clerk user with backend:', error)
          
          // Fallback to client-only storage
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
    // Don't clear tokens automatically - let logout handle that
  }, [user, isLoaded, isSignedIn])

  return null
}

// Protected Route component
export function ProtectedRoute({ children }) {
  if (!clerkPubKey) {
    // If Clerk is not configured, allow access
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
