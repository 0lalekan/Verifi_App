import React from 'react';

const FakeMapComponent = ({ scanLogs }) => {
  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold mb-2">Scan Logs (Map Placeholder)</h2>
      <div className="bg-gray-100 p-4 rounded-lg">
        {scanLogs.length > 0 ? (
          <ul className="space-y-2">
            {scanLogs.slice(0, 10).map((log, index) => (
              <li key={index} className="bg-white p-2 rounded shadow">
                <p><strong>Batch:</strong> {log.batchNumber}</p>
                <p><strong>Location:</strong> {log.latitude?.toFixed(4)}, {log.longitude?.toFixed(4)}</p>
                <p><strong>Timestamp:</strong> {new Date(log.createdAt).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No scan logs available.</p>
        )}
        {scanLogs.length > 10 && (
          <p className="text-sm text-gray-600 mt-2">Showing first 10 logs...</p>
        )}
      </div>
    </div>
  );
};

export default FakeMapComponent;
