class Bot {
	constructor() {
		this.Discord = require("discord.js");
		this.client = new this.Discord.Client();
		this.commands = [];
		this.listeners = {};
		this.info = {
			channel: null,
			message: null,
			author: null,
		};
		this.config = {
			color: 0x00bbbb,
		};
		this.client.on("ready", () => {
			this.dispatch("ready");
			this.status = "ready";
		});
		this.client.on("message", (message) => {
			this.dispatch("message", message);
			this.info.author = message.member;
			this.info.message = message;
			this.info.channel = message.channel.id;
			if (message.author.bot && this.config.allowBots !== true) {
				this.dispatch("bot_message", message);
				return;
			}
			this.runCommand({
				channel: message.channel,
				content: message.content,
				message,
			});
		});
	}
	findUser(query) {
		console.log(JSON.stringify(this.client.users, null, 2));
		if (typeof query === "function") {
			return this.client.users.cache.find(query);
		}
		if (typeof query === "string") {
			return this.client.users.cache.find(
				(i) =>
					i.username.toLowerCase() === query.toLowerCase() ||
					i.id == query ||
					i.tag.toLowerCase() === query.toLowerCase(),
			);
		}
		return {
			error: true,
			message: "Please provide a string or a find function.",
		};
	}
	dm(user, msg) {
		user = user || this.info.author;
		this.findUser(user).send(msg);
	}
	findChannel(query) {
		return this.client.channels.cache.find(query);
	}
	addListener(event, callback) {
		this.listeners[event] = this.listeners[event] || [];
		var id = Math.random();
		this.listeners[event].push({ function: callback, id });
		return {
			remove: () => {
				var item = this.listeners[event].find((i) => i.id === id);
				this.listeners[event].splice(this.listeners[event].indexOf(item), 1);
			},
		};
	}
	dispatch(event, ...data) {
		var listeners = this.listeners[event];
		if (!listeners) return;
		for (let fn of listeners) {
			fn.function(...(data || []));
		}
	}
	async initSlash() {
		this.dispatch("init_slash");
		var guildId = "838149475477618699";
		var getApp = (guildId) => {
			const app = this.client.api.applications(this.client.user.id);
			if (guildId) {
				app.guilds(guildId);
			}
			return app;
		};
		var currentCommands = await getApp(guildId).commands.get();
		for (let _ of currentCommands) {
			await getApp(guildId).commands(_.id).delete();
		}
		var commands = this.commands.map((i) => {
			return {
				name: i.name,
				description: i.description,
				options: i.args.length
					? i.args.map((item) => {
							return {
								...item,
								type: 3,
							};
					  })
					: undefined,
				...i.slashCommand,
			};
		});
		commands = JSON.parse(JSON.stringify(commands));
		// console.log(JSON.stringify(commands, null, 2));
		for (let command of commands) {
			var res = await getApp(guildId)
				.commands.post({ data: command })
				.catch((e) => {
					this.dispatch("slash_error", e);
					console.log("Error:");
					console.error(e.message);
				});
		}
		this.client.ws.on("INTERACTION_CREATE", async (interaction) => {
			this.dispatch("interaction", interaction);
			this.info.interaction = interaction;
			this.info.author = interaction.member;
			this.info.channel = interaction.channel_id;
			var _args = interaction.data.options;
			if (!_args) {
				var embed = this.runCommand({
					content: `${this.config.prefix}${interaction.data.name}`,
					interaction,
				});
				return this.client.api
					.interactions(interaction.id, interaction.token)
					.callback.post({
						data: {
							type: 4,
							data: {
								embeds: [{ ...embed, color: this.config.color }],
							},
						},
					});
			}
			var args = {};
			for (let a of _args) {
				args[a.name] = a.value;
			}
			var embed = this.runCommand({
				content: { name: interaction.data.name, ...args },
				interaction,
			});
			this.client.api
				.interactions(interaction.id, interaction.token)
				.callback.post({
					data: {
						type: 4,
						data: {
							embeds: [{ ...embed, color: this.config.color }],
						},
					},
				});
		});
	}
	runCommand({ channel, content, message, interaction }) {
		this.dispatch("run_command", { channel, content, message, interaction });
		for (let item of this.commands) {
			var command = new Command(item, this.config.prefix);
			var out = command.test(content);
			if (out.error) {
				this.dispatch("message_error", out);
			} else {
				if (channel) {
					return channel.send(
						this.embed(
							command.run({
								args: { ...out },
								message,
								interaction,
							}),
						),
					);
				} else {
					return command.run({
						args: { ...out },
						message,
						interaction,
					});
				}
			}
		}
	}
	addCommand(command, opts) {
		this.commands.push(command);
	}
	init(token) {
		token = token || this.config.BOT_TOKEN;
		if (!token) {
			throw new Error(
				"Token required to initiate bot. Get this token by registering an application at https://discord.com/developers and then creating an application. ",
			);
		}
		this.client.login(token);
		return this;
	}
	setPrefix(prefix) {
		if (!prefix) {
			throw new Error(
				"Prefix required. Prefixes allow users to run command such as '!help' or '!poll' that are specific to your bot",
			);
		}
		this.config.prefix = prefix;
		return this;
	}
	set(prop, val) {
		if (!(prop && val)) {
			throw new Error("Prop and val are required.");
		}
		this.config[prop] = val;
	}
	embed(opts) {
		if (typeof opts === "string") {
			return { embed: { description: opts } };
		}
		return {
			embed: { ...opts, color: this.config.color },
		};
	}
}
class Command {
	constructor(command, prefix) {
		this.command = command;
		this.prefix = prefix;
	}
	test(text) {
		if (typeof text === "object") {
			if (text.name !== this.command.name) {
				return {
					error: true,
					message: `Command given is not the command matched.`,
				};
			}
			this.args = text;
			return { error: false, ...this.args };
		}
		var sections = text.match(/(?:[^\s"]+|"[^"]*")+/g);
		this.sections = sections;
		if (!sections) {
			return {
				error: true,
				message: "Message has no content",
				code: "no_content",
			};
		}
		if (!this.sections[0].startsWith(this.prefix)) {
			return {
				error: true,
				message: `Message does not start with prefix`,
				code: "prefix",
			};
		}
		if (
			this.sections[0].toLowerCase().replace(this.prefix, "") !==
			this.command.name
		) {
			return {
				error: true,
				message: `Command given is not the command matched.`,
			};
		}
		if (
			sections.length - 1 <
			this.command.args.filter((i) => i.required === true).length
		) {
			return {
				error: true,
				message: `Missing arguments. This command requires ${
					this.command.args.filter((i) => i.required === true).length
				} arguments. (${sections.length - 1} given)`,
				code: "missing_args",
			};
		}
		this.args = {};
		for (let i in sections.slice(1)) {
			var key = this.command.args.map((i) => i.name)[i];
			this.args[key || i] = sections.slice(1)[i];
		}
		return { error: false, ...this.args };
	}
	run(...args) {
		var _ = {};
		if (this.command.run) {
			_ = this.command.run(...args);
		}
		if (Object.keys(_).length) {
			return _;
		}
		return {
			title: _.title || this.command.title,
			description: _.description || this.command.description,
		};
	}
}
