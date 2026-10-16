// Valida deals.json antes de publicarlo: formato, URLs y vencidos.
// Uso: node check-deals.mjs   (corrige vencidos y duplicados automáticamente)
import { readFileSync, writeFileSync } from 'node:fs';

const FILE = 'deals.json';
const REGIONS = [
  'Todo Chile', 'Santiago (RM)', 'Arica y Parinacota', 'Tarapacá', 'Antofagasta', 'Atacama', 'Coquimbo', 'Valparaíso',
  "O'Higgins", 'Maule', 'Ñuble', 'Biobío', 'Araucanía', 'Los Ríos', 'Los Lagos', 'Aysén', 'Magallanes',
];
const CATEGORIES = ['Bebé', 'Embarazo', 'Salud', 'Ropa', 'Alimentación', 'Panoramas', 'Educación', 'Beneficio estatal', 'Otro'];
const FIELDS = ['id', 'title', 'store', 'description', 'discount', 'region', 'category', 'url'];

const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Santiago' }).format(new Date());
const data = JSON.parse(readFileSync(FILE, 'utf8'));
const errors = [];
const seen = new Set();

const deals = (data.deals ?? []).filter((d, i) => {
  const where = `#${i + 1} (${d.title ?? 'sin título'})`;
  for (const f of FIELDS) if (typeof d[f] !== 'string' || !d[f].trim()) errors.push(`${where}: falta "${f}"`);
  if (!REGIONS.includes(d.region)) errors.push(`${where}: región inválida "${d.region}"`);
  if (!CATEGORIES.includes(d.category)) errors.push(`${where}: categoría inválida "${d.category}"`);
  if (!/^https:\/\//.test(d.url ?? '')) errors.push(`${where}: la URL debe empezar con https://`);
  if (d.expiresAt != null && !/^\d{4}-\d{2}-\d{2}$/.test(d.expiresAt)) errors.push(`${where}: expiresAt debe ser AAAA-MM-DD o null`);
  if (d.expiresAt && d.expiresAt < today) return false; // vencido: se quita
  if (seen.has(d.id)) return false; // duplicado: se quita
  seen.add(d.id);
  return true;
});

if (errors.length) {
  console.error('deals.json tiene errores:\n- ' + errors.join('\n- '));
  process.exit(1);
}
if (deals.length < 5) {
  console.error(`Solo hay ${deals.length} descuentos vigentes; se esperaban al menos 5. No se publica.`);
  process.exit(1);
}

writeFileSync(FILE, JSON.stringify({ updatedAt: new Date().toISOString(), deals }, null, 2) + '\n');
console.log(`deals.json OK: ${deals.length} descuentos vigentes.`);
