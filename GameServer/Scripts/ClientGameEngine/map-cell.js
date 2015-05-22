function MapCell(xy, size) {
    this.X = xy[0];
    this.Y = xy[1];
    this.width = size;
    this.height = size;
    this.gameRect = new Rect(this.X, this.Y, this.width, this.height)
    this.image = null;

    this.assignImage = function (image) { this.image = image }
}