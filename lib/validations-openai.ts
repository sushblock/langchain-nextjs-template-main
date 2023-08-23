import { auth } from "@clerk/nextjs";
import { checkSubscription } from "@/lib/subscription";
import { checkApiLimit, incrementApiLimit } from "@/lib/api-limit";
import {configuration} from "@/lib/openai";


let isPro: boolean;
async function getCommonValidationResponse() {

    const { userId } = auth();    

    if (!userId) {
        return { status: 401, message: "Unauthorized" };
    }

    if (!configuration.apiKey) {
        return { status: 500, message: "OpenAI API Key not configured" };
    }   

    const freeTrial = await checkApiLimit();
    isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
        return { status: 403, message: "Free trial has expired. Please upgrade to pro." };
    }

    if (!isPro) {
        await incrementApiLimit();
      }

    return { status: 200, message: "Success" };

}

export {isPro};

export default getCommonValidationResponse;