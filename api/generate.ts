import { GoogleGenAI } from "@google/genai";
import type { FunnelFormState } from '../types';

// This function will run on a server, not in the browser.
// Ensure the API_KEY is set as an environment variable in your Vercel project settings.

/**
 * This is a Vercel Serverless Function handler using the streaming API.
 * It handles POST requests to /api/generate.
 */
export default async function handler(request: Request): Promise<Response> {
    if (!process.env.API_KEY) {
        return new Response(JSON.stringify({ error: "API_KEY environment variable is not set." }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const formState: FunnelFormState = await request.json();
        const { brandIdea, industry, tone, mode } = formState;

        const prompt = `
          You are an expert marketing funnel generator. Your SOLE task is to generate a complete marketing funnel as a single, valid JSON object.
          Do NOT output any other text, markdown, or explanations before or after the JSON object. The output must be parsable by \`JSON.parse()\`.

          **Inputs:**
          - Brand/Product Idea: "${brandIdea}"
          - Industry: "${industry}"
          - Tone of Voice: "${tone}"
          - Generation Mode: "${mode}" (Quick = concise, Detailed = more copy)

          **Instructions:**
          - The entire output MUST be a single JSON object.
          - Consistently use a "${tone}" tone.
          - Ensure all copy is relevant to the "${industry}" and "${brandIdea}".
          - Generate 5 distinct HTML snippets for the 'systeme_sections' property. These should be simple, embeddable HTML.
          - The 'layout' array should contain the names of the key sections in a logical order.
        `;

        const stream = await ai.models.generateContentStream({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                temperature: 0.7,
            },
        });

        // Create a new ReadableStream to pipe the model's output
        const readableStream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                for await (const chunk of stream) {
                    const text = chunk.text;
                    if (text) {
                        controller.enqueue(encoder.encode(text));
                    }
                }
                controller.close();
            },
        });

        return new Response(readableStream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'X-Content-Type-Options': 'nosniff',
            },
        });

    } catch (error: any) {
        console.error("Error in API route (/api/generate):", error);
        return new Response(JSON.stringify({ error: "An unexpected error occurred during funnel generation." }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

// Switch to Node.js runtime with a longer timeout to prevent cold-start issues.
export const config = {
    runtime: 'nodejs',
    maxDuration: 60, // seconds
};
