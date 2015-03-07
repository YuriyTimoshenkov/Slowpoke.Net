using System.Collections.Generic;
using SlowpokeEngine.Bodies;

namespace SlowpokeEngine.Engines
{
    public class MapEngine : IMapEngine
    {
        public MapEngine()
        {
            Bodies = new BodyCollection();
        }

        public IEnumerable<ActiveBody> GetBodiesForCollision()
        {
            return Bodies;
        }

        public BodyCollection Bodies { get; private set; }
    }
}