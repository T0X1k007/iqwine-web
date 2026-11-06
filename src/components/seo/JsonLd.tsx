import { jsonLdScript } from '@/lib/structured-data';

/** Un bloc JSON-LD rendu côté serveur, dans le HTML initial. */
export default function JsonLd({ data }: { data: unknown }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(data) }} />
  );
}
