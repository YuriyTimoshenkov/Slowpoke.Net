interface IShape {
    position: Point;  // Position is always the visual center of an object
    x: number;        // x  -  it is always the top left X coordinate of an image
    y: number;        // y  -  it is always the top left Y coordinate of an image
    width: number;
    height: number;
    maxDimension: number;
}