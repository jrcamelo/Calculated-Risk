const MupCommand = require("./Mup.js");

class MupChangeCommand extends MupCommand {
  static command = ["UpdateMup", "EditMup"];
  static helpTitle = "Updates the current Mup image and description, without changing turn and rolls.";

  changeMup(description, attachment) {
    this.channel.game.updateMup(description, attachment);
  }

}
module.exports = MupChangeCommand;