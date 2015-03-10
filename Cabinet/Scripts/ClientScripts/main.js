/**
 * Created by dimapct on 08.03.2015.
 */





$(function ()
{
    console.log("Connection to gameProxy start.");

    $.connection.hub.start().done(function()
    {
        // Declare a proxy to reference the hub.
        var gameProxy = $.connection.slowpokeHub;

        gameProxy.server.loadPlayer().done(function (player)

        {
            game = new Game(worldWidth, worldHeight, player, 50, 1000/60, gameProxy);

            // Start listening server
            setInterval(function () {game.getFrameFromServer(player.Id, game.serverFramesQueue)}, 1000/60);

            // Start game loop
            setInterval(function () {game.loop()}, game.fps);

        }).fail(function (error) {

            console.log('2 Invocation of NewContosoChatMessage failed. Error: ' + error);
        });

    });
});