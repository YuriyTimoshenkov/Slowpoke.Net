function viewManager(canvas, canvasSize){
    this.drawContext = canvas.getContext("2d");

    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

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

    this.updateCanvasXY = function (frame) {
        var self = this;

        // Update objects
        frame.objects.forEach(function (obj) {
            if (obj.objectType !== "PlayerBody") {
                var dx = self.target.gameRect.x - obj.gameRect.x;
                var dy = self.target.gameRect.y - obj.gameRect.y;

                obj.canvasRect.x = self.target.canvasRect.x - dx;
                obj.canvasRect.y = self.target.canvasRect.y - dy;
            }
        })

        // Update cells
        frame.cells.forEach(function (row) {
            row.forEach(function (cell) {
                var dx = self.target.gameRect.x - cell.gameRect.x;
                var dy = self.target.gameRect.y - cell.gameRect.y;

                cell.canvasX = self.target.canvasRect.x - dx;
                cell.canvasY = self.target.canvasRect.y - dy;
            })
        })
    }

    this.draw = function (frame) {
        var self = this

        self.drawContext.clearRect(0, 0, canvas.width, canvas.height);

        // Draw background
        frame.cells.forEach(function (row) {
            row.forEach(function (cell) {
                cell.draw(self.drawContext)
            });

        });

        // Draw objects
        frame.objects.forEach(function (obj) {
            
            obj.draw(self.drawContext)
        });
    }
}