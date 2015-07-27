
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
    width: number;
    height: number;

    constructor(x: number, y: number, w: number, h: number) {
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

enum BodyChangesType { direction, position, hp, score, currentWeapon }

class ObjectsContainersSynchronizerTS<T extends Body, F extends ServerBody> {

    syncObjectsContainersTS(
        oldContainer: T[],
        newContainer: F[],
        createHandler: { (body: F): T },
        updateHandler: { (body: T): void },
        removehandler: { (body: T): void }) {

        //Create new container with new + updated elements
        var result = newContainer.map(function (newElement) {

            var objectsFromOldContainer = oldContainer.filter(function (oldElement) { return newElement.Id == oldElement.id })

            if (objectsFromOldContainer.length > 0) {
                updateHandler(objectsFromOldContainer[0]);

                return objectsFromOldContainer[0];
            }
            else {
                return createHandler(newElement)
            }
        });

        // Generate remove events
        oldContainer.forEach(function (item) {
            var existingItem = result.filter(function (v) { return v.id === item.id });

            if (existingItem.length === 0) {
                removehandler(item);
            }
        });

        return result;
    }
}

interface ServerFrame {
    Map: ServerTile[];
}

enum BodyProcessingTypes {
    ServerSide = 1,
    ClientSide = 2,
    ClientSidePrediction = 3
}