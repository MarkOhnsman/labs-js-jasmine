Game = function () {
  this.e = 10000;
  this.t = 8;
};

Game.prototype = {
  randomWithinLimitOf: function (n) {
    return Math.floor(Math.random() * n);
  },
  say(input) {
    $("#dialogue").append(input);
  },
  processCommand: function (ui) {
    var enemy;
    var distance;
    var damage;
    if (ui.parameter("command") === "phaser") {
      var amount = parseInt(ui.parameter("amount"), 10);
      enemy = ui.variable("target");
      if (this.e >= amount) {
        distance = enemy.distance;
        if (distance > 4000) {
          this.say(
            "<p>" +
              "Klingon out of range of phasers at " +
              distance +
              " sectors..." +
              "</p>"
          );
        } else {
          damage =
            amount -
            (((amount / 20) * distance) / 200 + this.randomWithinLimitOf(200));
          if (damage < 1) {
            damage = 1;
          }
          this.say(
            "<p>" +
              "Phasers hit Klingon at " +
              distance +
              " sectors with " +
              damage +
              " units" +
              "</p>"
          );
          if (damage < enemy.energy) {
            enemy.energy = enemy.energy - damage;
            this.say(
              "<p>" + "Klingon has " + enemy.energy + " remaining" + "</p>"
            );
          } else {
            this.say("<p>" + "Klingon destroyed!" + "</p>");
            enemy.destroy();
          }
        }
        this.e -= amount;
      } else {
        this.say("<p>" + "Insufficient energy to fire phasers!" + "</p>");
      }
    } else if (ui.parameter("command") === "photon") {
      enemy = ui.variable("target");
      if (this.t > 0) {
        distance = enemy.distance;
        if (this.randomWithinLimitOf(4) + (distance / 500 + 1) > 7) {
          this.say(
            "<p>" +
              "Torpedo missed Klingon at " +
              distance +
              " sectors..." +
              "</p>"
          );
        } else {
          damage = 800 + this.randomWithinLimitOf(50);
          this.say(
            "<p>" +
              "Photons hit Klingon at " +
              distance +
              " sectors with " +
              damage +
              " units" +
              "</p>"
          );
          if (damage < enemy.energy) {
            enemy.energy = enemy.energy - damage;
            this.say(
              "<p>" + "Klingon has " + enemy.energy + " remaining" + "</p>"
            );
          } else {
            this.say("<p>" + "Klingon destroyed!" + "</p>");
            enemy.destroy();
          }
        }
        this.t--;
      } else {
        this.say("<p>" + "No more photon torpedoes!" + "</p>");
      }
    }
  },
};
