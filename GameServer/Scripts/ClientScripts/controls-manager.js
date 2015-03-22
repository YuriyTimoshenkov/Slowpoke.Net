function controlsManager(canvas) {
    var self = this;
    
    this.canvas = canvas;

    this.keysHandlers = [
        { keyCode: 32, handler: [] },
        { keyCode: 87, handler: [] },
        { keyCode: 68, handler: [] },
        { keyCode: 83, handler: [] },
        { keyCode: 65, handler: [] }
    ];

    window.onkeydown = function (e) {
        self.keysHandlers.forEach(function (element, index, array) {
            if (e.keyCode === element.keyCode) {
                element.handler.forEach(function (element, index, array) {
                    element();
                })
            }
        })
    }

    this.addKeyHandler = function (keyCode, handler) {
        this.keysHandlers.forEach(function (element, index, array) {
            if (element.keyCode === keyCode) {
                element.handler.push(handler)
                return
            }
        })
    }

    this.addMoveUpHandler = function (handler) {
        this.addKeyHandler(87,handler)
    }

    this.addShootHandler = function (handler) {
        this.addKeyHandler(32, handler)
    }

    this.addMoveRightHandler = function (handler) {
        this.addKeyHandler(68, handler)
    }

    this.addMoveDownHandler = function (handler) {
        this.addKeyHandler(83, handler)
    }

    this.addMoveLeftHandler = function (handler) {
        this.addKeyHandler(65, handler)
    }

    this.addMouseMoveHandler = function (handler) {
        this.canvas.onmousemove = function (e) { handler(e) }
    }
}