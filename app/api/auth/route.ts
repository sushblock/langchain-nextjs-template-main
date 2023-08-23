import { NextResponse } from "next/server";

import getCommonValidationResponse, { isPro } from "@/lib/validations-openai";
import { incrementApiLimit } from "@/lib/api-limit";

export async function POST(
  req: Request
) {
  try {   

    const validationResponse = await getCommonValidationResponse();

    if (validationResponse.status !== 200) {
      return new NextResponse(validationResponse.message, { status: validationResponse.status });
    }  
    
    if (!isPro) {
        await incrementApiLimit();
    }

    return NextResponse.json("Success", { status: 200 });
  } catch (error) {
    //console.log('[CONVERSATION_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
