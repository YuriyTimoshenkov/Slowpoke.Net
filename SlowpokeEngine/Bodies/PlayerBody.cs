using System;
using SlowpokeEngine.Bodies;
using SlowpokeEngine.Entities;
using SlowpokeEngine.Actions;

namespace SlowpokeEngine.Bodies
{
	public class PlayerBody : ActiveBody, IPlayerBodyFacade
	{
		public PlayerBody (
			Point position,
			Vector direction,
			IMechanicEngine mechanicEngine):base(position, direction, mechanicEngine)
		{
		}

		public void ProcessAction (BodyAction bodyAction)
		{
			_mechanicEngine.ProcessAction (bodyAction, this);
		}
	}
}

