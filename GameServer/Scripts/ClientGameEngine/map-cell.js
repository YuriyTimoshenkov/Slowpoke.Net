function MapCell(xy, size, color) {
    this.X = xy[0];
    this.Y = xy[1];
    this.size = size;
    this.gameRect = new Rect(xy[0], xy[1], size, size)
    this.image = new createjs.Container();

    this.width = size;
    this.height = size;
    this.color = color;

    this.assignImage = function () {
        var image = new createjs.Shape();
        if (this.color == "#5EAB00") {
        }
        image.graphics.beginFill(this.color).drawRect(0, 0, this.size, this.size);
        this.image.addChild(image);
    }

    this.assignImage();
}