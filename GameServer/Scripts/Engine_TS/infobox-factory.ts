class InfoboxFactory {
    builders: any[];

    constructor() {
        this.builders = [];
        this.generateBuilders();
    }

    createInfobox(infoboxType, data, container, startPoint?) {
        return this.builders[infoboxType](data, container, startPoint);
    }

    generateBuilders() {
        var self = this;
        this.builders[infoboxes.PLAYER_FIXED] = function (data, container, startPoint) {
            var infobox = new PlayerInfoboxFixed(data, container, startPoint);
            return infobox
        }

        this.builders[infoboxes.PLAYER_FLOATING] = function (data, container, startPoint) {
            var infobox = new PlayerInfoboxFloating(data, container, startPoint);
            return infobox
        }
        this.builders[infoboxes.NPC_FLOATING] = function (data, container, startPoint) {
            var infobox = new NPCInfoboxFloating(data, container, startPoint);
            return infobox
        }
    }
}