import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import openaiinstance from "@/lib/openai";

import getCommonValidationResponse, { isPro } from "@/lib/validations-openai";

export async function POST(
  req: Request
) {
  try {
    const body = await req.json();
    const { prompt, amount = 1, resolution = "512x512" } = body;

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    if (!amount) {
      return new NextResponse("Amount is required", { status: 400 });
    }

    if (!resolution) {
      return new NextResponse("Resolution is required", { status: 400 });
    }

    const validationResponse = await getCommonValidationResponse();

    if (validationResponse.status !== 200) {
      return new NextResponse(validationResponse.message, { status: validationResponse.status });
    }

    const response = await openaiinstance.createImage({
      prompt,
      n: parseInt(amount, 10),
      size: resolution,
    });    

    return NextResponse.json(response.data.data);
  } catch (error) {
    //console.log('[IMAGE_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
