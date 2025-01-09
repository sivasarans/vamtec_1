import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaveRequests } from '../redux/leavestatus';
import { fetchPermissions } from '../redux/permissionsSlice';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { ResponsiveContainer } from 'recharts'; // Import ResponsiveContainer
import { Box, Typography, Stack } from '@mui/material';

const LeaveAndPermissionPieCharts = () => {
  const dispatch = useDispatch();
  const { leavestatusData, userData } = useSelector((state) => state.leavestatus);
  const { permissionRequests } = useSelector((state) => state.permissions);
  const { user_id, role } = userData || {};

  // Date filters
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    dispatch(fetchLeaveRequests());
    dispatch(fetchPermissions());
  }, [dispatch]);

  const calculateDays = (from, to) => {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    return Math.max(0, (toDate - fromDate) / (1000 * 60 * 60 * 24) + 1);
  };

  // Filter Leave Data by Date Range
  const filteredLeaveData = (leavestatusData || [])
    .filter((leave) => {
      const leaveFromDate = new Date(leave.from_date);
      const leaveToDate = new Date(leave.to_date);
      return (
        (role === 'Admin' || leave.user_id === user_id) &&
        (!fromDate || leaveFromDate >= new Date(fromDate)) &&
        (!toDate || leaveToDate <= new Date(toDate))
      );
    })
    .reduce(
      (counts, leave) => {
        const leaveDays = calculateDays(leave.from_date, leave.to_date);
        counts[leave.status] = (counts[leave.status] || 0) + leaveDays;
        return counts;
      },
      { Approved: 0, Rejected: 0, Pending: 0 }
    );

  const leaveData = [
    { label: 'Approved', value: filteredLeaveData.Approved || 0, color: '#32CD32' },
    { label: 'Rejected', value: filteredLeaveData.Rejected || 0, color: '#FF0000' },
    { label: 'Pending', value: filteredLeaveData.Pending || 0, color: '#FFA07A' },
  ];

  const leaveTotal = leaveData.reduce((sum, item) => sum + item.value, 0);

  const leaveArcLabel = (params) => {
    const percent = params.value / leaveTotal;
    return `${(percent * 100).toFixed(0)}%`;
  };

  // Filter Permission Data by Date Range
  const filteredPermissionData = (permissionRequests || [])
    .filter((permission) => {
      const permissionDate = new Date(permission.date);
      return (
        (!fromDate || permissionDate >= new Date(fromDate)) &&
        (!toDate || permissionDate <= new Date(toDate))
      );
    })
    .reduce(
      (counts, permission) => {
        counts[permission.status] = (counts[permission.status] || 0) + 1;
        return counts;
      },
      { Approved: 0, Rejected: 0, Pending: 0 }
    );

  const permissionData = [
    { label: 'Approved', value: filteredPermissionData.Approved || 0, color: '#4682B4' },
    { label: 'Rejected', value: filteredPermissionData.Rejected || 0, color: '#FF6347' },
    { label: 'Pending', value: filteredPermissionData.Pending || 0, color: '#FFD700' },
  ];

  const permissionTotal = permissionData.reduce((sum, item) => sum + item.value, 0);

  const permissionArcLabel = (params) => {
    const percent = params.value / permissionTotal;
    return `${(percent * 100).toFixed(0)}%`;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '20px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          backgroundColor: 'rgb(233, 231, 255)',
          padding: '16px',
          borderRadius: '25px',
          boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
          width: '100%',
          maxWidth: '600px',
        }}
      >
        <Typography variant="h6" align="center" sx={{ marginBottom: '16px', color: 'rgb(66, 23, 115)' }}>
          Leave and Permission Status Distribution
        </Typography>

        <Box sx={{ marginBottom: '16px' }}>
          <label className="block mb-2 font-bold">Select Date Range:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border p-2 mr-4"
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border p-2"
          />
        </Box>

        <Stack direction="row" spacing={2} sx={{ marginBottom: '16px', justifyContent: 'center' }}>
          {leaveData.map((item) => (
            <Box
              key={item.label}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: item.color,
              }}
            >
              <Box
                sx={{
                  width: '15px',
                  height: '15px',
                  borderRadius: '50%',
                  backgroundColor: item.color,
                  marginRight: '8px',
                }}
              />
              <Typography variant="body2">{item.label}</Typography>
            </Box>
          ))}
        </Stack>

        <Stack direction="row" spacing={2} sx={{ marginBottom: '16px', justifyContent: 'center' }}>
          {permissionData.map((item) => (
            <Box
              key={item.label}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: item.color,
              }}
            >
              <Box
                sx={{
                  width: '15px',
                  height: '15px',
                  borderRadius: '50%',
                  backgroundColor: item.color,
                  marginRight: '8px',
                }}
              />
              <Typography variant="body2">{item.label}</Typography>
            </Box>
          ))}
        </Stack>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart
            series={[
              {
                innerRadius: 0,
                outerRadius: 80,
                data: permissionData, // Inner: Permission Data
                arcLabel: permissionArcLabel,
                paddingAngle: 5,
              },
              {
                innerRadius: 90,
                outerRadius: 120,
                data: leaveData, // Outer: Leave Data
                arcLabel: leaveArcLabel,
                paddingAngle: 5,
              },
            ]}
            sx={{
              [`& .${pieArcLabelClasses.root}`]: {
                fill: 'white',
                fontSize: 14,
              },
            }}
            width={400}
            height={400}
            slotProps={{
              legend: { hidden: true },
            }}
          />
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default LeaveAndPermissionPieCharts;
