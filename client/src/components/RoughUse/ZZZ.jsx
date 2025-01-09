import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaveRequests } from '../redux/leavestatus';
import { fetchPermissions } from '../redux/permissionsSlice';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Legend, Tooltip, Cell, ResponsiveContainer, CartesianGrid, Text } from 'recharts';

const LeaveCountGraphsCharts = ({ showFilters = true }) => {
  const dispatch = useDispatch();
  const { leavestatusData, userData } = useSelector((state) => state.leavestatus);
  const { user_id, name, role } = userData || {};

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

  const leaveCounts = (leavestatusData || [])
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

  const leaveStatusData = [
    { name: 'Approved', count: leaveCounts.Approved || 0, fill: '#32CD32' },
    { name: 'Rejected', count: leaveCounts.Rejected || 0, fill: '#FF0000' },
    { name: 'Pending', count: leaveCounts.Pending || 0, fill: '#FFA07A' },
  ];

  const filteredLeaveStatusByDate = (leavestatusData || [])
    .filter((leave) => {
      const leaveFromDate = new Date(leave.from_date);
      const leaveToDate = new Date(leave.to_date);
      return (
        (role === 'Admin' || leave.user_id === user_id) &&
        (!fromDate || leaveFromDate >= new Date(fromDate)) &&
        (!toDate || leaveToDate <= new Date(toDate))
      );
    })
    .map((leave) => {
      const date = new Date(leave.from_date);
      const formattedDate = `${date.getDate()}-${date.toLocaleString('default', { month: 'short' })}-${date.getFullYear()}`;
      return {
        date: formattedDate,
        approved: leave.status === 'Approved' ? calculateDays(leave.from_date, leave.to_date) : 0,
        rejected: leave.status === 'Rejected' ? calculateDays(leave.from_date, leave.to_date) : 0,
        pending: leave.status === 'Pending' ? calculateDays(leave.from_date, leave.to_date) : 0,
      };
    })
    .sort((a, b) => new Date(a.date.split('-').reverse().join('-')) - new Date(b.date.split('-').reverse().join('-')));

  return (
    <div className="employee-leave-summary">
      {userData ? (
        <div className="text-sm text-gray-700 mb-4">
          {showFilters && (
            <div className="mb-4">
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
            </div>
          )}

          {/* <p className="inline-block bg-green-100 px-2 py-1 m-2 rounded-md mb-5">
            Leave Summary for: "{name}"
          </p> */}

          <div
            className="charts-container"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '16px',
            }}
          >
            {/* Pie Chart */}
            <div
              className="chart-container"
              style={{
                width: '45%',
                minWidth: '300px',
                borderRadius: '25px',
                padding: '16px',
                backgroundColor: 'rgb(233, 231, 255)',
                color: 'rgb(66, 23, 115)',
                boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
              }}
            >
              <h3 style={{ textAlign: 'center', marginBottom: '16px' }}>Leave Status Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie
      data={leaveStatusData}
      dataKey="count"
      nameKey="name"
      cx="50%"
      cy="50%"
      innerRadius={80}
      // outerRadius={(entry, index) => (index === activeIndex ? 120 : 100)}
      // onMouseEnter={onPieEnter}
      // onMouseLeave={onPieLeave}
      // label={({ name, count }) => `${name}: ${count}`}
    >
      {leaveStatusData.map((entry, index) => (
        <Cell
          key={`cell-${index}`}
          fill={entry.fill}
          // opacity={index === activeIndex ? 1 : 0.6}
        />
      ))}
    </Pie>
    <Legend />
    <Tooltip />
    {/* Middle Label */}
    <text
      x="50%"
      y="50%"
      textAnchor="middle"
      dominantBaseline="middle"
      style={{ fontSize: '16px', fontWeight: 'bold', fill: '#333' }}
    >
      Total: {leaveStatusData.reduce((sum, entry) => sum + entry.count, 0)}
    </text>
  </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div
              className="chart-container"
              style={{
                width: '45%',
                minWidth: '300px',
                borderRadius: '25px',
                padding: '16px',
                backgroundColor: 'rgb(233, 231, 255)',
                color: 'rgb(66, 23, 115)',
                boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
              }}
            >
              <h3 style={{ textAlign: 'center', marginBottom: '16px' }}>Leave Status Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={filteredLeaveStatusByDate}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="date" label={{ value: 'Date', position: 'bottom' }} />
                  <YAxis label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
                  
                  <Bar dataKey="approved" fill="#32CD32" />
                  <Bar dataKey="rejected" fill="#FF0000" />
                  <Bar dataKey="pending" fill="#FFA07A" />
                  <Legend />
                  <Tooltip />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default LeaveCountGraphsCharts;
