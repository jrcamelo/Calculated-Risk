const Discord = require('discord.js');
const Player = require("./player");
const Roll = require("./roll")
const TextUtils = require("../utils/text")

module.exports = class Turn {
  constructor(_database, mup = "", description = "", number = 0, players = null, rolls = null) {
    this._database = _database
    this.description = description
    this.mup = mup
    this.number = number
    this._players = players || {}
    this._rolls = rolls || []
  }

  static fromPreviousTurn(_database, previous, mup, description) {
    return new Turn(
      _database,
      mup,
      description,
      (previous.number || 0) + 1,
      this.playersToNewTurn(previous._players),
    )
  }
  
  static playersToNewTurn(oldPlayers) {
    const newPlayers = {};
    for (let player of Object.values(oldPlayers)) {
      if (player.left != true) {
        const newPlayer = Player.newTurn(player);
        newPlayers[newPlayer.id] = newPlayer;
      }
    }
    return newPlayers;
  }

  save() {
    return this._database.saveTurn(this)
  }

  getPlayer(discordUser) {
    return this._players[discordUser.id];    
  }

  addPlayer(discordUser, factionName) {
    this._players[discordUser.id] = new Player(discordUser, factionName)
  }

  renamePlayer(player, factionName) {
    this._players[player.id].name = factionName
  }

  kickPlayer(player) {
    player.alive = false;
    player.left = true;
  }

  banPlayer(player) {
    delete this.players[player.user.id]
  }

  revivePlayer(player) {
    player.alive = true
  }

  pingNotPlayed() {
    if (!Object.keys(this.players).length) {
      return "Nobody is playing yet."
    }
    let text = ""
    for (let player of this.playerHashToList()) {
      if (player.alive && !player.rolled) {
        text += `${player.ping()} `
      }
    }
    return text || "No players need to roll.";
  }

  
  playerHashToList() {
    return Object.values(this._players);
  }
}