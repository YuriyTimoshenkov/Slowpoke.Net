﻿function viewManager(canvas, canvasSize){
    var self = this;

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

    this.calculatePlayerDirectionVector = function (mousePoint) {
        var playerCenter = new Point(this.target.image.x, this.target.image.y);

        // Get mouse vector not normalized
        var mouseVectorNotNormalized = new Point(Math.round(mousePoint.x - playerCenter.x), Math.round(mousePoint.y - playerCenter.y));
        return mouseVectorNotNormalized;
    }

    this.updateCanvasXY = function (frame) {
        var self = this;

        // Update objects
        frame.objects.forEach(function (obj) {
            if (obj.objectType !== "PlayerBody") {
                var dx = self.target.gameRect.centerx - obj.gameRect.centerx;
                var dy = self.target.gameRect.centery - obj.gameRect.centery;

                obj.image.x = self.target.image.x - dx;
                obj.image.y = self.target.image.y - dy;
            }
        })

        // Update cells
        frame.cells.forEach(function (row) {
            row.forEach(function (cell) {
                var dx = self.target.gameRect.centerx - cell.gameRect.centerx;
                var dy = self.target.gameRect.centery - cell.gameRect.centery;

                // Cells are rects, and rects do not have center property
                cell.image.x = self.target.image.x - dx - cell.size / 2;
                cell.image.y = self.target.image.y - dy - cell.size / 2;
            })
        })
    }

    this.draw = function (frame) {
        var self = this;
        
        // Probably place for optimization. 
        // TODO: To remove\add only those objects, which were changed
        self.stage.removeAllChildren();

        frame.cells.forEach(function (row, index, array) {
            row.forEach(function (cell, index, array) {
                self.stage.addChild(cell.image);
            })
        })

        frame.objects.forEach(function (element, index, array) {
            self.stage.addChild(element.image);
        });

        self.stage.update();
    }
}