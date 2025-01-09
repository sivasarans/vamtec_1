import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaveRequests } from '../../redux/leavestatus';
import { fetchPermissions } from '../../redux/permissionsSlice';
import { BarChart } from '@mui/x-charts/BarChart';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Box, Typography, TextField, Stack } from '@mui/material';

const LeavePermissionChart = () => {
  const dispatch = useDispatch();
  const { leavestatusData, userData } = useSelector((state) => state.leavestatus);
  const { permissionRequests: permissions, loading, error } = useSelector((state) => state.permissions);
  const { user_id, role } = userData || {};

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filters, setFilters] = useState({ Pending: true, Rejected: true, Approved: true, Total: false });
  const [savedFilters, setSavedFilters] = useState({ Pending: true, Rejected: true, Approved: true });
  const [dataType, setDataType] = useState('Permission');

  useEffect(() => {
    dispatch(fetchLeaveRequests());
    dispatch(fetchPermissions());
    setDefaultDateRange();
  }, [dispatch]);
  const setDefaultDateRange = () => {
    const today = new Date();
    const defaultFromDate = new Date(today.setMonth(today.getMonth() - 1)).toISOString().slice(0, 10);
    setFromDate(defaultFromDate);
    setToDate(new Date().toISOString().slice(0, 10));
  };
  
  const formatDate = (date) => new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
  const calculateDays = (from, to) => Math.max(0, (new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24) + 1);

  const filteredLeaveData = leavestatusData
  .filter((entry) => {
    const entryDate = new Date(entry.from_date || entry.date);
    const isAdmin = role === 'Admin';
    return (
      (!fromDate || entryDate >= new Date(fromDate)) && (!toDate || entryDate <= new Date(toDate)) && (isAdmin || entry.user_id === user_id)
    );
  })
  .reduce((acc, entry) => {
    const date = formatDate(entry.from_date || entry.date);
    const days = calculateDays(entry.from_date, entry.to_date) || 1;
    if (!acc[date]) acc[date] = { date, Pending: 0, Rejected: 0, Approved: 0, Total: 0 };
    acc[date][entry.status] += days;
    acc[date].Total += days;
    return acc;
  }, {});

  const filteredPermissionData = permissions
  .filter((permission) => {
    const permissionDate = new Date(permission.date);
    const isAdmin = role === 'Admin';
    return (
      (!fromDate || permissionDate >= new Date(fromDate)) && (!toDate || permissionDate <= new Date(toDate)) && (isAdmin || permission.user_id === user_id)
    );
  })
  .map((permission) => ({
    date: formatDate(permission.date),
    Pending: permission.status === 'Pending' ? 1 : 0,
    Rejected: permission.status === 'Rejected' ? 1 : 0,
    Approved: permission.status === 'Approved' ? 1 : 0,
    Total: 1,
  }));

  const sortedLeaveData = Object.values(filteredLeaveData).sort((a, b) => new Date(a.date) - new Date(b.date));
  const dataset = dataType === 'Permission' ? filteredPermissionData : sortedLeaveData;

  const handleFilterChange = (status) => {
    if (status === 'Total') {
      const newTotalState = !filters.Total;
      if (newTotalState) {
        setSavedFilters({ Pending: filters.Pending, Rejected: filters.Rejected, Approved: filters.Approved });
        setFilters({ Pending: false, Rejected: false, Approved: false, Total: true });
      } else {
        setFilters({ ...savedFilters, Total: false });
      }
    } else {
      setFilters((prev) => ({ ...prev, [status]: !prev[status] }));
    }
  };

  const chartSettings = {
    dataset,
    height: 300,
    xAxis: [{ scaleType: 'band', dataKey: 'date' }],
    series: [
      filters.Pending && { dataKey: 'Pending', label: 'Pending', color: 'orange', stack: 'stack' },
      filters.Rejected && { dataKey: 'Rejected', label: 'Rejected', color: 'red', stack: 'stack' },
      filters.Approved && { dataKey: 'Approved', label: 'Approved', color: 'green', stack: 'stack' },
      filters.Total && { dataKey: 'Total', label: 'Total', color: 'blue', stack: 'stack' },
    ].filter(Boolean),
  };

  return (
    <div style={{ padding: 20 }}>
      {loading && <p>Loading permission data...</p>}
      {error && <p>Error: {error}</p>}

      <div
        style={{
          boxShadow: '0 4px 8px rgba(237, 16, 237, 0.96)',
          padding: 20,
          marginBottom: 20,
          borderRadius: 10,
          backgroundColor: '#ffe6e6',
        }}

      >
                    <Box sx={{ display: 'grid', gap: 2, mb: 3 }}>
                    <Typography variant="h6" align="center" sx={{ mb: 2, color: 'rgb(66,23,115)' }}>
                  Leave and Permission Status
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>

                {['From Date', 'To Date'].map((label, i) => (
  <TextField key={label} label={label} type="date" value={i === 0 ? fromDate : toDate} onChange={(e) => (i === 0 ? setFromDate(e.target.value) : setToDate(e.target.value))} sx={{ width: '20%' }} InputLabelProps={{ shrink: true }} />
))}

            <ToggleButtonGroup color="primary" value={dataType} exclusive onChange={(e, type) => setDataType(type || dataType)} aria-label="Data Type" style={{ marginBottom: 20 }}>
              {['Permission', 'Leave'].map((type) => (
                <ToggleButton key={type} value={type} sx={{ fontWeight: dataType === type ? 'bold' : 'normal', fontSize: dataType === type ? '1.2rem' : '1rem' }}>
                  {type} Data
                </ToggleButton>
              ))}
            </ToggleButtonGroup>

                      
                      </Box>
                      

                      </Box>

        <FormGroup row>
          {['Pending', 'Rejected', 'Approved', 'Total'].map((status) => (
            <FormControlLabel
              key={status}
              control={
                <Checkbox
                  checked={filters[status]}
                  onChange={() => handleFilterChange(status)}
                  disabled={status !== 'Total' && filters.Total}
                />
              }
              label={status}
            />
          ))}
        </FormGroup>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 6px 10px rgba(244, 8, 216, 0.88)', borderRadius: 10, backgroundColor: '#ffe6e6' }}>

        <BarChart {...chartSettings} />
      </div>
    </div>
  );
};

export default LeavePermissionChart;
