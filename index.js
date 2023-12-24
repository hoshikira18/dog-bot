import TelegramBot from 'node-telegram-bot-api';
import fetch from 'node-fetch';
import 'dotenv/config';

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });
const webhookUrl = process.env.WEBHOOK_URL;

bot.onText(/\/add (.+)/, (msg, match) => {
    const chatId = msg.chat.id;

    if (!match[1].includes(',')) {
        bot.sendMessage(chatId, 'Vui lòng nhập đúng định dạng.' + '\n\n' + 'Ví dụ:\n```\n/add name, price\n```', {
            parse_mode: 'Markdown'
        });
        return;
    }
    bot.sendChatAction(chatId, 'typing');

    const resp = match[1];
    const values = resp.split(',');
    if (Number.isNaN(parseInt(values[1]))) {
        bot.sendMessage(chatId, 'Price phải là số.');
        return;
    }

// Get the current date and time in the time zone of Vietnam (Indochina Time - ICT)
var date = new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' });

    const url = new URL(webhookUrl);
    url.searchParams.append('Date', date);
    url.searchParams.append('Name', values[0]);
    url.searchParams.append('Price', values[1]);
    url.searchParams.append('Dog', msg.from.username);


    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                bot.sendMessage(chatId, '✅ Đã thêm thành công.');
            } else {
                bot.sendMessage(chatId, 'Không thể thêm. Vui lòng thử lại sau!');
            }
        })
        .catch(err => {
            bot.sendMessage(chatId, 'Đã có lỗi xảy ra. Vui lòng thử lại sau!');
        });
});

console.log('Bot is running...')


