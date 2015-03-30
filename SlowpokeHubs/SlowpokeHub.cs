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
            var meb = new UnityMechanicEngineBuilder();//new SimpleMechanicEngineBuilder ();
			SlowpokeHub.MechanicEngine = meb.Build();

            var NPCBuilder = new SimpleBodyBuilder();

            SlowpokeHub.MechanicEngine.AddActiveBody(NPCBuilder.BuildNPC(SlowpokeHub.MechanicEngine));

			SlowpokeHub.MechanicEngine.StartEngine();
        }

		public IPlayerBodyFacade LoadPlayer()
		{
            return MechanicEngine.GetPlayerBody(_connectionsPlayerMapping[Context.ConnectionId]);
		}

		public List<ActiveBody> GetActiveBodies()
		{
            return MechanicEngine.ViewPort.GetActiveBodies(_connectionsPlayerMapping[Context.ConnectionId]).ToList();
		}

		public void MoveBody(int x, int y)
		{
            var player = MechanicEngine.GetPlayerBody(_connectionsPlayerMapping[Context.ConnectionId]);

            if (player != null)
                player.Move(new Vector(x,y));
		}

		public void ChangeBodyDirection(int x, int y)
		{
            var player = MechanicEngine.GetPlayerBody(_connectionsPlayerMapping[Context.ConnectionId]);

            if(player != null)
                player.ChangeDirection(new Vector(x, y));
		}

        public void Shoot()
        {
            var player = MechanicEngine.GetPlayerBody(_connectionsPlayerMapping[Context.ConnectionId]);

            if (player != null)
                player.Shoot();
        }

        public void ChangeWeapon()
        {
            var player = MechanicEngine.GetPlayerBody(_connectionsPlayerMapping[Context.ConnectionId]);

            if (player != null)
                player.ChangeWeapon();
        }

        public IMap GetMap()
        {
            return MechanicEngine.ViewPort.Map;
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
            Guid userId = Guid.Parse(((ClaimsIdentity)Context.User.Identity).FindFirst(v => v.Type == ClaimTypes.NameIdentifier).Value);

           var player = MechanicEngine.LoadPlayerBody(userId);

           _connectionsPlayerMapping.TryAdd(Context.ConnectionId, player.Id);

			return base.OnConnected ();
		}
	}
}