function viewManager(canvas, canvasSize, menu){
    var self = this;

    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    this.weaponPoint = new Point(5, canvas.height - 50);
    this.lifePoint = new Point(this.weaponPoint.x, this.weaponPoint.y - 30);
    this.fpsPoint = new Point(canvas.width - 80, this.weaponPoint.y - 10);

    this.menu = menu;
    this.stage = new createjs.Stage(canvas);


    this.setFrameQueue = function (framesQueue) {
        this.framesQueue = framesQueue
    }

    this.render = function (frame, fps) {
        this.updateCanvasXY(frame);
        this.updateMenu(fps);
        this.draw(frame);
    }

    this.setTarget = function (target) {
        this.target = target;
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
        frame.cells.forEach(function (cell) {
                var dx = self.target.gameRect.centerx - cell.gameRect.centerx;
                var dy = self.target.gameRect.centery - cell.gameRect.centery;

                // Cells are rects, and rects do not have center property
                cell.image.x = self.target.image.x - dx - cell.width / 2;
                cell.image.y = self.target.image.y - dy - cell.height / 2;
            })
    }

    this.updateMenu = function (fps) {
        if (!this.menu.weapon || this.menu.weapon["Name"] !== this.target.currentWeapon["Name"]) {
            this.menu.updateWeapon(this.target.currentWeapon, this.weaponPoint);
        }

        if (this.menu.life !== this.target.life) {
            this.menu.updateLife(this.target.life, this.lifePoint);
        }

        if (this.menu.fps !== fps) {
            this.menu.updateFPS(fps, this.fpsPoint)
        }
        

    }
      
    this.draw = function (frame) {
        var self = this;
        
        // Probably place for optimization. 
        // TODO: To remove\add only those objects, which were changed
        self.stage.removeAllChildren();

        // Add cells
        frame.cells.forEach(function (cell) {
                self.stage.addChild(cell.image);
            })

        // Add game objects
        frame.objects.forEach(function (element, index, array) {
            self.stage.addChild(element.image);
        });

        // Add menu objects
        self.stage.addChild(this.menu.weaponText, this.menu.lifeText, this.menu.fpsText);

        // Render
        self.stage.update();
    }
}