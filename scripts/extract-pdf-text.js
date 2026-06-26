import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const metadataPath = 'data/extracted/pdfs/metadata.json';
const outputDir = 'data/extracted/pages';

function commandExists(command) {
  return spawnSync('bash', ['-lc', `command -v ${command}`], { encoding: 'utf8' }).status === 0;
}

async function main() {
  await mkdir(outputDir, { recursive: true });
  const metadata = JSON.parse(await readFile(metadataPath, 'utf8'));

  if (!commandExists('pdftotext')) {
    console.warn('pdftotext is not installed; skipping raw text extraction. Install poppler-utils and rerun this script.');
    return;
  }

  for (const source of metadata) {
    if (!source.filePath || !existsSync(source.filePath)) {
      console.warn(`Skipping ${source.id}: cached PDF not found. Run npm run fetch:pdfs first.`);
      continue;
    }
    const textPath = path.join(outputDir, `${source.id}.txt`);
    const result = spawnSync('pdftotext', ['-layout', source.filePath, textPath], { encoding: 'utf8' });
    if (result.status !== 0) throw new Error(result.stderr || `pdftotext failed for ${source.id}`);
    await writeFile(path.join(outputDir, `${source.id}.json`), `${JSON.stringify({ sourceId: source.id, textPath, extractedAt: new Date().toISOString() }, null, 2)}\n`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
