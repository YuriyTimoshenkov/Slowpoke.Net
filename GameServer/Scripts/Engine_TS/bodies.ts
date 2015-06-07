class ActiveBody {
    id: number;
    name: string;
    gameRect: Rect;
    direction: Vector;
    speed: number;
    baseRotationVector: Vector;
    zIndex: number;

    constructor(serverBody: any) {
        this.id = serverBody.Id;
        this.name = serverBody.Name;
        this.gameRect = new Rect(0, 0, serverBody.Shape.Radius * 2, serverBody.Shape.Radius * 2);
        this.gameRect.center = serverBody.Shape.Position;
        this.direction = new Vector(serverBody.Direction.X, serverBody.Direction.Y)
        || new Vector(0, -1);
        this.zIndex = 1;
        this.speed = serverBody.Speed;
        this.baseRotationVector = new Vector(0, -1);
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
    maxLife: string;
    score: number;

    constructor(serverBody: any) {
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