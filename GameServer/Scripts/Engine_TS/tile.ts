interface ServerTile extends ServerBody  {
    Solid: string;
}

class Tile extends Body {
    size: number;
    constructor(id: number, position: Point, size: number, bodyType: string) {
        super(id, id.toString(), bodyType);
        this.size = size;
        this.gameRect = new Rect(position.x, position.y, size, size);
    }
} 