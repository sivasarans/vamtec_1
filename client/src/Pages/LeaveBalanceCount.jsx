import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box'; // Importing Box from MUI
import { fetchLeaveBalance_all_users } from '../redux/leavestatus'; // Adjust the path
import { useSelector, useDispatch } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

const LeaveBalanceCount = () => {
  const [leaveData, setLeaveData] = useState(null);
  const [serverError, setServerError] = useState(false); // State to track server errors
  const userData = useSelector((state) => state.leavestatus.userData);
  const dispatch = useDispatch();
  const leaveBalance_all_users = useSelector((state) => state.leavestatus.leaveBalance_all_users);

  // Fetch leave data for all users on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchLeaveBalance_all_users());
        console.log("xxx", serverError)
        setServerError(false); // Reset server error on successful fetch
      } catch (error) {
        console.error('Error fetching leave balance:', error);
        setServerError(true); // Set server error if fetch fails
      }
    };

    fetchData();
  }, [dispatch]);

  // Fetch leave data for the current user
  useEffect(() => {
    console.log(userData,leaveBalance_all_users )
    if (!userData || !leaveBalance_all_users) return;

    const userLeaveData = Array.isArray(leaveBalance_all_users)
      ? leaveBalance_all_users.find((item) => item.user_id === userData.user_id)
      : null;

    if (userLeaveData) {
      setLeaveData(userLeaveData);
    } else {
      setLeaveData(null);
    }
  }, [userData, leaveBalance_all_users]);

  const leaveTypes = [
    { key: 'EL', name: 'Earned Leave' },
    { key: 'SL', name: 'Sick Leave' },
    { key: 'CL', name: 'Casual Leave' },
    { key: 'CO', name: 'Compensatory Off' },
    { key: 'OOD', name: 'On Duty Leave' },
    { key: 'SML', name: 'Special Medical Leave' },
    { key: 'WFH', name: 'Work From Home' },
    { key: 'A', name: 'Annual Leave' },
    { key: 'ML', name: 'Maternity Leave' },
    { key: 'PL', name: 'Paternity Leave' },
    { key: 'MP', name: 'Marriage Leave' },
  ];

  return (
    <>
      <Box sx={{ marginBottom: 3 }}>
        <p className="inline-block bg-green-100 px-2 py-1 m-2 rounded-md mb-5">
          Leave Balances
        </p>
      </Box>

      {serverError ? (
        <p className="text-red-500 font-medium">Turn on server to fetch leave data</p>
      ) : leaveData ? (
        <Swiper
          spaceBetween={20}
          slidesPerView={3}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            320: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          modules={[Navigation, Pagination]}
        >
          {leaveTypes.map(({ key, name }) => (
            <SwiperSlide key={key}>
              <Box
                sx={{
                  p: 2,
                  border: 1,
                  backgroundColor: 'rgb(241, 251, 255)',
                  borderRadius: '8px',
                  textAlign: 'center',
                  width: '100%',
                  margin: '0 auto',
                  maxWidth: '500px',
                  boxShadow: '0px 8px 16px rgba(99, 69, 207, 0.57)',
                }}
              >
                <p className="font-medium">{name}</p>
                <p className="text-sm text-blue-500">
                  Available: {leaveData[`${key.toLowerCase()}_available`] || 0} Day(s)
                </p>
                <p className="text-sm text-red-500">
                  Availed: {leaveData[`${key.toLowerCase()}_availed`] || 0} Day(s)
                </p>
                <p className="text-sm text-green-500">
                  Balance: {leaveData[`${key.toLowerCase()}_balance`] || 0} Day(s)
                </p>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p>No leave data available / Turn On Server</p>
      )}
    </>
  );
};

export default LeaveBalanceCount;
