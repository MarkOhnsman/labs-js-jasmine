
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

    dealDamage(ui, distance, damage, enemy, type){
        ui.writeLine(type + " hit Klingon at " + distance + " sectors with " + damage + " units");
        if (damage < enemy.energy) {
            enemy.energy = enemy.energy - damage;
            ui.writeLine("Klingon has " + enemy.energy + " remaining");
        } else {
            ui.writeLine("Klingon destroyed!");
            enemy.destroy();
        }
    }

    firePhasers(ui, enemy, distance){
        var powerNeeded = parseInt(ui.parameter("amount"), 10);
        if (this.power >= powerNeeded) {
            var distance = enemy.distance
            if (distance > this.maxPhaserRange) {
                ui.writeLine("Klingon out of range of phasers at " + distance + " sectors...");
            } else {
                var damage = powerNeeded - (((powerNeeded / 20) * distance / 200) + this.randomWithinLimitOf(200));
                if (damage < 1) {
                    damage = 1;
                }
               this.dealDamage(ui, distance, damage, enemy, "Phasers")
            }
            this.power -= powerNeeded;
        } else {
            ui.writeLine("Insufficient energy to fire phasers!");
        }
    }

    firePhotonTorpedos(ui, enemy){
        if(this.torpedos > 0) {
            var distance = enemy.distance
            if ((this.randomWithinLimitOf(4) + ((distance / 500) + 1) > 7)) {
                ui.writeLine("Torpedo missed Klingon at " + distance + " sectors...");
            } else {
                var damage = 800 + this.randomWithinLimitOf(50);
                this.dealDamage(ui, distance, damage, enemy, "Photons")
            }
            this.torpedos--;
        } else {
            ui.writeLine("No more photon torpedoes!");
        }
    }

    processCommand(ui) {
        var enemy = ui.variable("target")
        if(ui.parameter("command") === "phaser") {
            this.firePhasers(ui, enemy)
        } else if(ui.parameter("command") === "photon") {
            this.firePhotonTorpedos(ui, enemy)
        }
    }
}


