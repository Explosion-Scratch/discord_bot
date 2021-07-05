class Bot {
	constructor() {
		this.Discord = require("discord.js");
		this.client = new this.Discord.Client();
		this.commands = [];
		this.config = {
			color: 0x00bbbb,
		};
		this.client.on("ready", () => {
			if (this.onready) {
				this.onready();
			}
			this.status = "ready";
		});
		this.client.on("message", (message) => {
			if (this.onmessage) {
				this.onmessage();
			}
			if (message.author.bot && this.config.allowBots !== true) {
				if (this.onbot) {
					this.onbot(message);
				}
				return;
			}
			this.runCommand({
				channel: message.channel,
				content: message.content,
				message,
			});
		});
	}
	async initSlash() {
		if (this.onInitSlash) {
			this.onInitSlash();
		}
		var guildId = this.config.guildId || undefined;
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
					if (this.onSlashError) {
						this.onSlashError(e);
					}
					console.log("Error:");
					console.error(e.message);
				});
		}
		this.client.ws.on("INTERACTION_CREATE", async (interaction) => {
			if (this.oninteraction) {
				this.oninteraction(interaction);
			}
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
		if (this.onRunCommand) {
			this.onRunCommand({ channel, content, message, interaction });
		}
		for (let item of this.commands) {
			var command = new Command(item, this.config.prefix);
			var out = command.test(content);
			if (out.error) {
				if (this.onMessageError) {
					this.onmessageerror(out);
				}
			} else {
				if (channel) {
					return channel.send(
						embed(
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
function embed(opts) {
	return {
		embed: { ...opts, color: 0x00bbbb },
	};
}
