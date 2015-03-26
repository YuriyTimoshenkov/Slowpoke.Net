function viewManager(canvas, canvasSize){
    //this.drawContext = canvas.getContext("2d");

    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    this.stage = new createjs.Stage(canvas);

    //this.circle = new createjs.Shape();
    //this.circle.graphics.beginFill("red").drawCircle(0, 0, 40);
    //this.circle.y = 50;
    //this.stage.addChild(this.circle);

    //createjs.Ticker.on("tick", tick);
    //createjs.Ticker.setFPS(30);

    var self = this;
    //function tick(event) {
    //    self.circle.x = self.circle.x + 5;
    //    if (self.circle.x > self.stage.canvas.width) { self.circle.x = 0; }

    //    self.stage.update(event); // important!!
    //}

    this.setFrameQueue = function (framesQueue) {
        this.framesQueue = framesQueue
    }

    this.render = function (frame) {
        this.updateCanvasXY(frame)
        this.draw(frame)
    }

    this.setTarget = function (target) {
        this.target = target
    }

    this.calculatePlayerDirectionVector = function (point) {
        var playerCenter = new Point(this.target.image.x, this.target.image.y);
        var vectorMultiplier = 10;
        var mouse = point;

        // Get mouse vector not normalized
        var mouseVectorNotNormalized = new Point(mouse.x - playerCenter.x, mouse.y - playerCenter.y);

        // Calculate mouse vector length
        var mouseVectorLength = Math.sqrt(Math.pow(mouseVectorNotNormalized.x, 2) + Math.pow(mouseVectorNotNormalized.y, 2));

        // Normalize mouse vector
        var mouseVectorNormalized = new Point(Math.round(mouseVectorNotNormalized.x / mouseVectorLength * vectorMultiplier),
                                              Math.round(mouseVectorNotNormalized.y / mouseVectorLength * vectorMultiplier));
        return mouseVectorNormalized;
    }

    this.updateCanvasXY = function (frame) {
        var self = this;

        // Update objects
        frame.objects.forEach(function (obj) {
            if (obj.objectType !== "PlayerBody") {
                var dx = self.target.gameRect.x - obj.gameRect.x;
                var dy = self.target.gameRect.y - obj.gameRect.y;

                obj.image.x = self.target.image.x - dx;
                obj.image.y = self.target.image.y - dy;
            }
        })

        // Update cells
        frame.cells.forEach(function (row) {
            row.forEach(function (cell) {
                var dx = self.target.gameRect.x - cell.gameRect.x;
                var dy = self.target.gameRect.y - cell.gameRect.y;

                // Cells are rects, and rects do not have center property
                cell.image.x = self.target.image.x - dx - cell.size / 2;
                cell.image.y = self.target.image.y - dy - cell.size / 2;
            })
        })
    }

    this.draw = function (frame) {
        var self = this;
        
        // Probably place for optimization. To remove\add only those objects, which were changed
        self.stage.removeAllChildren();

        frame.cells.forEach(function (row, index, array) {
            row.forEach(function (cell, index, array) {
                console.log("we add cell");
                self.stage.addChild(cell.image);
            })
        })

        frame.objects.forEach(function (element, index, array) {
            console.log("we add object");
            console.log([element.image.x, element.image.y]);
            self.stage.addChild(element.image);
        });

        self.stage.update();
    }
}