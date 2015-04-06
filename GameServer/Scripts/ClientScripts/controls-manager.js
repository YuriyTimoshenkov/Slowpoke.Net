function controlsManager(canvas) {
    var self = this;
    
    this.canvas = canvas;


    this.keysHandlers = [
        { key: "weaponSwitch", handler: [] },
        { key: "l", handler: [] },
        { key: "r", handler: [] },
        { key: "u", handler: [] },
        { key: "d", handler: [] },
        { key: "ur", handler: [] },
        { key: "ul", handler: [] },
        { key: "dr", handler: [] },
        { key: "dl", handler: [] }
    ];

    this.keypressed = [];

    window.onkeydown = function (e) {
        self.keypressed[e.keyCode] = true;
    }

    this.clearKeypressed = function () { self.keypressed = [] }

    this.getKeyPressed = function () {
        var keypressed = [];

        var weaponSwitch = self.keypressed[9];
        var left = self.keypressed[65];
        var right = self.keypressed[68];
        var up = self.keypressed[87];
        var down = self.keypressed[83];


        // Weapon switch
        if (weaponSwitch) {
            keypressed.push("weaponSwitch");
        }

        // Movement
        if (up && left) {
            keypressed.push("ul");
        }

        else if (up && right) {
            keypressed.push("ur");
        }

        else if (down && left) {
            keypressed.push("dl");
        }

        else if (down && right) {
            keypressed.push("dr");
        }

        else if (up) {
            keypressed.push("u");
        }

        else if (down) {
            keypressed.push("d");
        }

        else if (left) {
            keypressed.push("l");
        }

        else if (right) {
            keypressed.push("r");
        }

        return keypressed;

    }

    this.handleControls = function () {
        var keypressed = self.getKeyPressed();
        // Need to clear key pressed array each game cycle
        self.clearKeypressed();

        // Invoke controls handlers
        self.keysHandlers.forEach(function (element, index, array) {
            if (element.key in keypressed) {
                element.handler.forEach(function (element, index, array) {
                    element();
                });
            }
        });
    }

    //window.onkeydown = function (e) {

    //    self.keysHandlers.forEach(function (element, index, array) {
    //        if (e.keyCode === element.keyCode) {
    //            if (e.preventDefault) e.preventDefault();
    //            else throw "Prevent default doesn't work";
    //            element.handler.forEach(function (element, index, array) {
    //                element();
    //            })
    //        }
    //    })
    //}

    this.addKeyHandler = function (keyCode, handler) {
        this.keysHandlers.forEach(function (element, index, array) {
            if (element.keyCode === keyCode) {

                element.handler.push(handler)
                return
            }
        })
    }



    this.addShootHandler = function (handler) {
        this.canvas.onclick = function (e) {    
            if (e.button === 0) {
                handler()
            }
        }
    }

    this.addMoveUpHandler = function (handler) {
        this.addKeyHandler("u", handler)
    }

    this.addMoveRightHandler = function (handler) {
        this.addKeyHandler("r", handler)
    }

    this.addMoveDownHandler = function (handler) {
        this.addKeyHandler("d", handler)
    }

    this.addMoveLeftHandler = function (handler) {
        this.addKeyHandler("l", handler)
    }

    this.addChangeWeaponHandler = function (handler) {
        this.addKeyHandler("weaponSwitch", handler) // TAB
    }

    this.addMoveUpRightHandler = function (handler) {
        this.addKeyHandler("ur", handler)
    }
    this.addMoveUpLeftHandler = function (handler) {
        this.addKeyHandler("ul", handler)
    }
    this.addMoveDownRightHandler = function (handler) {
        this.addKeyHandler("dr", handler)
    }
    this.addMoveDownLeftHandler = function (handler) {
        this.addKeyHandler("dl", handler)
    }


    this.addMouseMoveHandler = function (handler) {
        this.canvas.onmousemove = function (e) {
            e.stopPropagation();
            handler(e)
        }
    }
}