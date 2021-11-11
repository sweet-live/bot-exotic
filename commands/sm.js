const Discord = require("discord.js");
module.exports = {
  name: "sm",
  description: "Puts slowmode on. Usage: <INSERT HERE>",
  args: true,
  usage: "<INSERT HERE>",
  permission: "MANAGE_MESSAGES",
  async execute(message, args, client) {
    var time;
    var embed;
    switch (args[0]) {
      case "stop":
        time = 0;
        embed = new Discord.MessageEmbed()
          .setColor("0xbf00ff")
          .setTitle(`Slowmode in ${message.channel.name} successfully stopped`);
        break;
      default:
        time = args[0];
        if (isNaN(time))
          return message.reply(
            "you need to specify a valid number for me to set slowmode"
          );
        embed = new Discord.MessageEmbed()
          .setColor("0xbf00ff")
          .setTitle(`i have succesfully set slowmode to \`${time}\` seconds!`);
        break;
    }

    if (time < 0) {
      return message.reply("you need to specify a postive slowmode to!");
    }
    if (time > 21600)
      return msg.reply(
        "you need to specify a time that is less than 6 hours (21,600)"
      );

    await message.channel.setRateLimitPerUser(time);
    message.channel.send(embed);
  },
};
