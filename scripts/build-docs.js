import { cp, mkdir, copyFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const optionalCopies = [
  ['data/sources/campus-il-pdfs.json', 'docs/data/sources/campus-il-pdfs.json'],
  ['data/sources/all-campus-il-pdfs.json', 'docs/data/sources/all-campus-il-pdfs.json'],
  ['data/official/catalog.json', 'docs/data/official/catalog.json'],
  ['data/official/solution-index.json', 'docs/data/official/solution-index.json'],
  ['data/official/explanations-preview.json', 'docs/data/official/explanations-preview.json'],
  ['data/official/formula-candidates.json', 'docs/data/official/formula-candidates.json']
];

async function copyIfPresent(from, to) {
  if (!existsSync(from)) return;
  await mkdir(to.split('/').slice(0, -1).join('/'), { recursive: true });
  await copyFile(from, to);
}

async function main() {
  await mkdir('docs/src', { recursive: true });
  await mkdir('docs/data', { recursive: true });
  await copyFile('index.html', 'docs/index.html');
  await copyFile('404.html', 'docs/404.html');
  await cp('src', 'docs/src', { recursive: true });
  await rm('docs/data/extracted', { recursive: true, force: true });
  await rm('docs/data/official/content-index.json', { force: true });
  await Promise.all(optionalCopies.map(([from, to]) => copyIfPresent(from, to)));
  console.log('docs mirror synced without raw extraction artifacts');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
