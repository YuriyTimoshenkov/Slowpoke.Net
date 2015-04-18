/**
 * Created by dimapct on 15.02.2015.
 */


function GameObject(name, id, objectType, position, direction, shapeRadius, life, maxLife, currentWeapon, canvasXY) {
    var self = this;

    this.name = name;
    this.id = id;
    this.objectType = objectType;
    this.gameRect = new Rect(0, 0, shapeRadius * 2, shapeRadius * 2);
    this.gameRect.center = position;
    this.direction = direction || {X: 0, Y: 0};
    this.image = new createjs.Container();
    this.life = life || 0;
    this.maxLife = maxLife || 0;
    
    this.weaponImage = null;
    this.currentWeapon = currentWeapon;
    //tassignImage();

    // Special for player character
    if (canvasXY) {
        this.image.x = canvasXY.x;
        this.image.y = canvasXY.y;
    }

    this.assignImage = function (canvasXY, shapeRadius) {
        switch (self.objectType) {
            case "PlayerBody":
                var teamColor = "orange";
                self.addWeaponImage();
                self.createHat(shapeRadius, teamColor);
                self.addNameText();
                break
            case "NPC":
                var teamColor = "blue";
                self.addWeaponImage();
                self.createHat(shapeRadius, teamColor);
                self.addLifeText();
                break
            case "NPCAI":
                var teamColor = "blue";
                self.addWeaponImage();
                self.createHat(shapeRadius, teamColor);
                self.addLifeText();
                break
            case "Bullet":
                var color = "yellow";
                self.image = this.createBullet(shapeRadius, color);
                break
            case "BulletDynamite":
                var color = "brown";
                self.image = this.createBullet(shapeRadius, color);
                break
            case "LifeContainer":
                var color = "red";
                self.image = this.createLifeContainer(shapeRadius, color);
                break
            default:
                throw "gameObject: invalid gameObject type";
        };
    }

    this.createHat = function (hatRadius, teamColor) {
        // SHAPE XY DIFFERS FROM CONTAINER XY ?? 
        var lineColor = "black";
        var circleBigColor;
        var circleSmallColor;

        switch (teamColor) {
            case "orange":
                circleBigColor = createjs.Graphics.getRGB(255, 127, 39, 1.0);
                circleSmallColor = createjs.Graphics.getRGB(232, 90, 0, 1.0);
                break
            case "blue":
                circleBigColor = createjs.Graphics.getRGB(0, 162, 232, 1.0);
                circleSmallColor = createjs.Graphics.getRGB(63, 72, 204, 1.0);
                break
            default:
                throw "gameObject: invalid team color"
        }


        var circleBigRadius = hatRadius;
        var circleSmallRadius = circleBigRadius / 2.3;

        var circleBig = new createjs.Shape();
        var circleSmall = new createjs.Shape();
        var lineLeft = new createjs.Shape();
        var lineRight = new createjs.Shape();

        circleBig.graphics.setStrokeStyle(1).
            beginStroke(lineColor).
            beginFill(circleBigColor).
            drawCircle(0, 0, circleBigRadius)

        circleSmall.graphics.setStrokeStyle(1).
            beginStroke(lineColor).
            beginFill(circleSmallColor).
            drawCircle(0, 0, circleSmallRadius);
        circleSmall.x = -circleBigRadius * 0.15;
        circleSmall.y = -circleBigRadius * 0.25;
        circleSmall.scaleY = 0.8;

        // Draw first line
        lineLeft.graphics.setStrokeStyle(1).beginStroke(lineColor).
        moveTo(circleSmall.x - circleSmallRadius, circleSmall.y).
        lineTo(circleSmall.x - circleSmallRadius * 0.75, circleSmall.y + circleSmallRadius);

        // Draw second line
        lineRight.graphics.setStrokeStyle(1).beginStroke(lineColor).
        moveTo(circleSmall.x + circleSmallRadius, circleSmall.y).
        lineTo(circleSmall.x + circleSmallRadius * 1.25, circleSmall.y + circleSmallRadius);

        self.image.addChild(circleBig, circleSmall, lineLeft, lineRight);
    }

    this.createBullet = function (bulletRadius, color) {
        // SHAPE XY DIFFERS FROM CONTAINER XY ?? 
        var image = new createjs.Shape();

        image.graphics.setStrokeStyle(1).
            beginStroke("black").
            beginFill(color).
            drawCircle(0, 0, bulletRadius)
        
        return image;
    }

    this.createLifeContainer = function (bulletRadius, color) {
        // SHAPE XY DIFFERS FROM CONTAINER XY ?? 
        var image = new createjs.Shape();

        image.graphics.setStrokeStyle(1).
            beginStroke("black").
            beginFill(color).
            drawCircle(0, 0, bulletRadius)

        return image;
    }

    this.createNameText = function () {
        var textSize = 10;
        return new createjs.Text(self.name, textSize + "px Arial", "purple");
    }

    this.addNameText = function () {
        self.nameText = self.createNameText();
        self.nameText.x = -self.gameRect.width / 1.5;
        self.nameText.y = -self.gameRect.height / 1.5;
        self.image.addChild(self.nameText);
    }

    this.removeNameText = function () {
        self.image.removeChild(self.nameText);
    }

    this.createLifeText = function () {
        var textSize = 10;
        return new createjs.Text(self.life, textSize + "px Arial", "purple");
    }

    this.addLifeText = function () {
        self.lifeText = self.createLifeText();
        self.lifeText.x = -self.gameRect.width / 1.5;
        self.lifeText.y = -self.gameRect.height / 1.5;
        self.image.addChild(self.lifeText);
    }

    this.removeLifeText =  function () {
        self.image.removeChild(self.lifeText);
    }

    this.updateLife = function (life) {
        self.life = life;

        if (self.lifeText)
            self.updateLifeText();
    }

    this.updateLifeText = function () {
        self.removeLifeText();
        self.addLifeText();
    }

    this.addWeaponImage = function () {
        self.weaponImage = self.createWeaponImage();
        self.image.addChildAt(self.weaponImage, 0);
    }

    this.createWeaponImage = function () {
        var weapon = new createjs.Shape();
        var weaponLength = 30;

        //var center = new Point(this.image.x, this.image.y);
        var center = new Point(0, 0);
        var weaponPoint = new Point(center.x + self.direction.X * weaponLength, center.y + self.direction.Y * weaponLength);

        weapon.graphics.setStrokeStyle(4, "round").beginStroke("black").
        moveTo(center.x, center.y).
        lineTo(weaponPoint.x, weaponPoint.y);
        return weapon
    }

    this.removeWeaponImage = function() {
        self.image.removeChild(self.weaponImage);
    }

    this.updateWeapon = function () {
        self.removeWeaponImage();
        self.addWeaponImage();
    }

    this.assignImage(canvasXY, shapeRadius)
}



