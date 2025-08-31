import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode))
    
    // Apply theme to document body
    if (isDarkMode) {
      document.body.classList.add('dark-theme')
    } else {
      document.body.classList.remove('dark-theme')
    }
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev)
  }

  const theme = {
    isDarkMode,
    toggleDarkMode,
    colors: {
      // Background colors
      bg: {
        primary: isDarkMode ? '#111827' : '#F8FAFC',
        secondary: isDarkMode ? '#1F2937' : '#FFFFFF',
        tertiary: isDarkMode ? '#374151' : '#F9FAFB',
        card: isDarkMode ? '#1F2937' : '#FFFFFF'
      },
      // Text colors
      text: {
        primary: isDarkMode ? '#F9FAFB' : '#1F2937',
        secondary: isDarkMode ? '#D1D5DB' : '#6B7280',
        muted: isDarkMode ? '#9CA3AF' : '#6B7280'
      },
      // Border colors
      border: {
        primary: isDarkMode ? '#374151' : '#E5E7EB',
        secondary: isDarkMode ? '#4B5563' : '#F3F4F6'
      },
      // Brand colors (remain consistent)
      brand: {
        primary: '#22C55E',
        primaryHover: '#16A34A',
        light: isDarkMode ? '#065F46' : '#DCFCE7'
      },
      // Status colors
      status: {
        success: '#22C55E',
        error: '#EF4444',
        warning: '#F59E0B'
      }
    }
  }

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  )
}