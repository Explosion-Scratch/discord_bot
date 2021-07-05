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
    * [.findUser(query)](#Bot+findUser)
    * [.dm([user], msg)](#Bot+dm)
    * [.findChannel(query)](#Bot+findChannel)
    * [.addListener(event, callback)](#Bot+addListener)
    * [.dispatch(event, ...data)](#Bot+dispatch)
    * [.initSlash()](#Bot+initSlash)
    * [.runCommand(params)](#Bot+runCommand)
    * [.addCommand(command)](#Bot+addCommand)
    * [.init(token)](#Bot+init)
    * [.setPrefix(prefix)](#Bot+setPrefix)
    * [.set(prop, val)](#Bot+set)
    * [.embed(opts)](#Bot+embed)

<a name="Bot+findUser"></a>

### bot.findUser(query)
Finds a user based on their discord tag, username, nickname or ID.

**Kind**: instance method of [<code>Bot</code>](#Bot)  

| Param | Type | Description |
| --- | --- | --- |
| query | <code>function</code> \| <code>String</code> | The discord tag, find function, username, or user ID of the user to find. |

<a name="Bot+dm"></a>

### bot.dm([user], msg)
Sends the user specified a message.

**Kind**: instance method of [<code>Bot</code>](#Bot)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [user] | <code>String</code> \| <code>function</code> | <code>last_user_of_bot</code> | The query to find the user by (same as used in 'findUser'.) |
| msg | <code>String</code> \| <code>Embed</code> \| <code>Object</code> |  | A sendable message that can be send through discord.js |

<a name="Bot+findChannel"></a>

### bot.findChannel(query)
Finds a channel based on a query.

**Kind**: instance method of [<code>Bot</code>](#Bot)  

| Param | Type | Description |
| --- | --- | --- |
| query | <code>function</code> | The find function to find the channel (this command still very much WIP.) |

<a name="Bot+addListener"></a>

### bot.addListener(event, callback)
Listens for an event emitted through 'bot.dispatch("event", "data")'.

**Kind**: instance method of [<code>Bot</code>](#Bot)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>String</code> | The event to listen for. |
| callback | <code>function</code> | The callback to run when the event happens. |

<a name="Bot+dispatch"></a>

### bot.dispatch(event, ...data)
Calls all the listeners added by 'addListener' matching the event dispatched. (Note: This function is mostly internal, if you want to use it to manually trigger events though, be my guest!)

**Kind**: instance method of [<code>Bot</code>](#Bot)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>String</code> | The event to dispatch. |
| ...data | <code>any</code> | The data to send with the event. |

<a name="Bot+initSlash"></a>

### bot.initSlash()
Initiates slash commands

**Kind**: instance method of [<code>Bot</code>](#Bot)  
<a name="Bot+runCommand"></a>

### bot.runCommand(params)
Internal function to run a command in a channel, with a message or interaction. For the most part leave this alone.

**Kind**: instance method of [<code>Bot</code>](#Bot)  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | The params. |
| params.channel | <code>Channel</code> | The channel that the command was operated in. |
| params.content | <code>String</code> | The content of the message that was sent. |
| params.message | <code>Message</code> | A discord.js message object with details about the message sent. |
| params.interaction | <code>Interaction</code> | A discord.js interaction object with info about the interaction if the event that triggered this command was an interaction. |

<a name="Bot+addCommand"></a>

### bot.addCommand(command)
Adds a command to the bot.

**Kind**: instance method of [<code>Bot</code>](#Bot)  

| Param | Type | Description |
| --- | --- | --- |
| command | <code>Object</code> | The command arguments. |
| command.run | <code>function</code> | The run function for when the command is run by the user. This is passed one argument, which is an object: {message: "The message that the user sent (if not an interaction)", interaction: "The interaction (instead of a message, in the case of slash commands)", args: "An object containing any arguments that got passed to the command when run by the user."} The return value of this function is used as the embed properties when sending a response message to the user. |
| command.title | <code>String</code> | The title of the command (useful for creating a nice help command for your bot. Also used as a default if the run function of the command returns nothing.) |
| command.description | <code>String</code> | Used as a default if the run function of the command returns nothing. |
| [command.args] | <code>Array</code> | A list of arguments for the command. Each should be an object containing name, description, and a required boolean. Also can have more options (See discord.js slash commands options documentation). |
| command.slashCommand | <code>Object</code> | Optional arguments to pass to discord.js slash command creation. |

<a name="Bot+init"></a>

### bot.init(token)
Initiates the bot using an authentication token.

**Kind**: instance method of [<code>Bot</code>](#Bot)  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>String</code> | The authentication token used to log the bot in and make it work! |

<a name="Bot+setPrefix"></a>

### bot.setPrefix(prefix)
Sets the bot's prefix for use in message based commands (E.g. '#help').
Does not affect slash commands.

**Kind**: instance method of [<code>Bot</code>](#Bot)  

| Param | Type | Description |
| --- | --- | --- |
| prefix | <code>String</code> | The new prefix for the bot. |

<a name="Bot+set"></a>

### bot.set(prop, val)
Sets a property in the bot's config to a value.

**Kind**: instance method of [<code>Bot</code>](#Bot)  

| Param | Type | Description |
| --- | --- | --- |
| prop | <code>String</code> | The property to set. Current config properties are: color, prefix, and guildId |
| val | <code>any</code> | The value to set the property to. |

<a name="Bot+embed"></a>

### bot.embed(opts)
Internal function to create an embed object to send in a message from an opts object/string

**Kind**: instance method of [<code>Bot</code>](#Bot)  

| Param | Type | Description |
| --- | --- | --- |
| opts | <code>String</code> \| <code>Object</code> | The options object. |

<a name="Command"></a>

## Command
A class that represents a command.

**Kind**: global class  
