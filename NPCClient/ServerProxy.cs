using Microsoft.AspNet.SignalR.Client;
using SlowpokeEngine.Bodies;
using SlowpokeEngine.Engines.View;
using SlowpokeHubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NPCClient
{
    public class ServerProxy : IServerProxy
    {
        private HubConnection _connection;
        private IHubProxy _proxy;
        private Guid _playerId;
        public ServerProxy(Guid playerId, string url)
        {
            _playerId = playerId;
            _connection = new HubConnection(url);
            _proxy = _connection.CreateHubProxy("slowpokeHub");
            _connection.Headers.Add("playerId", playerId.ToString());
            _connection.Start().Wait();
        }

        public async Task ProcessInputEvents(InputEvent inputEvent)
        {
            await _proxy.Invoke("ProcessInputEvents", inputEvent);
        }

        public async Task GetFrames(Action<ViewFrameFacade> resultHandler)
        {
            var frame = await _proxy.Invoke<ViewFrameFacade>("GetFrame");

            resultHandler(frame);

            return;
        }

        public async Task StartGame(Action<BodyFacade> resultHandler)
        {
            if (_connection.State != ConnectionState.Connected)
                _connection.Start().Wait();

            var playerBody = await _proxy.Invoke<BodyFacade>("LoadPlayer");

            resultHandler(playerBody);

            return;
        }
    }
}
