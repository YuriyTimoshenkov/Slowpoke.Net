

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



function Rect(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
}

Rect.prototype = {
    get center() { return [this.x + this.width / 2, this.y + this.height / 2] },
    set center(newValue) {
        this.x = newValue.X - this.width / 2;
        this.y = newValue.Y - this.height / 2;
    }



}