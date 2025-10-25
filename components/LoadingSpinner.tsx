
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="relative h-24 w-24">
        <div className="absolute inset-0 rounded-full border-4 border-slate-700"></div>
        <div className="absolute inset-0 rounded-full border-t-4 border-purple-500 animate-spin"></div>
      </div>
      <p className="mt-4 text-lg font-semibold text-slate-300 tracking-wider">Crafting Your Funnel...</p>
      <p className="text-sm text-slate-500">The AI is putting on its marketing hat. This can take up to a minute.</p>
    </div>
  );
};

export default LoadingSpinner;