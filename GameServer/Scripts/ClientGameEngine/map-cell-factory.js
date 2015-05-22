function MapCellFactory(size, gameObjectFactory) {
    var self = this;
    this.size = size;
    this.gameObjectFactory = gameObjectFactory;

    this.tileImages = [];
    this.tileImages[gameTypes.tiles.MEADOW] = new createjs.Shape().graphics.beginFill("#C0F598").drawRect(0, 0, this.size, this.size);
    this.tileImages[gameTypes.tiles.WATER] = new createjs.Shape().graphics.beginFill("#89EBF0").drawRect(0, 0, this.size, this.size);
    this.tileImages[gameTypes.tiles.ROCK] = new createjs.Shape().graphics.beginFill("#6E6E6E").drawRect(0, 0, this.size, this.size);
    this.tileImages[gameTypes.tiles.ROAD] = new createjs.Shape().graphics.beginFill("#EDC791").drawRect(0, 0, this.size, this.size);
    this.tileImages[gameTypes.tiles.FORD] = new createjs.Shape().graphics.beginFill("#5FA3A7").drawRect(0, 0, this.size, this.size);
    this.tileImages[gameTypes.tiles.TREE] = (function () {
        var image = new createjs.Container();
        var treeShape = new createjs.Shape().graphics.beginFill("#C0F598").drawRect(0, 0, self.size, self.size);
        var tree = self.gameObjectFactory.createGameObject(gameTypes.gameObjects.TREE, { "Position": {X: 0, Y: 0}});
        image.addChild(treeShape, tree.image);
        return image
    })();

    this.createMapCell = function (cellType, data) {
        var gameX = data.Position.X * data.cellSize;
        var gameY = data.Position.Y * data.cellSize;
        var cell = new MapCell([gameX, gameY], data.CellSize);
        cell.assignImage(self.tileImages[cellType]);
        return cell
    }
}