class InfoboxFactory {
    builders: any[];
    gameCanvas;

    constructor(gameCanvas) {
        this.builders = [];
        this.gameCanvas = gameCanvas;
        this.generateBuilders();
    }

    createInfoboxes(data, startPoint?): Infobox[]{
        var self = this;
        var infoboxes = [];
        var infoboxTypes = this.getInfoboxTypesToCreate(data);
        infoboxTypes.forEach((infoboxType) => {
            var infobox = self.builders[infoboxType](data, startPoint);
            infoboxes.push(infobox);
        });
        return infoboxes;
    }

    generateBuilders() {
        var self = this;
        this.builders[Infoboxes.PLAYER_FIXED] = function (data, startPoint): Infobox{
            var startPointOverride = new Point(5, self.gameCanvas.height - 50)
            var infobox = new PlayerInfoboxFixed(data, startPointOverride);
            return infobox
        }

        this.builders[Infoboxes.PLAYER_FLOATING] = function (data, startPoint): Infobox{
            var infobox = new PlayerInfoboxFloating(data, startPoint);
            return infobox
        }
        this.builders[Infoboxes.NPC_FLOATING] = function (data, startPoint): Infobox{
            var infobox = new NPCInfoboxFloating(data, startPoint);
            return infobox
        }
    }

    getInfoboxTypesToCreate(data): number[] {
        var infoboxTypes = [];
        // if NPC
        if (data.bodyType === "NPCAI") {
            infoboxTypes.push(Infoboxes.NPC_FLOATING);
        }
        // if PlayerOther
        else if (data.bodyType === "PlayerBody" && data instanceof PlayerOtherBody) {
            infoboxTypes.push(Infoboxes.PLAYER_FLOATING);
        }
        // if Player
        else if (data.bodyType === "PlayerBody" && data instanceof PlayerBody) {
            infoboxTypes.push(Infoboxes.PLAYER_FLOATING);
            infoboxTypes.push(Infoboxes.PLAYER_FIXED);
        }
        return infoboxTypes;
    }


}