import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const RegulatorDashboardScreen = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['verificationLogs'],
    queryFn: async () => {
      const response = await axios.get('/api/logs');
      return response.data;
    },
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Naija-Verify: Raw Scan Data Logs</h1>

      {isLoading && (
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      )}

      {error && (
        <div className="text-center">
          <p className="text-red-500">Error fetching logs: {error.message}</p>
        </div>
      )}

      {data && (
        <>
          {(() => {
            const logsToDisplay = data?.data ? data.data : data;
            return Array.isArray(logsToDisplay) && logsToDisplay.length > 0 ? (
              <>
                <p className="mb-4">Total Scans: {logsToDisplay.length}</p>
                <table className="min-w-full bg-white border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 border-b text-left">Batch Number</th>
                      <th className="px-4 py-2 border-b text-left">Status</th>
                      <th className="px-4 py-2 border-b text-left">Latitude</th>
                      <th className="px-4 py-2 border-b text-left">Longitude</th>
                      <th className="px-4 py-2 border-b text-left">Accuracy (m)</th>
                      <th className="px-4 py-2 border-b text-left">Scanned By (Email)</th>
                      <th className="px-4 py-2 border-b text-left">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logsToDisplay.map((log, index) => (
                      <tr key={log._id || index} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border-b">{log.productBatch}</td>
                        <td className="px-4 py-2 border-b">{log.status}</td>
                        <td className="px-4 py-2 border-b">{log.location?.latitude || 'N/A'}</td>
                        <td className="px-4 py-2 border-b">{log.location?.longitude || 'N/A'}</td>
                        <td className="px-4 py-2 border-b">{log.locationAccuracy ? log.locationAccuracy.toLocaleString() : 'N/A'}</td>
                        <td className="px-4 py-2 border-b">{log.scannedBy?.email || 'N/A'}</td>
                        <td className="px-4 py-2 border-b">{new Date(log.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              <p className="text-center text-gray-600">No verification data recorded yet.</p>
            );
          })()}
        </>
      )}
    </div>
  );
};

export default RegulatorDashboardScreen;
