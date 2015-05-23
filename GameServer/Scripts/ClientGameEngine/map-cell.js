function MapCell(point, size) {
    this.position = point;
    this.width = size;
    this.height = size;
    this.gameRect = new Rect(this.position.X, this.position.Y, this.width, this.height)
    this.image = null;

    this.assignImage = function (image) { this.image = image }
}