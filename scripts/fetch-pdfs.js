import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const manifestPath = process.argv[2] || 'data/sources/campus-il-pdfs.json';
const outputDir = '.cache/pdfs';
const metadataPath = 'data/extracted/pdfs/metadata.json';

function assertCampusPdf(url) {
  const parsed = new URL(url);
  if (parsed.hostname !== 'courses.campus.gov.il') throw new Error(`URL is not from courses.campus.gov.il: ${url}`);
  if (!decodeURIComponent(parsed.pathname).endsWith('.pdf')) throw new Error(`URL is not a PDF: ${url}`);
}

async function download(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  const contentType = response.headers.get('content-type') || '';
  const buffer = Buffer.from(await response.arrayBuffer());
  if (!buffer.subarray(0, 4).equals(Buffer.from('%PDF'))) throw new Error(`Downloaded file is not a PDF: ${url} (${contentType})`);
  return buffer;
}

async function main() {
  await mkdir(outputDir, { recursive: true });
  await mkdir(path.dirname(metadataPath), { recursive: true });
  const manifestJson = JSON.parse(await readFile(manifestPath, 'utf8'));
  const manifest = Array.isArray(manifestJson) ? manifestJson : manifestJson.pdfs;
  const metadata = [];

  for (const source of manifest) {
    assertCampusPdf(source.url);
    const filePath = path.join(outputDir, `${source.id}.pdf`);
    let buffer;
    if (existsSync(filePath)) {
      buffer = await readFile(filePath);
    } else {
      buffer = await download(source.url);
      await writeFile(filePath, buffer);
    }
    metadata.push({
      ...source,
      filePath,
      bytes: buffer.length,
      sha256: createHash('sha256').update(buffer).digest('hex'),
      fetchedAt: new Date().toISOString()
    });
  }

  await writeFile(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`);
  console.log(`Fetched ${metadata.length} PDFs`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
