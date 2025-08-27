import { Routes, Route } from 'react-router-dom'
import { navigationItems } from './config/navigation'
import Login from './pages/Login'
import Home from './pages/Home'
import Groups from './pages/Groups'
import Account from './pages/Account'
import Payment from './pages/Payment'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/payments" element={<Payment />} />
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