
import { GoogleGenAI, Type } from "@google/genai";
import type { FunnelJSON, FunnelFormState } from '../types';

// This function will run on a server, not in the browser.
// Ensure the API_KEY is set as an environment variable in your Vercel project settings.
if (!process.env.API_KEY) {
    // In a serverless environment, this won't stop the build but will fail at runtime.
    // We'll return an error response instead of throwing.
}

const landingPageSchema = {
    type: Type.OBJECT,
    properties: {
        meta: {
            type: Type.OBJECT,
            properties: {
                brand_idea: { type: Type.STRING },
                industry: { type: Type.STRING },
                tone: { type: Type.STRING },
                mode: { type: Type.STRING },
                big_idea: { type: Type.STRING, description: "Single sentence that sums up the promise." }
            },
            required: ["brand_idea", "industry", "tone", "mode", "big_idea"]
        },
        layout: { type: Type.ARRAY, items: { type: Type.STRING } },
        hero: {
            type: Type.OBJECT,
            properties: {
                headline: { type: Type.STRING },
                subheadline: { type: Type.STRING },
                primary_cta: { type: Type.STRING },
                secondary_cta: { type: Type.STRING },
                hero_points: { type: Type.ARRAY, items: { type: Type.STRING } },
                viral_hook: { type: Type.STRING, description: "One short pattern-interrupt line for the very top." }
            },
            required: ["headline", "subheadline", "primary_cta", "secondary_cta", "hero_points", "viral_hook"]
        },
        social_proof: {
            type: Type.OBJECT,
            properties: {
                proof_line: { type: Type.STRING, description: "Short proof statement or credibility bar." },
                badges: { type: Type.ARRAY, items: { type: Type.STRING } },
                mini_testimonials: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            snippet: { type: Type.STRING },
                            result: { type: Type.STRING }
                        },
                        required: ["name", "snippet", "result"]
                    }
                }
            },
            required: ["proof_line", "badges", "mini_testimonials"]
        },
        benefits: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                bullets: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["title", "bullets"]
        },
        how_it_works: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                steps: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            step: { type: Type.STRING },
                            title: { type: Type.STRING },
                            desc: { type: Type.STRING }
                        },
                        required: ["step", "title", "desc"]
                    }
                }
            },
            required: ["title", "steps"]
        },
        offer: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                items: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            desc: { type: Type.STRING },
                            value_tag: { type: Type.STRING }
                        },
                        required: ["name", "desc", "value_tag"]
                    }
                },
                price_anchor: { type: Type.STRING },
                primary_cta: { type: Type.STRING },
                risk_reversal: { type: Type.STRING }
            },
            required: ["title", "items", "price_anchor", "primary_cta", "risk_reversal"]
        },
        bonus: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                items: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            desc: { type: Type.STRING }
                        },
                        required: ["name", "desc"]
                    }
                }
            },
            required: ["title", "items"]
        },
        faq: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    q: { type: Type.STRING },
                    a: { type: Type.STRING }
                },
                required: ["q", "a"]
            }
        },
        guarantee: {
            type: Type.OBJECT,
            properties: {
                headline: { type: Type.STRING },
                copy: { type: Type.STRING }
            },
            required: ["headline", "copy"]
        },
        cta_block: {
            type: Type.OBJECT,
            properties: {
                headline: { type: Type.STRING },
                button_text: { type: Type.STRING },
                reassurance: { type: Type.STRING }
            },
            required: ["headline", "button_text", "reassurance"]
        },
        branding: {
            type: Type.OBJECT,
            properties: {
                color_palette: {
                    type: Type.OBJECT,
                    properties: {
                        primary: { type: Type.STRING },
                        secondary: { type: Type.STRING },
                        accent: { type: Type.STRING },
                        background: { type: Type.STRING },
                        text: { type: Type.STRING }
                    },
                    required: ["primary", "secondary", "accent", "background", "text"]
                },
                typography: {
                    type: Type.OBJECT,
                    properties: {
                        heading: { type: Type.STRING },
                        body: { type: Type.STRING }
                    },
                    required: ["heading", "body"]
                }
            },
            required: ["color_palette", "typography"]
        },
        extras: {
            type: Type.OBJECT,
            properties: {
                ugc_hooks: { type: Type.ARRAY, items: { type: Type.STRING } },
                ad_angles: { type: Type.ARRAY, items: { type: Type.STRING } },
                email_subjects: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["ugc_hooks", "ad_angles", "email_subjects"]
        },
        systeme_sections: {
            type: Type.OBJECT,
            properties: {
                hero_html: { type: Type.STRING },
                benefits_html: { type: Type.STRING },
                offer_html: { type: Type.STRING },
                faq_html: { type: Type.STRING },
                cta_html: { type: Type.STRING }
            },
            required: ["hero_html", "benefits_html", "offer_html", "faq_html", "cta_html"]
        }
    },
    required: ["meta", "layout", "hero", "social_proof", "benefits", "how_it_works", "offer", "bonus", "faq", "guarantee", "cta_block", "branding", "extras", "systeme_sections"]
};


/**
 * This is a Vercel Serverless Function handler.
 * It handles POST requests to /api/generate.
 */
export default async function handler(request: Request): Promise<Response> {
    if (!process.env.API_KEY) {
        return new Response(JSON.stringify({ error: "API_KEY environment variable is not set on the server." }), {
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
            As an expert direct-response marketer named FunnelBot, generate a complete, conversion-ready marketing funnel based on the provided inputs.

            **Your Task:**
            Create all the copy, structure, branding, and marketing assets for a landing page.
            The output must be a single, valid JSON object that strictly follows the provided schema. Do not include any text, markdown, or comments outside of the JSON object.

            **Inputs:**
            - Brand/Product Idea: "${brandIdea}"
            - Industry: "${industry}"
            - Tone of Voice: "${tone}"
            - Generation Mode: "${mode}" (Quick = concise copy, Detailed = more fleshed-out copy)

            **Key Directives:**
            - **Tone:** The copy must consistently reflect the "${tone}" tone.
            - **Clarity:** Use scannable copy with short sentences and bullet points.
            - **Relevance:** The offer and all content should be highly relevant to the "${industry}" and the core idea: "${brandIdea}".
            - **Credibility:** Use realistic promises. Avoid hype.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: landingPageSchema,
                temperature: 0.7,
            },
        });
        
        const rawText = response.text;
        
        // Defensively find and extract the JSON part of the response
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.error("Model response did not contain a valid JSON object. Response:", rawText);
            throw new Error("Failed to generate valid funnel structure. The model's response was not in the expected format.");
        }
        
        const jsonText = jsonMatch[0];
        let parsedData: FunnelJSON;

        try {
            parsedData = JSON.parse(jsonText);
        } catch (parseError: any) {
            console.error("Failed to parse JSON from model. Raw text:", jsonText);
            throw new Error(`The model returned a malformed structure. Details: ${parseError.message}`);
        }


        if (!parsedData.meta || !parsedData.layout) {
            throw new Error("Received invalid data structure from API. Required fields are missing.");
        }

        return new Response(JSON.stringify(parsedData), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error: any) {
        console.error("Error in API route (/api/generate):", error);
        const errorMessage = error.message || "Could not generate funnel. The model may have returned an unexpected response.";
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

// Vercel config to specify the runtime.
export const config = {
    runtime: 'edge',
};
