function MapCell(xy, size, color) {
    this.X = xy[0];
    this.Y = xy[1];
    this.size = size;
    this.gameRect = new Rect(xy[0], xy[1], size, size)
    this.image = null;

    this.width = size;
    this.height = size;
    this.color = color;

    this.assignImage = function () {
        var image = new createjs.Shape();
        image.graphics.beginFill(this.color).drawRect(0, 0, this.size, this.size);
        this.image = image;
    }

    this.draw = function (context) {
        context.clearRect(this.canvasX, this.canvasY, this.width, this.height);
        context.fillStyle = this.color
        context.fillRect(this.canvasX, this.canvasY, this.width, this.height);
    }

    this.assignImage();
}