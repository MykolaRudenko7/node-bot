import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';
import { Anthropic } from '@anthropic-ai/sdk';
import keys from '../data/config.js';

const { whisperApiKey, anthropicApiKey } = keys;
class AIController {
  constructor() {
    this.anthropic = new Anthropic({ apiKey: anthropicApiKey });
  }

  async transcribeVoice(voicePath) {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(voicePath));
    formData.append('diarization', 'false');
    formData.append('fileType', 'mp3');
    formData.append('language', 'uk');
    formData.append('task', 'transcribe');

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${whisperApiKey}`,
      },
    };

    try {
      const response = await axios.post(
        'https://transcribe.whisperapi.com',
        formData,
        config,
      );
      const transcribedText = response.data.text;

      return transcribedText;
    } catch (error) {
      console.error(
        'Error transcribing audio:',
        error.response.data,
        'status: ',
        error.response.status,
      );

      return null;
    }
  }

  async sendRequestToClaude(transcribedText) {
    try {
      const msg = await this.anthropic.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 4000,
        messages: [{ role: 'user', content: transcribedText }],
      });

      return msg.content[0].text;
    } catch (error) {
      console.error('Error sending request to Claude:', error);

      return null;
    }
  }
}

export default new AIController();
