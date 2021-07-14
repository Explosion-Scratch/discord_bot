# Discord bot engine


<p align="center"><img src="https://user-images.githubusercontent.com/61319150/125470380-65a1d35d-4e48-477f-af25-f6ccb214aed8.png" align="center"></p>


SUPER useful discord bot engine! Create a bot with integrated slash commands easily! P.S. Did I mention it uses embeds? 😏


# Example
<details>
<summary>Show</summary>
Here's some example code 😃:
	
```js
var bot = new Bot();
bot.init("TOKEN_HERE");
bot.setPrefix("#");
bot.addCommand({
  run: ({ args: { command } }) => {
    if (command) {
      var c = bot.commands.find(
        (i) => i.name === command || i.title === command
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
</details>

# Getting started:

To create a bot use 
```js
var bot = new Bot();
```
Now you need to log your bot into discord as follows:
```js
bot.init("YOUR_TOKEN_HERE");//Tokens can be gotten from the bots section of a discord developer application
```
Then set a prefix for your bot:
```js
bot.setPrefix("$$");
```
then add some commands!
```js
bot.addCommand({
  run: ({ message }) => {
    if (!message) {
      return {
        title: "🏓 Pong!",
        description:
          "Pong! I don't know how long that took because I forgot how to get the timestamp of an interaction! =D",
      };
    }
    return {
      title: "🏓 Pong!",
      description: `🏓Latency is ${
        Date.now() - message.createdTimestamp
      }ms. API Latency is ${Math.round(client.ws.ping)}ms`,
    };
  },
  title: "Ping",
  name: "ping",
  description: "Ping command!",
  args: [],
});
```
If you want slash commands then also add this:
```js
bot.addEventListener("ready", () => {
  console.log("Bot ready");
  bot.initSlash();
})
```



# Documentation:
