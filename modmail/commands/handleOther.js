const Discord = require("discord.js");
const { channels } = require("../../botconfig.json");
const { addTimeout } = require("../utilities/Timeout");
const { botID } = require("../../botconfig.json");
const { addModToDms, removeModFromDms } = require("../utilities/ModDm");
const COMMANDNAME = "Other";
const MODMAILCHANNEL = "other";

const handleOther = async (message, client, inProcess) => {
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
      "Provide our staff with the most information you can about our enquire, thank you. You have **3 minutes**"
    )
    .then((msg) => {
      msg.channel
        .awaitMessages(filter, { max: 1, time: 20000, errors: ["time"] })
        .then((collected) => {
          collected.first().reply(getModmailReply(collected.first()));
          doOther(collected.first(), client);
          inProcess.splice(index, 1);
        })
        .catch((collected) => {
          console.log(collected);
          msg.reply("Your time ran out, please try again.");
          inProcess.splice(index, 1);
        });
    });
};

const doOther = (message, client) => {
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
    .addField("Content", message.content);

  addTimeout(message.author.id);

  const filter = (reaction, user) => {
    return ["🆒"].includes(reaction.emoji.name) && !user.bot;
  };

  modmailChannel.send(suggestionEmbed).then((msg) => {
    msg.react("🆒");

    msg
      .awaitReactions(filter, { max: 1, time: 6000000, errors: ["time"] })
      .then((collected) => {
        msg.delete();
        const reactingUser = collected
          .first()
          .users.cache.find((u) => u.bot === false);
        let originalModmail = collected.first().message.embeds[0];
        reactingUser.send("You Reacted to the following modmail:");
        reactingUser.send(originalModmail);
        reactingUser.send("Please enter your reply:").then((m) => {
          modReply(reactingUser.id, m, message.author, originalModmail);
        });
      })
      .catch((collected) => {
        console.log(collected);
      });
  });
};

const modReply = (modID, message, user, originalModmail) => {
  addModToDms(modID);

  const filter = (m) => {
    return m.author.id === modID;
  };

  const embed = new Discord.MessageEmbed()
    .setColor("#7900ff")
    .setTitle("Modmail Reply")
    .addFields(
      { name: "Type", value: "Other" },
      { name: "Original Message", value: originalModmail.fields[0].value }
    );

  message.channel
    .awaitMessages(filter, { max: 1, time: 6000000, errors: ["time"] })
    .then((msg) => {
      embed.addField("Reply", msg.first().content);
      user.send(embed);
      removeModFromDms(modID);
    })
    .catch((err) => {
      removeModFromDms(modID);
    });
};

const getModmailReply = (message) => {
  const embed = new Discord.MessageEmbed()
    .setColor("#7900ff")
    .setTitle("Your Modmail")
    .addFields(
      { name: "Type", value: COMMANDNAME },
      { name: "Other", value: message.content }
    );

  return embed;
};

module.exports = {
  handleOther,
};
