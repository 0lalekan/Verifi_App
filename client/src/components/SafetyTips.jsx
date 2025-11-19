import React, { useState, useEffect } from 'react';

const safetyTips = [
  'Check the cap seal for breaks.',
  'Verify batch numbers match on packaging.',
  'Inspect for unusual colors or odors.',
  'Buy from trusted sources only.',
  'Report suspicious products immediately.',
  'Scan QR codes for authenticity.'
];

const SafetyTips = () => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prevIndex) => (prevIndex + 1) % safetyTips.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-lg text-sm font-medium shadow-sm">
      💡 {safetyTips[currentTipIndex]}
    </div>
  );
};

export default SafetyTips;
