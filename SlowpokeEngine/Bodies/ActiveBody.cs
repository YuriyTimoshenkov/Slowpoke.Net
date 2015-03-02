using System;
using SlowpokeEngine.Actions;
using SlowpokeEngine.Extensions;

namespace SlowpokeEngine.Bodies
{
	public abstract class ActiveBody
	{
		protected readonly IMechanicEngine _mechanicEngine;

		public Guid Id { get; private set; }

		public Tuple<int, int> Direction { get; set; }

		public Tuple<int, int> Position { get; set; }


		protected ActiveBody(
			Tuple<int, int> position, 
			Tuple<int, int> direction,
			IMechanicEngine mechanicEngine)
		{
			Id = Guid.NewGuid();
			_mechanicEngine = mechanicEngine;
			Position = position;
			Direction = direction;
		}
	}
}
