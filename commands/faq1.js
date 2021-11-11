const Discord = require("discord.js");
module.exports = {
  name: "faq1",
  description: "Provides server faq. Usage: $faq1",
  async execute(message, args, client) {
    var embed = new Discord.MessageEmbed()
      .setColor("0xbf00ff")
      .setTitle(`Idk what to put here `)
      .setDescription(`Hello`);

    message.channel.send(embed);
  },
};
