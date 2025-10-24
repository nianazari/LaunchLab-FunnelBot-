
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center mb-8 md:mb-12">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
        <span className="bg-gradient-to-r from-purple-400 to-indigo-400 text-transparent bg-clip-text">LaunchLab</span> FunnelBot™
      </h1>
      <p className="mt-3 md:mt-4 max-w-2xl mx-auto text-lg md:text-xl text-slate-400">
        Your one-click AI-powered marketing funnel generator.
      </p>
    </header>
  );
};

export default Header;
