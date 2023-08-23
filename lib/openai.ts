import { Configuration, OpenAIApi } from "openai";

export const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY || undefined,
});


const openai = new OpenAIApi(configuration);

declare global {
    var openai: OpenAIApi | undefined
}

const openaiinstance = globalThis.openai || new OpenAIApi(configuration)
if (process.env.NODE_ENV !== "production") globalThis.openai = openaiinstance

export default openaiinstance;
