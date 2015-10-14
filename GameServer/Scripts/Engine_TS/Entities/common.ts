interface ServerShape {
    Position: ServerPoint;
    MaxDimension: number;
}

interface ServerShapeCircle extends ServerShape {
    Radius: number;
}

interface ServerShapeRectangle extends ServerShape {
    Width: number;
    Height: number;
}

interface ServerPoint {
    X: number;
    Y: number;
}

class BodyFacade {
    Name: string;
}


class Vector{
    X: number;
    Y: number;

    constructor(x:number, y:number){
        this.X = x;
        this.Y = y;
    }

    calculateUnitVector(): Vector{
        var magnitude = Math.sqrt((this.X * this.X) + (this.Y * this.Y));

        return new Vector(this.X / magnitude, this.Y / magnitude);
    }

    product(vector: Vector): number {
        return this.X * vector.X + this.Y * vector.Y;
    }

    length() :number{
        return Math.sqrt(Math.pow(this.X, 2) + Math.pow(this.Y, 2));
    }
} 

class Point {
    X: number;
    Y: number;

    constructor(x: number, y: number) {
        this.X = x;
        this.Y = y;
    }
}

enum BodyChangesType { Direction, Position, hp, score, currentWeapon }

class ObjectsContainersSynchronizerTS<T extends Body, F extends ServerBody> {

    syncObjectsContainersTS(
        oldContainer: T[],
        newContainer: F[],
        createHandler: { (body: F): T },
        updateHandler: { (body: T): void },
        removehandler: { (body: T): void }) {

        //Create new container with new + updated elements
        var result = newContainer.map(function (newElement) {

            var objectsFromOldContainer = oldContainer.filter(function (oldElement) { return newElement.Id == oldElement.Id })

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
            var existingItem = result.filter(function (v) { return v.Id === item.Id });

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

function getRandomInt(fromToRange: number[]): number {
    return Math.floor((Math.random() * (fromToRange[1] - fromToRange[0])) + fromToRange[0] + 1);
}
function now(): number {
    return new Date().getTime();
}

class SerializationHelper {
    static deserialize(json, environment) {

        if (json === null) {
            return null;
        }

        if (json.$type === undefined) {
            return json;
        }

        var typeName = json.$type.match(/.+\.(\w+),.+/i)[1];
        var instance = new environment[typeName]();
        for (var prop in json) {
            if (!json.hasOwnProperty(prop)) {
                continue;
            }

            if (typeof json[prop] === 'object') {
                instance[prop] = this.deserialize(json[prop], environment);
            } else {
                instance[prop] = json[prop];
            }
        }

        return instance;
    }
}