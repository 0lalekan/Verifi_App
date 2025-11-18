import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import FakeMapComponent from '../components/FakeMapComponent';

const AdminDashboardScreen = () => {
  const { data: logs, isLoading, error } = useQuery({
    queryKey: ['adminLogs'],
    queryFn: async () => {
      const response = await axios.get('/api/logs');
      return response.data;
    },
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Regulator Scan Dashboard</h1>

      {isLoading && <p className="text-gray-600">Loading...</p>}

      {error && <p className="text-red-500">Error fetching logs: {error.message}</p>}

      {logs && (
        <>
          <p className="mb-4">Total Logs: {logs.length}</p>
          <FakeMapComponent scanLogs={logs} />
        </>
      )}
    </div>
  );
};

export default AdminDashboardScreen;
