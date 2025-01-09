import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Cancel } from '@mui/icons-material';
import AddTaskSharpIcon from '@mui/icons-material/AddTaskSharp';
import Permission from './Permission';
import { fetchPermissions, updatePermissionStatus } from '../redux/permissionsSlice';

function PermissionStatus() {
  const dispatch = useDispatch();

  const [showPermissionForm, setShowPermissionForm] = useState(false);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const { permissionRequests, loading, error } = useSelector((state) => state.permissions);

  // Fetch user data from Redux store
  const { userData } = useSelector((state) => state.leavestatus); // Assuming `leavestatus` contains `userData`

  // Fetch permission data when component mounts or userData changes
  useEffect(() => {
    if (userData) {
      dispatch(fetchPermissions());
    }
  }, [userData, dispatch]);

  // Filter permissions based on role
  useEffect(() => {
    if (userData?.role === 'Admin') {
      setFilteredRequests(permissionRequests);
    } else {
      const userSpecificData = permissionRequests.filter((row) => row.user_id === userData?.user_id);
      setFilteredRequests(userSpecificData);
    }
  }, [userData, permissionRequests]);

  const handleUpdateStatus = (id, status) => {
    dispatch(updatePermissionStatus({ id, status }));
  };

  const columns = [
    { field: 'user_id', headerName: 'User ID', width: 150 },
    { field: 'username', headerName: 'Username', width: 150 },
    {
      field: 'date',
      headerName: 'Date',
      width: 250,
      renderCell: (params) => {
        const { date, in_time, out_time } = params.row || {};
        const formatTime24Hr = (time) => {
          const formattedTime = new Date(`1970-01-01T${time}`);
          return formattedTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
        };

        return (
          <span className="px-4 py-2">
            {date ? new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
            {in_time && out_time ? ` (${formatTime24Hr(in_time)} - ${formatTime24Hr(out_time)})` : ''}
          </span>
        );
      },
    },
    { field: 'total_hours', headerName: 'Total Hours', width: 150 },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      cellClassName: (params) => {
        switch (params.value) {
          case 'Approved': return 'bg-green-200';
          case 'Rejected': return 'bg-red-200';
          case 'Pending': return 'bg-yellow-200';
          default: return '';
        }
      },
    },
    { field: 'reason', headerName: 'Reason', width: 250 },
    userData?.role === 'Admin' && {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        params.row.status === 'Pending' && (
          <>
            <AddTaskSharpIcon
              onClick={() => handleUpdateStatus(params.row.id, 'Approved')}
              style={{ color: 'green', cursor: 'pointer', marginRight: '16px' }}
            />
            <Cancel
              onClick={() => handleUpdateStatus(params.row.id, 'Rejected')}
              style={{ color: 'red', cursor: 'pointer' }}
            />
          </>
        )
      ),
    },
  ].filter(Boolean);

  return (
    <div style={{ height: 600, width: '100%' }} className="max-w-4xl mx-auto p-4">
      {userData ? (
        <div className="text-sm text-gray-700 mb-4">
          <p className="inline-block bg-green-100 px-2 py-1 m-2 rounded-md">User: "{userData.name}"</p>
          <p className="inline-block bg-green-100 px-2 py-1 m-2 rounded-md">User ID: {userData.user_id}</p>
          <p className="inline-block bg-green-100 px-2 py-1 m-2 rounded-md">Role: {userData.role}</p>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
      <button
        onClick={() => setShowPermissionForm(!showPermissionForm)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        {showPermissionForm ? 'Close Permission Form' : 'Open Permission Form'}
      </button>
      {showPermissionForm && <Permission />}
      <DataGrid
        rows={filteredRequests}
        columns={columns}
        pageSize={10}
        loading={loading}
        error={error}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        sx={{
          '& .MuiDataGrid-row:nth-of-type(even)': {
            backgroundColor: 'rgba(208, 220, 223, 0.37)', // Light grey for even rows
          },
        }}
      />
    </div>
  );
}

export default PermissionStatus;
