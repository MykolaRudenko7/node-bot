import { config } from 'dotenv';

config();

const keys = {
  telegramToken: process.env.BOT_TOKEN,
  whisperApiKey: process.env.WHISPER_API_KEY,
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
};

export default keys;
