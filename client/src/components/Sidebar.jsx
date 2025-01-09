import React, { useRef, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isSidebarOpen, closeNav, openNav, handleLinkClick }) => {
  const [user, setUser] = useState(null);
  const [isStatic, setIsStatic] = useState(false); // Track if the sidebar is static
  const sidenavRef = useRef(null);

  // Fetch user details from localStorage
  useEffect(() => {
    const storedUserDetails = JSON.parse(localStorage.getItem('userDetails'));
    if (storedUserDetails) {
      setUser(storedUserDetails); // Set user details if available
    }
  }, []);

  const handleClickOutside = (event) => {
    if (!isStatic && sidenavRef.current && !sidenavRef.current.contains(event.target)) {
      closeNav();
    }
  };

  useEffect(() => {
    if (isSidebarOpen && !isStatic) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen, isStatic]);

  const toggleStaticMode = () => {
    setIsStatic((prev) => !prev);
  };

  // Modify handleLinkClick to prevent closing the sidebar when in static mode
  const handleLinkClickModified = (event) => {
    if (!isStatic) {
      handleLinkClick(event); // Call the original handleLinkClick if not in static mode
      closeNav(); // Close sidebar in auto-close mode
    }
    // Do nothing if in static mode
  };

  if (!user) {
    return null; // If no user is found, return null (you can handle this in other ways if needed)
  }

  return (
    <div
      ref={sidenavRef}
      id="mySidenav"
      className={`fixed inset-0 bg-gray-800 bg-opacity-90 transition-all duration-500 ease-in-out transform 
      ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} z-50 sm:w-1/4 md:w-1/4 lg:w-1/4 xl:w-1/4`}
      style={{ maxWidth: '250px' }}
    >
      <div className="flex flex-col items-center p-4">
        {/* Logo or Profile Picture */}
        {isStatic && (
  <div 
    className="flex flex-col items-center justify-center p-4 m-4 rounded-lg" 
    style={{ background: 'rgb(123, 125, 204)' }}
  >
    {/* Display Profile Picture */}
    <img
      src={`http://localhost:5000${user.profile_picture}`}
      alt="User Logo"
      className="w-20 h-20 rounded-full mb-4"
    />
    {/* Display User Information */}
    <div className="text-white font-semibold text-lg mb-2">User Name: {user.name}</div>
    <div className="text-white text-sm mb-1">User ID: {user.user_id}</div>
    <div className="text-white text-sm">Role: {user.role}</div>
  </div>
)}


        {/* Close button */}
        <div className="flex justify-end w-full p-2">
        {!isStatic && <button onClick={closeNav} className="text-white text-3xl">&times;</button> }
        </div>
        <div className="flex flex-col space-y-4 p-4 w-full">
          {/* Common links */}
          <NavLink to="/Dashboard" className="text-white text-xl" onClick={handleLinkClickModified}>Dashboard</NavLink>
          <NavLink to="/LeaveStatus" className="text-white text-xl" onClick={handleLinkClickModified}>Leave Status</NavLink>
          <NavLink to="/PermissionStatus" className="text-white text-xl" onClick={handleLinkClickModified}>Permission Status</NavLink>
          <NavLink to="/admincalender" className="text-white text-xl" onClick={handleLinkClickModified}>Calendar</NavLink>

          {/* Admin role specific links */}
          {user.role === 'Admin' && (
            <>
              <NavLink to="/UserRegister" className="text-white text-xl" onClick={handleLinkClickModified}>User Register</NavLink>
              <NavLink to="/LeaveAssign" className="text-white text-xl" onClick={handleLinkClickModified}>Leave Assign</NavLink>
              <NavLink to="/LeaveReports" className="text-white text-xl" onClick={handleLinkClickModified}>Leave Reports</NavLink>
              <NavLink to="/Attendance" className="text-white text-xl" onClick={handleLinkClickModified}>Attendance</NavLink>
            </>
          )}

          {/* Links for all users */}
          {user.role !== 'Admin' && (
            <>
              <NavLink to="/LeaveForm" className="text-white text-xl" onClick={handleLinkClickModified}>Leave Form</NavLink>
              <NavLink to="/Permission" className="text-white text-xl" onClick={handleLinkClickModified}>Permission Form</NavLink>
            </>
          )}

          {/* Button to toggle static mode */}
          <button
            onClick={toggleStaticMode}
            className="text-white text-sm mt-4"
            style={{ backgroundColor: 'rgb(47, 53, 216)' }} // Replace with your desired RGB color
          >
            {isStatic ? 'Enable Auto-Close sidenav' : 'Enable Static Sidebar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
