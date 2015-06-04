function viewManager(canvas, canvasSize, menu, gameContext) {
    var self = this;

    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    var textGap = 30;
    this.weaponPoint = new Point(5, canvas.height - 50);
    this.lifePoint = new Point(this.weaponPoint.x, this.weaponPoint.y - textGap);
    this.scorePoint = new Point(this.weaponPoint.x, this.lifePoint.y - textGap)
    this.fpsPoint = new Point(canvas.width - 80, this.weaponPoint.y - 10);
    this.pingPoint = new Point(canvas.width - 80, this.weaponPoint.y - 20);

    this.menu = menu;
    this.stage = new createjs.Stage(canvas);

    // Add menu objects
    self.stage.addChild(this.menu.weaponText, this.menu.lifeText, this.menu.fpsText, this.menu.scoreText, this.menu.pingText);

    this.setFrameQueue = function (framesQueue) {
        this.framesQueue = framesQueue
    }

    this.render = function (bodies, cells) {
        this.updateCanvasXY(bodies, cells);
        this.updateMenu();
        this.draw();
    }

    this.setTarget = function (target) {
        self.target = target;
        self.stage.addChild(target.image, target.objectMenu);
    }

    this.calculatePlayerDirectionVector = function (mousePoint) {
        var playerCenter = new Point(this.target.image.x, this.target.image.y);

        // Get mouse vector not normalized
        var mouseVectorNotNormalized = new Vector(Math.round(mousePoint.x - playerCenter.x), Math.round(mousePoint.y - playerCenter.y));
        return mouseVectorNotNormalized;
    }

    this.updateCanvasXY = function (bodies, cells) {
        var self = this;

        // Update objects
        bodies.forEach(function (obj) {
            if (obj.Id !== self.target.Id) {
                var dx = self.target.gameRect.centerx - obj.gameRect.centerx;
                var dy = self.target.gameRect.centery - obj.gameRect.centery;

                obj.image.x = self.target.image.x - dx;
                obj.image.y = self.target.image.y - dy;

                // Update objectMenu for NPCAI only
                if (obj.serverBody.BodyType === "NPCAI") {
                    obj.objectMenu.x = self.target.image.x - dx;
                    obj.objectMenu.y = self.target.image.y - dy;
                }
            }
        })

        // Update cells
        cells.forEach(function (cell) {
                var dx = self.target.gameRect.centerx - cell.gameRect.centerx;
                var dy = self.target.gameRect.centery - cell.gameRect.centery;

                // Cells are rects, and rects do not have center property
                cell.image.x = self.target.image.x - dx - cell.width / 2;
                cell.image.y = self.target.image.y - dy - cell.height / 2;
            })
    }

    this.updateMenu = function () {
        if (!this.menu.weapon || this.menu.weapon !== this.target.currentWeapon) {
            this.menu.updateWeapon(this.target.currentWeapon, this.weaponPoint);
        }

        if (this.menu.life !== this.target.life) {
            this.menu.updateLife(this.target.life, this.lifePoint);
        }

        if (this.menu.fps !== gameContext.fps) {
            this.menu.updateFPS(gameContext.fps, this.fpsPoint)
        }

        if (this.menu.ping !== gameContext.ping) {
            this.menu.updatePing(gameContext.ping, this.pingPoint)
        }

        if (this.menu.score !== this.target.score) {
            this.menu.updateScore(this.target.score, this.scorePoint)
        }
    }
      
    this.draw = function () {
        var self = this;
        
        // Probably place for optimization. 
        // TODO: To remove\add only those objects, which were changed
        //self.stage.removeAllChildren();

        // Add cells
        //frame.cells.forEach(function (cell) {
        //    self.stage.addChild(cell.image);
        //})

        // Add game objects
        //frame.objects.forEach(function (element, index, array) {
        //    self.stage.addChild(element.image);
        //    if (element.objectMenu.children.length > 0) {
        //        self.stage.addChild(element.objectMenu);
        //    }
        //});

        var sortFunction = function (a, b) {
            //if (a.zIndex === undefined || b.zIndex === undefined) {
            //    console.log("In sort function");
            //}
            
            if (a.zIndex < b.zIndex) return -1;
            if (a.zIndex > b.zIndex) return 1;
            return -1;
        }
        self.stage.sortChildren(sortFunction);
        // Add menu objects
        self.stage.addChild(this.menu.pingText, this.menu.fpsText, this.menu.lifeText, this.menu.weaponText, this.menu.scoreText);

        // Render
        self.stage.update();
    }

    this.init = function (mechanicEngine) {
        mechanicEngine.onObjectStateChanged = function (object, state) {
            switch (state) {
                case 'remove': {
                    self.stage.removeChild(object.image);

                    break;
                }
                case 'add': {
                    if (object.image === undefined || object.image.zIndex === undefined)
                        console.log('fuck');

                    self.stage.addChild(object.image);

                    if (object.objectMenu !== undefined && object.objectMenu.children.length > 0) {
                        self.stage.addChild(object.objectMenu);
                    }
                    break;
                }
                case 'update': {
                    break;
                }
            }
        }
    }
}