import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Permission() {
  const [formData, setFormData] = useState({
    date: '',
    startTime: '15:00', // 3:00 PM
    endTime: '16:30',   // 4:30 PM
    reason: '',
  });
  const [alertMessage, setAlertMessage] = useState({ message: '', type: '' });
  const [userData, setUserData] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { startTime, endTime, reason, date } = formData;
    const start = startTime.split(':').map(Number);
    const end = endTime.split(':').map(Number);
    const duration = (end[0] * 60 + end[1] - start[0] * 60 - start[1]) / 60;

    if (duration < 0.5 || duration > 2) {
      setAlertMessage({ message: 'Duration must be between 30 minutes and 2 hours.', type: 'error' });
      return;
    }

    try {
      const payload = { user_id: userData.user_id, date, in_time: startTime, out_time: endTime, reason };
      const response = await axios.post('http://localhost:5000/permission', payload);

      setAlertMessage({
        message: response.status === 200 ? 'Permission added successfully!' : `Error: ${response.data.error}`,
        type: response.status === 200 ? 'success' : 'error',
      });
    } catch (error) {
      setAlertMessage({ message: 'Server error occurred while submitting the form.', type: 'error' });
    }
  };

  useEffect(() => {
    setFormData((prevData) => ({ ...prevData, date: new Date().toISOString().split('T')[0] }));
    const storedUserData = localStorage.getItem('userDetails');
    if (storedUserData) setUserData(JSON.parse(storedUserData));
  }, []);

  useEffect(() => {
    if (alertMessage.message) {
      const timer = setTimeout(() => setAlertMessage({ message: '', type: '' }), 3000);
      return () => clearTimeout(timer); // Cleanup the timeout on unmount or when the alert message changes
    }
  }, [alertMessage]);

  return (
//     <div className="w-full max-w-md mx-auto p-4 bg-grey rounded-lg shadow-md">
//   {alertMessage.message && (
//     <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 p-4 rounded-md w-80 text-center ${alertMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
//       {alertMessage.message}
//     </div>
//   )}

//   <h2 className="text-xl font-semibold text-center mb-4">Permission Request</h2>
  
//   {userData && (
//     <div className="text-sm text-gray-700 mb-4">
//       <p className="inline-block bg-green-100 px-2 py-1 m-2 rounded-md">
//         User:  "{userData.name}"
//       </p>      <p className="inline-block bg-green-100 px-2 py-1 m-2 rounded-md">
//         User ID :  {userData.user_id}
//       </p>
//     </div>
//   )}

//   {/* One-line form inputs */}
//   <div className="flex space-x-4 mb-4">
//     <div className="w-1/3">
//       <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
//       <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" />
//     </div>
//     <div className="w-1/3">
//       <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
//       <input type="time" id="startTime" name="startTime" value={formData.startTime} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" />
//     </div>
//     <div className="w-1/3">
//       <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
//       <input type="time" id="endTime" name="endTime" value={formData.endTime} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" />
//     </div>
//   </div>

//   {/* Reason input */}
//   <div className="mb-4">
//     <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Reason</label>
//     <textarea id="reason" name="reason" value={formData.reason} onChange={handleChange} rows="3" className="w-full p-2 border border-gray-300 rounded-md" required></textarea>
//   </div>

//   {/* Submit button */}
//   <div className="mb-4">
//     <button onClick={handleSubmit} className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">Submit</button>
//   </div>
// </div>

<div className="w-full max-w-md mx-auto p-4 bg-gray-300 rounded-2xl shadow-2xl">
{alertMessage.message && (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 p-4 rounded-md w-80 text-center ${alertMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
      {alertMessage.message}
    </div>
  )}

  <h2 className="text-xl font-semibold text-center mb-4">Permission Request</h2>
  
  {userData && (
    <div className="text-sm text-gray-700 mb-4">
      <p className="inline-block bg-green-100 px-2 py-1 m-2 rounded-md">
        User:  "{userData.name}"
      </p>      
      <p className="inline-block bg-green-100 px-2 py-1 m-2 rounded-md">
        User ID: {userData.user_id}
      </p>
    </div>
  )}

  {/* One-line form inputs */}
  <div className="flex space-x-4 mb-4">
    <div className="w-1/3">
      <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
      <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-2 border border-gray-300 bg-pink-100 rounded-md" />

    </div>
    <div className="w-1/3">
      <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
      <input type="time" id="startTime" name="startTime" value={formData.startTime} onChange={handleChange} className="w-full p-2 border border-gray-300 bg-pink-100 rounded-md" />
    </div>
    <div className="w-1/3">
      <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
      <input type="time" id="endTime" name="endTime" value={formData.endTime} onChange={handleChange} className="w-full p-2 border border-gray-300 bg-pink-100 rounded-md" />
    </div>
  </div>

  {/* Reason input */}
  <div className="mb-4">
    <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Reason</label>
    <textarea id="reason" name="reason" value={formData.reason} onChange={handleChange} rows="3" className="w-full p-2 border border-gray-300 bg-yellow-100 rounded-md" required></textarea>
  </div>

  {/* Submit button */}
  <div className="mb-4">
    <button onClick={handleSubmit} className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 shadow-lg">Submit</button>
  </div>
</div>


  );
}

export default Permission;
