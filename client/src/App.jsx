import { Routes, Route } from 'react-router-dom'
import { navigationItems } from './config/navigation'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import Groups from './pages/Groups'
import Account from './pages/Account'
import Payment from './pages/Payment'
import GroupDetails from './pages/GroupDetails'
import Dashboard from './pages/Dashboard'
import SSOCallback from './pages/SSOCallback'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/sso-callback" element={<SSOCallback />} />
        <Route path="/payments" element={<Payment />} />
        <Route path="/group-details" element={<GroupDetails />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {navigationItems.map(navItem => (
          <Route 
            key={navItem.id} 
            path={navItem.path} 
            element={
              navItem.id === 'home' ? <Home /> :
              navItem.id === 'groups' ? <Groups /> :
              navItem.id === 'account' ? <Account /> : null
            } 
          />
        ))}
      </Routes>
    </div>
  )
}

export default App