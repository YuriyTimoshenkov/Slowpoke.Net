interface ServerTile extends ServerBody  {
    Solid: string;
}

class Tile extends Body {
    size: number;
    constructor(serverBody: ServerBody) {
        super(serverBody);
        this.size = serverBody.Shape.Radius;
    }
} 