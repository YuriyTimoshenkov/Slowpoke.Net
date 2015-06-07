
class Vector{
    x: number;
    y: number;

    constructor(x:number, y:number){
        this.x = x;
        this.y = y;
    }

    calculateUnitVector(): Vector{
        var magnitude = Math.sqrt((this.x * this.x) + (this.y * this.y));

        return new Vector(this.x / magnitude, this.y / magnitude);
    }

    product(vector: Vector): number {
        return this.x * vector.x + this.y * vector.y;
    }

    length() :number{
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
} 

class Point {
    x: number;
    y: number;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Rect{
    private x: number;
    private y: number;
    private width: number;
    private height: number;

    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
    }

    get centerx(): number { return this.x + this.width / 2; }
    set centerx(value) { this.x = value - this.width / 2; }

    get centery(): number { return this.y + this.height / 2; }
    set centery(value) { this.y = value - this.height / 2; }

    get center(): Point { return new Point(this.centerx, this.centery); }
    set center(value: Point) {
        this.centerx = value.x;
        this.centery = value.y;
    }
}