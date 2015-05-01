function controlsManager(canvas) {
    var self = this;

    this.canvas = canvas;

    this.weaponSwitchCode = 9;
    this.left = 65;
    this.right = 68;
    this.up = 87;
    this.down = 83;

    this.keysHandlers = [
        { key: "weaponSwitch", handler: [], },
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

    this.mouseHandlers = [
        { key: "changeDirection", handler: [] }

    ]


    this.moveKeysRegistrator = {
        65: { keyDownTimeStamp: null, keyUpTimeStamp: null, duration: 0 }, // left
        68: { keyDownTimeStamp: null, keyUpTimeStamp: null, duration: 0 }, // right
        87: { keyDownTimeStamp: null, keyUpTimeStamp: null, duration: 0 }, // up
        83: { keyDownTimeStamp: null, keyUpTimeStamp: null, duration: 0 } // down
    }

    this.moveKeysHighLevelDuration = {
        "l": 0,
        "r": 0,
        "u": 0,
        "d": 0,
        "ul": 0,
        "ur": 0,
        "dl": 0,
        "dr": 0,
    };


    this.nonmoveKeysPressed = [];
    this.lastMouseMove = null;

    window.onkeydown = function (e) {
        if (e.preventDefault) e.preventDefault();
        else console.log("Controls-manager: onkeydown: Prevent default is not working")
        
        // If moving button
        if (e.keyCode in self.moveKeysRegistrator) {
            if (self.moveKeysRegistrator["keyDownTimeStamp"] == null) {
                var button = self.moveKeysRegistrator[e.keyCode];
                button["keyDownTimeStamp"] = new Date();
                button["keyUpTimeStamp"] = null;
            }
        }
        // If non-moving button
        else {
            self.nonmoveKeysPressed[e.keyCode] = true;
        }
    }

    window.onkeyup = function (e) {
        if (e.preventDefault) e.preventDefault();
        else console.log("Controls-manager: onkeyup : Prevent default is not working")

        // If moving button
        if (e.keyCode in self.moveKeysRegistrator) {
            var button = self.moveKeysRegistrator[e.keyCode];
            button["keyUpTimeStamp"] = new Date();
            button["duration"] += button["keyUpTimeStamp"] - button["keyDownTimeStamp"]
            button["keyDownTimeStamp"] = null;
        }
        // If non-moving button
        else {
            self.nonmoveKeysPressed[e.keyCode] = false;
        }
    }

    this.processKeyPressed = function () {
        var keypressed = [];

        // Process non-movement keys
        var weaponSwitch = self.nonmoveKeysPressed[self.weaponSwitchCode];
        var use = self.nonmoveKeysPressed[69];

        // Weapon switch
        if (weaponSwitch) {
            keypressed.push("weaponSwitch");
            // we need to invoke weaponSwitch worker only once at the first keydown event, hence switching off manually
            self.nonmoveKeysPressed[this.weaponSwitchCode] = false;
        }

        if (use) {
            keypressed.push("e");
        }

        // Process Movement Keys
            // left
        if (self.moveKeysRegistrator[self.left]["keyDownTimeStamp"] == null) {
            var left = self.moveKeysRegistrator[self.left]["duration"];
        }
        else {
            var now = new Date();
            var left = now - self.moveKeysRegistrator[self.left]["keyDownTimeStamp"];
            self.moveKeysRegistrator[self.left]["keyDownTimeStamp"] = now;
        }
            // right
        if (self.moveKeysRegistrator[self.right]["keyDownTimeStamp"] == null) {
            var right = self.moveKeysRegistrator[self.right]["duration"];
        }
        else {
            var now = new Date();
            var right = now - self.moveKeysRegistrator[self.right]["keyDownTimeStamp"];
            self.moveKeysRegistrator[self.right]["keyDownTimeStamp"] = now;
        }
        
        // up
        if (self.moveKeysRegistrator[self.up]["keyDownTimeStamp"] == null) {
            var up = self.moveKeysRegistrator[self.up]["duration"];
        }
        else {
            var now = new Date();
            var up = now - self.moveKeysRegistrator[self.up]["keyDownTimeStamp"];
            self.moveKeysRegistrator[self.up]["keyDownTimeStamp"] = now;
        }

        // down
        if (self.moveKeysRegistrator[self.down]["keyDownTimeStamp"] == null) {
            var down = self.moveKeysRegistrator[self.down]["duration"];
        }
        else {
            var now = new Date();
            var down = now - self.moveKeysRegistrator[self.down]["keyDownTimeStamp"];
            self.moveKeysRegistrator[self.down]["keyDownTimeStamp"] = now;
        }

            // Process diagonal movement first
        if (up > 0 && left > 0) {
            self.moveKeysHighLevelDuration["ul"] = Math.min(up, left);
            keypressed.push("ul");
        }

        else if (up > 0 && right > 0) {
            self.moveKeysHighLevelDuration["ur"] = Math.min(up, right);
            keypressed.push("ur");
        }

        else if (down > 0 && left > 0) {
            self.moveKeysHighLevelDuration["dl"] = Math.min(down, left);
            keypressed.push("dl");
        }

        else if (down > 0 && right > 0) {
            self.moveKeysHighLevelDuration["dr"] = Math.min(down, right);
            keypressed.push("dr");
        }

        else if (left > 0) {
            self.moveKeysHighLevelDuration["l"] = left;
            keypressed.push("l");
        }

        else if (right > 0) {
            self.moveKeysHighLevelDuration["r"] = right;
            keypressed.push("r");
        }

        else if (up > 0) {
            self.moveKeysHighLevelDuration["u"] = up;
            keypressed.push("u");
        }

        else if (down > 0) {
            self.moveKeysHighLevelDuration["d"] = down;
            keypressed.push("d");
        }

        self.nullifyMoveKeysDuration();

        return keypressed;
    }
    
    this.handleControls = function () {
        var keypressed = self.processKeyPressed();

        // Invoke keyboard controls handlers
        if (keypressed.length > 0) {
            self.keysHandlers.forEach(function (element, index, array) {
                if (inArray(element.key, keypressed)) {
                    element.handler.forEach(function (el, index, array) {
                        el(self.moveKeysHighLevelDuration[element.key]);
                    });
                }
            });
        }
        //Invoke mouse controls handlers
        if (this.lastMouseMove) {
            self.mouseHandlers.forEach(function (element, index, array) {
                element.handler.forEach(function (el, index, array) {
                    el(self.lastMouseMove);
                });
            
            });
            this.nullifyLastMouseMove();
        }
    }

    this.addKeyHandler = function (key, handler, mouse) {
        if (mouse) {
            var handlersArray = this.mouseHandlers;
        }
        else {
            var handlersArray = this.keysHandlers;
        }
        handlersArray.forEach(function (element, index, array) {
            if (element.key === key) {
                element.handler.push(handler)
                return
            }
        })
    }

    this.addShootHandler = function (handler) {
        this.canvas.onclick = function (e) {
            e.preventDefault();
            if (e.button === 0) {
                handler()
            }
        }
    }

    this.addChangeDirectionHandler = function (handler) {
        this.addKeyHandler("changeDirection", handler, true)
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
            //e.stopPropagation();
            self.lastMouseMove = handler(e);
        }
    }

    this.addUseHandler = function (handler) {
        this.addKeyHandler("e", handler)
    }
    this.nullifyLastMouseMove = function () {
        self.lastMouseMove = null;
    }

    this.nullifyMoveKeysDuration = function () {
        for (var item in self.moveKeysRegistrator) {
            self.moveKeysRegistrator[item].duration = 0;
        }
        for (var item in self.moveKeysHighLevelDuration) {
            self.moveKeysHighLevelDuration[item] = 0;
        }

    }
}