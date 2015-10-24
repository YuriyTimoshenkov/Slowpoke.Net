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
    public interface IServerProxy
    {
        Task SyncState(InputEvent inputEvent, Action<IViewFrame> resultHandler);

        Task StartGame(Action<Body> resultHandler);
    }
}
