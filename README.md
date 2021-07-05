# discord_bot
SUPER useful discord bot engine! Create a bot with integrated slash commands easily!


# README COMING SOON:
Here's some example code:
```js

var bot = new Bot();
bot.init("TOKEN_HERE");
bot.setPrefix("#");
bot.addCommand({
	run: ({ args: { command } }) => {
		if (command) {
			var c = bot.commands.find(
				(i) => i.name === command || i.title === command,
			);
			if (!c) {
				return {
					title: "Whoops!",
					description: `No command found! See a list of them with \`${bot.config.prefix}help\`.`,
				};
			}
			var a = `\n\nArguments: \n\n${c.args
				.map((e) => `**${e.name}**\n${e.description}\nRequired: ${e.required}`)
				.join("\n\n")}`;
			return {
				title: `Help for ${command}`,
				description: `\`${bot.config.prefix}${c.name}\`\n${c.description}${
					c.args && c.args.length ? a : ""
				}`,
			};
		}
		var fields = bot.commands.map((i) => {
			return {
				name: i.title || i.name,
				value: `\`${i.name}\`\n**Arguments:**: ${
					i.args.map((i) => i.name).join(", ") || "_None_"
				}\n${i.description ? `**Description:**: ${i.description}` : ""}`,
				inline: false,
			};
		});
		return {
			title: "Help is on the way!",
			fields,
		};
	},
	title: "help!!",
	name: "helpme",
	description: "Helps you",
	args: [
		{
			name: "command",
			required: false,
			description: "The command to get help about",
		},
	],
});

bot.addCommand({
	run: (args) => {
		return {
			title: "PONG PONG",
			description:
				"PONG!!!!\n\nArguments were: ```" + JSON.stringify(args) + "```",
		};
	},
	title: "Ping! Do it!!",
	name: "ping",
	description: "Ping pong command",
	args: [],
});
bot.addCommand({
	run: (args) => {
		return {
			title: "Time!",
			description: `The time currently is ${new Date().toString()}`,
		};
	},
	title: "Time!",
	name: "time",
	description: "Get the time",
	args: [],
});

bot.onready = () => {
	console.log("Bot ready");
	console.log("Initiating slash commands");
	bot.initSlash();
};
```
# discord_bot
SUPER useful discord bot engine! Create a bot with integrated slash commands easily!


# README COMING SOON:
Here's some example code:
```js

var bot = new Bot();
bot.init("TOKEN_HERE");
bot.setPrefix("#");
bot.addCommand({
	run: ({ args: { command } }) => {
		if (command) {
			var c = bot.commands.find(
				(i) => i.name === command || i.title === command,
			);
			if (!c) {
				return {
					title: "Whoops!",
					description: `No command found! See a list of them with \`${bot.config.prefix}help\`.`,
				};
			}
			var a = `\n\nArguments: \n\n${c.args
				.map((e) => `**${e.name}**\n${e.description}\nRequired: ${e.required}`)
				.join("\n\n")}`;
			return {
				title: `Help for ${command}`,
				description: `\`${bot.config.prefix}${c.name}\`\n${c.description}${
					c.args && c.args.length ? a : ""
				}`,
			};
		}
		var fields = bot.commands.map((i) => {
			return {
				name: i.title || i.name,
				value: `\`${i.name}\`\n**Arguments:**: ${
					i.args.map((i) => i.name).join(", ") || "_None_"
				}\n${i.description ? `**Description:**: ${i.description}` : ""}`,
				inline: false,
			};
		});
		return {
			title: "Help is on the way!",
			fields,
		};
	},
	title: "help!!",
	name: "helpme",
	description: "Helps you",
	args: [
		{
			name: "command",
			required: false,
			description: "The command to get help about",
		},
	],
});

bot.addCommand({
	run: (args) => {
		return {
			title: "PONG PONG",
			description:
				"PONG!!!!\n\nArguments were: ```" + JSON.stringify(args) + "```",
		};
	},
	title: "Ping! Do it!!",
	name: "ping",
	description: "Ping pong command",
	args: [],
});
bot.addCommand({
	run: (args) => {
		return {
			title: "Time!",
			description: `The time currently is ${new Date().toString()}`,
		};
	},
	title: "Time!",
	name: "time",
	description: "Get the time",
	args: [],
});

bot.onready = () => {
	console.log("Bot ready");
	console.log("Initiating slash commands");
	bot.initSlash();
};
```
