
import React, { useState } from 'react';
import type { FunnelFormState } from '../types';

interface FunnelFormProps {
  onSubmit: (data: FunnelFormState) => void;
  isLoading: boolean;
}

const FunnelForm: React.FC<FunnelFormProps> = ({ onSubmit, isLoading }) => {
  const [formState, setFormState] = useState<FunnelFormState>({
    brandIdea: '',
    industry: 'Ecommerce',
    tone: 'Playful',
    mode: 'Quick',
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formState.brandIdea.trim()) {
      onSubmit(formState);
    }
  };

  const industryOptions = ["Coaching", "Ecommerce", "Beauty", "Wellness", "Courses", "Agency", "SaaS"];
  const toneOptions = ["Playful", "Bold", "Luxury", "Minimalist", "Professional", "Friendly"];
  const modeOptions = ["Quick", "Detailed"];

  const inputBaseClasses = "w-full bg-slate-800/80 border border-slate-700 rounded-md py-3 px-4 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 ease-in-out";

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-2xl shadow-purple-900/10">
      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
        <div>
          <label htmlFor="brandIdea" className="block text-lg font-semibold mb-2 text-slate-100">Brand / Product Idea</label>
          <textarea
            id="brandIdea"
            name="brandIdea"
            value={formState.brandIdea}
            onChange={handleChange}
            placeholder="e.g., I sell handmade, scented candles for self-care and relaxation."
            rows={4}
            className={`${inputBaseClasses} resize-y`}
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="industry" className="block text-sm font-medium mb-2 text-slate-300">Industry</label>
            <select id="industry" name="industry" value={formState.industry} onChange={handleChange} className={inputBaseClasses}>
              {industryOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="tone" className="block text-sm font-medium mb-2 text-slate-300">Tone</label>
            <select id="tone" name="tone" value={formState.tone} onChange={handleChange} className={inputBaseClasses}>
              {toneOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="mode" className="block text-sm font-medium mb-2 text-slate-300">Mode</label>
            <select id="mode" name="mode" value={formState.mode} onChange={handleChange} className={inputBaseClasses}>
              {modeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading || !formState.brandIdea.trim()}
            className="w-full mt-2 flex justify-center items-center text-lg font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg px-8 py-4 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              '🚀 Generate My Funnel'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FunnelForm;
