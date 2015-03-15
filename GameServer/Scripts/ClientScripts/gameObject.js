/**
 * Created by dimapct on 15.02.2015.
 */


function GameObject(id, objectType, position, direction, canvasXY) {
    this.id = id;
    this.objectType = objectType;
    this.xy = position || {X: 0, Y: 0};
    this.canvasXY = canvasXY || this.xy;
    this.direction = direction || {X: 0, Y: 0};
}

GameObject.prototype = {
    draw: function(context) {
        console.log("GameObject Draw: " + this.objectType);
        if (this.objectType == "player"){
            context.fillStyle = "red";
            context.fillRect(this.canvasXY.X, this.canvasXY.Y, 20, 20);

        }

        else if (this.objectType == "NPC") {
            context.fillStyle = "black";
            context.fillRect(this.canvasXY.X, this.canvasXY.Y, 20, 20);
        }

        else if (this.objectType == "bullet") {
            context.beginPath();
            context.arc(this.canvasXY.X, this.canvasXY.Y, 5, 0, 2 * Math.PI, false);
            context.fillStyle = 'yellow';
            context.fill();
            context.lineWidth = 1;
            context.strokeStyle = '#003300';
            context.stroke();
        }



        else throw "GameObject: invalid gameObject type";
    }
};


