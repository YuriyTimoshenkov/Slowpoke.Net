﻿interface ServerBody {
    Id: number;
    BodyType: string;
    LastProcessedCommandId: number;
    CreatedByCommandId: number;
    Shape: { Radius: number; Position: { X: number; Y: number } }
}

interface ServerActiveBody extends ServerBody {
    Name: string;
    Direction: { X: number; Y: number }
    Speed: number;
}

interface ServerCharacterBody extends ServerActiveBody {
    Life: number;
    MaxLife: number;
    CurrentWeapon: string;
}

class Body {
    id: number;
    name: string;
    gameRect: Rect;
    zIndex: number;
    bodyType: string;
    syncSessionId: number;

    constructor(id: number, name: string, bodyType: string) {
        this.id = id;
        this.name = name;
        this.bodyType = bodyType;
    }
}

class PassiveBody extends Body {
    constructor(serverBody: ServerBody){
        super(serverBody.Id, serverBody.Id.toString(), serverBody.BodyType);

        this.gameRect = new Rect(0, 0, serverBody.Shape.Radius * 2, serverBody.Shape.Radius * 2);
    }
}

class ActiveBody extends Body{
    direction: Vector;
    speed: number;
    baseRotationVector: Vector;
    createdByCommandId: number;

    constructor(serverBody: ServerActiveBody) {
        this.id = serverBody.Id;
        this.name = serverBody.Name;
        this.bodyType = serverBody.BodyType;
        this.gameRect = new Rect(0, 0, serverBody.Shape.Radius * 2, serverBody.Shape.Radius * 2);
        this.gameRect.center = new Point(serverBody.Shape.Position.X, serverBody.Shape.Position.Y);
        this.direction = new Vector(serverBody.Direction.X, serverBody.Direction.Y)
        || new Vector(0, -1);
        this.zIndex = 1;
        this.speed = serverBody.Speed;
        this.baseRotationVector = new Vector(0, -1);

        super(this.id, this.name, serverBody.BodyType);
    }
    serverSync(serverBody) {
        // Update direction
        if (Math.abs(this.direction.x - serverBody.Direction.X) > 0.0001 || Math.abs(this.direction.y - serverBody.Direction.Y) > 0.0001) {
            this.direction = new Vector(serverBody.Direction.X, serverBody.Direction.Y);
        }

        //Position
        this.gameRect.center = serverBody.Shape.Position;
    }
    update() { }
} 

class CharacterBody extends ActiveBody{
    currentWeapon: string;
    life: number;
    maxLife: number;
    score: number;

    constructor(serverBody: ServerCharacterBody) {
        super(serverBody);

        this.life = serverBody.Life || 0;
        this.maxLife = serverBody.MaxLife || 0;
        this.score = 0;
        this.currentWeapon = serverBody.CurrentWeapon;
    }

    serverSync (serverBody) {
        super.serverSync(serverBody);

        this.life = serverBody.Life;
    }
}


class PlayerBody extends CharacterBody {

    serverSync(serverBody) {
        super.serverSync(serverBody);

        // Update weapon
        if (serverBody.CurrentWeapon != 'undefined' && this.currentWeapon !== serverBody.CurrentWeapon) {
            this.currentWeapon = serverBody.CurrentWeapon;
        }

        // Update score
        if (serverBody.Score) {
            this.score = serverBody.Score;
        }
    }
}

class Bullet extends ActiveBody {
    lastUpdateTime: number;
    unitDirection: Vector;

    constructor(serverBody: ServerActiveBody) {
        super(serverBody);

        this.lastUpdateTime = new Date().getTime();
        this.unitDirection = new Vector(this.direction.x, this.direction.y).calculateUnitVector();
    }

    update() {
        var currentTime = new Date().getTime();
        var duration = currentTime - this.lastUpdateTime;
        this.lastUpdateTime = currentTime;

        this.gameRect.center = new Point(
            this.gameRect.centerx + this.speed * duration * this.unitDirection.x / 1000,
            this.gameRect.centery + this.speed * duration * this.unitDirection.y / 1000
        );
    }
}