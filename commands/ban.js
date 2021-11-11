const Discord = require("discord.js");

module.exports = {
  name: "ban",
  description: "Bans user from server. Usage: $ban <TaggedUser> <Reason>",
  args: true,
  usage: "$ban <TaggedUser> <Reason>",
  permission: "BAN_MEMBERS",
  async execute(message, args, client) {
    const { member, mentions } = message;
    const mentionedUser = message.guild.member(mentions.users.first());

    if (!mentionedUser)
      return message.reply("This member does not exist on this server!");
    if (mentionedUser.hasPermission("MANAGE_MESSAGES"))
      return message.reply("You cannot ban this person!");

    const reason = args.splice(1).join(" ");
    if (!reason) return message.reply("You need to give a reason!");
    const channel = message.guild.channels.cache.find((c) => c.name === "logs");

    const log = new Discord.MessageEmbed()
      .setTitle("User Banned")
      .addField("User:", mentionedUser, true)
      .addField("By:", message.author, true)
      .addField("Reason:", reason)
      .setColor("#7900ff");
    channel.send(log);

    const embed = new Discord.MessageEmbed()
      .setTitle("You were banned!")
      .setDescription(reason)
      .setColor("#7900ff");
    try {
      await mentionedUser.send(embed);
    } catch (err) {
      console.warn(err);
    }

    mentionedUser.ban({ reason: reason });

    message.channel.send(
      `**${mentionedUser}** has been banned by **${message.author}**!`
    );
  },
};
