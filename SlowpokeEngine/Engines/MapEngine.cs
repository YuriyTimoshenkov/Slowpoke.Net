using System.Collections;
using System.Collections.Generic;
using SlowpokeEngine.Bodies;
using System.Collections.Concurrent;
using System;

namespace SlowpokeEngine.Engines
{
	public class MapEngine : IMapEngine, IActiveBodiesContainer
	{
		private readonly ConcurrentDictionary<Guid, ActiveBody> _bodies = new ConcurrentDictionary<Guid, ActiveBody>();

		public ConcurrentDictionary<Guid, ActiveBody> Bodies
		{
			get { return _bodies; }
		}
			

		public IEnumerable<ActiveBody> GetBodiesForCollision()
		{
			return _bodies.Values;
		}
	}
}