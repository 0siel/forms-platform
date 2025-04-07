"use client";

import { useState } from "react";

type Field = {
  label: string;
  type: "text" | "textarea" | "radio" | "rating";
  required: boolean;
  options: string[];
};

export default function CreateFormPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState<Field[]>([
    { label: "", type: "text", required: false, options: [""] },
  ]);

  const addField = () => {
    setFields([
      ...fields,
      { label: "", type: "text", required: false, options: [""] },
    ]);
  };

  const updateField = <K extends keyof Field>(
    index: number,
    key: K,
    value: Field[K]
  ) => {
    const updated = [...fields];
    updated[index][key] = value;
    setFields(updated);
  };

  const updateOption = (
    fieldIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const updated = [...fields];
    updated[fieldIndex].options[optionIndex] = value;
    setFields(updated);
  };

  const addOption = (fieldIndex: number) => {
    const updated = [...fields];
    updated[fieldIndex].options.push("");
    setFields(updated);
  };

  const handleSubmit = async () => {
    const res = await fetch("/api/forms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, fields }),
    });

    if (res.ok) {
      alert("Form saved!");
    } else {
      alert("Something went wrong");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create a Form</h1>

      <input
        className="w-full p-2 border mb-2 rounded"
        placeholder="Form title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="w-full p-2 border mb-4 rounded"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <h2 className="text-lg font-semibold mb-2">Fields</h2>
      {fields.map((field, index) => (
        <div key={index} className="mb-4 space-y-2">
          <input
            className="w-full p-2 border rounded"
            placeholder="Question label"
            value={field.label}
            onChange={(e) => updateField(index, "label", e.target.value)}
          />
          <select
            className="w-full p-2 border rounded"
            value={field.type}
            onChange={(e) =>
              updateField(index, "type", e.target.value as Field["type"])
            }
          >
            <option value="text">Text</option>
            <option value="textarea">Paragraph</option>
            <option value="radio">Multiple Choice</option>
            <option value="rating">1-5 Rating</option>
          </select>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={field.required}
              onChange={(e) => updateField(index, "required", e.target.checked)}
            />
            <span>Required</span>
          </label>

          {field.type === "rating" && (
            <div className="flex space-x-1 items-center">
              {[1, 2, 3, 4, 5].map((num) => (
                <span
                  key={num}
                  className="border px-3 py-1 rounded cursor-default hover:bg-gray-100"
                >
                  {num}
                </span>
              ))}
            </div>
          )}

          {field.type === "radio" && (
            <div>
              {field.options.map((option, optionIndex) => (
                <input
                  key={optionIndex}
                  className="w-full p-2 border rounded mb-1"
                  placeholder={`Option ${optionIndex + 1}`}
                  value={option}
                  onChange={(e) =>
                    updateOption(index, optionIndex, e.target.value)
                  }
                />
              ))}
              <button
                onClick={() => addOption(index)}
                className="text-sm text-blue-500 hover:underline"
              >
                + Add Option
              </button>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={addField}
        className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded mb-4"
      >
        + Add Field
      </button>

      <br />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save Form
      </button>
    </div>
  );
}
