import React, { useState, useEffect, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

function AdminCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [fromDate, setFromDate] = useState(new Date()); // Set default to current date
  const [toDate, setToDate] = useState(new Date()); // Set default to current date
  const [allLeaves, setAllLeaves] = useState([]); // Store all leaves
  const [filteredLeaves, setFilteredLeaves] = useState([]); // Filtered leaves for the selected date range

  // Load leave applications from backend (fetched once)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const leavesResponse = await axios.get('http://localhost:5000/leave/get-all-status');
        setAllLeaves(leavesResponse.data); // Set all leaves in state
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Utility function to reset time to midnight for date comparison
  const resetTimeToMidnight = (date) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0); // Set time to midnight
    return newDate;
  };

  // Filter leaves based on the selected date range (from_date and to_date)
  useEffect(() => {
    if (fromDate && toDate) {
      const resetFromDate = resetTimeToMidnight(fromDate); // Reset time for fromDate
      const resetToDate = resetTimeToMidnight(toDate); // Reset time for toDate

      const filteredLeaves = allLeaves.filter((leave) => {
        const leaveFromDate = resetTimeToMidnight(new Date(leave.from_date)); // Reset time for leave's from_date
        const leaveToDate = resetTimeToMidnight(new Date(leave.to_date)); // Reset time for leave's to_date

        // Check if the leave's date range falls within the selected range
        return leaveFromDate >= resetFromDate && leaveToDate <= resetToDate;
      });

      setFilteredLeaves(filteredLeaves);
    } else {
      setFilteredLeaves([]); // No filter applied if fromDate or toDate is null
    }
  }, [fromDate, toDate, allLeaves]); // Runs when fromDate, toDate, or allLeaves changes

  // Define columns for the DataGrid
  const columns = [
    { field: 'user_name', headerName: 'User Name', width: 200 },
    { field: 'reason', headerName: 'Reason', width: 300 },
    { field: 'from_date', headerName: 'From', width: 300 },
    { field: 'to_date', headerName: 'To', width: 300 },
    { field: 'status', headerName: 'Status', width: 150 },
  ];

  const rows = useMemo(
    () =>
      filteredLeaves.map((leave, index) => ({
        id: leave.id,
        user_name: leave.user_name,
        from_date: new Date(leave.from_date).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        to_date: new Date(leave.to_date).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        reason: leave.reason,
        status: leave.status,
      })),
    [filteredLeaves] // Recalculate rows only when filteredLeaves changes
  );

  return (
    <div>
      <Grid container spacing={3} p={6}>
        {/* Date Picker Section at the top of the table */}
        <Grid item xs={12}>
          <h1 className="text-2xl font-bold mb-4">Leave Calendar</h1>
          
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} md={5}>
              <div className="mb-4">
                <h2 className="text-lg font-medium text-gray-700 mb-2">Select From Date</h2>
                <DatePicker
                  selected={fromDate}
                  onChange={setFromDate}
                  dateFormat="dd-MMM-yyyy"
                  className="shadow-lg border-2 border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholderText="Select From Date"
                />
              </div>
            </Grid>

            <Grid item xs={12} md={5}>
              <div className="mb-4">
                <h2 className="text-lg font-medium text-gray-700 mb-2">Select To Date</h2>
                <DatePicker
                  selected={toDate}
                  onChange={setToDate}
                  dateFormat="dd-MMM-yyyy"
                  className="shadow-lg border-2 border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholderText="Select To Date"
                />
              </div>
            </Grid>
          </Grid>
        </Grid>
        
        {/* Leave Details Section below the date pickers */}
        <Grid item xs={12}>
          <h2 className="text-xl font-semibold mb-4">
            Leave Details from {fromDate?.toDateString()} to {toDate?.toDateString()}
          </h2>

          {/* DataGrid for Leaves */}
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5} // You can adjust the number of rows per page
              rowsPerPageOptions={[5]} // Allow only 5 rows per page
              disableSelectionOnClick // Disable row selection on click
              checkboxSelection // Optionally enable checkbox selection
            />
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default AdminCalendar;
