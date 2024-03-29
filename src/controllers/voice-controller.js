import axios from 'axios';
import Ffmpeg from 'fluent-ffmpeg';
import installer from '@ffmpeg-installer/ffmpeg';
import { createWriteStream } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import removeVoiceFile from '#utils/removeVoiceFile.js';

const directoryName = dirname(fileURLToPath(import.meta.url));

class VoiceController {
  constructor() {
    Ffmpeg.setFfmpegPath(installer.path);
  }

  async createOGGVoice(urlFile, fileName) {
    try {
      const oggPath = join(directoryName, '../voices', `${fileName}.ogg`);
      const response = await axios({
        method: 'get',
        url: urlFile,
        responseType: 'stream',
      });

      return new Promise((resolveStream, rejectStream) => {
        const stream = createWriteStream(oggPath);
        response.data.pipe(stream);
        stream.on('finish', () => resolveStream(oggPath));
        stream.on('error', (error) => rejectStream(error));
      });
    } catch (error) {
      console.error('Помилка при створенні .ogg', error.message);
      return null;
    }
  }

  async convertToMP3(inputOGGFile, outputMP3File) {
    try {
      const outputPath = join(dirname(inputOGGFile), `${outputMP3File}.mp3`);

      return new Promise((resolveStream, rejectStream) => {
        Ffmpeg(inputOGGFile)
          .inputOption('-t 30')
          .output(outputPath)
          .on('end', () => {
            removeVoiceFile(inputOGGFile);
            resolveStream(outputPath);
          })
          .on('error', (error) => rejectStream(error.message))
          .run();
      });
    } catch (error) {
      console.error('Помилка при конвертації в .mp3', error.message);
      return null;
    }
  }
}

export default new VoiceController();
