export const navigationItems = [
  {
    id: 'home',
    path: '/home',
    label: 'Home',
    icon: 'bi-house-fill',
    mobileIcon: 'bi-house'
  },
  {
    id: 'groups',
    path: '/groups',
    label: 'Groups',
    icon: 'bi-people',
    mobileIcon: 'bi-people'
  },
  {
    id: 'account',
    path: '/account',
    label: 'Account',
    icon: 'bi-person',
    mobileIcon: 'bi-person'
  }
]

export const getNavigationItem = (path) => {
  return navigationItems.find(item => item.path === path)
}
export const isActivePath = (currentPath, itemPath) => {
  return currentPath === itemPath
}