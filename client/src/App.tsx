import React, { useState } from 'react';
import { Home, Users, Settings, Bell, User, Plus, QrCode, DollarSign, TrendingUp, TrendingDown, Calendar, ChevronRight } from 'lucide-react';

interface Balance {
  youOwe: number;
  youAreOwed: number;
}

interface Group {
  id: string;
  name: string;
  members: string[];
  totalExpenses: number;
  yourShare: number;
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  date: string;
  splitBetween: string[];
}

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [balance] = useState<Balance>({ youOwe: 0, youAreOwed: 0 });
  const [groups] = useState<Group[]>([
    { id: '1', name: 'Weekend Trip', members: ['You', 'Alice', 'Bob'], totalExpenses: 450, yourShare: 150 },
    { id: '2', name: 'Roommates', members: ['You', 'Charlie', 'Diana'], totalExpenses: 320, yourShare: 80 },
    { id: '3', name: 'Office Lunch', members: ['You', 'Eve', 'Frank', 'Grace'], totalExpenses: 180, yourShare: 45 }
  ]);
  const [expenses] = useState<Expense[]>([
    { id: '1', description: 'Dinner at Restaurant', amount: 120, paidBy: 'Alice', date: '2025-01-15', splitBetween: ['You', 'Alice', 'Bob'] },
    { id: '2', description: 'Grocery Shopping', amount: 85, paidBy: 'You', date: '2025-01-14', splitBetween: ['You', 'Charlie'] },
    { id: '3', description: 'Movie Tickets', amount: 45, paidBy: 'Bob', date: '2025-01-13', splitBetween: ['You', 'Alice', 'Bob'] }
  ]);

  const HomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Balance Cards */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mb-8">
            <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 rounded-3xl p-6 lg:p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl lg:text-4xl font-bold mb-2">₹{balance.youOwe}</p>
                  <p className="text-slate-300 text-base lg:text-lg">You owe</p>
                </div>
                <div className="bg-slate-600/50 backdrop-blur-sm rounded-2xl p-4">
                  <TrendingUp className="w-8 h-8 lg:w-10 lg:h-10" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl p-6 lg:p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl lg:text-4xl font-bold mb-2">₹{balance.youAreOwed}</p>
                  <p className="text-emerald-100 text-base lg:text-lg">You are owed</p>
                </div>
                <div className="bg-emerald-400/50 backdrop-blur-sm rounded-2xl p-4">
                  <TrendingDown className="w-8 h-8 lg:w-10 lg:h-10" />
                </div>
              </div>
            </div>
          </div>

          {/* All Time Link */}
          <div className="flex justify-center mb-12">
            <button className="flex items-center text-emerald-600 font-semibold hover:text-emerald-700 transition-colors bg-white/70 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg hover:shadow-xl">
              <span className="text-base lg:text-lg">All time</span>
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      <div className="px-4 sm:px-6 lg:px-8 pb-32 lg:pb-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-40 h-40 lg:w-48 lg:h-48 mx-auto mb-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl">
            <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center">
              <Calendar className="w-10 h-10 lg:w-12 lg:h-12 text-emerald-600" />
            </div>
          </div>
          <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">No event yet</h3>
          <p className="text-gray-600 mb-10 px-4 text-base lg:text-lg leading-relaxed">Create a new event to track and split your group costs</p>
          
          <div className="space-y-4 max-w-md mx-auto">
            <button className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white py-5 lg:py-6 rounded-2xl font-semibold flex items-center justify-center hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
              <Plus className="w-6 h-6 mr-3" />
              <span className="text-base lg:text-lg">Create new event</span>
            </button>
            
            <p className="text-gray-500 text-base lg:text-lg py-2">Or join events by</p>
            
            <button className="w-full border-2 border-gray-200 bg-white/70 backdrop-blur-sm py-5 lg:py-6 rounded-2xl font-medium flex items-center justify-center hover:bg-white hover:border-emerald-300 hover:shadow-xl transition-all transform hover:-translate-y-1">
              <QrCode className="w-6 h-6 mr-3 text-emerald-500" />
              <span className="text-base lg:text-lg text-gray-700">Scan event QR</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const GroupsPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
      {/* Create Group Button */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="max-w-6xl mx-auto">
          <button className="w-full max-w-md mx-auto block bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white py-5 lg:py-6 rounded-2xl font-semibold flex items-center justify-center hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
            <Plus className="w-6 h-6 mr-3" />
            <span className="text-base lg:text-lg">Create New Group</span>
          </button>
        </div>
      </div>

      {/* Groups List */}
      <div className="px-4 sm:px-6 lg:px-8 pb-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {groups.map((group) => (
              <div key={group.id} className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 lg:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900">{group.name}</h3>
                  <div className="bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 px-4 py-2 rounded-full text-sm font-semibold">
                    {group.members.length} members
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-4 border border-violet-100">
                    <p className="text-violet-600 font-bold text-xl">₹{group.totalExpenses}</p>
                    <p className="text-violet-500 text-sm mt-1">Total expenses</p>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100">
                    <p className="text-emerald-600 font-bold text-xl">₹{group.yourShare}</p>
                    <p className="text-emerald-500 text-sm mt-1">Your share</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-3">
                    {group.members.slice(0, 3).map((member, index) => (
                      <div key={index} className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold border-3 border-white shadow-lg">
                        {member.charAt(0)}
                      </div>
                    ))}
                    {group.members.length > 3 && (
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-3 border-white shadow-lg">
                        +{group.members.length - 3}
                      </div>
                    )}
                  </div>
                  <button className="text-violet-600 font-semibold hover:text-violet-700 transition-colors bg-violet-50 px-4 py-2 rounded-full hover:bg-violet-100">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 pb-32 lg:pb-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 lg:mb-8">Recent Expenses</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {expenses.map((expense) => (
              <div key={expense.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-base lg:text-lg mb-1">{expense.description}</p>
                    <p className="text-sm text-gray-600">Paid by {expense.paidBy} • {expense.date}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-bold text-gray-900 text-lg">₹{expense.amount}</p>
                    <p className="text-sm text-emerald-600 font-medium">₹{Math.round(expense.amount / expense.splitBetween.length)} your share</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const SettingsPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Profile Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 lg:p-8 shadow-xl mb-8">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-xl">
                <User className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">SNK</h3>
                <p className="text-gray-600 text-base lg:text-lg mt-1">sn7k@example.com</p>
              </div>
              <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors bg-blue-50 px-6 py-3 rounded-full hover:bg-blue-100">
                Edit
              </button>
            </div>
          </div>

          {/* Settings Options */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden">
              <div className="p-6 lg:p-8 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 text-xl lg:text-2xl">Account</h3>
              </div>
              <div className="space-y-0">
                {[
                  { icon: User, label: 'Profile Settings', color: 'text-blue-600' },
                  { icon: Bell, label: 'Notifications', color: 'text-blue-600' },
                  { icon: DollarSign, label: 'Currency', color: 'text-blue-600' }
                ].map((item, index) => (
                  <button key={index} className="w-full p-6 lg:p-8 flex items-center justify-between hover:bg-blue-50/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <item.icon className={`w-6 h-6 lg:w-7 lg:h-7 ${item.color}`} />
                      <span className="text-gray-900 text-base lg:text-lg font-medium">{item.label}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden">
              <div className="p-6 lg:p-8 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 text-xl lg:text-2xl">Preferences</h3>
              </div>
              <div className="space-y-0">
                {[
                  { label: 'Dark Mode', toggle: true },
                  { label: 'Auto-split expenses', toggle: true },
                  { label: 'Email notifications', toggle: false }
                ].map((item, index) => (
                  <div key={index} className="p-6 lg:p-8 flex items-center justify-between">
                    <span className="text-gray-900 text-base lg:text-lg font-medium">{item.label}</span>
                    <div className={`w-14 h-7 lg:w-16 lg:h-8 rounded-full transition-colors cursor-pointer shadow-inner ${item.toggle ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-gray-300'}`}>
                      <div className={`w-6 h-6 lg:w-7 lg:h-7 bg-white rounded-full mt-0.5 transition-transform shadow-lg ${item.toggle ? 'translate-x-7 lg:translate-x-8' : 'translate-x-0.5'}`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl mt-6 lg:mt-8 mb-32 lg:mb-16 overflow-hidden">
            <div className="space-y-0">
              {[
                { label: 'Help & Support', color: 'text-gray-900' },
                { label: 'Privacy Policy', color: 'text-gray-900' },
                { label: 'Terms of Service', color: 'text-gray-900' },
                { label: 'Sign Out', color: 'text-red-600' }
              ].map((item, index) => (
                <button key={index} className="w-full p-6 lg:p-8 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                  <span className={`${item.color} text-base lg:text-lg font-medium`}>{item.label}</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'groups':
        return <GroupsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Desktop Navigation - Visible only on desktop */}
      <div className="hidden lg:block fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-gray-200 px-8 py-4 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Splitaa</h1>
            <nav className="flex space-x-2">
              <button
                onClick={() => setCurrentPage('home')}
                className={`flex items-center px-4 py-2 rounded-xl transition-all font-medium ${
                  currentPage === 'home' 
                    ? 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 shadow-md' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Home className="w-5 h-5 mr-2" />
                Home
              </button>
              <button
                onClick={() => setCurrentPage('groups')}
                className={`flex items-center px-4 py-2 rounded-xl transition-all font-medium ${
                  currentPage === 'groups' 
                    ? 'bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 shadow-md' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Users className="w-5 h-5 mr-2" />
                Groups
              </button>
              <button
                onClick={() => setCurrentPage('settings')}
                className={`flex items-center px-4 py-2 rounded-xl transition-all font-medium ${
                  currentPage === 'settings' 
                    ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 shadow-md' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Settings className="w-5 h-5 mr-2" />
                Settings
              </button>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all">
              <Bell className="w-5 h-5" />
            </button>
            <button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl flex items-center hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl font-medium">
              <Plus className="w-4 h-4 mr-2" />
              New Event
            </button>
          </div>
        </div>
      </div>

      {/* Main Content with proper spacing for desktop nav */}
      <div className="lg:pt-20">
        {renderPage()}
      </div>
      
      {/* Bottom Navigation - Hidden on desktop */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 px-4 py-3 lg:hidden shadow-2xl">
        <div className="flex items-center justify-around">
          <button
            onClick={() => setCurrentPage('home')}
            className={`flex flex-col items-center py-2 px-3 transition-all ${
              currentPage === 'home' ? 'text-emerald-600' : 'text-gray-400'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">Home</span>
          </button>
          
          <button
            onClick={() => setCurrentPage('groups')}
            className={`flex flex-col items-center py-2 px-3 transition-all ${
              currentPage === 'groups' ? 'text-violet-600' : 'text-gray-400'
            }`}
          >
            <Users className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">Groups</span>
          </button>
          
          <button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
            <Plus className="w-6 h-6" />
          </button>
          
          <button className="flex flex-col items-center py-2 px-3 text-gray-400">
            <Bell className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">Notification</span>
          </button>
          
          <button
            onClick={() => setCurrentPage('settings')}
            className={`flex flex-col items-center py-2 px-3 transition-all ${
              currentPage === 'settings' ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <User className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;