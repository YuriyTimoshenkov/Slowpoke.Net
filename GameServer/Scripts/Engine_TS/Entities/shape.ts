class Shape {
    MaxDimension: number;
    Position: Point;
    get X() { return null; }  // x  -  it is always the top left X coordinate
    get Y() { return null; }  // y  -  it is always the top left Y coordinate
}

class ShapeCircle extends Shape {
    Radius: number;
    get MaxDimension() { return this.Radius }
    get X() { return this.Position.X - this.Radius }
    get Y() { return this.Position.Y - this.Radius }
}

class ShapeRectangle extends Shape {
    Width: number;
    Height: number;
    get MaxDimension() { return this.Width > this.Height ? this.Width / 2: this.Height / 2 }
    get X() { return this.Position.X - this.Width / 2 }
    get Y() { return this.Position.Y - this.Height / 2}
}