class ServerBody {
    Id: number;
    BodyType: string;
    LastProcessedCommandId: number;
    CreatedByCommandId: number;
    Shape: ServerShape;  
    Name: string;
}

class ServerActiveBody extends ServerBody {
    Name: string;
    Direction: { X: number; Y: number }
    Speed: number;
}

class ServerCharacterBody extends ServerActiveBody {
    Life: number;
    MaxLife: number;
    CurrentWeapon: ServerBody;
    Score: number;
}

class ServerBulletBody extends ServerActiveBody {
    BulletTypeName: string;
    ShootingDistance: number;
}

class Body {
    Id: number;
    Name: string;
    Shape: Shape;
    zIndex: number;
    BodyType: string;
    syncSessionId: number;
    createdByCommandId: number;

    update(mechanicEngine: MechanicEngineTS) { }

    serverSync(serverBody, mechanicEngine: MechanicEngineTS) { }
}

class PassiveBody extends Body {
}

class BoxBody extends PassiveBody {
}

class ActiveBody extends Body{
    Speed: number;
    baseRotationVector: Vector;
    Direction: Vector;
    Life: number;
    LifeMax: number;
    State: number;
    OwnerId: number;
    LastProcessedCommandId: number;
    CreatedByCommandId: number;

    serverSync(serverBody: ServerActiveBody, mechanicEngine: MechanicEngineTS) {
        // Update Direction
        if (Math.abs(this.Direction.X - serverBody.Direction.X) > 0.0001 || Math.abs(this.Direction.Y - serverBody.Direction.Y) > 0.0001) {
            this.Direction = new Vector(serverBody.Direction.X, serverBody.Direction.Y);
        }

        //Position
        this.Shape.Position = new Point(serverBody.Shape.Position.X, serverBody.Shape.Position.Y);
    }
} 

class CharacterBody extends ActiveBody{
    CurrentWeapon: WeaponBase;
    Score: number;
    WeaponsCount: number;
    SocialGroups: string[];

    serverSync(serverBody, mechanicEngine: MechanicEngineTS) {
        super.serverSync(serverBody, mechanicEngine);
        if (serverBody.Life !== this.Life) {
            // to avoId body hit when drinking a bottle
            //if (serverBody.Life < this.Life) { 
                mechanicEngine.onBodyChanged.trigger({ body: this, changesType: BodyChangesType.hp });
            //}
            this.Life = serverBody.Life;
        }

    }
}

class PlayerOtherBody extends CharacterBody {
}

class NPCAI extends CharacterBody {
}

class PlayerBody extends CharacterBody {
    Name: string;

    serverSync(serverBody: CharacterBody, mechanicEngine: MechanicEngineTS) {
        //TODO: implement true polumorphic body processing

        if (serverBody.Life !== this.Life) {

            mechanicEngine.onBodyChanged.trigger({ body: this, changesType: BodyChangesType.hp });

            this.Life = serverBody.Life;
        }

        // Update weapon
        if ((serverBody.CurrentWeapon == null ? '' : this.CurrentWeapon.Name) != serverBody.CurrentWeapon.Name) {
            this.CurrentWeapon = serverBody.CurrentWeapon;
            mechanicEngine.onBodyChanged.trigger({ body: this, changesType: BodyChangesType.currentWeapon });
        }

        // Update score
        if (serverBody.Score && serverBody.Score !== this.Score) {
            this.Score = serverBody.Score;
            mechanicEngine.onBodyChanged.trigger({ body: this, changesType: BodyChangesType.score });
        }
    }
}

class Bullet extends ActiveBody {
    lastUpdateTime: number;
    startTime: number;
    flyDistance: number;
    bulletTypeName: string;

    constructor() {
        super();
        this.lastUpdateTime = new Date().getTime();
        this.startTime = this.lastUpdateTime;
        //this.unitDirection = new Vector(this.Direction.X, this.Direction.Y).calculateUnitVector();
    }

    update(mechanicEngine: MechanicEngineTS) {
        var currentTime = new Date().getTime();
        var duration = currentTime - this.lastUpdateTime;
        var durationFromStart = currentTime - this.startTime;
        this.lastUpdateTime = currentTime;

        if (durationFromStart / 1000 * this.Speed > this.flyDistance) {
            mechanicEngine.removeActiveBody(this.Id);
        }
        else {
            var moveCommand = new CommandMove(this.Id, new Date().getTime(), duration, this.Direction);
            moveCommand.syncedWithServer = true;

            mechanicEngine.addCommand(moveCommand);
        }
    }
}

class DynamitBody extends ActiveBody {
    lastUpdateTime: number;
    startTime: number;
    dynamiteDetonationTime: number;
    bulletTypeName: string;
    flyDistance: number;

    constructor() {
        super();

        this.lastUpdateTime = new Date().getTime();
        this.startTime = this.lastUpdateTime;
    }

    update(mechanicEngine: MechanicEngineTS) {
        var currentTime = new Date().getTime();
        var duration = currentTime - this.lastUpdateTime;
        var durationFromStart = currentTime - this.startTime;
        if (durationFromStart > this.dynamiteDetonationTime) {
            mechanicEngine.removeActiveBody(this.Id);
        }
        else {
            var moveCommand = new CommandMove(this.Id, new Date().getTime(), duration, this.Direction);
            moveCommand.syncedWithServer = true;

            mechanicEngine.addCommand(moveCommand);
        }

        this.lastUpdateTime = currentTime;
    }
}