function MapCell(Id, point, size) {
    this.Id = Id;
    this.Position = point;
    this.width = size;
    this.height = size;
    this.gameRect = new Rect(this.Position.X, this.Position.Y, this.width, this.height)
    this.image = null;

    this.assignImage = function (image) {
        this.image = image;
        this.image.zIndex = 0;
    }
}