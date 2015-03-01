using System.Collections;
using System.Collections.Generic;
using SlowpokeEngine.Bodies;

namespace SlowpokeEngine.Engines
{
	public class MapEngine : IEnumerable<ActiveBody>
	{
		private readonly IActiveBodiesContainer _activeBodiesContainer;

		public MapEngine(IActiveBodiesContainer activeBodiesContainer)
		{
			_activeBodiesContainer = activeBodiesContainer;
		}

		public IEnumerator<ActiveBody> GetEnumerator()
		{
			return _activeBodiesContainer.Bodies.Values.GetEnumerator();
		}

		IEnumerator IEnumerable.GetEnumerator()
		{
			return GetEnumerator();
		}

		public IEnumerable<ActiveBody> GetBodiesForCollision()
		{
			return _activeBodiesContainer.Bodies.Values;
		}
	}
}