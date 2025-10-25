import React, { useState, useCallback } from 'react';
import { FunnelJSON, FunnelFormState } from './types';
import { generateFunnelStream } from './services/geminiService';
import Header from './components/Header';
import FunnelForm from './components/FunnelForm';
import { FunnelDisplay } from './components/FunnelDisplay';

const App: React.FC = () => {
  const [data, setData] = useState<FunnelJSON | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [streamingResponse, setStreamingResponse] = useState<string>('');

  const onGenerate = useCallback(async (formState: FunnelFormState) => {
    setLoading(true);
    setError(null);
    setData(null);
    setStreamingResponse('');

    try {
      const result = await generateFunnelStream(formState, (chunk) => {
        setStreamingResponse((prev) => prev + chunk);
      });
      setData(result);
    } catch (err: any) {
      setError(err?.message || 'Failed to generate funnel.');
      console.error(err);
    } finally {
      setLoading(false);
      setStreamingResponse('');
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_45rem_at_top,rgba(140,75,255,0.2),#0f172a)] opacity-70" />
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#8C4BFF] to-[#4f46e5] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'}}></div>
        </div>
        
        <main className="container mx-auto px-4 py-8 md:py-12">
          <Header />
          <div className="max-w-4xl mx-auto">
            <FunnelForm onSubmit={onGenerate} isLoading={loading} />
            
            <div className="mt-12">
              <FunnelDisplay data={data} loading={loading} error={error} streamingResponse={streamingResponse} />
            </div>
          </div>
        </main>
        
        <footer className="text-center py-6 mt-8">
          <p className="text-sm text-slate-500">Powered by Gemini</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
