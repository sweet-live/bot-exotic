const { name, avatarURL } = require("../botconfig.json");
const { handleArt } = require("./commands/handleArt");
const { handleSuggestion } = require("./commands/handleSuggestion");
const { handleReportUser } = require("./commands/handleReportUser");
const { handleReportStaff } = require("./commands/handleReportStaff");
const { handleOther } = require("./commands/handleOther");
const {
  checkTimeout,
  getTimeLeft,
  removeCooldown,
} = require("./utilities/Timeout");
//mailmod command dictionary
const dictionary = [
  "post art",
  "suggestion",
  "report staff",
  "report user",
  "request role",
  "appeal",
  "other",
  "cancel",
];
const { modInDms } = require("./utilities/ModDm");
var inProcess = [];
const Discord = require("discord.js");

module.exports = {
  name: "modmail",
  description: "Contains modmail system",
  async execute(message, client, currentDMs) {
    if (modInDms(message.author.id)) {
      return;
    }
    if (!checkTimeout(message.author.id)) {
      return message.reply(getTimeLeft(message.author.id));
    } else {
      removeCooldown(message.author.id); ///removes user cooldown data from the json file
    }

    if (!inProcess.includes(message.author.id)) {
      currentDMs.push(message.author.id);
      const index = currentDMs.findIndex((id) => {
        return id == message.author.id;
      });

      let filter = (m) => {
        if (
          m.author.id === message.author.id &&
          dictionary.includes(m.content.toLowerCase())
        ) {
          return true;
        } else if (!m.author.bot) {
          m.reply("Please check the spelling of your command");
          return false;
        }
      };

      message.channel.send(modmailEmbed).then(() => {
        message.channel
          .awaitMessages(filter, {
            max: 1,
            time: 60000,
            errors: ["time"],
          })
          .then(async (collected) => {
            await handleResponse(collected.first(), client, inProcess);
            currentDMs.splice(index, 1);
          })
          .catch((collected) => {
            message.channel.send("Timeout");
            currentDMs.splice(index, 1);
          });
      });
    } else {
      return;
    }
  },
};

const handleResponse = async (message, client, inProcess) => {
  const command = message.content.toLowerCase();
  switch (command) {
    case "post art":
      await handleArt(message, client, inProcess);
      break;
    case "suggestion":
      handleSuggestion(message, client, inProcess);
      break;
    case "report staff":
      handleReportStaff(message, client, inProcess);
      break;
    case "report user":
      handleReportUser(message, client, inProcess);
      break;
    // case "appeal":
    //   handleAppeal(message);
    //   break;
    case "other":
      handleOther(message, client, inProcess);
      break;
    case "cancel":
      return message.reply("cancelled");
    default:
      message.reply("Please use one of the commands above");
  }
};

const modmailEmbed = new Discord.MessageEmbed()
  .setColor("BLURPLE")
  .setTitle("Welcome to the Mod Mail System")
  .setDescription(
    "This modmail system was created for Exotic World. It is designed to help you get the support you need. Please help our moderators help you - respond to one of the options below. This prompt will expire in 30 seconds"
  )
  .addFields(
    {
      name: "__**Post Art**__",
      value:
        "Use this command to send art to the art channel. The art will be reviewed by a member of our team shortly. (NOTE: Your art must be your art, otherwise it *will* result in a warning).\n Usage: Post Art <Attached Image>",
    },
    {
      name: "__**Suggestion**__",
      value:
        "This is to create a suggestion for the server. Be it a proposed feature you would want to see, or a new role added, etc. Make sure the suggestion is serious and not a joke. (NOTE this is not for youtube suggestions)",
    },
    {
      name: "__**Report Staff**__",
      value:
        "This is for reporting staff, who you suspect to have broken a rule or misconducted in any way. Please make sure that your report is serious and logical.",
    },
    {
      name: "__**Report User**__",
      value:
        "This is for reporting a user, who you suspect to have broken a rule or was misbehaving in voice chat, text chat etc. Please make sure that your report is serious and logical.",
    },
    {
      name: "__**Request Role**__",
      value:
        "This is for requesting a role that you think you are allowed to have. Please make sure that you have met the requirements for the role, you can do so by going to roleinfo in Exotic World",
    },
    {
      name: "__**Appeal**__",
      value:
        "This is for appealing a warning that you have been given. Please only appeal if you are 100% sure you are in the right.",
    },
    {
      name: "__**Other**__",
      value:
        "This is for any other concerns you might have about Exotic World that doesn't fit any of the above commands.",
    },
    { name: "__**Cancel**__", value: "Cancels this prompt" }
  );

// Suggestion
// This is for making a suggestion about the server maybe a cool feature you would like
// to see
// maybe a new role etc. Make sure you are serious about everything you say
// this is also not for youtube suggestions
// Report Staff
// This is for reporting staff that have broken a rule, this doesn't need to be necessarily
// if they
// broke a rule it can be for other reasons as long as your being serous and logical.
// Report User
// This is for reporting a user that has broken a rule such as posting gore images
// spamming
// messages swearing in a vc etc. (NOTE anything that you state that is not logical will
// be counted as a warning to you).
// Request Role
// This is for requesting a role that is obtainable, make sure you qualify for the role you
// want to obtain you can do this by
// going to role info in Exotic World.
// Appeal
// This is for appealing a warning that was given to you. You can only appeal a
// punishment if you did not really break the
// rules, or if you think the punishment was unfair
// (You cannot appeal automod punishments as they are accurate).
// Other
// This is for any other concerns you might have over Exotic World this could be why
// can't i spam or whatever you would like
// as long as it is logical
// Cancel
// Cancels this prompt
// NOTE
// When choose category you can only send ONE MESSAGE to the support team
// afterwards a moderator can respond to your mail remember ONLY ONE MESSAGE
// You have 10 seconds to choose
