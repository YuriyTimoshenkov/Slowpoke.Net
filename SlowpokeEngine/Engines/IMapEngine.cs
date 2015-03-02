using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using SlowpokeEngine.Bodies;

namespace SlowpokeEngine.Engines
{
	public interface IMapEngine
	{
		ConcurrentDictionary<Guid, ActiveBody> Bodies { get; }

		IEnumerable<ActiveBody> GetBodiesForCollision ();
	}
}

