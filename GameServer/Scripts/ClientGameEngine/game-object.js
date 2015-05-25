function GameObject(name, id, objectType, position, direction, shapeRadius, life, maxLife, currentWeapon, speed) {
    var self = this;

    this.name = name;
    this.id = id;
    this.objectType = objectType;
    this.gameRect = new Rect(0, 0, shapeRadius * 2, shapeRadius * 2);
    this.gameRect.center = position;
    this.direction = direction || { X: 0, Y: 0 };
    this.image = new createjs.Container();
    this.image.zIndex = 1;
    this.objectMenu = new createjs.Container();
    this.life = life || 0;
    this.maxLife = maxLife || 0;
    this.score = 0;
    this.speed = speed;
    this.weaponImage = null;
    this.currentWeapon = currentWeapon;

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

        //if (this.objectType != "Bullet") {
        //    this.updateWeapon();
        //}

    }

    this.updateObject = function (objData, playerBody) {
        var obj = self;

        if (playerBody.id !== obj.id)
            obj.gameRect.center = objData["Shape"]["Position"];

        if (obj.objectType === "NPCAI" || obj.objectType === "PlayerBody" || obj.objectType === "Bullet") {
            // Update direction
            var newDirection = objData["Direction"];

            if (obj.direction.X !== newDirection.X || obj.direction.Y !== newDirection.Y) {
                obj.updateDirection(newDirection);
            }


            // Update weapon
            var currentWeapon = objData["CurrentWeapon"];
            if (currentWeapon != 'undefined' && obj.currentWeapon !== currentWeapon) {
                obj.currentWeapon = currentWeapon;
            }

            // Update life
            var newLife = objData["Life"];
            if (obj.life !== newLife) {
                obj.updateLife(newLife);
            }

            // Update score
            var newScore = objData["Score"];
            if (newScore) {
                obj.score = newScore;
            }
        }
    }
}