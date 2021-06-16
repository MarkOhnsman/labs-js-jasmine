class Weapon {
  fire(game, ui) {
    if (_hasAmmo(game, ui)) {
      //TODO Pick-Up Here
    }
  }
  _hasAmmo(game, ui) {
    throw new Error("You must specify the derived method");
  }
}

class Photon extends Weapon {
  _hasAmmo(game, _unusedUI) {
    return game.torpedos > 0;
  }
}

class Phaser extends Weapon {
  _hasAmmo(game, ui) {
    return game.power >= parseInt(ui.parameter("amount"), 10);
  }
}

class Game {
  power = 10000;
  torpedos = 8;
  maxPhaserRange = 4000;

  generator() {
    return Math.random();
  }

  randomWithinLimitOf(n) {
    return Math.floor(this.generator() * n);
  }

  dealDamage(ui, distance, damage, enemy, type) {
    ui.writeLine(
      `${type} hit Klingon at ${distance} sectors with ${damage} units`
    );
    if (damage < enemy.energy) {
      enemy.energy = enemy.energy - damage;
      ui.writeLine(`Klingon has ${enemy.energy} remaining`);
    } else {
      ui.writeLine("Klingon destroyed!");
      enemy.destroy();
    }
  }

  hasPhaserAmmo(ui) {
    return this.power >= parseInt(ui.parameter("amount"), 10);
  }

  hasTorpedoAmmo() {
    return this.torpedos > 0;
  }

  phaserMissed(distance) {
    return distance > this.maxPhaserRange;
  }

  torpedoMissed(distance) {
    return this.randomWithinLimitOf(4) + (distance / 500 + 1) > 7;
  }

  expendPower(powerNeeded) {
    this.power -= powerNeeded;
  }

  expendTorpedo() {
    this.torpedos--;
  }

  calculatePhaserDamage(powerNeeded, distance) {
    var damage =
      powerNeeded -
      (((powerNeeded / 20) * distance) / 200 + this.randomWithinLimitOf(200));
    if (damage < 1) {
      damage = 1;
    }
    return damage;
  }

  calculatePhotonDamage() {
    return 800 + this.randomWithinLimitOf(50);
  }

  firePhasers(ui, enemy, distance) {
    if (this.hasPhaserAmmo(ui)) {
      var distance = enemy.distance;
      var powerNeeded = parseInt(ui.parameter("amount"), 10);
      if (this.phaserMissed(distance)) {
        ui.writeLine(
          `Klingon out of range of phasers at ${distance} sectors...`
        );
      } else {
        var damage = this.calculatePhaserDamage(powerNeeded, distance);
        this.dealDamage(ui, distance, damage, enemy, "Phasers");
      }
      this.expendPower(powerNeeded);
    } else {
      // ANCHOR you are here
      ui.writeLine("Insufficient energy to fire phasers!");
    }
  }

  firePhotonTorpedos(ui, enemy) {
    if (this.hasTorpedoAmmo()) {
      var distance = enemy.distance;
      if (this.torpedoMissed(distance)) {
        ui.writeLine("Torpedo missed Klingon at " + distance + " sectors...");
      } else {
        var damage = this.calculatePhotonDamage();
        this.dealDamage(ui, distance, damage, enemy, "Photons");
      }
      this.expendTorpedo();
    } else {
      ui.writeLine("No more photon torpedoes!");
    }
  }

  processCommand(ui) {
    var enemy = ui.variable("target");
    // var weapon;
    if (ui.parameter("command") === "phaser") {
      // weapon = new Phaser()
      this.firePhasers(ui, enemy);
    } else if (ui.parameter("command") === "photon") {
      // weapon = new Torpedo()
      this.firePhotonTorpedos(ui, enemy);
    }

    // fireWeapon(ui, enemy, weapon)
  }

  // NOTE abstraction of above method
  processCommandWithExcraction(ui) {
    var weapon = this.readyWeapon(ui.parameter("command"));
    weapon.fire(ui);
    weapon.coolStartCooldown();
  }
  readyWeapon(type) {
    switch (type) {
      case "phaser":
        return new Phaser();
      case "photon":
        return new Photon();
      default:
        throw new Error("We don't have that weapons system");
    }
  }
}
