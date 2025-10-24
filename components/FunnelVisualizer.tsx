import React from 'react';
import { FunnelJSON } from '../types';
import AwarenessIcon from './icons/AwarenessIcon';
import InterestIcon from './icons/InterestIcon';
import ConsiderationIcon from './icons/ConsiderationIcon';
import ConversionIcon from './icons/ConversionIcon';

interface FunnelStageProps {
  icon: React.ReactNode;
  title: string;
  content: string;
  color: string;
}

const FunnelStage: React.FC<FunnelStageProps> = ({ icon, title, content, color }) => (
  <div className="flex items-start space-x-4">
    <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div>
      <h3 className="text-lg font-bold text-white">{title}</h3>
      <p className="mt-1 text-sm text-slate-300">"{content}"</p>
    </div>
  </div>
);

const FunnelVisualizer: React.FC<{ data: FunnelJSON }> = ({ data }) => {
  const stages = [
    {
      icon: <AwarenessIcon className="w-7 h-7 text-white" />,
      title: "Awareness",
      content: data.extras.ad_angles[0] || data.hero.viral_hook,
      color: "bg-sky-500/80",
    },
    {
      icon: <InterestIcon className="w-7 h-7 text-white" />,
      title: "Interest",
      content: data.hero.headline,
      color: "bg-teal-500/80",
    },
    {
      icon: <ConsiderationIcon className="w-7 h-7 text-white" />,
      title: "Consideration",
      content: data.offer.title,
      color: "bg-amber-500/80",
    },
    {
      icon: <ConversionIcon className="w-7 h-7 text-white" />,
      title: "Conversion",
      content: data.cta_block.headline,
      color: "bg-rose-500/80",
    },
  ];

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur p-4 md:p-6 mb-4">
      <h2 className="text-xl font-semibold tracking-tight text-white/90 mb-6 text-center">Your Funnel at a Glance</h2>
      <div className="relative pl-6">
        {/* Dotted line connecting stages */}
        <div className="absolute left-[35px] top-10 bottom-10 w-0.5 border-l-2 border-dashed border-slate-600" aria-hidden="true"></div>
        
        <div className="space-y-8">
          {stages.map((stage, index) => (
            <FunnelStage key={index} {...stage} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FunnelVisualizer;