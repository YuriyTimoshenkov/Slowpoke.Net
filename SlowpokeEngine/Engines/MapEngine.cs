using System;
using System.Collections.Generic;
using System.Linq;

namespace SlowpokeEngine
{
	public class MapEngine
	{
		private IActiveBodiesContainer activeBodiesContainer;

		public MapEngine (IActiveBodiesContainer activeBodiesContainer)
		{
			this.activeBodiesContainer = activeBodiesContainer;
		}

		public IList<ActiveBody> GetBodiesForCollision()
		{
			return activeBodiesContainer.Bodies.Values.ToList();
		}
	}
}

