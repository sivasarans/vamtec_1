import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { ReactComponent as ReactLogo } from './logo.svg';
import Login from './Pages/Login';
import Dashboard from './components/Dashboard/Dashboard';
import LeaveForm from './Pages/LeaveForm';
import Permission from './Pages/Permission';
import UserRegister from './Pages/UserRegister';
import LeaveStatus from './Pages/LeaveStatus';
import PermissionStatus from './Pages/PermissionStatus';
import AdminCalendar from './Pages/AdminCalendar';
import LeaveAssign from './Pages/LeaveAssign';
import LeaveReports from './Pages/LeaveReports';
import Attendance from './Pages/Attendance';
import Sidebar from './components/Sidebar';
import 'font-awesome/css/font-awesome.min.css';
import BadgeAvatars from './components/BadgeAvatars'; // Import BadgeAvatars component
import LeaveBalanceCount from './Pages/LeaveBalanceCount';
import EmployeeLeaveCalendar from './components/Dashboard/EmployeeLeaveCalendar';
import LeaveCountGraphsCharts from './components/Dashboard/PieChart';
// import XXX from './components/RoughUse/XXX';
// import YYY from './components/RoughUse/YYY';
// import ZZZ from './components/RoughUse/ZZZ';

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [role, setRole] = useState(''); // Initialize role state

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleClickOutside = (e) => {
    // Check if the click is outside the dropdown and avatar button
    if (isDropdownOpen && !e.target.closest('.dropdown') && !e.target.closest('.avatar-button')) {
      setIsDropdownOpen(false); // Close dropdown if click is outside
    }
  };

  const [user, setUser] = useState(null);

  // Fetch user details from localStorage when the component mounts
  useEffect(() => {
    const storedUserDetails = JSON.parse(localStorage.getItem('userDetails'));
    if (storedUserDetails) {
      setUser(storedUserDetails); // Set user details if available
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const loggedInState = localStorage.getItem('isLoggedIn');
    const storedUserDetails = localStorage.getItem('userDetails');

    if (loggedInState === 'true' && storedUserDetails) {
      const userDetails = JSON.parse(storedUserDetails);
      setIsLoggedIn(true);
      setUserDetails(userDetails);
      setRole(userDetails.role);
      document.addEventListener('click', handleClickOutside); // Add event listener for click outside
    }

    return () => {
      document.removeEventListener('click', handleClickOutside); // Clean up the event listener
    };
  }, []); // Empty dependency array to run only once on mount

  const handleLogout = () => {
    localStorage.setItem('isLoggedIn', 'false'); // Mark as logged out
    localStorage.removeItem('userDetails'); // Remove user details from localStorage
    setIsLoggedIn(false);
    setIsDropdownOpen(false);
    setUserDetails(null);
  };

  const openNav = () => {
    setIsSidebarOpen(true);
  };

  const closeNav = () => {
    setIsSidebarOpen(false);
  };

  const handleLinkClick = () => closeNav();

  return (
    <div className="App">
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        {/* Sidebar: Only shown when logged in */}
        {isLoggedIn && (
          <Sidebar 
            isSidebarOpen={isSidebarOpen} 
            closeNav={closeNav} 
            openNav={openNav} 
            handleLinkClick={handleLinkClick} 
          />
        )}

        {/* Navigation Bar */}
        <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
        {isLoggedIn && (
    <span style={{ fontSize: '30px', cursor: 'pointer' }} onClick={openNav}>
      &#9776; 
      Menu
    </span>
  )}
          <div className="flex space-x-4">
            
            {/* React Logo */}
            <NavLink to="/Dashboard" className="text-white">
              <img src="/apple.png" alt="Logo" className="h-10 w-10" />
            </NavLink>
          </div>
          {/* Profile Button */}
          {isLoggedIn && (
            <div className="flex items-center space-x-4 relative">
              <p className="inline-block bg-green-500 px-2 py-1 m-2 rounded-md text-black font-bold">
                {user.name}
              </p>

              <button
                type="button"
                className="text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 avatar-button"
                onClick={toggleDropdown}
              >
                <BadgeAvatars role={user.role} avatarSrc={`http://localhost:5000${user.profile_picture}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow-lg dark:bg-gray-700 z-50 dropdown">
                  <div className="px-4 py-3">
                    {user && (
                      <>
                        <span className="block text-sm text-gray-900">Hi, {user.name} </span>
                        <span className="block text-sm text-red-900">ID: {user.user_id}</span>
                        <span className="block text-sm text-green-500">Designation: {user.role}</span>
                      </>
                    )}
                  </div>
                  <ul className="py-2">
                    <li><NavLink to="/Dashboard" className="block px-4 py-2 text-sm text-gray-500 hover:text-black">Dashboard</NavLink></li>
                    <li><button onClick={handleLogout} className="block px-4 py-2 text-sm text-red-500 hover:text-red-700">Logout</button></li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div id="main" 
        className={`transition-all duration-500 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}
        >
          {/* Routes */}
          <Routes>
            <Route path="/" element={<Dashboard onLogin={setIsLoggedIn} />} />
            <Route path="/LeaveBalanceCount" element={<LeaveBalanceCount />} />
            <Route path="/login" element={<Login onLogin={setIsLoggedIn} />} />
            <Route path="/Attendance" element={isLoggedIn ? <Attendance /> : <Login onLogin={setIsLoggedIn} />} />
            <Route path="/Dashboard" element={isLoggedIn ? <Dashboard /> : <Login onLogin={setIsLoggedIn} />} />
            <Route path="/UserRegister" element={isLoggedIn ? <UserRegister /> : <Login onLogin={setIsLoggedIn} />} />
            <Route path="/Permission" element={isLoggedIn ? <Permission /> : <Login onLogin={setIsLoggedIn} />} />
            <Route path="/LeaveForm" element={isLoggedIn ? <LeaveForm /> : <Login onLogin={setIsLoggedIn} />} />
            <Route path="/LeaveStatus" element={isLoggedIn ? <LeaveStatus /> : <Login onLogin={setIsLoggedIn} />} />
            <Route path="/PermissionStatus" element={isLoggedIn ? <PermissionStatus /> : <Login onLogin={setIsLoggedIn} />} />
            <Route path="/admincalender" element={isLoggedIn ? <AdminCalendar /> : <Login onLogin={setIsLoggedIn} />} />
            <Route path="/LeaveAssign" element={isLoggedIn ? <LeaveAssign /> : <Login onLogin={setIsLoggedIn} />} />
            <Route path="/EmployeeLeaveCalendar" element={isLoggedIn ? <EmployeeLeaveCalendar /> : <Login onLogin={setIsLoggedIn} />} />
            <Route path="/LeaveReports" element={isLoggedIn ? <LeaveReports /> : <Login onLogin={setIsLoggedIn} />} />
            <Route path="/LeaveCountGraphsCharts" element={isLoggedIn ? <LeaveCountGraphsCharts /> : <Login onLogin={setIsLoggedIn} />} />
            {/* <Route path="/xxx" element={isLoggedIn ? <XXX /> : <Login onLogin={setIsLoggedIn} />} />
            <Route path="/yyy" element={isLoggedIn ? <YYY /> : <Login onLogin={setIsLoggedIn} />} />
            <Route path="/zzz" element={isLoggedIn ? <ZZZ /> : <Login onLogin={setIsLoggedIn} />} /> */}
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
