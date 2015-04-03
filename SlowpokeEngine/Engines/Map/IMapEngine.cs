﻿using System;
using System.Collections.Concurrent;
using SlowpokeEngine.Bodies;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace SlowpokeEngine.Engines.Map
{
	public interface IMapEngine
	{
        IMap Map { get; }
        IEnumerable<Body> GetBodiesForCollision(ActiveBody body);
        ConcurrentDictionary<Guid, ActiveBody> Bodies { get; }
        void AddActiveBody(ActiveBody body);
        void UpdateActiveBody(ActiveBody body);
	}
}
