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
    this.lifeText = null;
    this.weaponImage = null;
    this.currentWeapon = currentWeapon;
    this.assignImage(canvasXY, shapeRadius);
    // Special for player character
    if (canvasXY) {
        this.image.x = canvasXY.x;
        this.image.y = canvasXY.y;
    }
    
}

GameObject.prototype = {
    assignImage: function (canvasXY, shapeRadius) {
        switch (this.objectType) {
            case "PlayerBody":
                var teamColor = "orange";
                this.addWeaponImage();
                this.createHat(shapeRadius, teamColor);
                this.addNameText();
                break
            case "NPC":
                var teamColor = "blue";
                this.addWeaponImage();
                this.createHat(shapeRadius, teamColor);
                this.addLifeText();
                break
            case "NPCAI":
                var teamColor = "blue";
                this.addWeaponImage();
                this.createHat(shapeRadius, teamColor);
                this.addLifeText();
                break
            case "Bullet":
                var color = "yellow";
                this.image = this.createBullet(shapeRadius, color);
                break
            default:
                throw "gameObject: invalid gameObject type";
        };
    },


    createHat: function (hatRadius, teamColor) {
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

        this.image.addChild(circleBig, circleSmall, lineLeft, lineRight);
    },

    createBullet: function (bulletRadius, color) {
        // SHAPE XY DIFFERS FROM CONTAINER XY ?? 
        var image = new createjs.Shape();

        image.graphics.setStrokeStyle(1).
            beginStroke("black").
            beginFill(color).
            drawCircle(0, 0, bulletRadius)
        
        return image;
    },

    createNameText: function () {
        var textSize = 10;
        return new createjs.Text(this.name, textSize + "px Arial", "purple");
    },

    addNameText: function () {
        this.nameText = this.createNameText();
        this.nameText.x = -this.gameRect.width / 1.5;
        this.nameText.y = -this.gameRect.height / 1.5;
        this.image.addChild(this.nameText);
    },
    removeNameText: function () {
        this.image.removeChild(this.nameText);
    },

    createLifeText: function () {
        var textSize = 10;
        return new createjs.Text(this.life, textSize + "px Arial", "purple");
    },
    addLifeText: function () {
        this.lifeText = this.createLifeText();
        this.lifeText.x = - this.gameRect.width / 1.5;
        this.lifeText.y = - this.gameRect.height / 1.5;
        this.image.addChild(this.lifeText);
    },
    removeLifeText: function () {
        this.image.removeChild(this.lifeText);
    },

    updateLife: function (life) {
        this.life = life;
        this.updateLifeText();
    },

    updateLifeText: function () {
        this.removeLifeText();
        this.addLifeText();
    },

    addWeaponImage: function () {
        this.weaponImage = this.createWeaponImage();
        this.image.addChildAt(this.weaponImage, 0);
    },

    createWeaponImage: function () {
        var weapon = new createjs.Shape();
        var weaponLength = 30;

        //var center = new Point(this.image.x, this.image.y);
        var center = new Point(0, 0);
        var weaponPoint = new Point(center.x + this.direction.X * weaponLength, center.y + this.direction.Y * weaponLength);

        weapon.graphics.setStrokeStyle(4, "round").beginStroke("black").
        moveTo(center.x, center.y).
        lineTo(weaponPoint.x, weaponPoint.y);
        return weapon
    },

    removeWeaponImage: function() {
        this.image.removeChild(this.weaponImage);
    },

    updateWeapon: function () {
        this.removeWeaponImage();
        this.addWeaponImage();
    }
};


