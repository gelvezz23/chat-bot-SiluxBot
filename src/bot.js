/** @format */

const Telegraf = require('telegraf');
//const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const fetch = require('node-fetch');
const fs = require('fs');
const Markup = require('telegraf/markup');
const NewsAPI = require('newsapi');
const { memoryUsage } = require('process');
const expressApp = express();
require('dotenv').config();

const Token = process.env.TOKEN_APP;
const Token_giphy = process.env.API_KEY_GIPHY;

const bot = new Telegraf(Token, {
	username: 'SiluxBot',
	polling: true,
});

bot.use(async (ctx, next) => {
	const start = new Date();
	await next();
	const ms = new Date() - start;
	console.log('Response time: %sms', ms);
});

expressApp.get('/', (req, res) => {
	res.send('Llamada a la ruta ');
});

expressApp.listen(process.env.PORT || 5000, () => {
	console.log('El servidor esta escuchando port:' + process.env.PORT);
});

bot.command('/news', (ctx) => {
	const newsapi = new NewsAPI(process.env.API_KEY_NEWSAPI);

	newsapi.v2
		.topHeadlines({
			category: 'technology',
			country: 'co',
		})
		.then((response) => {
			let news = response.articles[Math.floor(Math.random() * response.articles.length)];
			ctx.reply(news.url);
		});
});

bot.command('/imagen', async (msg) => {
	const { text } = msg.update.message;
	const search = text.split('=');
	const url = `https://api.giphy.com/v1/gifs/search?q=${encodeURI(
		search[1]
	)}&limit=10&api_key=${Token_giphy}`;

	const resp = await fetch(url, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
	});

	const { data } = await resp.json();

	let gift = data.map((img, index) => {
		return {
			index: index,
			id: img.id,
			image: img.images?.downsized_medium.url,
			title: img.title,
		};
	});
	const random = Math.floor(Math.random() * (10 - 1) + 1);
	const sendImagen = await gift.find((data) => data.index == random);
	if (!sendImagen) {
		msg.reply('UPS !! No puedo encontrar eso, debe ser una busqueda muy traviesa :3');
	} else {
		msg.replyWithPhoto({ url: sendImagen.image });
		gift = null;
	}

	// msg.sendPhoto(gift.image);
});

bot.command('/frase', (ctx) => {
	ctx.reply(getRamdonPhrase());
});

bot.command('/pregunta', (ctx) => {
	let arr_botones = [
		Markup.callbackButton('respuesta a', 'falsa'),
		Markup.callbackButton('respuesta b', 'falsa'),
		Markup.callbackButton('respuesta c', 'falsa'),
		Markup.callbackButton('respuesta d', 'falsa'),
	];

	let extra = Markup.inlineKeyboard(arr_botones).extra();
	extra['parse_mode'] = 'HTML';
	return bot.telegram.sendMessage(ctx.chat.id, 'mi pregunta', extra);
});

bot.command('/sorteo', (ctx) => {
	ctx.reply(
		'¡Hola Silux! \n\r \n\r' +
			'Considerando el trabajo que ha realizado el semillero ' +
			'Silux durante la pandemia y las interesantes charlas ' +
			'que se han realizado, la empresa Megaterios ofreció donar ' +
			'detalles para actividades de motivación, con el fin de ' +
			'incentivar a que participen en nuestras Redes Sociales ' +
			'y que sigamos manteniendo esta dinámica virtual del semillero. \n\r ' +
			'Megaterios es una empresa de desarrollo de software Cucuteña,' +
			'creada por uno de los estudiantes del grupo GNULinux UFPS, ' +
			'del cual luego apareció SILUX. ' +
			'https://www.instagram.com/megaterios.co/  \r\n \r\n' +
			'¿Cómo participar?  \r\n \r\n' +
			'1. Debes seguirnos en todas nuestras Redes Sociales: Twitter, Youtube, ' +
			'Facebook, Instagram y Telegram (Ahora tenemos ChatBot https://t.me/siluxufps) \r\n \r\n' +
			'2. Comparte en alguna de nuestras redes sociales cuál es el Sistema Operativo ' +
			'que usas y por qué. Envía también a Telegram para que nuestro ChatBot procese \r\n \r\n' +
			'3. Comparte en alguna de nuestras redes sociales cuál es el video que mas te ' +
			'gusta y por qué. Envía también a Telegram para que nuestro ChatBot procese  \r\n \r\n \r\n' +
			'¡Los esperamos a todos!  \r\n' +
			'¡Muchas gracias a todos por confiar en nosotros y apoyarnos!  \r\n'
	);
});

bot.command('/spam', (ctx) => {
	ctx.reply(' ¬¬ Cuidadito !! ');
});

const getRamdonPhrase = () => {
	let content = fs.readFileSync('./salidas/phrases.txt');
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
