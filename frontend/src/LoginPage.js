import React, { useState, useEffect } from 'react';
import { 
  User, 
  Briefcase, 
  Mail, 
  Lock, 
  UserPlus, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2,
  Users,
  ShieldCheck
} from 'lucide-react';
import './index.css';

// Import Dashboard Components from their respective files
import SalesmanDashboard from './SalesmanDashboard';
import AdminDashboard from './AdminDashboard';

const App = () => {
  // State to manage the active tab on the login form: 'admin' or 'salesman'
  const [activeTab, setActiveTab] = useState('admin');
  // State to manage the salesman form type: 'signIn' or 'signUp'
  const [salesmanFormType, setSalesmanFormType] = useState('signIn');

  // State for Admin login credentials
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // State for Salesman login/signup credentials
  const [salesmanEmail, setSalesmanEmail] = useState('');
  const [salesmanPassword, setSalesmanPassword] = useState('');
  const [salesmanUsername, setSalesmanUsername] = useState(''); // Used for salesman sign-up

  // State for displaying messages to the user (e.g., success, error)
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  // States for managing login status and user information after successful authentication
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'admin' or 'salesman'
  const [currentSalesmanId, setCurrentSalesmanId] = useState(null);
  const [currentUsername, setCurrentUsername] = useState(null);

  // --- Backend API Endpoints ---
  const BACKEND_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
  const SALESMAN_SIGNIN_API = `${BACKEND_BASE_URL}/auth/signin`;
  const SALESMAN_SIGNUP_API = `${BACKEND_BASE_URL}/auth/signup`;

  // Check localStorage on component mount to see if a user is already logged in
  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    const storedUserId = localStorage.getItem('userId');
    const storedUsername = localStorage.getItem('username');

    if (storedRole && storedUserId) {
      setIsLoggedIn(true);
      setUserRole(storedRole);
      if (storedRole === 'salesman') {
        setCurrentSalesmanId(parseInt(storedUserId, 10)); // Ensure it's a number
        setCurrentUsername(storedUsername);
      }
    }
  }, []);

  const displayMessage = (msg, type = 'error') => {
    setMessage(msg);
    setMessageType(type);
  };

  // Function to handle Admin Login (Hardcoded for demonstration)
  const handleAdminLogin = async (e) => {
    if (e) e.preventDefault();
    displayMessage('');

    const REQUIRED_ADMIN_EMAIL = 'admin@vaaltic.com';
    const REQUIRED_ADMIN_PASSWORD = 'CRM123';

    if (!adminEmail || !adminPassword) {
      displayMessage('Admin email and password are required.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(adminEmail)) {
      displayMessage('Please enter a valid email address format.', 'error');
      return;
    }

    if (adminEmail === REQUIRED_ADMIN_EMAIL && adminPassword === REQUIRED_ADMIN_PASSWORD) {
      displayMessage('Admin login successful!', 'success');
      
      // Delay slightly for transition animation
      setTimeout(() => {
        setIsLoggedIn(true);
        setUserRole('admin');
        localStorage.setItem('role', 'admin');
        localStorage.setItem('userId', 'admin_user_id');
      }, 500);
      
      console.log('Admin Login Success: Hardcoded credentials matched.');
    } else {
      displayMessage('Admin login failed. Invalid email or password.', 'error');
      console.error('Admin Login Failed: Hardcoded credentials did not match.');
    }
  };

  // Function to handle Salesman Sign In
  const handleSalesmanSignIn = async (e) => {
    if (e) e.preventDefault();
    displayMessage('');

    if (!salesmanEmail || !salesmanPassword) {
      displayMessage('Email and password are required for salesman sign-in.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(salesmanEmail)) {
      displayMessage('Please enter a valid email address format.', 'error');
      return;
    }

    try {
      const response = await fetch(SALESMAN_SIGNIN_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: salesmanEmail, password: salesmanPassword }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        displayMessage(`Salesman sign-in successful: ${data.message}`, 'success');
        
        setTimeout(() => {
          setIsLoggedIn(true);
          setUserRole('salesman');
          setCurrentSalesmanId(data.salesmanId);
          setCurrentUsername(data.username);

          localStorage.setItem('role', 'salesman');
          localStorage.setItem('userId', data.salesmanId);
          localStorage.setItem('username', data.username);
        }, 500);

        console.log('Salesman Sign-in Success:', data);
      } else {
        displayMessage(data.message || 'Salesman sign-in failed. Invalid email or password.', 'error');
        console.error('Salesman Sign-in Failed:', data.message);
      }
    } catch (error) {
      console.error("Salesman sign-in error:", error);
      displayMessage(`Salesman sign-in failed: Ensure your backend is running.`, 'error');
    }
  };

  // Function to handle Salesman Sign Up
  const handleSalesmanSignUp = async (e) => {
    if (e) e.preventDefault();
    displayMessage('');

    if (!salesmanUsername || !salesmanEmail || !salesmanPassword) {
      displayMessage('All fields are required for salesman sign-up.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(salesmanEmail)) {
      displayMessage('Please enter a valid email address format.', 'error');
      return;
    }

    try {
      const response = await fetch(SALESMAN_SIGNUP_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: salesmanUsername, email: salesmanEmail, password: salesmanPassword }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        displayMessage(`Sign-up successful! Switch to sign-in to access your dashboard.`, 'success');
        setSalesmanFormType('signIn');
        setSalesmanEmail(salesmanEmail); // Carry over email for convenience
        setSalesmanPassword('');
        setSalesmanUsername('');
        console.log('Salesman Sign-up Success:', data);
      } else {
        displayMessage(data.message || 'Salesman sign-up failed. User might already exist.', 'error');
        console.error('Salesman Sign-up Failed:', data.message);
      }
    } catch (error) {
      console.error("Salesman sign-up error:", error);
      displayMessage(`Salesman sign-up failed: Ensure backend server is active.`, 'error');
    }
  };

  // Function to handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setCurrentSalesmanId(null);
    setCurrentUsername(null);
    localStorage.clear(); // Clear all stored user data
    displayMessage('Logged out successfully.', 'success');
  };

  // Conditional rendering based on login status and user role
  if (isLoggedIn) {
    if (userRole === 'admin') {
      return <AdminDashboard onLogout={handleLogout} />;
    } else if (userRole === 'salesman') {
      return <SalesmanDashboard salesmanId={currentSalesmanId} username={currentUsername} onLogout={handleLogout} />;
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-slate-950 font-inter p-4 overflow-hidden">
      
      {/* Dynamic Glow Ambient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-600/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-600/15 blur-[120px] pointer-events-none"></div>
      
      {/* Glassmorphic Container Box */}
      <div className="relative w-full max-w-lg bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl z-10 flex flex-col justify-center animate-fade-in">
        
        {/* Brand/Logo Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-indigo-500/20">
            <Users className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300 tracking-tight leading-tight">VAALTIC</h1>
          <p className="text-indigo-400 text-sm mt-1 tracking-widest uppercase font-bold">CRM Suite</p>
        </div>

        {/* Tab Selection Row */}
        <div className="flex bg-slate-950/60 rounded-2xl p-1.5 border border-slate-800/80 mb-8">
          <button
            type="button"
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all duration-300 text-xs font-semibold uppercase tracking-wider ${
              activeTab === 'admin' 
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
            }`}
            onClick={() => {
              setActiveTab('admin');
              displayMessage('');
            }}
          >
            <ShieldCheck className="w-4 h-4" />
            Admin
          </button>
          
          <button
            type="button"
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all duration-300 text-xs font-semibold uppercase tracking-wider ${
              activeTab === 'salesman' 
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
            }`}
            onClick={() => {
              setActiveTab('salesman');
              displayMessage('');
            }}
          >
            <Briefcase className="w-4 h-4" />
            Salesman
          </button>
        </div>

        {/* Conditional rendering for Admin Panel */}
        {activeTab === 'admin' && (
          <form onSubmit={handleAdminLogin} className="space-y-5">
            <div className="text-center md:text-left mb-2">
              <h2 className="text-lg font-bold text-white">System Administrator</h2>
              <p className="text-xs text-slate-300">Enter your secure credentials to access the control panel.</p>
            </div>

            <div className="space-y-4">
              {/* Admin Email Input */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Admin Email Address"
                  className="w-full bg-slate-950/50 text-slate-200 text-sm pl-11 pr-4 py-3.5 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-slate-950 transition-all duration-200 placeholder-slate-600"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  required
                />
              </div>

              {/* Admin Password Input */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  placeholder="Admin Password"
                  className="w-full bg-slate-950/50 text-slate-200 text-sm pl-11 pr-4 py-3.5 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-slate-950 transition-all duration-200 placeholder-slate-600"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  required
                />
              </div>

              {/* Admin Login Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white py-3.5 rounded-xl font-bold transition-all duration-200 shadow-lg shadow-indigo-900/30 hover:shadow-indigo-900/50 hover:scale-[1.01] flex items-center justify-center gap-2 text-sm"
              >
                Access Control Panel
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Conditional rendering for Salesman Panel */}
        {activeTab === 'salesman' && (
          <div>
            {salesmanFormType === 'signIn' ? (
              <form onSubmit={handleSalesmanSignIn} className="space-y-5">
                <div className="text-center md:text-left mb-2">
                  <h2 className="text-lg font-bold text-white">Sales Representative Sign In</h2>
                  <p className="text-xs text-slate-400">Access your accounts, leads, and active pipelines</p>
                </div>

                <div className="space-y-4">
                  {/* Salesman Email Input */}
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      placeholder="Email Address"
                      className="w-full bg-slate-950/50 text-slate-200 text-sm pl-11 pr-4 py-3.5 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-slate-950 transition-all duration-200 placeholder-slate-600"
                      value={salesmanEmail}
                      onChange={(e) => setSalesmanEmail(e.target.value)}
                      required
                    />
                  </div>

                  {/* Salesman Password Input */}
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type="password"
                      placeholder="Password"
                      className="w-full bg-slate-950/50 text-slate-200 text-sm pl-11 pr-4 py-3.5 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-slate-950 transition-all duration-200 placeholder-slate-600"
                      value={salesmanPassword}
                      onChange={(e) => setSalesmanPassword(e.target.value)}
                      required
                    />
                  </div>

                  {/* Sign In Button */}
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white py-3.5 rounded-xl font-bold transition-all duration-200 shadow-lg shadow-indigo-900/30 hover:shadow-indigo-900/50 hover:scale-[1.01] flex items-center justify-center gap-2 text-sm"
                  >
                    Authenticate Account
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-center text-slate-400 text-xs mt-3">
                    Don't have an agent account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setSalesmanFormType('signUp');
                        displayMessage('');
                      }}
                      className="text-purple-400 hover:text-purple-300 font-bold transition duration-150 underline cursor-pointer"
                    >
                      Sign Up Now
                    </button>
                  </p>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSalesmanSignUp} className="space-y-5">
                <div className="text-center md:text-left mb-2">
                  <h2 className="text-lg font-bold text-white">Create Agent Profile</h2>
                  <p className="text-xs text-slate-400">Register in the database to receive assigned accounts</p>
                </div>

                <div className="space-y-4">
                  {/* Salesman Username Input for Sign Up */}
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      placeholder="Full Name / Username"
                      className="w-full bg-slate-950/50 text-slate-200 text-sm pl-11 pr-4 py-3.5 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-slate-950 transition-all duration-200 placeholder-slate-600"
                      value={salesmanUsername}
                      onChange={(e) => setSalesmanUsername(e.target.value)}
                      required
                    />
                  </div>

                  {/* Salesman Email Input for Sign Up */}
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      placeholder="Email Address"
                      className="w-full bg-slate-950/50 text-slate-200 text-sm pl-11 pr-4 py-3.5 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-slate-950 transition-all duration-200 placeholder-slate-600"
                      value={salesmanEmail}
                      onChange={(e) => setSalesmanEmail(e.target.value)}
                      required
                    />
                  </div>

                  {/* Salesman Password Input for Sign Up */}
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type="password"
                      placeholder="Password"
                      className="w-full bg-slate-950/50 text-slate-200 text-sm pl-11 pr-4 py-3.5 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-slate-950 transition-all duration-200 placeholder-slate-600"
                      value={salesmanPassword}
                      onChange={(e) => setSalesmanPassword(e.target.value)}
                      required
                    />
                  </div>

                  {/* Sign Up Button */}
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white py-3.5 rounded-xl font-bold transition-all duration-200 shadow-lg shadow-indigo-900/30 hover:shadow-indigo-900/50 hover:scale-[1.01] flex items-center justify-center gap-2 text-sm"
                  >
                    Register Profile
                    <UserPlus className="w-4 h-4" />
                  </button>

                  <p className="text-center text-slate-400 text-xs mt-3">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setSalesmanFormType('signIn');
                        displayMessage('');
                      }}
                      className="text-purple-400 hover:text-purple-300 font-bold transition duration-150 underline cursor-pointer"
                    >
                      Sign In Here
                    </button>
                  </p>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Message Display Area */}
        {message && (
          <div className={`mt-6 p-4 rounded-xl flex items-start gap-3 border text-xs leading-relaxed animate-fade-in ${
            messageType === 'error' 
              ? 'bg-red-500/10 border-red-500/20 text-red-400' 
              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
          }`}>
            {messageType === 'error' ? (
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            )}
            <p>{message}</p>
          </div>
        )}

        {/* System Footer Info */}
        <footer className="text-center text-[10px] text-slate-600 mt-8 uppercase font-bold tracking-widest">
          Secured Connection &copy; 2026 Vaaltic Group
        </footer>
      </div>
    </div>
  );
};

export default App;
