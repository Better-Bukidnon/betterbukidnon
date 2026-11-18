import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const source = fileURLToPath(new URL('../data/', import.meta.url));
const destination = fileURLToPath(new URL('../apps/web/dist/client/data/', import.meta.url));
fs.mkdirSync(destination, { recursive: true });
for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
  if (entry.isFile() && /\.(?:json|geojson)$/.test(entry.name)) {
    fs.copyFileSync(path.join(source, entry.name), path.join(destination, entry.name));
  }
}
