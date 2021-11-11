const Discord = require("discord.js");
module.exports = {
  name: "purge",
  description:
    "Purges messages from the chat. Usage: $purge <MessageCount>, $purge all",
  args: true,
  usage: "$purge <MessageCount>, $purge all",
  permission: "ADMINISTRATOR",
  async execute(message, args, client) {
    if (!args[0])
      return message.reply(
        "You need to specify a number of messages that you want me to purge!"
      );

    if (!args == "all") {
      if (isNaN(args[0])) {
        return message.reply(
          "You need to specify a valid number of messages you want me to delete"
        );
      }
    }

    if (args[0] > 100 || !args == "all") {
      return message.reply("You need to specify a number less than 100!");
    } else if (args[0] < 1 || !args == "all")
      return message.reply(
        "You need to specify a number that is greater than 0!"
      );

    await message.delete();

    if (args[0] == "all") {
      await message.channel.messages.fetch().then((messages) => {
        message.channel.bulkDelete(messages);

        var embed = new Discord.MessageEmbed()
          .setColor("0xbf00ff")
          .setTitle(`i have succesfully deleted ${args[0]} messages!`);
        return message.channel.send(embed).then((msg) => {
          setTimeout(() => msg.delete(), 3000);
        });
      });
    } else {
      await message.channel.messages
        .fetch({ limit: args[0] })
        .then((messages) => {
          message.channel.bulkDelete(messages);

          var embed = new Discord.MessageEmbed()
            .setColor("0xbf00ff")
            .setTitle(`i have succesfully deleted ${args[0]} messages!`);
          return message.channel.send(embed).then((msg) => {
            setTimeout(() => msg.delete(), 3000);
          });
        });
    }
  },
};
