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

    this.moveKeysToDirectionMap = [
        { keys: [this.leftCode], direction: { x: -1, y: 0 } },
        { keys: [this.rightCode], direction: { x: 1, y: 0 } },
        { keys: [this.upCode], direction: { x: 0, y: -1 } },
        { keys: [this.downCode], direction: { x: 0, y: 1 } },
        { keys: [this.upCode, this.leftCode], direction: { x: -0.707, y: -0.707 } },
        { keys: [this.upCode, this.rightCode], direction: { x: 0.707, y: -0.707 } },
        { keys: [this.downCode, this.leftCode], direction: { x: -0.707, y: 0.707 } },
        { keys: [this.downCode, this.rightCode], direction: { x: 0.707, y: 0.707 } }
    ];

    this.controlsToReport = {
        use: false,
        weaponSwitch: false,
        shoot: false,
        changeDirection: null
    }

    this.moveKeysContext= [
        { Code: this.leftCode, keyDownTimeStamp: null, keyUpTimeStamp: null, duration: 0 },
        { Code: this.rightCode, keyDownTimeStamp: null, keyUpTimeStamp: null, duration: 0 },
        { Code: this.upCode, keyDownTimeStamp: null, keyUpTimeStamp: null, duration: 0 },
        { Code: this.downCode, keyDownTimeStamp: null, keyUpTimeStamp: null, duration: 0 }
    ]

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
            var moveKeyContext = self.moveKeysContext.filter(function (item) { return item.Code === e.keyCode })[0];
            if (moveKeyContext !== undefined && moveKeyContext.keyDownTimeStamp === null) {
                    moveKeyContext.keyDownTimeStamp = new Date();
                    moveKeyContext.keyUpTimeStamp = null;
            }
            // If non-moving button
            else if (e.keyCode === self.useCode) {
                self.controlsToReport["use"] = true;
            }
            else if (e.keyCode === self.weaponSwitchCode) {
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
        var moveKeyContext = self.moveKeysContext.filter(function (item) { return item.Code === keyCode })[0];
        if (moveKeyContext !== undefined) {
            moveKeyContext.keyUpTimeStamp = new Date();
            moveKeyContext.duration += moveKeyContext.keyUpTimeStamp.getTime() - moveKeyContext.keyDownTimeStamp.getTime();
            moveKeyContext.keyDownTimeStamp = null;
        }
    }

    this.handleControlsCommon = function () {

        var controlsToReport = {};

        controlsToReport.use = self.controlsToReport.use;
        controlsToReport.shoot = self.controlsToReport.shoot;
        controlsToReport.changeDirection = self.controlsToReport.changeDirection;
        controlsToReport.weaponSwitch = self.controlsToReport.weaponSwitch;
 
        self.nullifyControlsToReport();
        return controlsToReport
    }

    this.handleControlsMove = function () {
        var keysduration = self.processMoveKeysRegistrator();
        var controlsToReport = {};

        // we presume that player could go only 1 direction per report
        var appliedRule = self.moveKeysToDirectionMap.filter(function (itemA) {
            return itemA.keys.length === keysduration.length
            && keysduration.filter(function (itemB) {
                return itemA.keys.indexOf(itemB.key) !== -1;
            }).length > 0;
        })[0];

        if (appliedRule !== undefined) {
            controlsToReport.move = {
                direction: appliedRule.direction,
                duration: Math.min(keysduration.map(function (item) { return item.duration; }))
            };
        }

        return controlsToReport
    }

    this.processMoveKeysRegistrator = function () {
        var now = new Date();
        var keysduration = [];

        //Read durations
        self.moveKeysContext.forEach(function (item) {
            var duration = 0;

            if (item.keyDownTimeStamp !== null) {
                duration = now.getTime() - item.keyDownTimeStamp.getTime()
                item.keyDownTimeStamp = now;
            }

            if (item.duration > 0) {
                duration = item.duration;
                item.duration = 0;
            }

            if (duration > 0) {
                keysduration.push({
                    key: item.Code,
                    duration: duration
                });
            }
        });

        return keysduration;
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

    this.nullifyControlsToReport = function () {
        self.controlsToReport["use"] = false;
        self.controlsToReport["weaponSwitch"] = false;
        self.controlsToReport["shoot"] = false;
        self.controlsToReport["changeDirection"] = null;
    }
}