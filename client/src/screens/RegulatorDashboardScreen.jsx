import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import FakeMapComponent from '../components/FakeMapComponent';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

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
            if (Array.isArray(logsToDisplay) && logsToDisplay.length > 0) {
              // Aggregate scans per location
              const locationCounts = {};
              logsToDisplay.forEach(log => {
                if (log.location && log.location.longitude !== null && log.location.latitude !== null) {
                  const locationKey = `${log.location.latitude.toFixed(2)}, ${log.location.longitude.toFixed(2)}`;
                  locationCounts[locationKey] = (locationCounts[locationKey] || 0) + 1;
                }
              });

              const labels = Object.keys(locationCounts);
              const dataPoints = Object.values(locationCounts);

              const chartData = {
                labels,
                datasets: [
                  {
                    label: 'Number of Scans',
                    data: dataPoints,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                  },
                ],
              };

              const chartOptions = {
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: 'Scan Distribution Map',
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Number of Scans',
                    },
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Location (Lat, Lng)',
                    },
                  },
                },
              };

              return (
                <>
                  <p className="mb-4">Total Scans: {logsToDisplay.length}</p>
                  <FakeMapComponent scanLogs={logsToDisplay} />
                  <div className="mt-6">
                    <Bar data={chartData} options={chartOptions} />
                  </div>
                </>
              );
            } else {
              return (
                <p className="text-center text-gray-600">No verification data recorded yet.</p>
              );
            }
          })()}
        </>
      )}
    </div>
  );
};

export default RegulatorDashboardScreen;
