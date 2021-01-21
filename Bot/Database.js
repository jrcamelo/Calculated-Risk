const ReplitDatabase = require("@replit/database");
const Base32 = require("base32");

module.exports = class Database {
  constructor() {
    this.db = new ReplitDatabase();
  }

  // For tests
  async getAll() {
    return await this.db.getAll();
  }

  async get(id) {
    return await this.db.get(id);
  }

  async getChannel(channelId, prefix="CHANNEL_") {
    return await this.db.get(prefix + channelId);
  }

  async saveChannel(channel, prefix="CHANNEL_") {
    // await this.trySaveChannelBackup(channel);
    // channel.encode();
    return await this.db.set(prefix + channel.id, channel);
  }

  async trySaveChannelBackup(channel) {
    try {
      const old = await this.db.get("CHANNEL_" + channel.id);
      if (old != null) {
        await this.db.set("CHANNEL_" + channel.id + "_BACKUP", old);
      }
    } catch(e) {
      console.log(e);
    }
  }

  async savePrefix(serverId, commandPrefix, prefix="SERVER_") {
    return await this.db.set(prefix + serverId, commandPrefix);
  }

  async getPrefix(serverId, prefix="SERVER_") {
    return await this.db.get(prefix + serverId);
  }

  async getChannels() {
    return await this.db.list("CHANNEL_");
  }

  async restoreBackup(channel_id) {
    await this.db.set(channel_id, await this.db.get(channel_id + "_BACKUP"));
  }

  async encodeAllChannels() {
    const search = await this.db.list("CHANNEL_")
    for (let ch of search) {
      if (ch.endsWith("BACKUP")) {
        continue;
      }
      let chan = await this.get(ch);
      const Channel = require("./Models/Channel");
      let channel = new Channel().load(chan);
      await this.db.set("CHANNEL_" + channel.id + "_MIGRATIONBACKUP", channel);
      channel.encode();
      await this.db.set("CHANNEL_" + channel.id, channel);
    }
    console.log("Done");
  }

  async restoreAllMigrationBackups() {
    const search = await this.db.list("CHANNEL_")
    for (let ch of search) {
      if (ch.endsWith("BACKUP")) {
        continue;
      }
      let bk = await this.get(ch + "_MIGRATIONBACKUP");
      if (bk) {
        const Channel = require("./Models/Channel");
        let channel = new Channel().load(bk);
        await this.db.set("CHANNEL_" + channel.id, channel);
      }
    }
    console.log("Done");

  }
}