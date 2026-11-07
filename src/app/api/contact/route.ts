/**
 * Formulaire de contact : le relais vit dans `lib/relais-contact`, partagé avec
 * le Worker Cloudflare (`cloudflare/worker.ts`). Cette route ne fait que le
 * brancher sur Next.
 */
import { traiterContact } from '@/lib/relais-contact';

export const POST = traiterContact;
