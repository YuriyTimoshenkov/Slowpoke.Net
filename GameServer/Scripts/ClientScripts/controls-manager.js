function controlsManager(canvas, serverProxy) {
    var self = this;
    
    this.canvas = canvas;
    this.serverProxy = serverProxy;

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

    //this.canvas.onmousemove = function (e) { self.handleMouseMove(e) }

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




    this.targetCenter = { x: $(window).width() / 2, y: $(window).height() / 2 };
    this.handleMouseMove = function (e, player) {
        var vectorMultiplier = 10;

        var mouse = new Point(e.clientX, e.clientY);

        console.log(999)
        console.log(mouse)
        // Object { x: 695, y: 113 }
        console.log(this.targetCenter)
        //Object { x: 417, y: 336.5 }

        // Get mouse vector not normalized
        var mouseVectorNotNormalized = new Point(mouse.x - this.targetCenter.x, mouse.y - this.targetCenter.y);
        console.log(mouseVectorNotNormalized)
        // Object { x: 278, y: -223.5 }

        // Calculate mouse vector length
        var mouseVectorLength = Math.sqrt(Math.pow(mouseVectorNotNormalized.x, 2) + Math.pow(mouseVectorNotNormalized.y, 2));
        console.log(mouseVectorLength)
        // 356.70190635879703

        // Normalize mouse vector
        var mouseVectorNormalized = new Point((mouseVectorNotNormalized.x / mouseVectorLength * vectorMultiplier),
                                              (mouseVectorNotNormalized.y / mouseVectorLength * vectorMultiplier));
        console.log(mouseVectorNormalized)
        // Object { x: 7.793622491054677, y: -6.265736067448634 }

        var dx = Math.round(mouseVectorNormalized.x);
        var dy = Math.round(mouseVectorNormalized.y);

        // Request server
        this.serverProxy.changeBodyDirection(player.id, dx, dy);
        console.log(dx)
        console.log(dy)
        console.log(999)
    }
}