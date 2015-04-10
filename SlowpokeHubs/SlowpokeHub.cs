using System;
using Microsoft.AspNet.SignalR;
using SlowpokeEngine;
using SlowpokeEngine.Bodies;
using System.Collections.Generic;
using System.Linq;
using SlowpokeEngine.Actions;
using System.Threading.Tasks;
using System.Collections.Concurrent;
using SlowpokeEngine.Entities;
using System.Security.Claims;
using SlowpokeEngine.Engines.Map;
using SlowpokeEngine.Engines.View;

namespace SlowpokeHubs
{
    //[Authorize]
	public class SlowpokeHub : Hub
	{
		private static ConcurrentDictionary<string, IPlayerBodyFacade> _connectionsPlayerMapping =
            new ConcurrentDictionary<string, IPlayerBodyFacade>();
        public static readonly string TokenCookieName = "SlowpokeToken";
        public static readonly TimeSpan TokentDuration = new TimeSpan(0,5,0);

        public static IMechanicEngine MechanicEngine;

        public SlowpokeHub()
        {

        }

        public static void Run()
        {
            var meb = new UnityMechanicEngineBuilder();
			SlowpokeHub.MechanicEngine = meb.Build();

            SlowpokeHub.MechanicEngine.StartEngine(UpdatePlayerState);
        }

        public static void UpdatePlayerState(IPlayerBodyFacade playerBodyFacade)
        {
            var playerMapping = _connectionsPlayerMapping.FirstOrDefault(v => v.Value.Id == playerBodyFacade.Id);
            
            //Find connectionId
            if (playerMapping.Value != null)
            {
                var clientConnection = GlobalHost.ConnectionManager.GetHubContext<SlowpokeHub>().Clients.Client(playerMapping.Key);
                clientConnection.playerStateChanged(playerBodyFacade.State);
            }
        }

		public IPlayerBodyFacade LoadPlayer()
		{
            var player = _connectionsPlayerMapping[Context.ConnectionId];
            MechanicEngine.StartGame(player);

            return player;
		}

		public IViewFrame GetFrame()
		{
            return MechanicEngine.ViewPort.GetFrame(_connectionsPlayerMapping[Context.ConnectionId].Id);
		}

		public void MoveBody(double x, double y)
		{
            var player = MechanicEngine.GetPlayerBody(_connectionsPlayerMapping[Context.ConnectionId].Id);

            if (player != null)
                player.Move(new Vector(x,y));
		}

		public void ChangeBodyDirection(int x, int y)
		{
            var player = MechanicEngine.GetPlayerBody(_connectionsPlayerMapping[Context.ConnectionId].Id);

            if(player != null)
                player.ChangeDirection(new Vector(x, y));
		}

        public void Shoot()
        {
            var player = MechanicEngine.GetPlayerBody(_connectionsPlayerMapping[Context.ConnectionId].Id);

            if (player != null)
                player.Shoot();
        }

        public void ChangeWeapon()
        {
            var player = MechanicEngine.GetPlayerBody(_connectionsPlayerMapping[Context.ConnectionId].Id);

            if (player != null)
                player.ChangeWeapon();
        }

        public IMap GetMap()
        {
            return MechanicEngine.ViewPort.Map;
        }

		public override Task OnDisconnected (bool stopCalled)
		{
			IPlayerBodyFacade  player;

			if (_connectionsPlayerMapping.TryRemove (Context.ConnectionId, out player)) {
				MechanicEngine.ReleaseActiveBody(player.Id);
			}

			return base.OnDisconnected(stopCalled);
		}

		public override Task OnConnected ()
		{
            Guid userId = Guid.Parse("4b084299-ed14-4975-a4f1-ecf93ee01e7c");//((ClaimsIdentity)Context.User.Identity).FindFirst(v => v.Type == ClaimTypes.NameIdentifier).Value);

           var player = MechanicEngine.LoadPlayerBody(userId);

           _connectionsPlayerMapping.TryAdd(Context.ConnectionId, player);

			return base.OnConnected ();
		}
	}
}