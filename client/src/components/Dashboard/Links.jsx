import React from 'react';
import { Box } from '@mui/material';
import { NavLink } from 'react-router-dom';

const UserActions = ({ role }) => {
  const adminLinks = [
    { to: "/UserRegister", label: "User Register", color: "rgb(106, 90, 205)" },
    { to: "/LeaveStatus", label: "Leave", color: "rgb(65, 105, 225)" },
    { to: "/PermissionStatus", label: "Permission", color: "rgb(28, 186, 91)" },
    { to: "/admincalender", label: "Calendar", color: "rgb(59, 197, 239)" },
    { to: "/LeaveAssign", label: "LeaveAssign", color: "rgb(223, 112, 199)" },
    { to: "/LeaveReports", label: "LeaveReports", color: "rgb(218, 227, 36)" },
    { to: "/Attendance", label: "Attendance", color: "rgb(74, 126, 69)" },
    { to: "/LeaveBalanceCount", label: "LeaveBalanceCount", color: "rgb(242, 206, 88)" },
    { to: "/PieChart", label: "PieChart", color: "rgb(112, 44, 172)" },

  ];

  const userLinks = [
    { to: "/LeaveStatus", label: "Leave", color: "rgb(65, 105, 225)" },
    { to: "/PermissionStatus", label: "Permission", color: "rgb(40, 203, 78)" },
    { to: "/admincalender", label: "Calendar", color: "rgb(46, 150, 198)" },
    { to: "/LeaveBalanceCount", label: "Leave Balance Count", color: "rgb(255, 140, 0)" },
    { to: "/leaveform", label: "Apply Leave", color: "rgb(30, 144, 255)" },
  ];

  const links = role === "Admin" ? adminLinks : userLinks;

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 2, // Space between buttons
        width: '100%',
      }}
    >
      {links.map((link, index) => (
        <NavLink key={index} to={link.to} style={{ textDecoration: 'none' }}>
          <Box
            sx={{
              p: 2,
              textAlign: 'center',
              fontSize: '1rem',
              fontWeight: 'medium',
              color: '#fff',
              bgcolor: link.color,
              borderRadius: 2,
              '&:hover': { opacity: 0.9 },
            }}
          >
            {link.label}
          </Box>
        </NavLink>
      ))}
    </Box>
  );
};

export default UserActions;
