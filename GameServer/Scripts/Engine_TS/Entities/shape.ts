class Shape implements IShape {
    x: number;        // x  -  it is always the top left X coordinate
    y: number;        // y  -  it is always the top left Y coordinate
    width: number;
    height: number;
    maxDimension: number;
    set position(newPosition: Point) { }  // Position is always the visual center of an object
    constructor(position: Point) {
        this.position = position;
    }
}

class ShapeCircle extends Shape {
    radius: number;
    get maxDimension() { return this.radius }
    get position(): Point {
        return new Point(this.x + this.radius, this.y + this.radius)
    }
    set position(newPosition: Point) {
        //console.log("Setting position circle")
        this.x = newPosition.x - this.radius;
        this.y = newPosition.y - this.radius;
    }
    constructor(radius: number, point: Point) {
        this.radius = radius;
        super(point);
    }
}

class ShapeRectangle extends Shape {
    constructor(width: number, height: number, position: Point) {
        this.width = width;
        this.height = height;
        super(position);
    }
    get maxDimension() { return this.width > this.height ? this.width : this.height }
    get position(): Point {
        return new Point(this.x + this.width / 2, this.y + this.height / 2)
    }
    set position(newPosition: Point) {
        //console.log("Setting position rect")
        this.x = newPosition.x - this.width / 2;
        this.y = newPosition.y - this.height / 2;
    }
}