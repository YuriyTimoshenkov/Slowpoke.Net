function controlsManager(canvas) {
    var self = this;

    this.canvas = canvas;

    this.weaponSwitchCode = 9;
    this.keysHandlers = [
        { key: "weaponSwitch", handler: [] },
        { key: "l", handler: [] },
        { key: "r", handler: [] },
        { key: "u", handler: [] },
        { key: "d", handler: [] },
        { key: "ur", handler: [] },
        { key: "ul", handler: [] },
        { key: "dr", handler: [] },
        { key: "dl", handler: [] },
        { key: "e", handler: [] }
    ];

    this.keypressed = [];
    this.lastMouseMove = null;

    window.onkeydown = function (e) {
        if (e.preventDefault) e.preventDefault();
        else console.log("Controls-manager: onkeydown: Prevent default is not working")
        self.keypressed[e.keyCode] = true;
    }

    window.onkeyup = function (e) {
        if (e.preventDefault) e.preventDefault();
        else console.log("Controls-manager: onkeyup : Prevent default is not working")
        self.keypressed[e.keyCode] = false;
    }

    this.getKeyPressed = function () {
        var keypressed = [];

        var weaponSwitch = self.keypressed[this.weaponSwitchCode];
        var left = self.keypressed[65];
        var right = self.keypressed[68];
        var up = self.keypressed[87];
        var down = self.keypressed[83];
        var use = self.keypressed[69];

        // Weapon switch
        if (weaponSwitch) {
            keypressed.push("weaponSwitch");
            // we need to invoke weaponSwitch worker only once at the first keydown event, hence switching off manually
            self.keypressed[this.weaponSwitchCode] = false;
        }

        if (use) {
            keypressed.push("e");
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

        // Invoke controls handlers
        if (keypressed.length > 0) {
            self.keysHandlers.forEach(function (element, index, array) {
                if (inArray(element.key, keypressed)) {
                    element.handler.forEach(function (element, index, array) {
                        element();
                    });
                }
            });
        }
    }

    this.addKeyHandler = function (key, handler) {
        this.keysHandlers.forEach(function (element, index, array) {
            if (element.key === key) {

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
            self.lastMouseMove = handler(e);
        }
    }
    this.addUseHandler = function (handler) {
        this.addKeyHandler("e", handler)
    }
    this.nullifyLastMouseMove = function () {
        self.lastMouseMove = null;
    }
}