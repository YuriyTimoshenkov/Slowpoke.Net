function Menu() {
    this.currentWeapon = null;
    this.currentWeaponText = null;

    this.setCurrentWeapon = function(currentWeapon) {this.currentWeapon = currentWeapon}

    this.createCurrentWeaponText = function () {
        var weaponName = this.currentWeapon["Name"];
        var textSize = 20;
        this.currentWeaponText = new createjs.Text(weaponName, textSize + "px Arial", "red");
    }
}
