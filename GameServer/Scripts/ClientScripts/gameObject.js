/**
 * Created by dimapct on 15.02.2015.
 */


function GameObject(id, objectType, position, direction, canvasXY) {
    this.id = id;
    this.objectType = objectType;
    this.objectSize = 20;
    this.gameRect = new Rect(0, 0, this.objectSize, this.objectSize);
    this.gameRect.center = position;


    var self = this;
    this.canvasRect = (function() {
        if (canvasXY) return new Rect(canvasXY.x, canvasXY.y, self.objectSize, self.objectSize)
        else return new Rect(0, 0, self.objectSize, self.objectSize)
    })();

    this.direction = direction || {X: 0, Y: 0};
}

GameObject.prototype = {
    draw: function(context) {
        console.log("GameObject Draw: " + this.objectType);
        if (this.objectType == "PlayerBody") {
            context.fillStyle = "red";
            context.fillRect(this.canvasRect.x, this.canvasRect.y, 20, 20);

            console.log("Player Direction:")
            console.log(this.direction)

            // Draw weapon
            var newX = this.canvasRect.center.x + this.direction.X * 5;
            var newY = this.canvasRect.center.y + this.direction.Y * 5;
            context.beginPath();
            context.moveTo(this.canvasRect.center.x, this.canvasRect.center.y);
            context.lineTo(newX, newY);
            context.lineWidth = 3;
            context.stroke();

            // Transformation
            //context.translate(this.canvasRect.center.x, this.canvasRect.center.y);
            //context.rotate(30 * Math.PI / 180);

        }

        else if (this.objectType == "NPC") {
            context.fillStyle = "black";
            context.fillRect(this.canvasRect.x, this.canvasRect.y, 20, 20);
        }

        else if (this.objectType == "Bullet") {
            context.beginPath();
            context.arc(this.canvasRect.x, this.canvasRect.y, 5, 0, 2 * Math.PI, false);
            context.fillStyle = 'yellow';
            context.fill();
            context.lineWidth = 1;
            context.strokeStyle = '#003300';
            context.stroke();
        }

        else throw "GameObject: invalid gameObject type";
    }
};


