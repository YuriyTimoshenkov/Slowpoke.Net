/**
 * Created by dimapct on 15.02.2015.
 */


function GameObject(id, objectType, position, direction, shapeRadius, canvasXY) {
    var self = this;

    this.id = id;
    this.objectType = objectType;
    this.objectSize = 20;
    this.gameRect = new Rect(0, 0, this.objectSize, this.objectSize);
    this.gameRect.center = position;
    this.direction = direction || {X: 0, Y: 0};
    this.image = null;
    this.assignImage(canvasXY, shapeRadius);

    // Special for player character
    if (canvasXY) {
        this.image.x = canvasXY.x;
        this.image.y = canvasXY.y;
    }
}

GameObject.prototype = {
    assignImage: function (shapeRadius, canvasXY) {

        switch (this.objectType) {
            case "PlayerBody":
                var teamColor = "orange";
                this.image = this.createHat(shapeRadius, teamColor);
                break
            case "NPC":
                var teamColor = "blue";
                this.image = this.createHat(shapeRadius, teamColor);
                break
            case "Bullet":
                var color = "yellow";
                this.createBullet(shapeRadius, color);
                break
            default:
                throw "gameObject: invalid gameObject type";
        };
    },

    draw: function(context) {
        console.log("GameObject Draw: " + this.objectType);
        
    },

    createHat: function (hatRadius, teamColor) {
        // SHAPE XY DIFFERS FROM CONTAINER XY ?? 
        var image = new createjs.Container();

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

        image.addChild(circleBig, circleSmall, lineLeft, lineRight);

        return image;
    },

    createBullet: function (bulletRadius, color) {
        // SHAPE XY DIFFERS FROM CONTAINER XY ?? 

        var image = new createjs.Shape();

        image.graphics.setStrokeStyle(1).
            beginStroke(lineColor).
            beginFill(color).
            drawCircle(0, 0, bulletRadius)
        
        return image;
    }
};


