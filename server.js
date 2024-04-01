import { Bot } from 'grammy';
import keys from '#data/config.js';
import voiceController from '#controllers/voice-controller.js';
import aiController from '#controllers/ai-controller.js';

const { telegramToken } = keys;
const bot = new Bot(telegramToken);

bot.on('message:voice', async (ctx) => {
  try {
    await ctx.reply(
      '👂 Голосове повідомлення отримано. Чекаю відповідь серверу...🧐',
    );

    const path = (await ctx.getFile())?.file_path;
    const link = `https://api.telegram.org/file/bot${telegramToken}/${path}`;
    const currentUserId = ctx.message.from.id;

    const oggPath = await voiceController.createOGGVoice(link, currentUserId);
    const mp3Path = await voiceController.convertToMP3(oggPath, currentUserId);
    const transcribedText = await aiController.transcribeVoice(mp3Path);
    await ctx.reply(`Ваш запит: ${transcribedText} ✍️`);

    const claudeResponse = await aiController.sendRequestToClaude(transcribedText);
    await ctx.reply(claudeResponse);
  } catch (error) {
    console.error('error voice', error.message);
  }
});

bot.on('message', async (ctx) => {
  try {
    await ctx.reply('Повідомлення отримано. Чекаю відповідь серверу...🧐');
    const claudeResponse = await aiController.sendRequestToClaude(
      ctx.message.text,
    );
    await ctx.reply(claudeResponse);
  } catch (e) {
    console.log('Error while voice message', e.message);
  }
});

bot.start();
