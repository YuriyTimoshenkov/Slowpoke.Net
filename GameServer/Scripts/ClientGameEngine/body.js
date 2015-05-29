var BaseBody = Class.extend({
    init: function (serverBody) {
        var self = this;
        this.serverBody = serverBody;
        this.Id = serverBody.Id;
        this.gameRect = new Rect(0, 0, serverBody.Shape.Radius * 2, serverBody.Shape.Radius * 2);
        this.gameRect.center = serverBody.Shape.Position;
        this.direction = serverBody.Direction || { X: 0, Y: 0 };
        this.image = new createjs.Container();
        this.image.zIndex = 1;
        this.speed = serverBody.Speed;

        this.updateDirection = function (newDirection) {
            // Calc rotation for object rendering

            var a = { X: 0, Y: -1 }
            var b = newDirection;

            var value1 = a.X * b.X + a.Y * b.Y;
            var value21 = Math.sqrt(Math.pow(a.X, 2) + Math.pow(a.Y, 2));
            var value22 = Math.sqrt(Math.pow(b.X, 2) + Math.pow(b.Y, 2));
            var value2 = value21 * value22;
            var value = value1 / value2;
            var rotationDeltaRad = Math.acos(value);

            var rotationDeltaDegree = rotationDeltaRad * (180 / Math.PI);

            // To check rotation direction
            var centerX = this.image.x;
            var centerY = this.image.y;
            var mouseX = centerX + newDirection.X;
            var mouseY = centerY + newDirection.Y;

            // Clockwise
            if (mouseX > centerX) {
                this.image.rotation = rotationDeltaDegree;
            }
                // Counter-clockwise
            else if (mouseX < centerX) {
                this.image.rotation = 360 - rotationDeltaDegree;
            }
                // if mousex = centerx
            else {
                // if up
                if (mouseY < centerY) {
                    this.image.rotation = 0;
                }
                    // if down
                else if (mouseY > centerY) {
                    this.image.rotation = 180;
                }
            }

            // Update direction and weapon
            this.direction = newDirection;
        }

        this.serverSync = function (serverBody) {
            // Update direction
            var newDirection = serverBody.Direction;

            if (self.direction.X !== serverBody.Direction.X || self.direction.Y !== serverBody.Direction.Y) {
                self.updateDirection(serverBody.Direction);
            }

            //Position
            self.gameRect.center = serverBody.Shape.Position;
        }

        this.update = function () { };
    }
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
    }
});

var PlayerBody = CharacterBody.extend({
    init: function (serverBody) {
        var self = this;

        this._super(serverBody);

        this.serverSync = function (serverBody) {
            // Update direction
            var newDirection = serverBody.Direction;

            if (self.direction.X !== serverBody.Direction.X || self.direction.Y !== serverBody.Direction.Y) {
                self.updateDirection(serverBody.Direction);
            }

            // Update weapon
            if (serverBody.CurrentWeapons != 'undefined' && self.currentWeapon !== serverBody.CurrentWeapons) {
                self.currentWeapon = serverBody.CurrentWeapons;
            }

            // Update life
            if (self.life !== serverBody.Life) {
                self.updateLife(serverBody.Life);
            }

            // Update score
            if (serverBody.Score) {
                self.score = serverBody.Score;
            }
        }
    }
});

var BulletBody = BaseBody.extend({
    init: function (serverBody) {
        var self = this;

        this._super(serverBody);
        this.lastUpdateTime = new Date().getTime();
        this.unitDirection = self.direction.calculateUnitVector();

        this.serverSync = function (serverBody) { }

        this.update = function () {
            var currentTime = new Date().getTime();
            var duration = currentTime - self.lastUpdateTime;
            self.lastUpdateTime = currentTime;

            body.gameRect.center = {
                X: self.gameRect.centerx + self.speed * duration * self.unitDirection.x / 1000,
                Y: self.gameRect.centery + self.speed * duration * self.unitDirection.y / 1000
            };


            console.log('bullet x = ' + self.gameRect.centerx);
            
        }
    }
});
