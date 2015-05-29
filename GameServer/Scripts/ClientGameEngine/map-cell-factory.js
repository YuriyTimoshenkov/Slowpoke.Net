﻿function MapCellFactory(size, gameObjectFactory) {
    var self = this;
    this.size = size;
    this.gameObjectFactory = gameObjectFactory;
    this.tree = self.gameObjectFactory.createGameObject(gameTypes.gameObjects.TREE, { Position: { X: 0, Y: 0 } });
    this.tree.image.cache(0, 0, self.size, self.size)

    this.tileImages = [];
    this.tileImages[gameTypes.tiles.MEADOW] = new createjs.Shape();
    this.tileImages[gameTypes.tiles.WATER] = new createjs.Shape();
    this.tileImages[gameTypes.tiles.ROCK] = new createjs.Shape();
    this.tileImages[gameTypes.tiles.ROAD] = new createjs.Shape();
    this.tileImages[gameTypes.tiles.FORD] = new createjs.Shape();
    this.tileImages[gameTypes.tiles.TREE] = new createjs.Shape();
    this.tileImages[gameTypes.tiles.MEADOW].graphics.beginFill("#C0F598").drawRect(0, 0, this.size, this.size);
    this.tileImages[gameTypes.tiles.WATER].graphics.beginFill("#89EBF0").drawRect(0, 0, this.size, this.size);
    this.tileImages[gameTypes.tiles.ROCK].graphics.beginFill("#6E6E6E").drawRect(0, 0, this.size, this.size);
    this.tileImages[gameTypes.tiles.ROAD].graphics.beginFill("#EDC791").drawRect(0, 0, this.size, this.size);
    this.tileImages[gameTypes.tiles.TREE].graphics.beginFill("#5EAB00").drawRect(0, 0, this.size, this.size);
       
    this.createMapCell = function (cellType, data) {
        var cellPosition = {
            X: data.Position.X * self.size,
            Y: data.Position.Y * self.size
        }
        var Id = data.Id;
        var cell = new MapCell(Id, cellPosition, self.size);
        var img = self.tileImages[cellType].clone(true);

        cell.assignImage(img);
        
        return cell;
    }
}