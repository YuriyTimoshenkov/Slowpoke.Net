QUnit.test("MechanicEngine_ProcessMoveCommand", function (assert) {
    var body = { id: 123, gameRect: { center: { centerx: 0, centery: 0 } } };
    var gameWorldManager = {
        world: {
            allGameObjects: [body]
        }
    };
    var me = new MechanicEngine(gameWorldManager);
    var commandMove = new CommandMove(123, 10, {X:1, Y:1});

    me.addCommand(commandMove);
    me.update();

    assert.ok(body.gameRect.center.x !== 0 && body.gameRect.center.y !== 0 && me.commandQueueProcessed.length === 1);
});

QUnit.test("MechanicEngine_ServerSync", function (assert) {
    var body = { id: 123, gameRect: { center: { centerx: 0, centery: 0 } } };
    var gameWorldManager = {
        world: {
            allGameObjects: [body]
        },
        player: body
    };
    var me = new MechanicEngine(gameWorldManager);
    var commandMove = new CommandMove(123, 10, {X:1, Y:1});

    me.addCommand(commandMove);
    me.update();

    var serverCommands = me.syncWithServer({
        Bodies:[
            {
                Id: 123,
                Shape: {
                    Position: {
                        X: 10,
                        Y: 10
                    }
                }
            }
    ]});

    assert.ok(me.commandQueueProcessed.length === 0
        && serverCommands.length === 1
        && serverCommands[0].Name === "Move"
        && body.gameRect.centerx === 10
        && body.gameRect.centery === 10);
});