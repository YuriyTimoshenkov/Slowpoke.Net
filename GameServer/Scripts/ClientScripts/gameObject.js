/**
 * Created by dimapct on 15.02.2015.
 */


function GameObject(id, objectType, position, direction, canvasXY) {
    this.id = id;
    this.objectType = objectType;
    //this.xy = position || { X: 0, Y: 0 };
    this.gameRect = new Rect(0, 0, 20, 20);
    this.gameRect.center = position;
    this.canvasXY = canvasXY || { x: this.gameRect.x, y: this.gameRect.y };
    this.direction = direction || {X: 0, Y: 0};
}

GameObject.prototype = {
    draw: function(context) {
        console.log("GameObject Draw: " + this.objectType);
        if (this.objectType == "PlayerBody") {
            context.fillStyle = "red";
            context.fillRect(this.canvasXY.x, this.canvasXY.y, 20, 20);

        }

        else if (this.objectType == "NPC") {
            context.fillStyle = "black";
            context.fillRect(this.canvasXY.x, this.canvasXY.y, 20, 20);
        }

        else if (this.objectType == "Bullet") {
            context.beginPath();
            context.arc(this.canvasXY.x, this.canvasXY.y, 5, 0, 2 * Math.PI, false);
            context.fillStyle = 'yellow';
            context.fill();
            context.lineWidth = 1;
            context.strokeStyle = '#003300';
            context.stroke();
        }

        else throw "GameObject: invalid gameObject type";
    }
};


