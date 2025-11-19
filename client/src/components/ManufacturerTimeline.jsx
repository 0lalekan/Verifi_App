import React from 'react';

const ManufacturerTimeline = ({ productHistory }) => {
  // Sort history by createdAt ascending (chronological for timeline)
  const sortedHistory = [...productHistory].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  const getEventIcon = (status) => {
    if (status === 'Valid') {
      // Green dot
      return (
        <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow"></div>
      );
    } else {
      // Red flag icon for 'Fake' or 'Expired'
      return (
        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v.01a1 1 0 110 2c0 .28.22.5.5.5h.5a.5.5 0 00.5-.5V4H3v9.5c0 .83.67 1.5 1.5 1.5h1.5a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5h-1A1.5 1.5 0 013 12.5V3z" clipRule="evenodd" />
        </svg>
      );
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">Product Timeline</h2>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>

        {sortedHistory.map((log, index) => (
          <div key={log._id || index} className="relative flex mb-6">
            {/* Icon on the line */}
            <div className="absolute left-2 flex items-center justify-center w-8 h-8 bg-white rounded-full border-2 border-gray-300">
              {getEventIcon(log.status)}
            </div>

            {/* Event details */}
            <div className="ml-12 p-3 bg-white rounded-lg shadow border w-full">
              <div className="text-sm text-gray-600">
                <strong>Scan Date:</strong> {new Date(log.createdAt).toLocaleString()}
              </div>
              {log.productBatch && (
                <div className="text-sm text-gray-600">
                  <strong>Manufactured Date:</strong> {/* Assuming productBatch.createdAt or leave if not */}
                  {log.productBatch.createdAt ? new Date(log.productBatch.createdAt).toLocaleString() : 'N/A'}
                </div>
              )}
              {log.location && (
                <div className="text-sm text-gray-600">
                  <strong>Location:</strong> {log.location.latitude}, {log.location.longitude}
                </div>
              )}
              <div className="text-sm">
                <strong>Status:</strong> {log.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManufacturerTimeline;
