QUnit.test("MechanicEngine_ProcessMoveCommand", function (assert) {
    var player = {
        Id: 123,
        Shape: {
            Position: {
                X: 10,
                Y: 10
            }
        }
    };

    var me = new MechanicEngine(player, {});
    
    var commandMove = new CommandMove(123, 10, {X:1, Y:1});

    me.addCommand(commandMove);
    me.update();

    assert.ok(me.player.gameRect.center.x !== 0 && me.player.gameRect.center.y !== 0 && me.commandQueueProcessed.length === 1);
});

QUnit.test("MechanicEngine_ServerSync", function (assert) {

    var player = {
        Id: 123,
        Shape: {
            Position: {
                X: 0,
                Y: 0
            },
            Radius: 10
        },
        Speed: 10
    };

    var me = new MechanicEngine(player, {});

    var commandMove = new CommandMove(123, 1000, {x:1, y:0});

    me.addCommand(commandMove);
    me.update();

    var serverCommands = me.syncServerFrames({
        Bodies:[
            {
                Id: 123,
                Shape: {
                    Position: {
                        X: 10,
                        Y: 10
                    },
                    Radius: 10
                },
                Direction: {
                    X: 1,
                    Y: 0
                }
            }
    ]});

    assert.ok(me.commandQueueProcessed[0].syncedWithServer === true
        && serverCommands.length === 1
        && serverCommands[0].Name === "Move"
        && me.player.gameRect.centerx === 10
        && me.player.gameRect.centery === 0);
});