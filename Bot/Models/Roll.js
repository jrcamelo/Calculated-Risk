const Discord = require('discord.js');
const Utils = require("../Utils");

DEFAULT_MAX = 1000000000000;
DATABASE_MAX = 10000000000000000;
SAVED_ROLL_LENGTH = 6;
module.exports = class Roll {

  constructor(message, type, arg, limit) {
    if (message && message.id) {
      this.messageId = message.id;
    }
    this.type = type
    this.intention = arg;
    this.userLimit = limit;
    if (!limit || limit < 1 || limit > DATABASE_MAX) {
      this.userLimit = DEFAULT_MAX;
    }
    this.time = Date.now()
    return this;
  }

  load(hash) {
    this.value = hash.value;
    this.type = hash.type;
    this.intention = hash.intention || "";
    this.userLimit = hash.userLimit;
    this.result = hash.result;
    this.time = hash.time;
    return this;
  }

  static types = {
    NORMAL: "NORMAL",
    ID: "ID",
    TEST: "TEST",
    TESTID: "TESTID",
  }

  roll() {
    switch(this.type) {
      case Roll.types.NORMAL:
      case Roll.types.TEST:
        this.rollNormal();
        break;
      case Roll.types.ID:
      case Roll.types.TESTID:
        this.rollId();
        break;
      default:
        return null;
    }
    return this;
  }

  rollNormal() {
    this.value = this.randomNumber(1, this.userLimit);
    this.result = this.calculateRoll();
    return this;
  }

  rollId() {
    this.value = this.message.id;
    this.calculateRoll();
    return this;
  }

  calculateRoll() {
    let str = this.value.toString();
    let repeated = Utils.findRepeatedSize(str);
    let pali = Utils.findPalindromeSize(str);
    let straight = Utils.findStraightSize(str);
    let funny = Utils.findFunnyNumberSize(str);
    let size = Math.max(1, repeated, pali, straight, funny);
    this.formattedResult = Utils.spliceFromEnd(str, size, "**") + "**";
    this.result = Utils.lastCharacters(this.formattedResult, Math.max(size + 4, SAVED_ROLL_LENGTH + 4));
    return this.result;
  }


  makeText(player) {    
    let text = `${this.describeRoll(player)}\n`;
    text += this.describeIntentionAndDetails();
    return text;
  }

  makeEmbed(player) {
    let embed = new Discord.MessageEmbed()
      .setTitle(`${this.describeRoll(player)}`)
      .setDescription(this.describeIntentionAndDetails())
    return embed;
  }
  
  describeRoll(player) {
    return `${player.user.ping()} ${this.describeType()}${this.describeRollValue()}`;
  }

  describeType() {
    switch(this.type) {
      case Roll.types.NORMAL:
        return `rolled `
      case Roll.types.ID:
        return `rolled ID `
      case Roll.types.TEST:
        return `test rolled `
      case Roll.types.TESTID:
        return `test rolled ID `
      default:
        return "rolled ";
    }
  }

  describeRollValue() {
    return `${this.formattedResult || this.result || "?"}`
  }

  describeIntentionAndDetails() {
    let intention = "";
    if (this.intention) {
      intention = `**${this.intention}**`
    }
    let details = this.describeDetails();
    if (details && intention) {
      return `${details} - ${intention}`
    }
    return `${details}${intention}`
  }

  describeDetails() {
    switch(this.type) {
      case Roll.types.NORMAL:
        if (this.userLimit == DEFAULT_MAX) {
          return ""
        }
        return `Rolled for ${this.userLimit} `
      case Roll.types.ID:
      case Roll.types.TEST:
      case Roll.types.TESTID:
      default:
        return "";
    }
  }


  randomNumber(min=1, max=1000000000000) {
    return Math.floor(
      Math.random() * (max - min + 1) + min
    )
  }
}