class Ship {
    constructor(hp, shield, shieldRecovery, weaponSlots, moduleSlots) {
        this.hp = hp;
        this.shield = shield;
        this.maxShield = shield;
        this.shieldRecovery = shieldRecovery;
        this.weaponSlots = weaponSlots;
        this.moduleSlots = moduleSlots;
        this.weapons = [];
        this.modules = [];
    }

    addModule(module) {
        switch(module) {
            case 'A': this.maxShield += 50; break;
            case 'B': this.hp += 50; break;
            case 'C': this.weapons.forEach(weapon => weapon.cooldown *= 0.8); break;
            case 'D': this.shieldRecovery *= 1.2; break;
        }
    }

    addWeapon(weapon) {
        this.weapons.push(weapon);
    }

    update() {
        // Recover shield
        this.shield = Math.min(this.shield + this.shieldRecovery, this.maxShield);
    }

    receiveDamage(damage) {
        let damageToShield = Math.min(this.shield, damage);
        this.shield -= damageToShield;
        let damageToHp = damage - damageToShield;
        this.hp -= damageToHp;
    }

    isAlive() {
        return this.hp > 0;
    }
}

class Weapon {
    constructor(type) {
        switch(type) {
            case 'A': this.damage = 5; this.cooldown = 3; break;
            case 'B': this.damage = 4; this.cooldown = 2; break;
            case 'C': this.damage = 20; this.cooldown = 5; break;
        }
        this.timer = 0;
    }

    ready() {
        return this.timer === 0;
    }

    reset() {
        this.timer = this.cooldown;
    }

    tick() {
        if (this.timer > 0) {
            this.timer--;
        }
    }
}

let shipA = new Ship(100, 80, 1, 2, 2);
let shipB = new Ship(60, 120, 1, 2, 3);

function setupShips() {
    // Setup weapons and modules for Ship A
    shipA.addWeapon(new Weapon(document.getElementById('weaponA1').value));
    shipA.addWeapon(new Weapon(document.getElementById('weaponA2').value));
    shipA.addModule(document.getElementById('moduleA1').value);
    shipA.addModule(document.getElementById('moduleA2').value);
    // Setup weapons and modules for Ship B
    shipB.addWeapon(new Weapon(document.getElementById('weaponB1').value));
    shipB.addWeapon(new Weapon(document.getElementById('weaponB2').value));
    shipB.addModule(document.getElementById('moduleB1').value);
    shipB.addModule(document.getElementById('moduleB2').value);
    shipB.addModule(document.getElementById('moduleB3').value);
}

function startBattle() {
    setupShips();
    const battleInterval = setInterval(() => {
        // Simulate battle
        simulateRound(shipA, shipB);
        simulateRound(shipB, shipA);

        updateUI();

        if (!shipA.isAlive() || !shipB.isAlive()) {
            clearInterval(battleInterval);
            alert(shipA.isAlive() ? "Ship A Wins!" : "Ship B Wins!");
        }
    }, 1000); // Run simulation every second
}

function simulateRound(attacker, defender) {
    attacker.weapons.forEach(weapon => {
        if (weapon.ready()) {
            defender.receiveDamage(weapon.damage);
            weapon.reset();
        }
        weapon.tick();
    });
    attacker.update();
    defender.update();
}

function updateUI() {
    document.getElementById('hpA').innerText = shipA.hp;
    document.getElementById('shieldA').innerText = shipA.shield;
    document.getElementById('hpB').innerText = shipB.hp;
    document.getElementById('shieldB').innerText = shipB.shield;
}