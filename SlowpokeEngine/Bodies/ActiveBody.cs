using System;
using SlowpokeEngine.Actions;
using SlowpokeEngine.Extensions;
using SlowpokeEngine.Entities;

namespace SlowpokeEngine.Bodies
{
	public abstract class ActiveBody : Body
	{
		protected readonly IMechanicEngine _mechanicEngine;

		public Guid Id { get; private set; }

		public Vector Direction { get; set; }

        public string ActiveBodyType { get { return this.GetType().Name; } }


		public ActiveBody(
			Shape shape, 
			Vector direction,
			IMechanicEngine mechanicEngine)
		{
			Id = Guid.NewGuid();
			_mechanicEngine = mechanicEngine;
			Shape = shape;
			Direction = direction;
		}

        public virtual void Run() { }
		public virtual void ReleaseGame() {}
	}
}
