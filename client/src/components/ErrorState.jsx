import React from 'react';

const ErrorState = ({ title = "Something went wrong", message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center h-full min-h-[400px]">
      <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-3xl mb-4">
        ⚠️
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 max-w-xs mx-auto mb-6">
        {message || "We couldn't load the data. Please check your connection."}
      </p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="px-6 py-2 bg-white border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;