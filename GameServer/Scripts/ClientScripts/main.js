/**
 * Created by dimapct on 08.03.2015.
 */


$(function ()
{
    console.log("Connection to gameProxy start.");

    // Declare a proxy to reference the hub.
    var gameProxy = $.connection.slowpokeHub;

    $.connection.slowpokeHub.client.SomeMethod = function () { };


    $.connection.hub.start().done(function()
    {
        gameProxy.server.loadPlayer().done(function (player)

        {
            game = new Game(worldWidth, worldHeight, player, 50, updateFPS, gameProxy);

            // Start listening server
            setInterval(function () { game.getFrameFromServer(player.Id, game.serverFramesQueue) }, serverRequestFPS);

            // Start game loop
            setInterval(function () {game.loop()}, game.fps);

        }).fail(function (error) {

            console.log('2 Invocation of NewContosoChatMessage failed. Error: ' + error);
        });

    });
});