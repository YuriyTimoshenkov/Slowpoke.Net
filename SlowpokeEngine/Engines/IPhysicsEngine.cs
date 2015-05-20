using System;
using SlowpokeEngine.Actions;
using SlowpokeEngine.Bodies;

namespace SlowpokeEngine
{
	public interface IPhysicsEngine
	{
		PhysicsProcessingResult ProcessBodyAction (GameCommand actio);
	}
}

