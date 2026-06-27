import { cp, mkdir, copyFile } from 'node:fs/promises';

async function main() {
  await mkdir('docs/src', { recursive: true });
  await mkdir('docs/data', { recursive: true });
  await copyFile('index.html', 'docs/index.html');
  await copyFile('404.html', 'docs/404.html');
  await cp('src', 'docs/src', { recursive: true });
  await cp('data', 'docs/data', { recursive: true });
  console.log('docs mirror synced');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
