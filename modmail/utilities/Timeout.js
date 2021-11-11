const { MessageEmbed } = require("discord.js");
const fs = require("fs");
const COOLDOWN = 1; ///cooldown in milliseconds

const addTimeout = (userId) => {
  let cooldowns = require("./cooldowns.json");
  let data = {
    userId: userId,
    time: Date.now(),
  };

  cooldowns.push(data);
  data = JSON.stringify(cooldowns);
  fs.writeFileSync("modmail/utilities/cooldowns.json", data);
};

const checkTimeout = (userId) => {
  const cooldowns = require("./cooldowns.json");
  for (let i = 0, len = cooldowns.length; i < len; i++) {
    if (cooldowns[i].userId === userId) {
      const timeElapsed = Date.now() - cooldowns[i].time;
      if (timeElapsed > COOLDOWN) {
        return true; //no more cooldown
      } else {
        return false; //still cooldown
      }
    }
  }
  return true;
};

const removeCooldown = (userId) => {
  const cooldowns = require("./cooldowns.json");
  for (let i = 0, len = cooldowns.length; i < len; i++) {
    if (cooldowns[i].userId === userId) {
      cooldowns.splice(i, 1);
      break;
    }
  }
  data = JSON.stringify(cooldowns);
  fs.writeFileSync("modmail/utilities/cooldowns.json", data);
};

const getTimeLeft = (userId) => {
  const cooldowns = require("./cooldowns.json");
  let timeLeft = 0;

  for (let i = 0, len = cooldowns.length; i < len; i++) {
    if (cooldowns[i].userId === userId) {
      timeLeft = COOLDOWN - (Date.now() - cooldowns[i].time);
    }
  }

  let minutes = Math.floor(timeLeft / 60000);
  let seconds = ((timeLeft % 60000) / 1000).toFixed(0);

  embed = new MessageEmbed()
    .setColor("#7900ff")
    .setTitle("Modmail is on cooldown!")
    .addFields({
      name: "Time Left",
      value: `${minutes < 1 ? "" : minutes} ${
        minutes < 1 ? "" : "minutes and"
      } ${seconds} seconds`,
    });

  return embed;
};

module.exports = {
  addTimeout,
  checkTimeout,
  getTimeLeft,
  removeCooldown,
};
