function Menu() {
    var self = this;

    this.weaponTextSize = 20;
    this.weaponTextColor = "blue";
    this.lifeTextSize = this.weaponTextSize;
    this.lifeTextColor = this.weaponTextColor;
    this.fpsTextSize = 10;
    this.fpsTextColor = "red";
    this.pingTextSize = 10;
    this.pingTextColor = "red";
    this.scoreTextSize = this.weaponTextSize;
    this.scoreTextColor = "red";

    this.createScoreText = function (score, point) {
        var text = "Score: " + score;
        this.scoreText = new createjs.Text(text, this.scoreTextSize + "px Arial", this.scoreTextColor);
        this.scoreText.X = point.X;
        this.scoreText.y = point.y;
        this.scoreText.zIndex = 100;
    }

    this.updateScore = function (score, point) {
        if (self.scoreText === undefined) {
            this.createScoreText(score, point)
        }
        else {
            self.scoreText.text = "Score: " + score;
        }
    }

    this.createLifeText = function (newLife, point) {
        var text = "HP: " + newLife;
        this.lifeText = new createjs.Text(text, this.lifeTextSize + "px Arial", this.lifeTextColor);
        this.lifeText.X = point.X;
        this.lifeText.y = point.y;
        this.lifeText.zIndex = 100;
    }

    this.updateLife = function (newLife, point) {
        if (self.lifeText === undefined) {
            this.createLifeText(newLife, point)
        }
        else {
            self.lifeText.text = "HP: " + newLife;
        }
    }

    this.createWeaponText = function (newWeapon, point) {
        this.weaponText = new createjs.Text(newWeapon, this.weaponTextSize + "px Arial", this.lifeTextColor);
        this.weaponText.zIndex = 3;
        this.weaponText.X = point.X;
        this.weaponText.y = point.y;
        this.weaponText.zIndex = 100;
    }

    this.updateWeapon = function (newWeapon, point) {
        if (self.weaponText === undefined) {
            this.createWeaponText(newWeapon, point)
        }
        else {
            self.weaponText.text = newWeapon;
        }
    }

    this.createFPSText = function (fps, point) {
        this.fpsText = new createjs.Text("FPS: " + fps, this.fpsTextSize + "px Arial", this.fpsTextColor);
        this.fpsText.zIndex = 3;
        this.fpsText.X = point.X;
        this.fpsText.y = point.y;
        this.fpsText.zIndex = 100;
    }

    this.createPingText = function (ping, point) {
        this.pingText = new createjs.Text("PPS: " + ping, this.fpsTextSize + "px Arial", this.fpsTextColor);
        this.pingText.zIndex = 3;
        this.pingText.X = point.X;
        this.pingText.y = point.y;
        this.pingText.zIndex = 100;
    }

    this.updateFPS = function (fps, point) {
        if (self.fpsText === undefined) {
            this.createFPSText(fps, point)
        }
        else {
            self.fpsText.text = "FPS: " + fps;
        }
    }

    this.updatePing = function (ping, point) {
        if (self.pingText === undefined) {
            this.createPingText(ping, point)
        }
        else {
            self.pingText.text = "PPS: " + ping;
        }
    }
}
