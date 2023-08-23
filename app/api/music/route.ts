import replicate_instance from "@/lib/replicate";
import { NextResponse } from "next/server";

import { incrementApiLimit} from "@/lib/api-limit";
import getCommonValidationResponse, { isPro } from "@/lib/validations-replicate";

export async function POST(
  req: Request
) {
  try {
    const body = await req.json();
    const { prompt  } = body;

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }
    
    const validationResponse = await getCommonValidationResponse();

    if (validationResponse.status !== 200) {
      return new NextResponse(validationResponse.message, { status: validationResponse.status });
    }

    const response = await replicate_instance.run(
      "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
      {
        input: {
          prompt_a: prompt
        }
      }
    );

    if (!isPro) {
      await incrementApiLimit();
    }

    return NextResponse.json(response);
  } catch (error) {
    //console.log('[MUSIC_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
