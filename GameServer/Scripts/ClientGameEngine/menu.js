function Menu() {
    this.weapon = null;
    this.weaponText = null;
    this.weaponTextSize = 20;
    this.weaponTextColor = "blue";
    this.life = null;
    this.lifeText = null;
    this.lifeTextSize = this.weaponTextSize;
    this.lifeTextColor = this.weaponTextColor;
    this.fpsText = null;
    this.fpsTextSize = 10;
    this.fpsTextColor = "red";

    this.setLife = function (newLife) { this.life = newLife }
    this.setWeapon = function (newWeapon) { this.weapon = newWeapon }

    this.createLifeText = function (point) {
        this.lifeText = new createjs.Text(this.life, this.lifeTextSize + "px Arial", this.lifeTextColor);
        this.lifeText.x = point.x;
        this.lifeText.y = point.y;
    }

    this.updateLife = function (newLife, point) {
        this.setLife(newLife);
        this.createLifeText(point)
    }

    this.createWeaponText = function (point) {
        var weaponName = this.weapon["Name"];
        this.weaponText = new createjs.Text(weaponName, this.weaponTextSize + "px Arial", this.lifeTextColor);
        this.weaponText.x = point.x;
        this.weaponText.y = point.y;
    }

    this.updateWeapon = function (newWeapon, point) {
        this.setWeapon(newWeapon);
        this.createWeaponText(point);
    }

    this.createFPSText = function (fps, point) {
        this.fpsText = new createjs.Text("FPS: " + fps, this.fpsTextSize + "px Arial", this.fpsTextColor);
        this.fpsText.x = point.x;
        this.fpsText.y = point.y;
    }

    this.updateFPS = function (fps, point) {
        this.createFPSText(fps, point)
    }
}
