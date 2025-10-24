import { FunnelJSON, FunnelFormState } from '../types';

export const generateFunnel = async (formState: FunnelFormState): Promise<FunnelJSON> => {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formState),
    });

    if (!response.ok) {
      let errorMsg = `Server error: ${response.statusText}`;
      try {
        const errorData = await response.json();
        // Use the error message from the serverless function if available
        errorMsg = errorData.error || errorMsg;
      } catch (e) {
        // Response might not be JSON, proceed with the status text
      }
      throw new Error(errorMsg);
    }

    const data: FunnelJSON = await response.json();
    return data;

  } catch (error: any) {
    console.error("Error fetching from API route:", error);
    // Re-throw a user-friendly error message
    throw new Error(error.message || "Failed to communicate with the generation service.");
  }
};
