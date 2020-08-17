/** @format */

const Telegraf = require('telegraf');
//const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const fs = require('fs');
const Markup = require('telegraf/markup');
const expressApp = express();
require('dotenv').config();

const Token = process.env.TOKEN_APP;

const bot = new Telegraf(Token, {
	username: 'SiluxBot',
	polling: true,
});
expressApp.use(bot.webhookCallback('/ruta-bot'));
bot.telegram.setWebhook(`${process.env.URL_RUN}/ruta-bot`);

expressApp.post('ruta-bot', (req, res) => {
	res.send('Llamada a la ruta ');
});

expressApp.listen(3000, () => {
	console.log('El servidor esta escuchando');
});

bot.command('/frase', (ctx) => {
	ctx.reply(getRamdonPhrase());
});
bot.command('/pregunta', (ctx) => {
	let arr_botones = [
		Markup.callbackButton('a', 'falsa'),
		Markup.callbackButton('b', 'falsa'),
		Markup.callbackButton('c', 'falsa'),
		Markup.callbackButton('d', 'falsa'),
	];

	let extra = Markup.inlineKeyboard(arr_botones).extra();
	extra['parse_mode'] = 'HTML';
	return bot.telegram.sendMessage(ctx.chat.id, 'mi pregunta', extra);
});

bot.command('/spam', (ctx) => {
	ctx.reply(' ¬¬ Cuidadito !! ');
});

const getRamdonPhrase = () => {
	let content = fs.readFileSync('../salidas/phrases.txt');
	let frases = content.toString().split('\n');
	return frases[Math.floor(Math.random() * frases.length)];
};

bot.start((ctx) => {
	return ctx.reply(`Bienvenido !! ${ctx.from.first_name} ${ctx.from.last_name}`);
});

bot.help((ctx) => {
	return ctx.reply(' ¿ Necesitas ayuda ?');
});

bot.on('text', (ctx) => {
	if (ctx.message.text.toLowerCase() === 'hola') {
		return ctx.reply(
			`Hola ${ctx.from.first_name} ${ctx.from.last_name} , cuentanos ¿ como estas ?`
		);
	}

	if (ctx.message.text.toLowerCase() === 'bien') {
		return ctx.reply(`Eso me da mucha felicidad 😊 !! Sigue asi  😀`);
	}

	if (ctx.message.text.toLowerCase() === 'mal') {
		return ctx.reply(`Hoy no es un buen dia, Que la fuerza te acompañe`);
	}
});

bot.on('sticker', (ctx) => {
	return ctx.reply('Genial !! A mi tambien me gustan los stickers 🤣🤣😍');
});

bot.mention(
	['BotFather', 'SiluxBot', 'BotSilux', 'siluxbot', 'botsilux', 'silux', 'Silux'],
	(ctx) => {
		return ctx.reply('Si !! Aqui estoy 😅 ');
	}
);

bot.hashtag(
	['siluxlive', 'SiluxLive', 'miercolesdesilux', 'miercolesDeSilux', 'Silux', 'silux'],
	(ctx) => {
		return ctx.reply(
			'Gracias por apoyar 🥳, No olvides darle like a nuestros videos, comentar y ' +
				'suscribirte 🤩🤩 !! Es un honor tenerte aqui con nosotros 😎😎'
		);
	}
);

bot.use(async (ctx, next) => {
	const start = new Date();
	await next();
	const ms = new Date() - start;
	console.log('Response time: %sms', ms);
});

// bot.on('text', (ctx) => console.log(ctx));

bot.on('new_chat_members', (ctx) => {
	return ctx.reply(
		`Hola! *Welcome* to the open jungla 😜 .\n\r \r\n \r\n` +
			`Gracias y un gusto saludarte 👋👋\r\n \r\n` +
			`${ctx.message.new_chat_members[0].first_name} \r\n \r\n` +
			'🔥 Algunas cosas a recordar :\r\n \r\n' +
			'Aprender - Aplicar - Explicar\r\n \r\n' +
			'1. Los viernes son de EnglishSilux.\r\n' +
			'2. Tratar con respeto a todos.\r\n' +
			'3. Seguirnos en nuestras redes.\r\n' +
			'4. Si quieres participar en algun live contactar con algun admin. \r\n \r\n' +
			'Espero disfrutes de nuestro grupo . \r\n \r\n \r\n \r\n' +
			`att: TeamSilux`
	);
});

bot.launch();
