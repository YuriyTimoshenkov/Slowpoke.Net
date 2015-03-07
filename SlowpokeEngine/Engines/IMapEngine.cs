using System.Collections.Generic;
using SlowpokeEngine.Bodies;

namespace SlowpokeEngine.Engines
{
	public interface IMapEngine : IActiveBodiesContainer
	{
		IEnumerable<ActiveBody> GetBodiesForCollision ();
	}
}

