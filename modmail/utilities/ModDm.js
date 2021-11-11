const { MessageEmbed } = require("discord.js");
const fs = require("fs");

const addModToDms = (userId) => {
  let modDms = require("./modDms.json");
  let mod = {
    userId: userId,
  };

  modDms.push(mod);
  let data = JSON.stringify(modDms);
  fs.writeFileSync("modmail/utilities/modDms.json", data);
};

const modInDms = (userId) => {
  const modDms = require("./modDms.json");
  for (let i = 0, len = modDms.length; i < len; i++) {
    if (modDms[i].userId === userId) {
      return true; // mod in dms with bot
    } else {
      return false; //mod not in dms with bot
    }
  }
  return false;
};

const removeModFromDms = (userId) => {
  const modDms = require("./modDms.json");
  for (let i = 0, len = modDms.length; i < len; i++) {
    if (modDms[i].userId === userId) {
      modDms.splice(i, 1);
      break;
    }
  }
  data = JSON.stringify(modDms);
  fs.writeFileSync("modmail/utilities/modDms.json", data);
};

module.exports = {
  addModToDms,
  modInDms,
  removeModFromDms,
};
