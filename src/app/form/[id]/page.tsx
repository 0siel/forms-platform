import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";

// 1) Force dynamic route handling
export const dynamicParams = true;

const prisma = new PrismaClient();

// 2) Define PageProps with promise-wrapped properties
export interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Extend the field type to include an optional "options" property.
interface FormField {
  id: string;
  formId: string;
  label: string;
  type: "text" | "textarea" | "radio" | "rating";
  required: boolean;
  options?: string[];
}

export default async function FormPage({ params }: PageProps) {
  // Await the promise-wrapped params
  const resolvedParams = await params;

  // 3) Fetch the form + fields from your DB
  const form = await prisma.form.findUnique({
    where: { id: resolvedParams.id },
    include: { fields: true },
  });

  if (!form) return notFound();

  // Cast fields as FormField[] so that TypeScript recognizes the optional "options"
  const fields = form.fields as FormField[];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">{form.title}</h1>
      <p className="mb-4 text-gray-600">{form.description}</p>

      {/* 
        4) The POST action points to /form/[id]/submit (dynamic route),
        passing the form ID in the URL. 
      */}
      <form
        action={`/form/${form.id}/submit`}
        method="POST"
        className="space-y-4"
      >
        {fields.map((field) => (
          <div key={field.id}>
            <label className="block font-medium mb-1">{field.label}</label>

            {field.type === "textarea" && (
              <textarea
                name={field.label}
                required={field.required}
                className="w-full p-2 border rounded"
              />
            )}

            {field.type === "text" && (
              <input
                type="text"
                name={field.label}
                required={field.required}
                className="w-full p-2 border rounded"
              />
            )}

            {field.type === "radio" && field.options && (
              <div className="space-y-2">
                {field.options.map((option, idx) => (
                  <label key={idx} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={field.label}
                      value={option}
                      required={field.required}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}

            {field.type === "rating" && (
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <label key={num} className="flex items-center space-x-1">
                    <input
                      type="radio"
                      name={field.label}
                      value={num}
                      required={field.required}
                    />
                    <span>{num}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
