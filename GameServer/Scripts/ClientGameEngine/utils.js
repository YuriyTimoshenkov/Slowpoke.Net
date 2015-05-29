

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

function Rect(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
}
Rect.prototype = {

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
}

ObjectsContainersSynchronizer = {
    syncObjectsContainers: function (oldContainer, newContainer, createHandler, updateHandler) {
        // Calculate objects to delete 
        var objectsToDelete = [];
        oldContainer.forEach(function (oldElement) {
            var Id = oldElement.Id;
            var objectsFromNewContainer = newContainer.filter(function (newElement) { return newElement.Id == Id })
            if (objectsFromNewContainer.length == 0) {
                objectsToDelete.push(oldElement)
            }
            // Calculate objects to update and update them
            // we expect maximum 1 element will be presend in newContainer
            else updateHandler(oldElement, objectsFromNewContainer[0])
        });

        // Actually deleting items
        objectsToDelete.forEach(function (obj) {
            var i = oldContainer.indexOf(obj);
            oldContainer.splice(i, 1)
        });

        // Create missing objects
        newContainer.forEach(function (newElement) {
            if (oldContainer.filter(function (oldElement) { return newElement.Id == oldElement.Id }).length == 0) { createHandler(newElement) }
        });
    }
}

