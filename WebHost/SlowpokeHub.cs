using System;
using Microsoft.AspNet.SignalR;
using SlowpokeEngine;
using SlowpokeEngine.Bodies;
using System.Collections.Generic;
using System.Linq;
using SlowpokeEngine.Actions;
using System.Threading.Tasks;
using System.Collections.Concurrent;

namespace WebHost
{
	public class SlowpokeHub : Hub
	{
		private static ConcurrentDictionary<string, Guid> _connectionsPlayerMapping =
			new ConcurrentDictionary<string, Guid>();

		public static IMechanicEngine MechanicEngine;

        public SlowpokeHub():base()
        { }

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

		public void MoveBody(Guid playerId)
		{
			var player = MechanicEngine.GetPlayerBody (playerId);

			player.ProcessAction (new BodyActionMove());
		}

		public void ChangeBodyDirection(Guid playerId, int dX, int dY)
		{
			var player = MechanicEngine.GetPlayerBody (playerId);

			player.ProcessAction (new BodyActionChangeDirection(dX, dY));
		}

		public override Task OnDisconnected (bool stopCalled)
		{
			Guid playerId;

			if (_connectionsPlayerMapping.TryRemove (Context.ConnectionId, out playerId)) {
				MechanicEngine.ReleasePlayerBody(playerId);
			}

			return base.OnDisconnected(stopCalled);
		}

		public override Task OnConnected ()
		{
			return base.OnConnected ();
		}
	}
}