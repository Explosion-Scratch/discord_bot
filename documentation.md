## Classes

<dl>
<dt><a href="#Bot">Bot</a></dt>
<dd><p>A class that represents a discord bot.</p>
</dd>
<dt><a href="#Command">Command</a></dt>
<dd><p>A class that represents a command.</p>
</dd>
</dl>

<a name="Bot"></a>

## Bot
A class that represents a discord bot.

**Kind**: global class  

* [Bot](#Bot)
    * [.findUser(query)](#Bot+findUser) ⇒ <code>DiscordUserObject</code>
    * [.dm([user], msg)](#Bot+dm) ⇒ <code>DiscordMessageObject</code>
    * [.findChannel(query)](#Bot+findChannel) ⇒ <code>DiscordChannelObject</code>
    * [.addListener(event, callback)](#Bot+addListener) ⇒ <code>Object</code>
    * [.dispatch(event, ...data)](#Bot+dispatch) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.initSlash()](#Bot+initSlash) ⇒ [<code>Bot</code>](#Bot)
    * [.runCommand(params)](#Bot+runCommand) ⇒ <code>DiscordMessageObject</code> \| <code>RunCommandOutput</code>
    * [.addCommand(command)](#Bot+addCommand) ⇒ <code>Object</code>
    * [.init(token)](#Bot+init) ⇒ [<code>Bot</code>](#Bot)
    * [.setPrefix(prefix)](#Bot+setPrefix) ⇒ [<code>Bot</code>](#Bot)
    * [.set(prop, val)](#Bot+set) ⇒ [<code>Bot</code>](#Bot)
    * [.embed(opts)](#Bot+embed) ⇒ <code>Object</code>

<a name="Bot+findUser"></a>

### bot.findUser(query) ⇒ <code>DiscordUserObject</code>
Finds a user based on their discord tag, username, nickname or ID.

**Kind**: instance method of [<code>Bot</code>](#Bot)  
**Returns**: <code>DiscordUserObject</code> - A discord.js object representing the user found.  

| Param | Type | Description |
| --- | --- | --- |
| query | <code>function</code> \| <code>String</code> | The discord tag, find function, username, or user ID of the user to find. |

<a name="Bot+dm"></a>

### bot.dm([user], msg) ⇒ <code>DiscordMessageObject</code>
Sends the user specified a message.

**Kind**: instance method of [<code>Bot</code>](#Bot)  
**Returns**: <code>DiscordMessageObject</code> - A discord.js message object.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [user] | <code>String</code> \| <code>function</code> | <code>last_user_of_bot</code> | The query to find the user by (same as used in 'findUser'.) |
| msg | <code>String</code> \| <code>Embed</code> \| <code>Object</code> |  | A sendable message that can be send through discord.js |

<a name="Bot+findChannel"></a>

### bot.findChannel(query) ⇒ <code>DiscordChannelObject</code>
Finds a channel based on a query.

**Kind**: instance method of [<code>Bot</code>](#Bot)  
**Returns**: <code>DiscordChannelObject</code> - A discord.js channel object containing details about the channel found.  

| Param | Type | Description |
| --- | --- | --- |
| query | <code>function</code> | The find function to find the channel (this command still very much WIP.) |

<a name="Bot+addListener"></a>

### bot.addListener(event, callback) ⇒ <code>Object</code>
Listens for an event emitted through 'bot.dispatch("event", "data")'.

**Kind**: instance method of [<code>Bot</code>](#Bot)  
**Returns**: <code>Object</code> - Returns an object with a remove function, which removes the current listener.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>String</code> | The event to listen for. |
| callback | <code>function</code> | The callback to run when the event happens. |

<a name="Bot+dispatch"></a>

### bot.dispatch(event, ...data) ⇒ <code>Array.&lt;Object&gt;</code>
Calls all the listeners added by 'addListener' matching the event dispatched. (Note: This function is mostly internal, if you want to use it to manually trigger events though, be my guest!)

**Kind**: instance method of [<code>Bot</code>](#Bot)  
**Returns**: <code>Array.&lt;Object&gt;</code> - Returns all the listeners that are currently listening to the event given.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>String</code> | The event to dispatch. |
| ...data | <code>any</code> | The data to send with the event. |

<a name="Bot+initSlash"></a>

### bot.initSlash() ⇒ [<code>Bot</code>](#Bot)
Initiates slash commands

**Kind**: instance method of [<code>Bot</code>](#Bot)  
<a name="Bot+runCommand"></a>

### bot.runCommand(params) ⇒ <code>DiscordMessageObject</code> \| <code>RunCommandOutput</code>
Internal function to run a command in a channel, with a message or interaction. For the most part leave this alone.

**Kind**: instance method of [<code>Bot</code>](#Bot)  
**Returns**: <code>DiscordMessageObject</code> \| <code>RunCommandOutput</code> - Returns either a discord.js message object or the output of a 'command.run(__)' function.  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | The params. |
| params.channel | <code>Channel</code> | The channel that the command was operated in. |
| params.content | <code>String</code> | The content of the message that was sent. |
| params.message | <code>Message</code> | A discord.js message object with details about the message sent. |
| params.interaction | <code>Interaction</code> | A discord.js interaction object with info about the interaction if the event that triggered this command was an interaction. |

<a name="Bot+addCommand"></a>

### bot.addCommand(command) ⇒ <code>Object</code>
Adds a command to the bot.

**Kind**: instance method of [<code>Bot</code>](#Bot)  
**Returns**: <code>Object</code> - The bot's commands.  

| Param | Type | Description |
| --- | --- | --- |
| command | <code>Object</code> | The command arguments. |
| command.run | <code>function</code> | The run function for when the command is run by the user. This is passed one argument, which is an object: {message: "The message that the user sent (if not an interaction)", interaction: "The interaction (instead of a message, in the case of slash commands)", args: "An object containing any arguments that got passed to the command when run by the user."} The return value of this function is used as the embed properties when sending a response message to the user. |
| command.title | <code>String</code> | The title of the command (useful for creating a nice help command for your bot. Also used as a default if the run function of the command returns nothing.) |
| command.description | <code>String</code> | Used as a default if the run function of the command returns nothing. |
| [command.args] | <code>Array</code> | A list of arguments for the command. Each should be an object containing name, description, and a required boolean. Also can have more options (See discord.js slash commands options documentation). |
| command.slashCommand | <code>Object</code> | Optional arguments to pass to discord.js slash command creation. |

<a name="Bot+init"></a>

### bot.init(token) ⇒ [<code>Bot</code>](#Bot)
Initiates the bot using an authentication token.

**Kind**: instance method of [<code>Bot</code>](#Bot)  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>String</code> | The authentication token used to log the bot in and make it work! |

<a name="Bot+setPrefix"></a>

### bot.setPrefix(prefix) ⇒ [<code>Bot</code>](#Bot)
Sets the bot's prefix for use in message based commands (E.g. '#help').
Does not affect slash commands.

**Kind**: instance method of [<code>Bot</code>](#Bot)  

| Param | Type | Description |
| --- | --- | --- |
| prefix | <code>String</code> | The new prefix for the bot. |

<a name="Bot+set"></a>

### bot.set(prop, val) ⇒ [<code>Bot</code>](#Bot)
Sets a property in the bot's config to a value.

**Kind**: instance method of [<code>Bot</code>](#Bot)  
**Returns**: [<code>Bot</code>](#Bot) - The bot.  

| Param | Type | Description |
| --- | --- | --- |
| prop | <code>String</code> | The property to set. Current config properties are: color, prefix, and guildId |
| val | <code>any</code> | The value to set the property to. |

<a name="Bot+embed"></a>

### bot.embed(opts) ⇒ <code>Object</code>
Internal function to create an embed object to send in a message from an opts object/string

**Kind**: instance method of [<code>Bot</code>](#Bot)  
**Returns**: <code>Object</code> - An object that can be sent by 'channel.send(embedObj)'  

| Param | Type | Description |
| --- | --- | --- |
| opts | <code>String</code> \| <code>Object</code> | The options object. |

<a name="Command"></a>

## Command
A class that represents a command.

**Kind**: global class  

* [Command](#Command)
    * [.test(text)](#Command+test) ⇒ <code>Object</code>
    * [.run(...args)](#Command+run) ⇒ <code>Object</code>

<a name="Command+test"></a>

### command.test(text) ⇒ <code>Object</code>
Tests a command on text or interaction arguments.

**Kind**: instance method of [<code>Command</code>](#Command)  
**Returns**: <code>Object</code> - An object which either contains {error: true, message: "MESSAGE_HERE"} or {error: false, ...arguments}, where arguments are the arguments that were parsed from the command.  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>String</code> \| <code>Object</code> | The text or arguments (from an interaction) to test. |

<a name="Command+run"></a>

### command.run(...args) ⇒ <code>Object</code>
Runs a command using the specified arguments.

**Kind**: instance method of [<code>Command</code>](#Command)  
**Returns**: <code>Object</code> - An object with title and description for the embed which should be sent in response, or the return value of the command's run function if it is an object and represents a discord embed.  

| Param | Type | Description |
| --- | --- | --- |
| ...args | <code>any</code> | The arguments that are passed to the run function of the command |

