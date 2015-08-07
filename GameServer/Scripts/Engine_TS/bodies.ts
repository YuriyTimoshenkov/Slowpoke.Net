interface ServerBody {
    Id: number;
    BodyType: string;
    LastProcessedCommandId: number;
    CreatedByCommandId: number;
    Shape: { Radius: number; Position: { X: number; Y: number } };  
    Name: string;
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

interface ServerBulletBody extends ServerActiveBody {
    BulletTypeName: string;
}

class Body {
    id: number;
    name: string;
    gameRect: Rect;
    zIndex: number;
    bodyType: string;
    syncSessionId: number;
    direction: Vector;
    createdByCommandId: number;


    constructor(serverBody: ServerBody) {
        this.id = serverBody.Id;
        this.name = serverBody.Name;
        this.bodyType = serverBody.BodyType;

        this.gameRect = new Rect(0, 0, serverBody.Shape.Radius * 2, serverBody.Shape.Radius * 2);
        this.gameRect.center = new Point(serverBody.Shape.Position.X, serverBody.Shape.Position.Y);
    }

    update(mechanicEngine: MechanicEngineTS) { }

    serverSync(serverBody, mechanicEngine: MechanicEngineTS) { }
}

class PassiveBody extends Body {
    constructor(serverBody: ServerBody){
        super(serverBody);
    }
}

class ActiveBody extends Body{
    speed: number;
    baseRotationVector: Vector;


    constructor(serverBody: ServerActiveBody) {
        this.id = serverBody.Id;
        this.name = serverBody.Name;
        this.bodyType = serverBody.BodyType;

        this.direction = new Vector(serverBody.Direction.X, serverBody.Direction.Y)
        || new Vector(0, -1);
        this.zIndex = 1;
        this.speed = serverBody.Speed;
        this.baseRotationVector = new Vector(0, -1);

        super(serverBody);
    }
    serverSync(serverBody: ServerActiveBody, mechanicEngine: MechanicEngineTS) {
        // Update direction
        if (Math.abs(this.direction.x - serverBody.Direction.X) > 0.0001 || Math.abs(this.direction.y - serverBody.Direction.Y) > 0.0001) {
            this.direction = new Vector(serverBody.Direction.X, serverBody.Direction.Y);
        }

        //Position
        this.gameRect.center = new Point(serverBody.Shape.Position.X, serverBody.Shape.Position.Y);
    }
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

    serverSync(serverBody, mechanicEngine: MechanicEngineTS) {
        super.serverSync(serverBody, mechanicEngine);
        if (serverBody.Life !== this.life) {
            // to avoid body hit when drinking a bottle
            //if (serverBody.Life < this.life) { 
                mechanicEngine.onBodyChanged.trigger({ body: this, changesType: BodyChangesType.hp });
            //}
            this.life = serverBody.Life;
        }

    }
}

class PlayerOtherBody extends CharacterBody {
    constructor(serverBody: ServerCharacterBody) {
        super(serverBody);
    }
}

class PlayerBody extends CharacterBody {

    serverSync(serverBody, mechanicEngine: MechanicEngineTS) {
        //TODO: implement true polumorphic body processing

        //super.serverSync(serverBody);
        if (serverBody.Life !== this.life) {
            // to avoid body hit when drinking a bottle
            //if (serverBody.Life < this.life) { 
            mechanicEngine.onBodyChanged.trigger({ body: this, changesType: BodyChangesType.hp });
            //}
            this.life = serverBody.Life;
        }

        // Update weapon
        if (serverBody.CurrentWeapon && this.currentWeapon !== serverBody.CurrentWeapon) {
            this.currentWeapon = serverBody.CurrentWeapon;
            mechanicEngine.onBodyChanged.trigger({ body: this, changesType: BodyChangesType.currentWeapon });
        }

        // Update score
        if (serverBody.Score && serverBody.Score !== this.score) {
            this.score = serverBody.Score;
            mechanicEngine.onBodyChanged.trigger({ body: this, changesType: BodyChangesType.score });
        }
    }
}

class Bullet extends ActiveBody {
    lastUpdateTime: number;
    startTime: number;
    unitDirection: Vector;
    flyDuration: number = 1500;
    bulletTypeName: string;

    constructor(serverBody: ServerBulletBody) {
        super(serverBody);

        this.lastUpdateTime = new Date().getTime();
        this.startTime = this.lastUpdateTime;
        this.unitDirection = new Vector(this.direction.x, this.direction.y).calculateUnitVector();
        this.bulletTypeName = serverBody.BulletTypeName;
    }

    update(mechanicEngine: MechanicEngineTS) {
        var currentTime = new Date().getTime();
        var duration = currentTime - this.lastUpdateTime;
        var durationFromStart = currentTime - this.startTime;
        this.lastUpdateTime = currentTime;

        if (durationFromStart > this.flyDuration) {
            mechanicEngine.removeActiveBody(this.id);
        }
        else {
            var moveCommand = new CommandMove(this.id, new Date().getTime(), duration, this.unitDirection);
            moveCommand.syncedWithServer = true;

            mechanicEngine.addCommand(moveCommand);
        }
    }
}