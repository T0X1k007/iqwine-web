/**
 * Takes a display title and renders the trailing period (.) in orange,
 * per brand kit (terminal period signature). If the title ends with any
 * other punctuation or no punctuation, the title is rendered as-is and
 * an orange period is appended.
 */
interface TitleAccentProps {
  text: string;
  className?: string;
}

export default function TitleAccent({ text }: TitleAccentProps) {
  // Strip exactly one trailing period if present
  const trailing = /\.\s*$/.test(text);
  const base = trailing ? text.replace(/\.\s*$/, '') : text;
  return (
    <>
      {base}
      <span className="iq-period">.</span>
    </>
  );
}
