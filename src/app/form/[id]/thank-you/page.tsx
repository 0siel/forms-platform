import Link from "next/link";

export default function ThankYouPage({ params }: { params: { id: string } }) {
  const formId = params.id;

  return (
    <div className="max-w-xl mx-auto p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">
        Thank you for your submission!
      </h1>
      <p className="text-gray-600">Your responses have been saved.</p>

      <p className="mt-4 text-gray-600">
        Would you like to ask AI about the responses?
      </p>

      <Link
        href={`/form/${formId}/ask`}
        className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Ask AI
      </Link>
    </div>
  );
}
