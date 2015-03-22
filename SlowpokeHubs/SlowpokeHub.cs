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

namespace SlowpokeHubs
{
    //[Authorize]
	public class SlowpokeHub : Hub
	{
		private static ConcurrentDictionary<string, Guid> _connectionsPlayerMapping =
			new ConcurrentDictionary<string, Guid>();
        public static readonly string TokenCookieName = "SlowpokeToken";
        public static readonly TimeSpan TokentDuration = new TimeSpan(0,5,0);

		public static IMechanicEngine MechanicEngine;

        public SlowpokeHub()
        {

        }

        public static void Run()
        {
            var meb = new MechanicEngineBuilder ();
			SlowpokeHub.MechanicEngine = meb.Build();

            var NPCBuilder = new SimpleBodyBuilder();

            SlowpokeHub.MechanicEngine.AddActiveBody(NPCBuilder.BuildNPC(SlowpokeHub.MechanicEngine));

			SlowpokeHub.MechanicEngine.StartEngine();
        }

		public IPlayerBodyFacade LoadPlayer()
		{
			var player = MechanicEngine.LoadPlayerBody();
			_connectionsPlayerMapping.TryAdd(Context.ConnectionId, player.Id);

			return player;
		}

		public List<ActiveBody> GetActiveBodies(Guid playerId)
		{
			return MechanicEngine.ViewPort.GetActiveBodies (playerId).ToList ();
		}

		public void MoveBody(Guid playerId, int x, int y)
		{
			var player = MechanicEngine.GetPlayerBody (playerId);

            if (player != null)
                player.Move(new Vector(x,y));
		}

		public void ChangeBodyDirection(Guid playerId, int x, int y)
		{
			var player = MechanicEngine.GetPlayerBody (playerId);

            if(player != null)
                player.ChangeDirection(new Vector(x, y));
		}

        public void Shoot(Guid playerId, int weaponindex)
        {
            var player = MechanicEngine.GetPlayerBody (playerId);

            if (player != null)
                player.Shoot(weaponindex);
        }

		public override Task OnDisconnected (bool stopCalled)
		{
			Guid playerId;

			if (_connectionsPlayerMapping.TryRemove (Context.ConnectionId, out playerId)) {
				MechanicEngine.ReleaseActiveBody(playerId);
			}

			return base.OnDisconnected(stopCalled);
		}

		public override Task OnConnected ()
		{
			return base.OnConnected ();
		}
	}
}