using System;
using SlowpokeEngine.Actions;
using SlowpokeEngine.Extensions;
using SlowpokeEngine.Entities;

namespace SlowpokeEngine.Bodies
{
	public abstract class ActiveBody
	{
		protected readonly IMechanicEngine _mechanicEngine;

		public Guid Id { get; private set; }

		public Vector Direction { get; set; }

		public Point Position { get; set; }


		protected ActiveBody(
			Point position, 
			Vector direction,
			IMechanicEngine mechanicEngine)
		{
			Id = Guid.NewGuid();
			_mechanicEngine = mechanicEngine;
			Position = position;
			Direction = direction;
		}

		public virtual void ReleaseGame() {}
	}
}
