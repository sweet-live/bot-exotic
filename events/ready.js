const fs = require("fs");
var path = require("path");
const { isDeepStrictEqual } = require("util");
var appDir = path.dirname(require.main.filename);

module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    var map = {};
    client.guilds.cache.first().channels.cache.forEach((channel) => {
      map[channel.name] = channel.id;
    });
    let botDetails = {
      botID: client.user.id,
      name: client.user.username,
      avatarURL: client.user.avatarURL(),
      channels: map,
    };

    let data = JSON.stringify(botDetails);
    fs.writeFileSync(`${appDir}/botconfig.json`, data);

    console.log("Ready!");
  },
};
