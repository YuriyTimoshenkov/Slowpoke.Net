﻿function viewManager(canvas, canvasSize, menu, gameContext) {
    var self = this;

    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    var textGap = 30;
    this.bodyImages = [];
    this.weaponPoint = new Point(5, canvas.height - 50);
    this.lifePoint = new Point(this.weaponPoint.x, this.weaponPoint.y - textGap);
    this.scorePoint = new Point(this.weaponPoint.x, this.lifePoint.y - textGap)
    this.fpsPoint = new Point(canvas.width - 80, this.weaponPoint.y - 10);
    this.pingPoint = new Point(canvas.width - 80, this.weaponPoint.y - 20);

    this.menu = menu;
    this.stage = new createjs.Stage(canvas);
    this.viewBodyFactory = new ViewBodyFactory();

    // Add menu objects
    self.stage.addChild(this.menu.weaponText, this.menu.lifeText, this.menu.fpsText, this.menu.scoreText, this.menu.pingText);

    this.setFrameQueue = function (framesQueue) {
        this.framesQueue = framesQueue
    }

    this.render = function (bodies, cells) {
        this.updateCanvasXY(bodies, cells);
        //this.updateMenu();
        this.draw();
    }

    this.setTarget = function (body) {
        self.targetBody = body;

        self.targetBodyImage = self.bodyImages.filter(function (v) { return v.id === body.id ? true : false })[0].image;
    }

    this.calculatePlayerDirectionVector = function (mousePoint) {
        var playerCenter = new Point(self.targetBodyImage.x, self.targetBodyImage.y);

        // Get mouse vector not normalized
        var mouseVectorNotNormalized = new Vector(Math.round(mousePoint.x - playerCenter.x), Math.round(mousePoint.y - playerCenter.y));
        return mouseVectorNotNormalized;
    }

    updateDirection: function (newDirection) {
        var rotationDeltaRad = Math.acos(this.baseRotationVector.product(newDirection)/
            this.baseRotationVector.length() * newDirection.length());

        var rotationDeltaDegree = rotationDeltaRad * (180 / Math.PI);

        // To check rotation direction
        var centerX = this.image.x;
        var mouseX = centerX + newDirection.x;

        // Clockwise
        if (mouseX >= centerX) {
            this.image.rotation = rotationDeltaDegree;
        }// Counter-clockwise
        else {
            this.image.rotation = 360 - rotationDeltaDegree;
        }

        // Update direction and weapon
        this.direction = newDirection;
    } 

    this.updateCanvasXY = function (bodies){//, cells) {

        // Update objects
        self.mechanicEngine.bodies.forEach(function (body) {
            if (body.Id !== self.target.Id) {
                var bodyImage = self.bodyImages.filter(function (v) { return v.id === body.id ? true : false })[0].image;

                if (bodyImage !== undefined) {
                    var dx = self.targetBody.gameRect.centerx - body.gameRect.centerx;
                    var dy = self.targetBody.gameRect.centery - body.gameRect.centery;

                    bodyImage.image.x = self.targetBodyImage.x - dx;
                    bodyImage.image.y = self.targetBodyImage.y - dy;

                    // Update objectMenu for NPCAI only
                    //if (obj.serverBody.BodyType === "NPCAI") {
                    //    obj.objectMenu.x = self.target.image.x - dx;
                    //    obj.objectMenu.y = self.target.image.y - dy;
                    //}
                }
            }
        })

        // Update cells
        //cells.forEach(function (cell) {
        //        var dx = self.target.gameRect.centerx - cell.gameRect.centerx;
        //        var dy = self.target.gameRect.centery - cell.gameRect.centery;

        //        // Cells are rects, and rects do not have center property
        //        cell.image.x = self.target.image.x - dx - cell.width / 2;
        //        cell.image.y = self.target.image.y - dy - cell.height / 2;
        //    })
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
        self.mechanicEngine = mechanicEngine;

        mechanicEngine.onActiveBodyAdd.push(function (body) {
            var image = self.viewBodyFactory.createGameObjectbyServerBody(body);
            self.bodyImages.push({id:body.id, image: image});

            self.stage.addChild(image);
        });
    }
}