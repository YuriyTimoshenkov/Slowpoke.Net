function viewManager(canvas, canvasSize){
    //this.drawContext = canvas.getContext("2d");

    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    this.stage = new createjs.Stage(canvas);

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
        var playerCenter = this.target.canvasRect.center;
        var vectorMultiplier = 10;
        var mouse = point;

        // Get mouse vector not normalized
        var mouseVectorNotNo
        rmalized = new Point(mouse.x - playerCenter.x, mouse.y - playerCenter.y);

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
        // Probably place for optimization
        this.stage.removeAllChildren();

        frame.objects.forEach(function (obj) {
            this.stage.addChild(obj.image);
        });

        frame.cells.forEach(function (cell) {
            this.stage.addChild(cell.image);
        });
        
        this.stage.update();
    }
}