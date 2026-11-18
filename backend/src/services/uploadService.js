import fs from 'node:fs/promises';
import path from 'node:path';
import { UPLOAD_DIR } from '../config/env.js';
import Item from '../models/Item.js';

const LOCAL = /^\/uploads\/[\w.-]+$/;

export const isLocalUpload = (url) => typeof url === 'string' && LOCAL.test(url) && !url.includes('..');
const fileFor = (url) => path.join(UPLOAD_DIR, path.basename(url));

export async function uploadExists(url) {
  try {
    await fs.access(fileFor(url));
    return true;
  } catch {
    return false;
  }
}

// Deletes uploaded files that no listing references any more. Remote (https) images are ignored.
export async function deleteUploads(urls = []) {
  const targets = [...new Set(urls.filter(isLocalUpload))];
  await Promise.all(
    targets.map(async (url) => {
      if (await Item.exists({ images: url })) return;
      await fs.unlink(fileFor(url)).catch((err) => {
        if (err.code !== 'ENOENT') console.error('Could not delete upload', url, err.message);
      });
    })
  );
}
