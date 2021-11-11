const Discord = require("discord.js");
const { channels } = require("../../botconfig.json");
const { addTimeout } = require("../utilities/Timeout");
const COMMANDNAME = "Report Staff";
const MODMAILCHANNEL = "staff-reports";

const handleReportStaff = async (message, client, inProcess) => {
  inProcess.push(message.author.id);
  const deleteIndex = inProcess.findIndex((id) => {
    return id == message.author.id;
  });
  const filter = (msg) => {
    if (!msg.author.bot) {
      return msg.channel.client.users.fetch(msg.content).catch((err) => {
        msg.reply(
          "No such member, please enter a valid ID. If you don't know how to find an ID, please click on this link: https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-."
        );
      });
    } else {
      return false;
    }
  };

  await message.channel
    .send(
      "Abuse of the system may result in a punishment. You have **3 minutes** \n __**Please enter the id:**__"
    )
    .then((msg) => {
      msg.channel
        .awaitMessages(filter, { max: 1, time: 180000, errors: ["time"] })
        .then((collected) => {
          doIdStep(collected.first(), client, inProcess, deleteIndex);
        })
        .catch((collected) => {
          console.log(collected);
          msg.reply("Your time ran out, please try again.");
          inProcess.splice(index, 1);
        });
    });
};

const doIdStep = (message, client, inProcess, deleteIndex) => {
  const userId = message.content;

  const filter = (msg) => {
    return msg.content != null;
  };

  message.channel.send("Enter the reason for the report:").then((msg) => {
    msg.channel
      .awaitMessages(filter, { max: 1, time: 180020, errors: ["time"] })
      .then((collected) => {
        doFinalStep(userId, collected.first(), client, inProcess, deleteIndex);
      });
  });
};

const doFinalStep = (id, message, client, inProcess, deleteIndex) => {
  const reason = message.content;

  const filter = (msg) => {
    console.log(msg);
    if (!(msg.attachments.first().url != null)) {
      msg.reply("Please provide a screenshot as evidence");
      return false;
    } else {
      return true;
    }
  };
  const modmailChannel = client.guilds.cache
    .first()
    .channels.cache.find((c) => c.name === MODMAILCHANNEL);

  const reportEmbed = new Discord.MessageEmbed()
    .setColor("#7900ff")
    .setTitle("Received Modmail:")
    .setAuthor(
      ` ${message.channel.recipient.username}#${message.channel.recipient.discriminator}`,
      message.channel.recipient.avatarURL()
    )
    .addFields(
      { name: "Reported User ID", value: id },
      { name: "Reason:", value: reason }
    );
  addTimeout(message.author.id);
  message.channel.send("Please provide evidence (Screenshot):").then((msg) => {
    msg.channel
      .awaitMessages(filter, { max: 1, time: 180020, errors: ["time"] })
      .then((collected) => {
        let imageUrl = collected.first().attachments.first().url;
        collected.first().reply(getModmailReply(id, reason, imageUrl));
        reportEmbed.setImage(imageUrl);
        modmailChannel.send(reportEmbed);
        inProcess.splice(deleteIndex, 1);
      });
  });
};

const getModmailReply = (id, reason, attachment) => {
  const embed = new Discord.MessageEmbed()
    .setColor("#7900ff")
    .setTitle("Your Modmail")
    .addFields(
      { name: "Type", value: COMMANDNAME },
      { name: "Reported User ID", value: id },
      { name: "Reason:", value: reason }
    )
    .setImage(attachment);

  return embed;
};

module.exports = {
  handleReportStaff,
};
