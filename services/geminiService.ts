import { FunnelJSON, FunnelFormState } from '../types';

export const generateFunnelStream = async (
  formState: FunnelFormState,
  onChunk: (chunk: string) => void
): Promise<FunnelJSON> => {
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
        errorMsg = errorData.error || errorMsg;
      } catch (e) {
        // Response might not be JSON
      }
      throw new Error(errorMsg);
    }

    if (!response.body) {
      throw new Error("The response body is empty.");
    }

    // Process the stream
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      const chunk = decoder.decode(value, { stream: true });
      fullResponse += chunk;
      onChunk(chunk); // Callback to update UI with raw text
    }

    // After stream is complete, parse the full JSON
    try {
      const data: FunnelJSON = JSON.parse(fullResponse);
      return data;
    } catch (parseError) {
      console.error("Failed to parse the streamed JSON:", parseError);
      console.error("Received raw response:", fullResponse);
      throw new Error("The AI returned an invalid funnel structure. Please try again.");
    }

  } catch (error: any) {
    console.error("Error fetching from API route:", error);
    throw new Error(error.message || "Failed to communicate with the generation service.");
  }
};
