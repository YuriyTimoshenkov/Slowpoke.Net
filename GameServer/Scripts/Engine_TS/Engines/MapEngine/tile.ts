interface ServerTile extends ServerBody  {
    Solid: string;
}

class Tile extends Body {
    size: number;
    constructor(serverBody: ServerBody) {
        super(serverBody);

        this.size = (<ServerShapeCircle>serverBody.Shape).Radius;
    }
} 