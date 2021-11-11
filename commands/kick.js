const Discord = require("discord.js");
module.exports = {
  name: "kick",
  description: "Kicks user from server. Usage: $kick <TaggedUser> <Reason>",
  args: true,
  usage: "$kick <TaggedUser> <Reason>",
  permission: "KICK_MEMBERS",
  async execute(message, args, client) {
    const { member, mentions } = message;
    const mentionedUser = message.guild.member(mentions.users.first()); //Gets the user as a guildmember

    if (!mentionedUser)
      return message.reply("This member does not exist on this server!");
    if (mentionedUser.hasPermission("MANAGE_MESSAGES"))
      return message.reply("You cannot ban this person!");

    const reason = args.splice(1).join(" ");
    if (!reason) return message.reply("You need to give a reason!");

    const channel = message.guild.channels.cache.find((c) => c.name === "logs");
    console.log(channel);
    const log = new Discord.MessageEmbed()
      .setTitle("User Kicked")
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

    mentionedUser.kick(reason);

    message.channel.send(
      `**${mentionedUser}** has been kicked by **${message.author}**!`
    );
  },
};
