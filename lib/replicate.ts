import Replicate from "replicate";

declare global {
  var replicate: Replicate | undefined
}

const replicate_instance = globalThis.replicate || new Replicate({
    auth: process.env.REPLICATE_API_TOKEN!,
  });
if (process.env.NODE_ENV !== "production") globalThis.replicate = replicate_instance

export default replicate_instance;
