import { auth } from "@clerk/nextjs";
import { checkSubscription } from "@/lib/subscription";
import { checkApiLimit } from "@/lib/api-limit";


let isPro: boolean;
async function getCommonValidationResponse() {

    const { userId } = auth();
    
    if (!userId) {
        return { status: 401, message: "Unauthorized" };
    }   

    const freeTrial = await checkApiLimit();
    isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
        return { status: 403, message: "Free trial has expired. Please upgrade to pro." };
    }

    return { status: 200, message: "Success" };

}

export {isPro};

export default getCommonValidationResponse;