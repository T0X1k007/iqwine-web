#!/usr/bin/env node
/**
 * SONDE de la garde du vocabulaire du magasin (eslint.config.mjs,
 * `VOCABULAIRE_INTERDIT`), ajoutée avec elle le 2026-11-06.
 *
 * ── Pourquoi une sonde ────────────────────────────────────────────────────
 * Une règle `no-restricted-syntax` mal échappée ne rougit sur RIEN, et rien
 * ne le signale : `npm run lint` reste vert, exactement comme quand le site
 * est propre. C'est le « cliquet décoratif » que la garde jumelle de l'app
 * (`tests/i18n/zero-saq-generique.test.ts`) documente et prévient par
 * mutation. Ici, même idée : on fait lire au VRAI linter, avec la VRAIE
 * configuration, des extraits qui doivent rougir et d'autres qui doivent
 * passer, et le moindre écart fait échouer la sonde (code 1).
 *
 * Usage : npm run vocabulaire:sonder   (aucun réseau, quelques secondes)
 */
import { ESLint } from 'eslint';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Deadline dure : une sonde ne doit jamais pendre (règle globale anti-stall).
setTimeout(() => {
  console.error('[vocabulaire] délai dépassé (60 s).');
  process.exit(124);
}, 60_000).unref();

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const eslint = new ESLint({ cwd: RACINE });
// Un chemin fictif SOUS src/ : c'est lui qui sélectionne le bloc de règles.
const FICHIER = path.join(RACINE, 'src/components/__sonde-vocabulaire__.tsx');

/** [extrait, doit-il rougir ?] — chaque forme de nœud, chaque terme. */
const CAS = [
  // Chaînes (Literal), dont un attribut alt.
  ["export const a = 'Au point de vente le plus proche';", true],
  ["export const a = 'Un réseau de points de vente';", true],
  ["export const a = 'Photographiée en succursale';", true],
  ["export const a = 'Les succursales du Québec';", true],
  ["export const a = 'Disponible à la SAQ';", true],
  ["export const a = 'Voir sur saq.com';", true],
  ["export const E = () => <img alt=\"Dans un point de vente\" src=\"/x.png\" />;", true],
  // Texte JSX.
  ['export const E = () => <p>Disponible en succursale</p>;', true],
  ['export const E = () => <p>Prix SAQ du jour</p>;', true],
  // Gabarit.
  ['export const a = (n: number) => `${n} points de vente`;', true],
  // Ce qui doit PASSER : le vocabulaire officiel et l'identifiant technique.
  ["export const a = 'Disponible en magasin, près de vous';", false],
  ['export const E = () => <p>Available in store</p>;', false],
  ["export const source = 'saq';", false],
  ["export const a = 'Vente de vins';", false],
];

let echecs = 0;
for (const [code, doitRougir] of CAS) {
  const [resultat] = await eslint.lintText(code, { filePath: FICHIER });
  const rougit = resultat.messages.some(
    (m) => m.ruleId === 'no-restricted-syntax' && /Vocabulaire interdit/.test(m.message),
  );
  if (rougit !== doitRougir) {
    echecs++;
    console.error(
      `[vocabulaire] ${doitRougir ? 'NON DÉTECTÉ' : 'FAUX POSITIF'} : ${code}` +
        (resultat.messages.length ? `\n  ${resultat.messages.map((m) => m.message).join('\n  ')}` : ''),
    );
  }
}
if (echecs > 0) {
  console.error(`[vocabulaire] ${echecs} cas sur ${CAS.length} en écart : la garde ne garde plus.`);
  process.exit(1);
}
console.log(`[vocabulaire] garde vivante : ${CAS.length} cas sur ${CAS.length} conformes.`);
