import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material'; // Import the download icon

const LeaveReports = () => {
  const [fileFormat, setFileFormat] = useState("excel");
  const [query, setQuery] = useState("SELECT * FROM LeaveRequests"); // Default query

  const handleDownload = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/download-leave-requests?format=${fileFormat}&query=${encodeURIComponent(query)}`, { responseType: 'blob' });
      const fileExtension = fileFormat === "excel" ? ".xlsx" : fileFormat === "csv" ? ".csv" : ".pdf";
      const blob = new Blob([response.data], { type: 'application/octet-stream' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `leave_requests${fileExtension}`;
      link.click();
    } catch (error) {
      console.error('Error downloading file', error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <div className="mb-4">
        <label className="block text-lg font-semibold text-gray-700 mb-2">Select File Format:</label>
        <select 
          value={fileFormat} 
          onChange={(e) => setFileFormat(e.target.value)} 
          className="p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500"
        >
          <option value="excel">Excel (.xlsx)</option>
          <option value="csv">CSV (.csv)</option>
          <option value="pdf">PDF (.pdf)</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-lg font-semibold text-gray-700 mb-2">Custom SQL Query (Optional):</label>
        <input 
          type="text" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          className="p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500"
          placeholder="Enter custom SQL query"
        />
      </div>

      <Button 
        onClick={handleDownload} 
        variant="contained" 
        color="primary" 
        endIcon={<DownloadIcon />}
        fullWidth
      >
        Download Leave Requests
      </Button>
    </div>
  );
};

export default LeaveReports;
