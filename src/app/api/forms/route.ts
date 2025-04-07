import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

type FieldInput = {
  label: string;
  type: string;
  required: boolean;
};

export async function POST(req: Request) {
  const body = await req.json();

  const { title, description, fields } = body as {
    title: string;
    description?: string;
    fields: FieldInput[];
  };

  try {
    const form = await prisma.form.create({
      data: {
        title,
        description,
        fields: {
          create: fields.map((field: FieldInput) => ({
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
