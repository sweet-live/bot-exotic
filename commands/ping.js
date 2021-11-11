const Discord = require("discord.js");

module.exports = {
  name: "ping",
  description: "Shows user ping. Usage: $ping",
  execute(message, args, client) {
    var embed = new Discord.MessageEmbed()
      .setColor("0xbf00ff")
      .setTitle(`My ping`)
      .setDescription(`My ping: ${client.ws.ping}ms`);

    message.channel.send(embed);
  },
};
