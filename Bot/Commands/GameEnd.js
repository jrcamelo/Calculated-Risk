const BaseCommand = require("./Base.js");

class GameEndCommand extends BaseCommand {
  static command = ["EndGame", "FinishGame"];
  static helpTitle = "Finishes the current running game. GM or Mod only.";
  static helpDescription() { return `${BaseCommand.prefix + this.command[0]}` }

  async execute() {
    if (this.thereIsNoGame()) {
        return await this.sendReply(`There is currently no game being hosted in this channel.`)
    }
    if (this.userIsNotMaster() && this.userIsNotMod()) {
        return await this.sendReply(`You are not the GM of this game.`)
    }
    const oldGame = this.channel.finishGame();
    await this.save();
    return await this.sendReply(`${oldGame.name} has been finished.`)
  }

}
module.exports = GameEndCommand;