import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const body = await req.json();

  const { title, description, fields } = body;

  try {
    const form = await prisma.form.create({
      data: {
        title,
        description,
        fields: {
          create: fields.map((field: any) => ({
            label: field.label,
            type: field.type,
            required: field.required,
          })),
        },
      },
    });

    return NextResponse.json({ success: true, form });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
