import React from "react";
import { FunnelJSON } from "../types";
import { buildFullPageHtml } from "../utils/buildFullPageHtml";

export const FullPageHtmlButton: React.FC<{ data: FunnelJSON }> = ({ data }) => {
  const handleClick = async () => {
    const html = buildFullPageHtml(data);

    // Copy to clipboard
    try {
      await navigator.clipboard.writeText(html);
    } catch {}

    // Also download .html
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "launchlab_funnel.html";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    alert("Full-page HTML copied to clipboard and downloaded.");
  };

  return (
    <button
      onClick={handleClick}
      className="text-sm px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors shadow-md flex items-center gap-2"
      title="Copy and download full-page HTML"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 12 2.25a2.251 2.251 0 0 1 1.498 3.692m-3.398 6.043A5.25 5.25 0 0 0 12 20.25a5.25 5.25 0 0 0 3.398-9.213m-3.398 9.213-3.398-9.213" />
      </svg>
      Copy & Download Page
    </button>
  );
};
