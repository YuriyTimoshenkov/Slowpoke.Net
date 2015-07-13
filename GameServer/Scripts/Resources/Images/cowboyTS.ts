class CowboyContainerTS {
    image = new createjs.Container();

    constructor() { 
        var shape = new createjs.Shape();
        var color = "black";
        shape.graphics.beginFill(color).drawRect(0, 0, 50, 50);
        this.image.addChild(shape);
    }
}

 