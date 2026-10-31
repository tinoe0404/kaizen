/**
 * Server component that renders a JSON-LD script tag for structured data.
 * Escapes `<` to prevent XSS in inline scripts.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

