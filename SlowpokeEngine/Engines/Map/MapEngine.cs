using System.Collections;
using System.Collections.Generic;
using SlowpokeEngine.Bodies;
using System.Collections.Concurrent;
using System;
using SlowpokeEngine.Engines.Map;

namespace SlowpokeEngine.Engines.Map
{
    public class MapEngine : IMapEngine
    {
        public IMap Map { get; private set; }

        public ConcurrentDictionary<Guid, ActiveBody> Bodies { get; private set; }

        public MapEngine(IMap map)
        {
            Map = map;
            Bodies = new ConcurrentDictionary<Guid, ActiveBody>();
        }

        public IEnumerable<ActiveBody> GetBodiesForCollision()
        {
            return Bodies.Values;
        }
    }
}