import React from "react";
import { FunnelJSON } from "../types";
import { buildFullPageSnippet } from "../utils/buildFullPageSnippet";

export const FullPageSnippetButton: React.FC<{ data: FunnelJSON }> = ({ data }) => {
  const handleClick = async () => {
    const snippet = buildFullPageSnippet(data);
    try {
      await navigator.clipboard.writeText(snippet);
      alert("Embeddable HTML snippet copied to clipboard.");
    } catch (err) {
      console.error("Failed to copy snippet: ", err);
      alert("Could not copy snippet to clipboard.");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="text-sm px-4 py-2 rounded-lg bg-slate-600 hover:bg-slate-700 text-white font-semibold transition-colors shadow-md flex items-center gap-2"
      title="Copy embeddable HTML snippet for platforms like Systeme.io"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 12" />
      </svg>
      Copy Snippet for Embedding
    </button>
  );
};
