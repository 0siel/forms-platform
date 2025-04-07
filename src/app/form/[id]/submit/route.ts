import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // Await the promise-wrapped params
  const { id: formId } = await context.params;

  const data = await req.formData();
  const answers = [];

  for (const [fieldLabel, value] of data.entries()) {
    answers.push({
      fieldLabel,
      value: value.toString(),
    });
  }

  try {
    await prisma.response.create({
      data: {
        formId,
        answers: {
          create: answers,
        },
      },
    });

    return NextResponse.redirect(new URL(`/form/${formId}/thank-you`, req.url));
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to save response" },
      { status: 500 }
    );
  }
}
