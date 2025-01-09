import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Tooltip, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaveRequests } from '../../redux/leavestatus';
import { fetchPermissions } from '../../redux/permissionsSlice';

function CustomDay(props) {
  const { leaveDays = [], permissionDays = [], day, outsideCurrentMonth, selectedStyle, ...other } = props;

  const leaveStatus = leaveDays.find((leave) => dayjs(leave.date).isSame(day, 'day'));
  const permissionStatus = permissionDays.find((permission) => dayjs(permission.date).isSame(day, 'day'));

  const tooltipMessage = leaveStatus?.status || permissionStatus?.status || '';

  const defaultColors = {
    Approved: { backgroundColor: '#d0f5d0', color: '#2e7d32' },
    Rejected: { backgroundColor: '#f8d7da', color: '#d32f2f' },
    Pending: { backgroundColor: '#fff3cd', color: '#856404' },
  };

  const uniqueColors = {
    Approved: { backgroundColor: '#aed581', color: '#33691e' },
    Rejected: { backgroundColor: '#e57373', color: '#b71c1c' },
    Pending: { backgroundColor: '#ffd54f', color: '#f57f17' },
    PermissionApproved: { backgroundColor: '#b3e5fc', color: '#01579b' },
    PermissionRejected: { backgroundColor: '#ff8a80', color: '#d32f2f' },
    PermissionPending: { backgroundColor: '#ffecb3', color: '#f9a825' },
  };

  const getBackgroundStyle = (status, isPermission) => {
    if (selectedStyle === 'unique') {
      return uniqueColors[isPermission ? `Permission${status}` : status] || {};
    }
    return defaultColors[status] || {};
  };

// Assuming selectedStyle is a variable holding the current style selection (either 'unique' or 'default')
const permissionStatusSymbol = (selectedStyle !== 'unique' && permissionStatus) ? 'P' : null;

  return (
    <div style={{ position: 'relative' }}>
      <Tooltip title={tooltipMessage} arrow>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <PickersDay
            {...other}
            day={day}
            outsideCurrentMonth={outsideCurrentMonth}
            style={{
              borderRadius: '50%',
              ...getBackgroundStyle(leaveStatus?.status || permissionStatus?.status, !!permissionStatus),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
            }}
          />
          {permissionStatusSymbol && (
            <span
              style={{
                position: 'absolute',
                top: '2px',
                right: '4px',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                color: getBackgroundStyle(permissionStatus?.status, true).color,
              }}
            >
              {permissionStatusSymbol}
            </span>
          )}
        </div>
      </Tooltip>
    </div>
  );
}

export default function EmployeeLeaveCalendar() {
  const [selectedStyle, setSelectedStyle] = useState('unique'); // Set unique style as default
  const dispatch = useDispatch();
  const { leavestatusData, loading, userData } = useSelector((state) => state.leavestatus);
  const { permissionRequests } = useSelector((state) => state.permissions);
  const { user_id, name } = userData || {};

  useEffect(() => {
    if (user_id) {
      dispatch(fetchLeaveRequests());
      dispatch(fetchPermissions());
    }
  }, [dispatch, user_id]);

  const leaveData = leavestatusData.filter((leave) => leave.user_id === user_id).flatMap((leave) => {
    const startDate = dayjs(leave.from_date);
    const endDate = dayjs(leave.to_date);
    const datesInRange = [];
    for (let currentDate = startDate; currentDate.isBefore(endDate, 'day') || currentDate.isSame(endDate, 'day'); currentDate = currentDate.add(1, 'day')) {
      datesInRange.push({ date: currentDate, status: leave.status });
    }
    return datesInRange;
  });

  const permissionData = permissionRequests.filter((permission) => permission.user_id === user_id).map((permission) => ({
    date: dayjs(permission.date),
    status: permission.status,
  }));

  return (
    <>
      <div className="mb-4">
        <Button variant="outlined" onClick={() => setSelectedStyle((prev) => (prev === 'default' ? 'unique' : 'default'))}>
          Switch to {selectedStyle === 'default' ? 'Unique' : 'Default'} Style
        </Button>
        <div className="mt-4 text-sm">
          <p className="text-gray-700">Color Legend:</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs rounded-lg p-5" style={{ backgroundColor: 'rgba(116, 171, 247, 0.8)' }}>
          {selectedStyle === 'unique' ? (
              <>
                <div className="flex items-center ">
  <div className="w-3 h-3 mr-2" style={{ backgroundColor: '#aed581' }}></div>
  <span>Leave Approved</span>
</div>
<div className="flex items-center">
  <div className="w-3 h-3 mr-2" style={{ backgroundColor: '#ffd54f' }}></div>
  <span>Leave Pending</span>
</div>
<div className="flex items-center">
  <div className="w-3 h-3 mr-2" style={{ backgroundColor: '#e57373' }}></div>
  <span>Leave Rejected</span>
</div>
<div className="flex items-center">
  <div className="w-3 h-3 mr-2" style={{ backgroundColor: '#b3e5fc' }}></div>
  <span>Permission Approved</span>
</div>
<div className="flex items-center">
  <div className="w-3 h-3 mr-2" style={{ backgroundColor: '#ffecb3' }}></div>
  <span>Permission Pending</span>
</div>
<div className="flex items-center">
  <div className="w-3 h-3 mr-2" style={{ backgroundColor: '#ff8a80' }}></div>
  <span>Permission Rejected</span>
</div>

              </>
            ) : (
              <>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-200 mr-2"></div>
                  <span>Approved</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-200 mr-2"></div>
                  <span>Pending</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-200 mr-2"></div>
                  <span>Rejected</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-900 mr-2 font-bold">P</span>
                  <span>Permission</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          loading={loading}
          views={['year', 'month', 'day']}
          slots={{
            day: CustomDay,
          }}
          slotProps={{
            day: {
              leaveDays: leaveData,
              permissionDays: permissionData,
              selectedStyle,
            },
          }}
          style={{ 
            backgroundColor: 'rgb(213, 218, 125)',  // Background color
            borderRadius: '1.9rem'                   // Rounded corners (you can adjust the value)
          }}

        />
      </LocalizationProvider>
    </>
  );
}
