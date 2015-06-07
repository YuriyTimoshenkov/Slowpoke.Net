var BaseBody = Class.extend({
    init: function (serverBody) {
        var self = this;
        this.serverBody = serverBody;
        this.Id = serverBody.Id;
        this.name = serverBody.Name;
        this.gameRect = new Rect(0, 0, serverBody.Shape.Radius * 2, serverBody.Shape.Radius * 2);
        this.gameRect.center = serverBody.Shape.Position;
        this.direction = new Vector(serverBody.Direction.X, serverBody.Direction.Y)
            || new Vector(0,-1);
        this.image = new createjs.Container();
        this.image.zIndex = 1;
        this.speed = serverBody.Speed;
        this.baseRotationVector = new Vector(0, -1);
    },
    updateDirection: function (newDirection) {
        var rotationDeltaRad = Math.acos(this.baseRotationVector.product(newDirection)/
            this.baseRotationVector.length() * newDirection.length());

        var rotationDeltaDegree = rotationDeltaRad * (180 / Math.PI);

        // To check rotation direction
        var centerX = this.image.x;
        var mouseX = centerX + newDirection.x;

        // Clockwise
        if (mouseX >= centerX) {
            this.image.rotation = rotationDeltaDegree;
        }// Counter-clockwise
        else {
            this.image.rotation = 360 - rotationDeltaDegree;
        }

        // Update direction and weapon
        this.direction = newDirection;
    },
    serverSync: function (serverBody) {
        // Update direction
        var newDirection = serverBody.Direction;

        if (Math.abs(this.direction.x - serverBody.Direction.X) > 0.0001 || Math.abs(this.direction.y - serverBody.Direction.Y) > 0.0001) {
            this.updateDirection(new Vector(serverBody.Direction.X, serverBody.Direction.Y));
        }

        //Position
        this.gameRect.center = serverBody.Shape.Position;
    },
    update: function () { }
});

var CharacterBody = BaseBody.extend({
    init: function (serverBody) {
        var self = this;

        this._super(serverBody);

        this.objectMenu = new createjs.Container();
        this.life = serverBody.Life || 0;
        this.maxLife = serverBody.MaxLife || 0;
        this.score = 0;

        this.weaponImage = null;
        this.currentWeapon = serverBody.CurrentWeapon;

        this.createLifeText = function () {
            var textSize = 15;
            return new createjs.Text(self.life, textSize + "px Arial", "#AAA9AB");
        }

        this.addLifeText = function () {
            self.lifeText = self.createLifeText();
            self.lifeText.x = -self.gameRect.width * 1.5;
            self.lifeText.y = -self.gameRect.height * 1.5;
            self.objectMenu.addChild(self.lifeText);
        }

        this.updateLife = function (life) {
            self.life = life;

            if (self.lifeText) {
                self.lifeText.text = life
            }
        }
    },
    serverSync: function (serverBody) {
        this._super(serverBody);

        this.updateLife(serverBody.Life)
    }
});

var PlayerBody = CharacterBody.extend({
    init: function (serverBody) {
        var self = this;

        this._super(serverBody);
    },
    serverSync: function (serverBody) {
        // Update weapon
        if (serverBody.CurrentWeapon != 'undefined' && this.currentWeapon !== serverBody.CurrentWeapon) {
            this.currentWeapon = serverBody.CurrentWeapon;
        }

        // Update life
        if (this.life !== serverBody.Life) {
            this.updateLife(serverBody.Life);
        }


        // Update score
        if (serverBody.Score) {
            this.score = serverBody.Score;
        }
    }
});

var BulletBody = BaseBody.extend({
    init: function (serverBody) {
        var self = this;

        this._super(serverBody);
        this.lastUpdateTime = new Date().getTime();
        this.unitDirection = new Vector(self.direction.x, self.direction.y).calculateUnitVector();
    },
      serverSync :function (serverBody) { },

        update : function () {
            var currentTime = new Date().getTime();
            var duration = currentTime - this.lastUpdateTime;
            this.lastUpdateTime = currentTime;

            this.gameRect.center = {
                X: this.gameRect.centerx + this.speed * duration * this.unitDirection.x / 1000,
                Y: this.gameRect.centery + this.speed * duration * this.unitDirection.y / 1000
            };
        }
    }
);
