const { token } = require("./config.json");
const fs = require("fs");
const Discord = require("discord.js");

const client = new Discord.Client();
client.commands = new Discord.Collection();

//Reads the command names from the command files.
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

//Reads the event names from the command files
const eventFiles = fs
  .readdirSync("./events")
  .filter((file) => file.endsWith(".js"));

//saves the commands in the client object accessable with client.commands.get(COMMAND_NAME)
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

//Initializes event listeners
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

// client.once("ready", () => {
//   console.log("Ready!");
// });

// client.on("message", (message) => {
//   if (!message.content.startsWith(prefix) || message.author.bot) return;

//   const args = message.content.slice(prefix.length).trim().split(/ +/);
//   const commandName = args.shift().toLowerCase();

//   if (!client.commands.has(commandName)) {
//     message.reply("No such command");
//   }

//   const command = client.commands.get(commandName);

//   //check if the person has needed permissions
//   if (command.permission) {
//     const authorPerms = message.channel.permissionsFor(message.author);
//     if (!authorPerms || !authorPerms.has(command.permission)) {
//       return message.reply("You do not have the permissions!");
//     }
//   }

//   //check if command requires arguments and if there was any arguments provided
//   if (command.args && !args.length) {
//     let reply = "No arguments provided.";
//     if (command.usage) {
//       reply += ` Please follow the correct syntax: ${command.usage}, ${message.author}!`;
//     }
//     return message.channel.send(reply);
//   }

//   try {
//     command.execute(message, args);
//   } catch (error) {
//     console.error(error);
//     message.reply("there was an error trying to execute that command!");
//   }
// );

client.login(token);
