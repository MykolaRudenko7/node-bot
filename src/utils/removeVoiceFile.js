import { unlink } from 'fs/promises';

export default async function removeVoiceFile(path) {
  try {
    await unlink(path);
  } catch (error) {
    console.error('while delete', error.message);
  }
}
