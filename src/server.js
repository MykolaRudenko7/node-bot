import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import keys from './data/config.js';
import voiceController from './controllers/voice-controller.js';

const bot = new Telegraf(keys.telegramToken);

bot.on(message('voice'), async (ctx) => {
  try {
    const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id);
    const currentUserId = ctx.message.from.id;
    const oggPath = await voiceController.createOGGVoice(
      link.href,
      currentUserId
    );
    const mp3Path = await voiceController.convertToMP3(oggPath, currentUserId);

    await ctx.reply(mp3Path);
  } catch (error) {
    console.error('error voice', error.message);
  }
});

// те що я відправляю (текст)
// bot.on(message('text'), async (ctx) => {
//   await ctx.reply(JSON.stringify(ctx.message.voice, null, 2));
// });

bot.command('start', async (ctx) => {
  await ctx.reply(JSON.stringify(ctx.message, null, 2));
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
