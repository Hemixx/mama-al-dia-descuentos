// Valida panoramas.json antes de publicarlo: formato, edades, URLs y vencidos.
// Uso: node check-panoramas.mjs   (quita vencidos y duplicados automáticamente)
import { readFileSync, writeFileSync } from 'node:fs';

const FILE = 'panoramas.json';
const REGIONS = [
  'Todo Chile', 'Santiago (RM)', 'Arica y Parinacota', 'Tarapacá', 'Antofagasta', 'Atacama', 'Coquimbo', 'Valparaíso',
  "O'Higgins", 'Maule', 'Ñuble', 'Biobío', 'Araucanía', 'Los Ríos', 'Los Lagos', 'Aysén', 'Magallanes',
];
const KINDS = ['Cafetería con juegos', 'Parque', 'Museo', 'Biblioteca', 'Taller', 'Evento', 'Juegos y entretención', 'Otro'];
const FIELDS = ['id', 'title', 'place', 'kind', 'description', 'region', 'price', 'when', 'url'];

const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Santiago' }).format(new Date());
const data = JSON.parse(readFileSync(FILE, 'utf8'));
const errors = [];
const seen = new Set();

const panoramas = (data.panoramas ?? []).filter((p, i) => {
  const where = `#${i + 1} (${p.title ?? 'sin título'})`;
  for (const f of FIELDS) if (typeof p[f] !== 'string' || !p[f].trim()) errors.push(`${where}: falta "${f}"`);
  if (!REGIONS.includes(p.region)) errors.push(`${where}: región inválida "${p.region}"`);
  if (!KINDS.includes(p.kind)) errors.push(`${where}: tipo inválido "${p.kind}"`);
  if (!Number.isInteger(p.ageMin) || !Number.isInteger(p.ageMax) || p.ageMin < 0 || p.ageMax > 18 || p.ageMin > p.ageMax) {
    errors.push(`${where}: ageMin y ageMax deben ser enteros entre 0 y 18, con ageMin <= ageMax`);
  }
  if (p.address != null && typeof p.address !== 'string') errors.push(`${where}: address debe ser texto o null`);
  if (!/^https:\/\//.test(p.url ?? '')) errors.push(`${where}: la URL debe empezar con https://`);
  if (p.endsAt != null && !/^\d{4}-\d{2}-\d{2}$/.test(p.endsAt)) errors.push(`${where}: endsAt debe ser AAAA-MM-DD o null`);
  if (p.endsAt && p.endsAt < today) return false; // terminado: se quita
  if (seen.has(p.id)) return false; // duplicado: se quita
  seen.add(p.id);
  return true;
});

if (errors.length) {
  console.error('panoramas.json tiene errores:\n- ' + errors.join('\n- '));
  process.exit(1);
}
if (panoramas.length < 5) {
  console.error(`Solo hay ${panoramas.length} panoramas vigentes; se esperaban al menos 5. No se publica.`);
  process.exit(1);
}

writeFileSync(FILE, JSON.stringify({ updatedAt: new Date().toISOString(), panoramas }, null, 2) + '\n');
console.log(`panoramas.json OK: ${panoramas.length} panoramas vigentes.`);
