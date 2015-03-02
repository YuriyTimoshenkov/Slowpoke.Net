using System;
using System.Collections.Concurrent;
using SlowpokeEngine.Bodies;
using System.Collections.Generic;

namespace SlowpokeEngine
{
	public interface IMapEngine
	{
		ConcurrentDictionary<Guid, ActiveBody> Bodies { get; }

		IEnumerable<ActiveBody> GetBodiesForCollision ();
	}
}

