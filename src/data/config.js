import { config } from 'dotenv';

config();

const keys = {
  telegramToken: process.env.BOT_TOKEN,
};

export default keys;
