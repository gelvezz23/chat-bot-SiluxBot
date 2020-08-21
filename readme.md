<!-- @format -->

# chat bot de Silux en Telegram

### es un bot que hacer ciertas opciones que explicare acontinuación :

Primero debes estar en telegram
en este caso : https://t.me/siluxufps
</br>
</br>

# Configuración

<dt>Lo primero que debemos hacer es tener Node </dt>
<dt>abrimos la terminal para asegurarnos</dt>

```javascript
node -v
v14.3.0

npm -v
6.14.7
```

<dt>Luego de esto, clonamos el repositorio y hacemos la instalacion de las dependencias necesarias.</dt>

</br>

```javascript
npm install
```

</br>

Ahora debemos acomodar nuestro archivo **.env**
Debes crear un archivo .env y ahi vas a meter lo siguiente
</br>

```javascript

TOKEN_APP=1260638405:AAFFG61La7VqXggOODk3_MRmIWI6_Xic1S4
API_KEY_NEWSAPI=debes generar una apikey en newsapi
PORT=3000
```

no se te olvide el **apiKey** de newsapi
</br>
</br>

<td>Una vez este todo instalado tenemos que correr el nodemon para estar trabajando en tiempo real</td>

</br>

```javascript
nodemon src/bot.js
```

<td>Ya cuando este corriendo podemos empezar a trabajar en las funciones que tiene el codigo</td>

</br>
</br>

# Explicación del codigo

Aqui estamos haciendo uso de variables de entorno
en este caso usamos el Token que nos da telegram al crear un bot
**Yo use Botfather**

```javascript
// configuracion necesaria para usar las variables de entorno
require('dotenv').config();

const Token = process.env.TOKEN_APP;
```

Luego levantamos el servidor con **Express**

```javascript
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
```

Aqui comienzan las funciones en el chat bot

## /news

```javascript
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
```

**.command** es una funcion propia de Telegraf y lo que hace es escuchar comandos que inicien con **/**

En este caso trae una noticia aleatoria de la api **newsapi**

## /frase

```javascript
bot.command('/frase', (ctx) => {
	ctx.reply(getRamdonPhrase());
});

const getRamdonPhrase = () => {
	let content = fs.readFileSync('./salidas/phrases.txt');
	let frases = content.toString().split('\n');
	return frases[Math.floor(Math.random() * frases.length)];
};
```

Aqui nos trae una frase aleatoria, **IMPORTANTE**
todas las frases estan en **salidas/phrases.txt**
</br>
Y el metodo recorre ese .txt y los separa por saltos de linea, cada salto de linea es una frase diferente
**pueden agregar mas si quieren**

## /pregunta

```javascript
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
```

Este pinta una pregunta con botones **esta en construcción**

## /spam

```javascript
bot.command('/spam', (ctx) => {
	ctx.reply(' ¬¬ Cuidadito !! ');
});
```

aqui genera un mensaje cuando hay mucho spam en el grupo

## /start - /help

```javascript
bot.start((ctx) => {
	return ctx.reply(`Bienvenido !! ${ctx.from.first_name} ${ctx.from.last_name}`);
});

bot.help((ctx) => {
	return ctx.reply(' ¿ Necesitas ayuda ?');
});
```

comandos para iniciar el chat bot y el otro para generar helpers **Los helpers estan en construccion**

## saludos

```javascript
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
```

Este escucha cuando alguien dice hola y si responde bien o mal

## Detecta stickers

```javascript
bot.on('sticker', (ctx) => {
	return ctx.reply('Genial !! A mi tambien me gustan los stickers 🤣🤣😍');
});
```

Da un mensaje cuando alguien manda un sticker

## #silux - @silux

```javascript
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
```

Este lo que hace es detectar cuando alguien etiqueta al chat bot o cuando ponene un hashtag

## Da la bienvenida

```javascript
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
```

Este detecta cuando alguien entra nuevo al grupo y le da la bienvenida, captura su primer nombre y segundo nombre

## inicialización de el chat bot

```javascript
bot.launch();
```

## Recomendacion

usar la documentacion de telegraf para el bot
