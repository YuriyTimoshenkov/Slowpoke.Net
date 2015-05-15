function controlsManager(canvas) {
    var self = this;

    this.canvas = canvas;

    this.weaponSwitchCode = 9;
    this.useCode = 69;
    this.leftCode = 65;
    this.rightCode = 68;
    this.upCode = 87;
    this.downCode = 83;

    this.focus = true;

    this.controlsToReport = {
        use: false,
        weaponSwitch: false,
        shoot: false,
        changeDirection: null,
        move: {
            l: { direction: { x: -1, y: 0 }, duration: 0 },
            r: { direction: { x: 1, y: 0 }, duration: 0 },
            u: { direction: { x: 0, y: -1 }, duration: 0 },
            d: { direction: { x: 0, y: 1 }, duration: 0 },
            ul: { direction: { x: -0.707, y: -0.707 }, duration: 0 },
            ur: { direction: { x: 0.707, y: -0.707 }, duration: 0 },
            dl: { direction: { x: -0.707, y: 0.707 }, duration: 0 },
            dr: { direction: { x: 0.707, y: 0.707 }, duration: 0 }
        }
    }

    this.moveKeysRegistrator = {
        65: { keyDownTimeStamp: null, keyUpTimeStamp: null, duration: 0 }, // left
        68: { keyDownTimeStamp: null, keyUpTimeStamp: null, duration: 0 }, // right
        87: { keyDownTimeStamp: null, keyUpTimeStamp: null, duration: 0 }, // up
        83: { keyDownTimeStamp: null, keyUpTimeStamp: null, duration: 0 } // down
    }

    $(self.canvas).click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.button === 0) {
            self.controlsToReport["shoot"] = true;
        }
        return false;
    })

    self.canvas.oncontextmenu = function () {return false}

    window.onkeydown = function (e) {
        if (e.preventDefault) e.preventDefault();
        else console.log("Controls-manager: onkeydown: Prevent default is not working");
        
        if (self.focus) {
            // If moving button
            if (e.keyCode in self.moveKeysRegistrator) {
                if (self.moveKeysRegistrator[e.keyCode]["keyDownTimeStamp"] == null) {
                    var button = self.moveKeysRegistrator[e.keyCode];
                    button["keyDownTimeStamp"] = new Date();
                    button["keyUpTimeStamp"] = null;
                }
            }
            // If non-moving button
            else if (e.keyCode == self.useCode) {
                self.controlsToReport["use"] = true;
            }
            else if (e.keyCode == self.weaponSwitchCode) {
                self.controlsToReport["weaponSwitch"] = true;
            }
        }
    }

    window.onkeyup = function (e) {
        if (e.preventDefault) e.preventDefault();
        else console.log("Controls-manager: onkeyup : Prevent default is not working");

        if (self.focus) {
            // If moving buttons only
            self.processKeyUp(e.keyCode);
        }
    }

    $(window).on("focus blur", function (e) {
        switch (e.type) {
            case "blur":
                self.focus = false;
                // Force keyUp for all pressed keys
                for (var button in self.moveKeysRegistrator) {
                    if (self.moveKeysRegistrator[button]["keyDownTimeStamp"]) {
                        self.processKeyUp(button);
                    }
                }
                break;
            case "focus":
                self.focus = true;
                break;
        }
    })

    this.processKeyUp = function (keyCode) {
        if (keyCode in self.moveKeysRegistrator) {
            var button = self.moveKeysRegistrator[keyCode];
            button["keyUpTimeStamp"] = new Date();
            button["duration"] += button["keyUpTimeStamp"].getTime() - button["keyDownTimeStamp"].getTime();
            button["keyDownTimeStamp"] = null;
        }
    }

    this.handleControlsCommon = function () {
        self.processMoveKeysRegistrator();
        self.nullifyMoveKeysRegistratorDuration();

        var controlsToReport = {};

        controlsToReport.use = self.controlsToReport.use;
        controlsToReport.shoot = self.controlsToReport.shoot;
        controlsToReport.changeDirection = self.controlsToReport.changeDirection;
        controlsToReport.weaponSwitch = self.controlsToReport.weaponSwitch;
 
        self.nullifyControlsToReport();
        return controlsToReport
    }

    this.handleControlsMove = function () {
        self.processMoveKeysRegistrator();
        self.nullifyMoveKeysRegistratorDuration();
        var controlsToReport = {};

        // we presume that player could go only 1 direction per report
        var moves = self.controlsToReport.move
        for (var dir in moves) {
            if (moves[dir]["duration"] > 0) {
                controlsToReport["move"] = {
                    direction: moves[dir]["direction"],
                    duration: moves[dir]["duration"]
                };
            }
        }

        for (var dir in self.controlsToReport["move"]) {
            self.controlsToReport["move"][dir]["duration"] = 0;
        }

        return controlsToReport
    }

    this.processMoveKeysRegistrator = function () {
        var left, right, up, down;
        var now = new Date();

        // Process Movement Keys
            // left
        if (self.moveKeysRegistrator[self.leftCode]["keyDownTimeStamp"] == null) {
            left = self.moveKeysRegistrator[self.leftCode]["duration"];
        }
        else {
            left = now - self.moveKeysRegistrator[self.leftCode]["keyDownTimeStamp"];
            self.moveKeysRegistrator[self.leftCode]["keyDownTimeStamp"] = now;
        }
            // right
        if (self.moveKeysRegistrator[self.rightCode]["keyDownTimeStamp"] == null) {
            right = self.moveKeysRegistrator[self.rightCode]["duration"];
        }
        else {
            right = now - self.moveKeysRegistrator[self.rightCode]["keyDownTimeStamp"];
            self.moveKeysRegistrator[self.rightCode]["keyDownTimeStamp"] = now;
        }
            // up
        if (self.moveKeysRegistrator[self.upCode]["keyDownTimeStamp"] == null) {
            up = self.moveKeysRegistrator[self.upCode]["duration"];
        }
        else {
            up = now.getTime() - self.moveKeysRegistrator[self.upCode]["keyDownTimeStamp"].getTime();
            self.moveKeysRegistrator[self.upCode]["keyDownTimeStamp"] = now;
        }
            // down
        if (self.moveKeysRegistrator[self.downCode]["keyDownTimeStamp"] == null) {
            down = self.moveKeysRegistrator[self.downCode]["duration"];
        }
        else {
            down = now - self.moveKeysRegistrator[self.downCode]["keyDownTimeStamp"];
            self.moveKeysRegistrator[self.downCode]["keyDownTimeStamp"] = now;
        }

        // Process diagonal movement first
        if (up > 0 && left > 0) {
            self.controlsToReport["move"]["ul"]["duration"] = Math.min(up, left);
        }
        else if (up > 0 && right > 0) {
            self.controlsToReport["move"]["ur"]["duration"] = Math.min(up, right);
        }
        else if (down > 0 && left > 0) {
            self.controlsToReport["move"]["dl"]["duration"] = Math.min(down, left);
        }
        else if (down > 0 && right > 0) {
            self.controlsToReport["move"]["dr"]["duration"] = Math.min(down, right);
        }
        else if (left > 0) {
            self.controlsToReport["move"]["l"]["duration"] = left;
        }
        else if (right > 0) {
            self.controlsToReport["move"]["r"]["duration"] = right;
        }
        else if (up > 0) {
            self.controlsToReport["move"]["u"]["duration"] = up;
        }
        else if (down > 0) {
            self.controlsToReport["move"]["d"]["duration"] = down;
        }
    }

    this.processKeyPressed = function () {
        var keypressed = [];

        // Process non-movement keys
        var weaponSwitch = self.nonmoveKeysPressed[self.weaponSwitchCode];
        var use = self.nonmoveKeysPressed[69];
        var left, right, up, down;
        var now = new Date();

            // Weapon switch
        if (weaponSwitch) {
            keypressed.push("weaponSwitch");
            // we need to invoke weaponSwitch worker only once at the first keydown event, hence switching off manually
            self.nonmoveKeysPressed[this.weaponSwitchCode] = false;
        }
            // Use
        if (use) {
            keypressed.push("e");
        }

        // Process Movement Keys
            // left
        if (self.moveKeysRegistrator[self.leftCode]["keyDownTimeStamp"] == null) {
            left = self.moveKeysRegistrator[self.leftCode]["duration"];
        }
        else {
            left = now - self.moveKeysRegistrator[self.leftCode]["keyDownTimeStamp"];
            self.moveKeysRegistrator[self.leftCode]["keyDownTimeStamp"] = now;
        }
            // right
        if (self.moveKeysRegistrator[self.rightCode]["keyDownTimeStamp"] == null) {
            right = self.moveKeysRegistrator[self.rightCode]["duration"];
        }
        else {
            right = now - self.moveKeysRegistrator[self.rightCode]["keyDownTimeStamp"];
            self.moveKeysRegistrator[self.rightCode]["keyDownTimeStamp"] = now;
        }
        // up
        if (self.moveKeysRegistrator[self.upCode]["keyDownTimeStamp"] == null) {
            up = self.moveKeysRegistrator[self.upCode]["duration"];
        }
        else {
            up = now.getTime() - self.moveKeysRegistrator[self.upCode]["keyDownTimeStamp"].getTime();
            self.moveKeysRegistrator[self.upCode]["keyDownTimeStamp"] = now;
        }
        // down
        if (self.moveKeysRegistrator[self.downCode]["keyDownTimeStamp"] == null) {
            down = self.moveKeysRegistrator[self.downCode]["duration"];
        }
        else {
            down = now - self.moveKeysRegistrator[self.downCode]["keyDownTimeStamp"];
            self.moveKeysRegistrator[self.downCode]["keyDownTimeStamp"] = now;
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

        self.nullifyMoveKeysRegistratorDuration();

        return keypressed;
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
    this.addMouseMoveHandler = function (handler) {
        this.canvas.onmousemove = function (e) {
            self.controlsToReport["changeDirection"] = handler(e);
        }
    }
    this.nullifyMoveKeysRegistratorDuration = function () {
        for (var item in self.moveKeysRegistrator) {
            self.moveKeysRegistrator[item].duration = 0;
        }
    }
    this.nullifyControlsToReport = function () {
        self.controlsToReport["use"] = false;
        self.controlsToReport["weaponSwitch"] = false;
        self.controlsToReport["shoot"] = false;
        self.controlsToReport["changeDirection"] = null;
    }
}