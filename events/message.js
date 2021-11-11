const { prefix } = require("../config.json");
var currentDMs = [];

module.exports = {
  name: "message",
  execute(message, client) {
    if (
      message.channel.type == "dm" &&
      !currentDMs.includes(message.author.id) &&
      !message.author.bot
    ) {
      const modmail = require("../modmail/modmail");
      modmail.execute(message, client, currentDMs);
      return;
    }

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);

    const commandName = args.shift().toLowerCase();

    1;
    if (!client.commands.has(commandName)) {
      message.reply("No such command");
    }

    const command = client.commands.get(commandName);

    //check if the person has needed permissions for the command
    if (command.permission) {
      const authorPerms = message.channel.permissionsFor(message.author);
      if (!authorPerms || !authorPerms.has(command.permission)) {
        return message.reply("You do not have the permissions!");
      }
    }

    //check if command requires arguments and if there was any arguments provided
    if (command.args && !args.length) {
      let reply = "No arguments provided.";
      if (command.usage) {
        reply += ` Please follow the correct syntax: ${command.usage}, ${message.author}!`;
      }
      return message.channel.send(reply);
    }

    try {
      command.execute(message, args, client);
    } catch (error) {
      console.error(error);
      message.reply("there was an error trying to execute that command!");
    }
  },
};
