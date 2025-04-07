import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function POST(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const formId = context.params.id;
  const data = await req.formData();

  const answers = [];

  for (const [fieldLabel, value] of data.entries()) {
    answers.push({
      fieldLabel,
      value: value.toString(),
    });
  }

  try {
    const response = await prisma.response.create({
      data: {
        formId,
        answers: {
          create: answers,
        },
      },
    });

    // 👇 Must use an ABSOLUTE URL for redirects in API routes!
    return NextResponse.redirect(new URL(`/form/${formId}/thank-you`, req.url));
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to save response" },
      { status: 500 }
    );
  }
}
