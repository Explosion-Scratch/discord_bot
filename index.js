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
	/**
	 * Finds a user based on their discord tag, username, nickname or ID.
	 * @param {Function|String} query The discord tag, find function, username, or user ID of the user to find.
	 */
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
	/**
	 * Sends the user specified a message.
	 * @param {String|Function} [user=last_user_of_bot] The query to find the user by (same as used in 'findUser'.)
	 * @param {String|Embed|Object} msg A sendable message that can be send through discord.js
	 */
	dm(user, msg) {
		user = user || this.info.author;
		this.findUser(user).send(msg);
	}
	/**
	 * Finds a channel based on a query.
	 * @param {Function} query The find function to find the channel (this command still very much WIP.)
	 */
	findChannel(query) {
		return this.client.channels.cache.find(query);
	}
	/**
	 * Listens for an event emitted through 'bot.dispatch("event", "data")'.
	 * @param {String} event The event to listen for.
	 * @param {Function} callback The callback to run when the event happens.
	 */
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
	/**
	 * Calls all the listeners added by 'addListener' matching the event dispatched. (Note: This function is mostly internal, if you want to use it to manually trigger events though, be my guest!)
	 * @param {String} event The event to dispatch.
	 * @param  {...any} data The data to send with the event.
	 */
	dispatch(event, ...data) {
		var listeners = this.listeners[event];
		if (!listeners) return;
		for (let fn of listeners) {
			fn.function(...(data || []));
		}
	}
	/**
	 * Initiates slash commands
	 */
	async initSlash() {
		this.dispatch("init_slash");
		// Providing a guildId in config allows slash commands to update immediately. otherwise they take about an hour and update bot wide (all servers).
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
	/**
	 * Internal function to run a command in a channel, with a message or interaction. For the most part leave this alone.
	 * @param {Object} params The params.
	 * @param {Channel} params.channel The channel that the command was operated in.
	 * @param {String} params.content The content of the message that was sent.
	 * @param {Message} params.message A discord.js message object with details about the message sent.
	 * @param {Interaction} params.interaction A discord.js interaction object with info about the interaction if the event that triggered this command was an interaction.
	 */
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
	/**
	 * Adds a command to the bot.
	 * @param {Object} command The command arguments.
	 * @param {Function} command.run The run function for when the command is run by the user. This is passed one argument, which is an object: {message: "The message that the user sent (if not an interaction)", interaction: "The interaction (instead of a message, in the case of slash commands)", args: "An object containing any arguments that got passed to the command when run by the user."}
	 * The return value of this function is used as the embed properties when sending a response message to the user.
	 * @param {String} command.title The title of the command (useful for creating a nice help command for your bot. Also used as a default if the run function of the command returns nothing.)
	 * @param {String} command.description Used as a default if the run function of the command returns nothing.
	 * @param {Array} [command.args] A list of arguments for the command. Each should be an object containing name, description, and a required boolean. Also can have more options (See discord.js slash commands options documentation).
	 * @param {Object} command.slashCommand Optional arguments to pass to discord.js slash command creation.
	 */
	addCommand(command) {
		this.commands.push(command);
	}
	/**
	 * Initiates the bot using an authentification token.
	 * @param {String} token The authentification token used to log the bot in and make it work!
	 */
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
	/**
	 * Sets the bot's prefix for use in message based commands (E.g. '#help').
	 * Does not affect slash commands.
	 * @param {String} prefix The new prefix for the bot.
	 */
	setPrefix(prefix) {
		if (!prefix) {
			throw new Error(
				"Prefix required. Prefixes allow users to run command such as '!help' or '!poll' that are specific to your bot",
			);
		}
		this.config.prefix = prefix;
		return this;
	}
	/**
	 * Sets a property in the bot's config to a value.
	 * @param {String} prop The property to set.
	 * Current config properties are: color, prefix, and guildId
	 * @param {any} val The value to set the property to.
	 */
	set(prop, val) {
		if (!(prop && val)) {
			throw new Error("Prop and val are required.");
		}
		this.config[prop] = val;
		return this;
	}
	/**
	 * Internal function to create an embed object to send in a message from an opts object/string
	 * @param {String|Object} opts The options object.
	 */
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
