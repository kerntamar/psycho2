import { mkdir, readFile, writeFile } from 'node:fs/promises';

const downloadsPage = 'https://courses.campus.gov.il/courses/course-v1%3AMSE%2BGOV_PsychometryHe%2B2018_1/c360bdbb470643c5aaa5e5aa96bc5c8e/';
const outputPath = 'data/sources/all-campus-il-pdfs.json';

function decodeTitle(raw) {
  return raw.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function normalizeUrl(href) {
  return new URL(href.replace(/&amp;/g, '&'), downloadsPage).toString();
}

function isCampusPdf(url) {
  const parsed = new URL(url);
  return parsed.hostname === 'courses.campus.gov.il' && decodeURIComponent(parsed.pathname).endsWith('.pdf');
}

async function discover() {
  const response = await fetch(downloadsPage);
  if (!response.ok) throw new Error(`Failed to load downloads page: ${response.status} ${response.statusText}`);
  const html = await response.text();
  const matches = [...html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)];
  const seen = new Set();
  const pdfs = [];

  for (const [, href, label] of matches) {
    const url = normalizeUrl(href);
    if (!isCampusPdf(url) || seen.has(url)) continue;
    seen.add(url);
    const title = decodeTitle(label) || decodeURIComponent(url.split('/').pop() || 'PDF');
    pdfs.push({
      id: `campus-pdf-${String(pdfs.length + 1).padStart(3, '0')}`,
      title,
      url,
      sourcePage: downloadsPage,
      status: 'discovered'
    });
  }

  await mkdir('data/sources', { recursive: true });
  await writeFile(outputPath, `${JSON.stringify({ discoveredAt: new Date().toISOString(), sourcePage: downloadsPage, count: pdfs.length, pdfs }, null, 2)}\n`);
  console.log(`Discovered ${pdfs.length} Campus IL PDFs`);
}

discover().catch((error) => {
  console.error(error);
  process.exit(1);
});
