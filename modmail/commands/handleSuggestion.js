const Discord = require("discord.js");
const { channels } = require("../../botconfig.json");
const { addTimeout } = require("../utilities/Timeout");
const COMMANDNAME = "Suggestion";
const MODMAILCHANNEL = "suggestions";

const handleSuggestion = async (message, client, inProcess) => {
  inProcess.push(message.author.id);
  const index = inProcess.findIndex((id) => {
    return id == message.author.id;
  });
  const filter = (msg) => {
    if (msg.content != null) {
      return true;
    } else {
      if (!msg.author.bot) msg.reply("Please send some text.");
      return false;
    }
  };

  await message.channel
    .send(
      "Please write a suggestion that you would like our staff to consider. The Suggestion must be serious and logical. Abuse of the system may result in a punishment. You have **3 minutes**"
    )
    .then((msg) => {
      msg.channel
        .awaitMessages(filter, { max: 1, time: 180000, errors: ["time"] })
        .then((collected) => {
          collected.first().reply(getModmailReply(collected.first()));
          doSuggestion(collected.first(), client);
          inProcess.splice(index, 1);
        })
        .catch((collected) => {
          console.log(collected);
          msg.reply("Your time ran out, please try again.");
          inProcess.splice(index, 1);
        });
    });
};

const doSuggestion = (message, client) => {
  const filter = (reaction, user) => {
    return (
      ["👍", "👎"].includes(reaction.emoji.name) &&
      user.id === message.author.id
    );
  };
  const modmailChannel = client.guilds.cache
    .first()
    .channels.cache.find((c) => c.name === MODMAILCHANNEL);

  const suggestionEmbed = new Discord.MessageEmbed()
    .setColor("#7900ff")
    .setTitle("Received Modmail:")
    .setAuthor(
      ` ${message.channel.recipient.username}#${message.channel.recipient.discriminator}`,
      message.channel.recipient.avatarURL()
    )
    .addField("Suggestion", message.content);

  addTimeout(message.author.id);

  modmailChannel.send(suggestionEmbed).then((msg) => {
    msg.react("👍").then(() => msg.react("👎"));
    msg
      .awaitReactions(filter, { max: 1, time: 10000000, errors: ["time"] })
      .then((collected) => {
        const reaction = collected.first();

        if (reaction.emoji.name === "👍") {
          message.reply("Your Suggestion was approved");
          msg.delete();
        } else {
          msg.delete();
          message.reply("Your Suggestion was rejected");
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
      { name: "Suggestion", value: message.content }
    );

  return embed;
};

module.exports = {
  handleSuggestion,
};
