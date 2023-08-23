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
      "anotherjesse/zeroscope-v2-xl:71996d331e8ede8ef7bd76eba9fae076d31792e4ddf4ad057779b443d6aea62f",
      {
        input: {
          prompt,
        }
      }
    );

    if (!isPro) {
      await incrementApiLimit();
    }

    return NextResponse.json(response);
  } catch (error) {
    //console.log('[VIDEO_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
