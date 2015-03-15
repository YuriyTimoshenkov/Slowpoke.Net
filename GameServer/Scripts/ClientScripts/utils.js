

function KeyPressedHandler() {
    this.keyPressed = {
        32: false,  // Space
        87: false,  // W
        68: false,  // D
        83: false,  // S
        65: false,  // A
    };
};

KeyPressedHandler.prototype = {
    clearAll: function () {
        for (var key in this.keyPressed) {
            //console.log(key)
            this.keyPressed[key] = false;
        }
    }
}