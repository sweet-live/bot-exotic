const Discord = require("discord.js");
const { channels } = require("../../botconfig.json");
const { addTimeout } = require("../utilities/Timeout");
const COMMANDNAME = "Post Art";
const MODMAILCHANNEL = "art-request";
const SENDCHANNEL = "art-channel";

const handleArt = async (message, client, inProcess) => {
  inProcess.push(message.author.id);
  const index = inProcess.findIndex((id) => {
    return id == message.author.id;
  });
  const filter = (msg) => {
    if (msg.attachments.first() != null) {
      return true;
    } else {
      if (!msg.author.bot) msg.reply("Please send a picture");
      return false;
    }
  };

  await message.channel
    .send(
      "Please provide the art you want to post, and it will be sent to our support team for review. The art must be completely original. Stolen art can result in punishment. You have **20 seconds**"
    )
    .then((msg) => {
      msg.channel
        .awaitMessages(filter, { max: 1, time: 20000, errors: ["time"] })
        .then((collected) => {
          collected.first().reply(getModmailReply(collected.first()));
          doArt(collected.first(), client);
          inProcess.splice(index, 1);
        })
        .catch((collected) => {
          msg.reply("Your time ran out, please try again.");
          inProcess.splice(index, 1);
        });
    });
};

const doArt = (message, client) => {
  const filter = (reaction, user) => {
    return (
      ["👍", "👎"].includes(reaction.emoji.name) &&
      user.id === message.author.id
    );
  };
  const modmailChannel = client.guilds.cache
    .first()
    .channels.cache.find((c) => c.name === MODMAILCHANNEL);

  const artChannel = client.guilds.cache
    .first()
    .channels.cache.find((c) => c.name === SENDCHANNEL);

  const artEmbed = new Discord.MessageEmbed()
    .setColor("#7900ff")
    .setTitle("Received Modmail:")
    .setAuthor(
      ` ${message.channel.recipient.username}#${message.channel.recipient.discriminator}`,
      message.channel.recipient.avatarURL()
    )
    .setImage(message.attachments.first().url);

  addTimeout(message.author.id);

  modmailChannel.send(artEmbed).then((msg) => {
    msg.react("👍").then(() => msg.react("👎"));
    msg
      .awaitReactions(filter, { max: 1, time: 600000, errors: ["time"] })
      .then((collected) => {
        const reaction = collected.first();
        if (reaction.emoji.name === "👍") {
          artEmbed.setTitle("");
          artChannel.send(artEmbed);
          msg.delete();
        } else {
          msg.delete();
          message.reply("Your art submission was refused");
        }
      })
      .catch((collected) => {});
  });
};

const getModmailReply = (message) => {
  const embed = new Discord.MessageEmbed()
    .setColor("#7900ff")
    .setTitle("Your Modmail")
    .addFields(
      { name: "Type", value: COMMANDNAME },
      { name: "Content", value: "Art" }
    )
    .setImage(message.attachments.first().url);

  return embed;
};

module.exports = {
  handleArt,
};
