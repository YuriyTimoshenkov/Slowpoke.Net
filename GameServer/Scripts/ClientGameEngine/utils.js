

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


function Point(x, y) {
    this.x = x;
    this.y = y;
}

function Rect_old(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
}
Rect_old.prototype = {

    get centerx() { return this.x + this.width / 2 },
    set centerx(value) { this.x = value - this.width / 2 },

    get centery() { return this.y + this.height / 2 },
    set centery(value) { this.y = value - this.height / 2 },

    get center() { return new Point(this.centerx, this.centery) },
    set center(value) {
        this.centerx = value.X;
        this.centery = value.Y;    
    }
}

function inArray(what, where) {
    for (var i = 0; i < where.length; i++)
        if (what == where[i])
            return true;
    return false;
}

function Vector(x, y) {
    var self = this;
    this.x = x;
    this.y = y;

    this.calculateUnitVector = function()
    {
        var magnitude = Math.sqrt((self.x * self.x) + (self.y * self.y));

        return new Vector(self.x / magnitude, self.y / magnitude);
    }

    this.product = function (vector) {
        return self.x * vector.x + self.y * vector.y
    }

    this.length = function () {
        return Math.sqrt(Math.pow(self.x, 2) + Math.pow(self.y, 2));
    }
}

ObjectsContainersSynchronizer = {
    syncObjectsContainers: function (oldContainer, newContainer, createHandler, updateHandler, removehandler) {
        //Create new container with new + updated elements
        var result = newContainer.map(function (newElement) {

            var objectsFromOldContainer = oldContainer.filter(function (oldElement) { return newElement.Id == oldElement.Id })

            if (objectsFromOldContainer.length > 0) {
                updateHandler(objectsFromOldContainer[0]);

                return objectsFromOldContainer[0];
            }
            else {
                return createHandler(newElement)
            }
        });

        // Generate remove events
        oldContainer.forEach(function (item) {
            var existingItem = result.filter(function(v) { return v.Id === item.Id});
            
            if (existingItem.length === 0) {
                removehandler(item);
            }
        });

        return result;
    }
}

