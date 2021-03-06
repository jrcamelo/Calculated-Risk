const BaseCommand = require("./Base.js");

class GameMupsCommand extends BaseCommand {
  static command = ["AllMups", "Mups"];
  static helpTitle = "Shows a list of all the mups.";
  static helpDescription() { return `${BaseCommand.prefix + this.command[0]}`; }

  async execute() {
    if (this.thereIsNoGame()) {
        return await this.sendReplyWithDelete(`There is currently no game being hosted in this channel.`)
    }
    await this.sendReplyWithDelete(this.getGame().makeListOfMups());
  }
}
module.exports = GameMupsCommand;