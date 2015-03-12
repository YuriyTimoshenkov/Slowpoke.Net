using SlowpokeEngine.Bodies;
using System.Collections.Generic;

namespace SlowpokeEngine.Actions
{
    public class PhysicsProcessingResultCollision : PhysicsProcessingResult
	{
        public List<Body> Bodies { get; private set; }

        public PhysicsProcessingResultCollision(List<Body> bodies) 
        {
            Bodies = bodies;
        }
	}
}

