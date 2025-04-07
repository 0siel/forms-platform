import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const prisma = new PrismaClient();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // Updated type: params is a Promise
) {
  // Await the params to get the id
  const { id: formId } = await context.params;
  const { question } = await req.json();

  const responses = await prisma.response.findMany({
    where: { formId },
    include: { answers: true },
  });

  if (!responses.length) {
    return NextResponse.json({ answer: "There are no responses yet." });
  }

  const structured = responses.map((r, i) => ({
    [`Response #${i + 1}`]: r.answers
      .map((a) => `${a.fieldLabel}: ${a.value}`)
      .join(", "),
  }));

  const prompt = `
Here are some survey responses:
${structured.map((r) => JSON.stringify(r)).join("\n")}

Now answer this question based on the responses (be concise and clear):
"${question}"
`;

  try {
    const chat = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant who analyzes survey responses.",
        },
        { role: "user", content: prompt },
      ],
      model: "gpt-4o-mini",
    });

    const reply = chat.choices[0].message.content;

    return NextResponse.json({ answer: reply });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return NextResponse.json(
      { answer: "AI failed to respond." },
      { status: 500 }
    );
  }
}
