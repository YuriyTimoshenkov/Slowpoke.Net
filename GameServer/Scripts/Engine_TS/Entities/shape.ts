class Shape {
    X: number;        // x  -  it is always the top left X coordinate
    Y: number;        // y  -  it is always the top left Y coordinate
    MaxDimension: number;
    Width: number;
    Height: number;

    get Position() { return null; }
    set Position(newPosition: Point) { }  // Position is always the visual center of an object
}

class ShapeCircle extends Shape {
    Radius: number;
    get MaxDimension() { return this.Radius }
    get Position(): Point {
        return new Point(this.X + this.Radius, this.Y + this.Radius)
    }
    set Position(newPosition: Point) {
        //console.log("Setting position circle")
        this.X = newPosition.X - this.Radius;
        this.Y = newPosition.Y - this.Radius;
    }
}

class ShapeRectangle extends Shape {


    get MaxDimension() { return this.Width > this.Height ? this.Width : this.Height }
    get Position(): Point {
        return new Point(this.X + this.Width / 2, this.Y + this.Height / 2)
    }
    set Position(newPosition: Point) {
        //console.log("Setting position rect")
        this.X = newPosition.X - this.Width / 2;
        this.Y = newPosition.Y - this.Height / 2;
    }
}