function Menu() {
    this.weapon = null;
    this.weaponText = null;
    this.weaponTextsize = 20;
    this.weaponTextColor = "red";

    this.life = null;
    this.lifeText = null;
    this.lifeTextsize = this.weaponTextsize;
    this.lifeTextColor = this.weaponTextColor;

    this.setLife = function (newLife) { this.life = newLife }
    this.setWeapon = function(newWeapon) {this.weapon = newWeapon}

    this.createLifeText = function (point) {
        this.lifeText = new createjs.Text(this.life, this.weaponTextsize + "px Arial", this.lifeTextColor);
        this.lifeText.x = point.x;
        this.lifeText.y = point.y;
    }

    this.updateLife = function (newLife, point) {
        this.setLife(newLife);
        this.createLifeText(point)
    }

    this.createWeaponText = function (point) {
        var weaponName = this.weapon["Name"];
        this.weaponText = new createjs.Text(weaponName, this.weaponTextsize + "px Arial", this.lifeTextColor);
        this.weaponText.x = point.x;
        this.weaponText.y = point.y;
    }

    this.updateWeapon = function (newWeapon, point) {
        this.setWeapon(newWeapon);
        this.createWeaponText(point);
    }

}
