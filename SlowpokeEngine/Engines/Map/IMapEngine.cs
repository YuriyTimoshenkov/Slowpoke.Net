using System;
using System.Collections.Concurrent;
using SlowpokeEngine.Bodies;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace SlowpokeEngine.Engines.Map
{
	public interface IMapEngine
	{
        IMap Map { get; }
		IEnumerable<ActiveBody> GetBodiesForCollision ();

        [JsonIgnore]
        ConcurrentDictionary<Guid, ActiveBody> Bodies { get; }
	}
}

