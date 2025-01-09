import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import EmployeeLeaveCalendar from './EmployeeLeaveCalendar';
import LeaveBalanceCount from '../../Pages/LeaveBalanceCount';
import LeaveCountGraphsCharts from './PieChart';
import Dashborad_main_section_links from './Links';
// import PermissionsChart from './OLDPermissionGraph';
import BarChart from './BarChart';
import { PieChart } from 'recharts';


const Dashboard = () => {
  
  const [user, setUser] = useState(null);
  const userData = useSelector((state) => state.leavestatus.userData);

  useEffect(() => {
    setUser(userData); // Set user details if available
  }, [userData]);

  if (!user) {
    return (
      <div className="text-center text-lg font-semibold text-gray-600">
        Please log in to view the dashboard.
      </div>
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'auto',
        gap: 2,
        gridTemplateAreas: `
          "header header header header"
          "main main sidebar sidebar"
          "leaveChart permissionChart permissionChart permissionChart"
          "footer footer footer footer"
        `,
        width: '100%',
        minHeight: '100vh',
        p: 3,
        bgcolor: 'background.default',
      }}
    >

<Box sx={{ gridArea: 'header' }}>
  <div className="relative bg-red-800 p-4 text-white rounded-md overflow-hidden">
    <div
      className="whitespace-nowrap"
      style={{
        display: 'inline-block',
        animation: 'scroll 10s linear infinite',
      }}
    >
      <h1 className="inline-block px-4">Welcome, {user.name}!</h1>
      <p className="inline-block px-4">User ID: {user.user_id}</p>
      <p className="inline-block px-4">Role: {user.role}</p>
      
    </div>

    <style>
      {`
        @keyframes scroll {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}
    </style>
  </div>
</Box>



      {/* Main Section */}
      <Box
        sx={{
          gridArea: 'main',
          bgcolor: 'rgb(245, 245, 245)', // Light gray background
          p: 2,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <h2>Main Section</h2>
        <Dashborad_main_section_links role={user.role} />
      </Box>

      {/* Sidebar Section */}
      <Box
        sx={{
          gridArea: 'sidebar',
          bgcolor: 'rgb(192, 186, 247)',
          p: 2,
          borderRadius: 2,
          color: 'rgb(27, 14, 167)',
        }}
      >
        <h2>Quick Access</h2>
        <div className="mt-8">
          <EmployeeLeaveCalendar />
        </div>
      </Box>

      {/* Leave Count Chart Section */}
      <Box
        sx={{
          gridArea: 'leaveChart',
          bgcolor: 'rgb(250, 250, 250)', // Light background for better contrast
          p: 2,
          borderRadius: 2,
          boxShadow: 1, // Add a subtle shadow for emphasis
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* <h2>Leave vs Permission Chart</h2> */}
        <LeaveCountGraphsCharts />
      </Box>

        <Box
          sx={{
            gridArea: 'permissionChart',
            bgcolor: 'rgb(250, 250, 250)', // Light background for better contrast
            p: 2,
            borderRadius: 2,
            boxShadow: 1, // Add a subtle shadow for emphasis
            display: 'grid',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* <h2>Permission / Leave Chart</h2> */}
          <BarChart sx={{ width: '100%' }} />
          </Box>
        

      {/* Footer Section */}
      <Box
        sx={{
          gridArea: 'footer',
          bgcolor: 'warning.main',
          p: 2,
          borderRadius: 2,
          textAlign: 'center',
          color: 'rgb(232, 131, 35)',
        }}
      >
        <h2>Footer Section</h2>
        <LeaveBalanceCount />
      </Box>
    </Box>
  );
};

export default Dashboard;
