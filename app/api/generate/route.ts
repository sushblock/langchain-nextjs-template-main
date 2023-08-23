import { OpenAIStream, OpenAIStreamPayload } from "@/lib/openAIStream";

export const dynamic = 'auto'
export const dynamicParams = true
export const revalidate = false
export const fetchCache = 'auto'
export const runtime = 'edge'
export const preferredRegion = 'auto'

export async function POST(req: Request): Promise<Response> {
    const { prompt } = (await req.json()) as {
        prompt?: string;
    };

    if (!prompt) {
        return new Response("No prompt in the request", { status: 400 });
    }

    // Add your instructions for ChatGPT here
    const modifiedPrompt = `
        // INSTRUCTIONS FOR CODE GENERATION:
        // 1. Code Responses: Please provide code snippets in markdown format.
        // 2. Code Comments: Use comments to explain the code whenever necessary.
        // 3. English Language: Responses should be in the English language.
        
        // User Prompt: ${prompt}
    `;       

    const payload: OpenAIStreamPayload = {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: modifiedPrompt }], // Use the modified prompt here
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 1000,
        stream: true,
        n: 1,
    };

    const stream = await OpenAIStream(payload);   

    return new Response(stream);
}
