import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";

const prisma = new PrismaClient();

export default async function FormPage({ params }: { params: { id: string } }) {
  const form = await prisma.form.findUnique({
    where: { id: params.id },
    include: { fields: true },
  });

  if (!form) return notFound();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">{form.title}</h1>
      <p className="mb-4 text-gray-600">{form.description}</p>

      <form
        action={`/form/${form.id}/submit`}
        method="POST"
        className="space-y-4"
      >
        {form.fields.map((field) => (
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
